import { LlmRunner, PromptBuilder, PromptUtils } from "aihub";
import { FieldMapping } from "../specs/types/spec.types";
import { getCollectionByName } from "../../../lib/dbutils";
import { createDocument, patchDocument, updateDocument } from "./createHelper";
import { GenerationSpec } from "../specs/types/aispec.types";
import { getSpecByName } from "../specs/specRegistry";
import * as AihubService from './AihubService';

const config = require("../../../../env");

async function updateRecordField(
  space: string,
  domain: string,
  reference: string,
  payload: any
): Promise<void> {
  await patchDocument({
    space,
    domain,
    reference,
    payload
  });
}

async function createChildRecords(params: {
  space: string,
  domain: string,
  parentReference: string,
  data: any,
}
): Promise<void> {
  const records = Array.isArray(params.data) ? params.data : [params.data];

  for (const record of records) {
    if (record.reference) {
      try {
        await updateRecordField(params.space, params.domain, record.reference, record);
      } catch (err) {
        await createDocument({
          space: params.space,
          domain: params.domain,
          payload: record,
        });
      }
    } else {
      await createDocument({
        space: params.space,
        domain: params.domain,
        payload: record,
        skipBeforeCreateHook: true
      });
    }
  }
}

export const runGeneration = async (params: {
  token: string;
  space: string,
  spec: GenerationSpec,
  reference?: string,
  parentReference?: string,
  parentVersion?: string,
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
    const spec = getSpecByName(params.spec.parentDomain);
    if (!spec) {
      throw new Error(`Parent domain (${params.spec.parentDomain}) not found`);
    }
    let ParentModel = getCollectionByName(params.space, params.spec.parentDomain);

    if (spec.meta?.versioning && params.parentVersion) {
      ParentModel = getCollectionByName(params.space, spec.meta.versioning.domain);

      const versionRefField = spec.meta.versioning.reference || "parentReference";
      parentRecord = await ParentModel.findOne({
        [versionRefField]: params.parentReference,
        __version: params.parentVersion,
      });
    } else {
      parentRecord = await ParentModel.findOne({ reference: params.parentReference });
    }

    if (!parentRecord) {
      throw new Error(`Parent record with reference (${params.parentReference})${params.parentVersion ? ` and version (${params.parentVersion})` : ""} not found in domain (${params.spec.parentDomain})`);
    }
  }

  const contextData = {
    [params.spec.domain]: baseRecord,
    payload: params.payload,
    params: {
      reference: params.reference, parentReference: params.parentReference, parentVersion: params.parentVersion
    }
  }

  if (params.spec.parentDomain) {
    contextData[params.spec.parentDomain] = parentRecord;
  }

  const prompt = PromptUtils.replacePlaceholders(params.spec.prompt, contextData);
  const chatgptPrompt = PromptBuilder.adapters.chatgpt.convert(prompt);

  // const llmOutput = await LlmRunner.runner.chatgpt.predict(
  //   config.CHATGPT_API_KEY,
  //   "/v1/chat/completions",
  //   chatgptPrompt,
  //   "object"
  // );

  const llmOutput = await AihubService.predict(params.space, params.token, {
    uri: "/v1/chat/completions",
    provider: "chatgpt",
    model: "gpt-4o-mini",
    payload: chatgptPrompt,
    format: "object",
  });

  const mappedOutput = applyPostProcessing(
    llmOutput.response_object,
    params.spec.mapFields,
    contextData,
    params.payload);

  if (params.spec.target.type === "fields" && params.reference) {
    await updateRecordField(params.space, params.spec.domain, params.reference, mappedOutput);
  } else if (params.spec.target.type === "childRecords" && params.parentReference) {
    await createChildRecords({
      space: params.space,
      domain: params.spec.target.domain,
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
  contextData: any,
  inputPayload: any
): Record<string, any> {
  const result: Record<string, any> = {};

  console.log(mapFields);

  for (const [targetField, mapping] of Object.entries(mapFields)) {
    let value;

    switch (mapping.source) {
      case "llm":
        value = mapping.path ? getValueByPath(llmOutput, mapping.path) : "";
        break;
      case "parent":
        value = mapping.path ? getValueByPath(contextData, mapping.path) : "";
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


