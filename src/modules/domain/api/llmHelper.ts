import { LlmRunner, PromptBuilder, PromptUtils } from "aihub";
import { FieldMapping, LLMGenerationSpec, PromptTemplate } from "../specs/types/spec.types";
import { getCollectionByName } from "../../../lib/dbutils";
import { createDocument } from "./createHelper";
import { map } from "lodash";


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
async function createChildRecords(
  space: string,
  domain: string,
  parentField: string,
  reference: string,
  data: any,
): Promise<void> {
  const records = Array.isArray(data) ? data : [data];

  for (const record of records) {
    const enrichedRecord = {
      [parentField]: reference,
      ...record,
    };

    if (record.reference) {
      try {
        await updateRecordField(space, domain, record.reference, enrichedRecord);
      } catch (err) {
        await createDocument({
          space,
          domain,
          payload: enrichedRecord,
        });
      }
    } else {
      await createDocument({
        space,
        domain,
        payload: enrichedRecord,
        skipBeforeCreateHook: true
      });
    }
  }
}

export const runGeneration = async (
  space: string,
  spec: LLMGenerationSpec,
  domain: string,
  reference: string,
  payload: any
) => {

  const Model = getCollectionByName(space, domain);
  const baseRecord = await Model.findOne({ reference });

  if (!baseRecord) {
    throw new Error(`Record with reference (${reference}) not found in domain (${domain})`);
  }

  const mergedData = { ...baseRecord, ...payload };

  const prompt = PromptUtils.replacePlaceholders(spec.prompt, mergedData);
  const chatgptPrompt = PromptBuilder.adapters.chatgpt.convert(prompt);

  console.log(chatgptPrompt);

  const llmOutput = await LlmRunner.runner.chatgpt.predict(
    config.CHATGPT_API_KEY,
    "/v1/chat/completions",
    chatgptPrompt,
    "object"
  );


  const mappedOutput = applyPostProcessing(llmOutput.responseObject, spec.mapFields, baseRecord, payload);
  console.log(mappedOutput)

  if (spec.target.type === "field") {
    await updateRecordField(space, domain, reference, mappedOutput);
  } else if (spec.target.type === "childRecords") {
    await createChildRecords(
      space,
      spec.target.domain,
      spec.target.parentField,
      reference,
      mappedOutput
    );
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
  console.log(llmOutput)
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


