import { customAlphabet } from "nanoid";
import { getSpecByName } from "../specs/specRegistry";
import { fillMissingFields, validateAndShapePayload } from "../utils/schemaValidator";
import { preprocessTagFields } from "./tagUtils";
import { getCollectionByName } from "../../../lib/dbutils";
import { applyShapeResponse, checkParentReferences } from "./service";
import { handleVersioning } from "./versioningHelper";

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

export interface UpdateDocumentOptions {
  space: string;
  domain: string;
  payload: any;
  reference: string;
  userId?: string;
  skipResponseShaping?: boolean;
  skipBeforeUpdateHook?: boolean;
  skipAfterUpdateHook?: boolean;
  operation?: "create" | "update" | "patch" | "delete" | "generate";
}

export interface PatchDocumentOptions {
  space: string;
  domain: string;
  reference: string;
  payload: any;
  userId?: string;
  skipBeforePatchHook?: boolean;
  skipAfterPatchHook?: boolean;
  skipResponseShaping?: boolean;
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
    status: () => ({ json: () => { } })
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
  const result = await applyShapeResponse(shapedDoc, spec, { space, domain, operation, userId });
  const newVersion = await handleVersioning({ space, domain, doc: result });

  if (newVersion) {
    const Model = getCollectionByName(space, domain);
    await Model.updateOne(
      { _id: result._id },
      { $set: { __version: newVersion } }
    );

    result.__version = newVersion;
  }
};

export const updateDocument = async ({
  space,
  domain,
  reference,
  payload,
  userId,
  skipResponseShaping = false,
  skipBeforeUpdateHook = false,
  skipAfterUpdateHook = false,
  operation = "update"
}: UpdateDocumentOptions) => {
  const spec = getSpecByName(domain);
  if (!spec) throw new Error(`Domain (${domain}) does not exist`);

  const { valid, shapedData: shapedDataOriginal, errors } = validateAndShapePayload(payload, spec);
  if (!valid) throw new Error(`Validation failed: ${errors.join(", ")}`);

  let shapedData = shapedDataOriginal;
  const hooks = spec.meta?.hooks;

  if (!skipBeforeUpdateHook && hooks?.beforeUpdate) {
    const hookResponse = await hooks.beforeUpdate(shapedDataOriginal, {
      space, domain, operation, payload, userId
    });

    if (hookResponse.errors.length > 0) {
      throw new Error(`BeforeUpdate hook failed: ${hookResponse.errors.join(", ")}`);
    }

    shapedData = hookResponse.doc;
  }

  const ok = await checkParentReferences(shapedData, spec, space, {
    status: () => ({ json: () => { } })
  } as any);
  if (!ok) throw new Error("Parent reference check failed");

  const Model = getCollectionByName(space, domain);

  if (spec.meta?.ordering?.length && shapedData.order !== undefined) {
    const oldDoc = await Model.findOne({ reference });
    const oldOrder = oldDoc?.order;
    const newOrder = shapedData.order;

    if (newOrder !== oldOrder) {
      const groupFilter: any = {};
      for (const field of spec.meta.ordering) {
        groupFilter[field] = oldDoc[field];
      }

      await reorderWithinGroup(Model, reference, groupFilter, oldOrder, newOrder);
      delete shapedData.order;
    }
  }

  await preprocessTagFields(shapedData, spec, space);

  const prevDoc = await Model.findOne({ reference });
  const updated = await Model.findOneAndUpdate({ reference }, shapedData, { new: true });

  if (!updated) throw new Error("Document not found");

  const newVersion = await handleVersioning({
    space,
    domain,
    doc: updated.toObject(),
    prevDoc: prevDoc?.toObject(),
  });

  if (newVersion) {
    await Model.updateOne({ reference }, { __version: newVersion });
  }

  if (!skipAfterUpdateHook && hooks?.afterUpdate) {
    hooks.afterUpdate(updated.toObject(), {
      space, domain, operation, payload, userId
    }).catch(console.error);
  }

  if (skipResponseShaping) return updated.toObject();

  const shapedDoc = fillMissingFields(updated.toObject(), spec);
  const result = await applyShapeResponse(shapedDoc, spec, { space, domain, operation, userId });

  return result;
};


async function reorderWithinGroup(Model: any, reference: any, groupFilter: any, oldOrder: number, newOrder: number) {
  if (newOrder > oldOrder) {
    await Model.updateMany(
      { ...groupFilter, order: { $gt: oldOrder, $lte: newOrder } },
      { $inc: { order: -1 } }
    );
  } else {
    await Model.updateMany(
      { ...groupFilter, order: { $lt: oldOrder, $gte: newOrder } },
      { $inc: { order: 1 } }
    );
  }

  await Model.updateOne({ reference }, { order: newOrder });
}

export const patchDocument = async ({
  space,
  domain,
  reference,
  payload,
  userId,
  skipBeforePatchHook = false,
  skipAfterPatchHook = false,
  skipResponseShaping = false,
  operation = "patch"
}: PatchDocumentOptions) => {
  const spec = getSpecByName(domain);
  if (!spec) throw new Error(`Domain (${domain}) does not exist`);

  const { valid, shapedData: shapedDataOriginal, errors } = validateAndShapePayload(payload, spec, "", { allowPartial: true });
  if (!valid) throw new Error(`Validation failed: ${errors.join(", ")}`);

  let shapedData = shapedDataOriginal;
  const hooks = spec.meta?.hooks;

  if (!skipBeforePatchHook && hooks?.beforePatch) {
    const hookResponse = await hooks.beforePatch(shapedDataOriginal, {
      space, domain, operation, payload, userId
    });

    if (hookResponse.errors.length > 0) {
      throw new Error(`BeforePatch hook failed: ${hookResponse.errors.join(", ")}`);
    }

    shapedData = hookResponse.doc;
  }

  const ok = await checkParentReferences(shapedData, spec, space, {
    status: () => ({ json: () => { } })
  } as any);
  if (!ok) throw new Error("Parent reference check failed");

  const Model = getCollectionByName(space, domain);

  if (spec.meta?.ordering?.length && shapedData.order !== undefined) {
    const oldDoc = await Model.findOne({ reference });
    const oldOrder = oldDoc?.order;
    const newOrder = shapedData.order;

    if (newOrder !== oldOrder) {
      const groupFilter: any = {};
      for (const field of spec.meta.ordering) {
        groupFilter[field] = oldDoc[field];
      }

      await reorderWithinGroup(Model, reference, groupFilter, oldOrder, newOrder);
      delete shapedData.order;
    }
  }

  await preprocessTagFields(shapedData, spec, space);

  const prevDoc = await Model.findOne({ reference });
  const updated = await Model.findOneAndUpdate({ reference }, { $set: shapedData }, { new: true });

  if (!updated) throw new Error("Document not found");

  const newVersion = await handleVersioning({
    space,
    domain,
    doc: updated.toObject(),
    prevDoc: prevDoc?.toObject()
  });

  if (newVersion) {
    await Model.updateOne({ reference }, { __version: newVersion });
  }

  if (!skipAfterPatchHook && hooks?.afterPatch) {
    hooks.afterPatch(updated.toObject(), {
      space, domain, operation, payload, userId
    }).catch(console.error);
  }

  if (skipResponseShaping) return updated.toObject();

  const shapedDoc = fillMissingFields(updated.toObject(), spec);
  const result = await applyShapeResponse(shapedDoc, spec, { space, domain, operation, userId });

  return result;
};
