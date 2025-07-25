import { LlmRunner, PromptBuilder, PromptUtils } from "aihub";
import { FieldMapping, LLMGenerationSpec, PromptTemplate } from "../specs/types/spec.types";
import { getCollectionByName } from "../../../lib/dbutils";
import { createDocument } from "./createHelper";
import { map } from "lodash";
import { GenerationSpec } from "../specs/types/aispec.types";


const config = require("../../../../env");

async function updateRecordField(
  space: string,
  domain: string,
  reference: string,
  payload: any
): Promise<void> {
  const Model = getCollectionByName(space, domain);

  const result = await Model.updateOne({ reference }, { $set: payload });

  if (result.matchedCount === 0) {
    throw new Error(`No record found to update with reference ${reference} in ${domain}`);
  }
}
async function createChildRecords(params: {
  space: string,
  domain: string,
  parentReference: string,
  parentField: string,
  data: any,
}
): Promise<void> {
  const records = Array.isArray(params.data) ? params.data : [params.data];

  for (const record of records) {
    const enrichedRecord = {
      [params.parentField]: params.parentReference,
      ...record,
    };

    if (record.reference) {
      try {
        await updateRecordField(params.space, params.domain, record.reference, enrichedRecord);
      } catch (err) {
        await createDocument({
          space: params.space,
          domain: params.domain,
          payload: enrichedRecord,
        });
      }
    } else {
      await createDocument({
        space: params.space,
        domain: params.domain,
        payload: enrichedRecord,
        skipBeforeCreateHook: true
      });
    }
  }
}

export const runGeneration = async (params: {
  space: string,
  spec: GenerationSpec,
  reference?: string,
  parentReference?: string,
  payload: any
}
) => {

  const Model = getCollectionByName(params.space, params.spec.domain);
  let baseRecord = {};
  if (params.reference) {
    baseRecord = await Model.findOne({ reference: params.reference });

    if (!baseRecord) {
      throw new Error(`Record with reference (${params.reference}) not found in domain (${params.spec.domain})`);
    }
  }

  let parentRecord = {};

  if (params.spec.parentDomain && params.parentReference) {
    const ParentModel = getCollectionByName(params.space, params.spec.parentDomain);
    parentRecord = await ParentModel.findOne({ reference: params.parentReference });

    if (!parentRecord) {
      throw new Error(`Parent record with reference (${params.parentReference}) not found in domain (${params.spec.parentDomain})`);
    }
  }

  const contextData = {
    [params.spec.domain]: baseRecord,
    payload: params.payload
  }

  if (params.spec.parentDomain) {
    contextData[params.spec.parentDomain] = parentRecord;
  }

  const prompt = PromptUtils.replacePlaceholders(params.spec.prompt, contextData);
  const chatgptPrompt = PromptBuilder.adapters.chatgpt.convert(prompt);

  const llmOutput = await LlmRunner.runner.chatgpt.predict(
    config.CHATGPT_API_KEY,
    "/v1/chat/completions",
    chatgptPrompt,
    "object"
  );

  const mappedOutput = applyPostProcessing(llmOutput.responseObject, params.spec.mapFields, baseRecord, params.payload);

  if (params.spec.target.type === "fields" && params.reference) {
    await updateRecordField(params.space, params.spec.domain, params.reference, mappedOutput);
  } else if (params.spec.target.type === "childRecords" && params.parentReference) {
    await createChildRecords({
      space: params.space,
      domain: params.spec.target.domain,
      parentField: params.spec.target.parentField,
      parentReference: params.parentReference,
      data: mappedOutput
    });
  }

  return mappedOutput;
};

function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function applyPostProcessing(
  llmOutput: any,
  mapFields: { [targetField: string]: FieldMapping },
  parentData: any,
  inputPayload: any
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [targetField, mapping] of Object.entries(mapFields)) {
    let value;

    switch (mapping.source) {
      case "llm":
        value = mapping.path ? getValueByPath(llmOutput, mapping.path) : "";
        break;
      case "parent":
        value = mapping.path ? getValueByPath(parentData, mapping.path) : "";
        break;
      case "input":
        value = mapping.path ? getValueByPath(inputPayload, mapping.path) : "";
        break;
      case "static":
        value = mapping.value;
        break;
    }

    result[targetField] = value;
  }

  return result;
}


