import { customAlphabet } from "nanoid";
import { getSpecByName } from "../specs/specRegistry";
import { fillMissingFields, validateAndShapePayload } from "../utils/schemaValidator";
import { preprocessTagFields } from "./tagUtils";
import { getCollectionByName } from "../../../lib/dbutils";
import { applyShapeResponse, checkParentReferences } from "./service";

const alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphanumericAlphabet, 8);

export interface CreateDocumentOptions {
  space: string;
  domain: string;
  payload: any;
  userId?: string;
  skipResponseShaping?: boolean;
  skipBeforeCreateHook?: boolean;
  skipAfterCreateHook?: boolean;
  operation?: "create" | "update" | "patch" | "delete" | "generate";
}

export const createDocument = async ({
  space,
  domain,
  payload,
  userId,
  skipResponseShaping = false,
  skipBeforeCreateHook = false,
  skipAfterCreateHook = false,
  operation = "create"
}: CreateDocumentOptions) => {
  const spec = getSpecByName(domain);
  if (!spec) {
    throw new Error(`Domain (${domain}) does not exist`);
  }

  const { valid, shapedData: shapedDataOriginal, errors } = validateAndShapePayload(payload, spec);
  if (!valid) {
    throw new Error(`Validation failed: ${errors.join(", ")}`);
  }

  let shapedData = shapedDataOriginal;
  const hooks = spec.meta?.hooks;

  if (!skipBeforeCreateHook && hooks?.beforeCreate) {
    const hookResponse = await hooks.beforeCreate(shapedDataOriginal, {
      space, domain, operation, payload, userId
    });

    if (hookResponse.errors.length > 0) {
      throw new Error(`BeforeCreate hook failed: ${hookResponse.errors.join(", ")}`);
    }

    shapedData = hookResponse.doc;
  }

  const ok = await checkParentReferences(shapedData, spec, space, {
    status: () => ({ json: () => { } }) // Dummy res to satisfy the function
  } as any);
  if (!ok) {
    throw new Error("Parent reference check failed");
  }

  const Model = getCollectionByName(space, domain);

  if (spec.meta?.ordering?.length) {
    const groupFilter: any = {};
    for (const field of spec.meta.ordering) {
      groupFilter[field] = shapedData[field];
    }

    const lastInGroup = await Model.find(groupFilter).sort({ order: -1 }).limit(1);
    const maxOrder = lastInGroup[0]?.order ?? 0;
    shapedData.order = maxOrder + 1;
  }

  const timestamp = new Date();
  await preprocessTagFields(shapedData, spec, space);
  const doc = new Model({
    ...shapedData,
    reference: nanoid(),
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: userId,
    updatedBy: userId
  });

  await doc.save();

  if (!skipAfterCreateHook && hooks?.afterCreate) {
    hooks.afterCreate(doc.toObject(), { space, domain, operation, payload, userId }).catch(console.error);
  }

  if (skipResponseShaping) return doc.toObject();

  const shapedDoc = fillMissingFields(doc.toObject(), spec);
  return await applyShapeResponse(shapedDoc, spec, { space, domain, operation, userId });
};
