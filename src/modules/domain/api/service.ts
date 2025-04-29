import { Request, Response } from "express";
import { customAlphabet } from 'nanoid';
import { getCollectionByName } from "../../../lib/dbutils";
// import { getSpecByName } from "../../specs/specRegistry";
import { fillMissingFields, validateAndShapePayload } from "../utils/schemaValidator";
import { getSpecByName } from "../specs/specRegistry";
import { SpecDefinition, SpecField } from "../specs/types/spec.types";
import { buildQueryFromAdvancedFilters, buildSortQuery } from "../filterBuilder";
import { generateTypesFromSpecs } from "../utils/typeInference";

const alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphanumericAlphabet, 8);


export const checkParentReferences = async (
  shapedData: any,
  spec: SpecDefinition,
  space: string,
  res: Response,
  path = ""
): Promise<boolean> => {
  // Loop through each field in the SpecDefinition
  for (const fieldName in spec.fields) {
    const fieldSpec = spec.fields[fieldName];
    const value = shapedData?.[fieldName];
    const fullPath = path ? `${path}.${fieldName}` : fieldName;

    // Skip fields with no value
    if (value === undefined || value === null) continue;

    // Handle fields with a 'parent' property (StringField, NumberField)
    if ('parent' in fieldSpec) {
      // Only check for parent references on fields with a 'parent' property
      if (
        ["string", "number"].includes(fieldSpec.type) && // Validate only for 'string' or 'number'
        fieldSpec.parent && // Ensure 'parent' is defined
        typeof value === 'string' // The value must be a string (reference)
      ) {
        // Access the parent model using the domain from the 'parent' property
        const parentModel = getCollectionByName(space, fieldSpec.parent.domain);
        // Check if the reference exists in the parent model
        const found = await parentModel.findOne({ [fieldSpec.parent.field]: value });

        if (!found) {
          // If not found, return an error response
          res.status(400).json({
            error: `Invalid parent reference '${value}' for '${fullPath}' in domain '${fieldSpec.parent.domain}', field '${fieldSpec.parent.field}'`
          });
          return false;
        }
      }
    }

    // Handle ObjectFields: check parent references in nested fields
    if (fieldSpec.type === 'object') {
      const ok = await checkParentReferences(value, { fields: fieldSpec.fields }, space, res, fullPath);
      if (!ok) return false;
    }

    // Handle ArrayFields: check each item in the array for parent references
    if (fieldSpec.type === 'array' && Array.isArray(value)) {
      const itemFields = fieldSpec.fields;

      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const itemPath = `${fullPath}[${i}]`;

        // Handle object items in arrays
        if (fieldSpec.itemType === 'object' && itemFields) {
          const ok = await checkParentReferences(item, { fields: itemFields }, space, res, itemPath);
          if (!ok) return false;
        }

        // Handle array items with parent references
        if (
          ["string", "number"].includes(fieldSpec.itemType) &&
          fieldSpec.parent && // Check if 'parent' is defined for array items
          typeof item === "string"
        ) {
          const parentModel = getCollectionByName(space, fieldSpec.parent.domain);
          const found = await parentModel.findOne({ [fieldSpec.parent.field]: item });
          if (!found) {
            res.status(400).json({
              error: `Invalid parent reference '${item}' for '${itemPath}' in domain '${fieldSpec.parent.domain}'`
            });
            return false;
          }
        }
      }
    }
  }

  return true;
};

async function reorderWithinGroup(Model: any, reference: any, groupFilter: any, oldOrder: number, newOrder: number) {
  if (newOrder > oldOrder) {
    // Move down: shift others up
    await Model.updateMany(
      { ...groupFilter, order: { $gt: oldOrder, $lte: newOrder } },
      { $inc: { order: -1 } }
    );
  } else {
    // Move up: shift others down
    await Model.updateMany(
      { ...groupFilter, order: { $lt: oldOrder, $gte: newOrder } },
      { $inc: { order: 1 } }
    );
  }

  await Model.updateOne({ reference }, { order: newOrder });
}


export const getMeta = async (req: Request, res: Response) => {
  const { space, domain } = req.params;

  const spec = getSpecByName(domain);
  if (!spec) return res.status(404).json({ error: `Domain (${domain}) does not exists` });

  const supportedHooks = Object.keys(spec.meta?.hooks || {});
  const endpoints = [
    `GET /api/${domain}/meta`,
    `POST /api/${domain}/search`,
    `GET /api/${domain}/:id`,
    `POST /api/${domain}`,
    `PATCH /api/${domain}/:id`,
    `PUT /api/${domain}/:id`,
    `DELETE /api/${domain}/:id`
  ];

  const meta = {
    domain,
    fields: spec.fields,
    // children: spec.meta?.children || [],
    // supportedHooks,
    endpoints
  };

  res.json(meta);
};


export const search = async (req: Request, res: Response) => {
  const { space, domain } = req.params;

  const spec = getSpecByName(domain);
  if (!spec) return res.status(404).json({ error: `Domain (${domain}) does not exist` });

  try {
    const { filters = {}, pagination = {}, sort = {} } = req.body;
    const page = Math.max(1, +pagination.page || 1);
    const limit = Math.max(1, +pagination.limit || 10);
    const Model = getCollectionByName(space, domain);

    const mongoQuery = buildQueryFromAdvancedFilters(filters, spec);
    const mongoSort = buildSortQuery(sort);

    console.log("Query:", mongoQuery);
    console.log("Sort:", mongoSort);

    const docs = await Model.find(mongoQuery)
      .sort(mongoSort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Model.countDocuments(mongoQuery);
    const shaped = docs.map((doc: any) => fillMissingFields(doc.toObject(), spec));

    res.json({
      data: shaped,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err: any) {
    res.status(500).json({ error: "Search failed", details: err.message });
  }
};


export const getOne = async (req: Request, res: Response) => {
  const { space, domain, reference } = req.params;

  const spec = getSpecByName(domain);
  if (!spec) return res.status(404).json({ error: `Domain (${domain}) does not exists` });

  const Model = getCollectionByName(space, domain);
  const doc = await Model.findOne({ reference });
  if (!doc) return res.status(404).json({ error: "Not found" });

  res.json(fillMissingFields(doc.toObject(), spec));
};

export const create = async (req: Request, res: Response) => {
  const { space, domain } = req.params;
  const payload = req.body;
  const userId = req.user?.user_id;

  const spec = getSpecByName(domain);
  if (!spec) return res.status(404).json({ error: `Domain (${domain}) does not exists` });

  const { valid, shapedData: shapedDataOriginal, errors } = validateAndShapePayload(payload, spec);

  let shapedData = shapedDataOriginal;

  if (!valid) return res.status(400).json({ error: "Validation failed", details: errors });

  const hooks = spec.meta?.hooks;
  if (hooks?.beforeCreate) {
    let hookResponse = await hooks.beforeCreate(shapedDataOriginal, { space, domain, operation: "create", userId });
    if (hookResponse.errors.length > 0) return res.status(400).json({ error: "Validation failed", details: hookResponse.errors });
    shapedData = hookResponse.doc;
  }

  const ok = await checkParentReferences(shapedData, spec, space, res);
  if (!ok) return;


  const Model = getCollectionByName(space, domain);

  // Logic to create ordering
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
  const doc = new Model({
    ...shapedData,
    reference: nanoid(),
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: userId,
    updatedBy: userId
  });

  await doc.save();
  res.status(201).json(fillMissingFields(doc.toObject(), spec));
  if (hooks?.afterCreate) {
    hooks.afterCreate(doc.toObject(), { space, domain, operation: "create", userId }).catch(console.error);
  }
};

export const patch = async (req: Request, res: Response) => {
  const { space, domain, reference } = req.params;
  const payload = req.body;
  const userId = req.user?.user_id;

  const spec = getSpecByName(domain);
  if (!spec) return res.status(404).json({ error: `Domain (${domain}) does not exists` });

  const { valid, shapedData: shapedDataOriginal, errors } = validateAndShapePayload(payload, spec, "", { allowPartial: true });

  if (!valid) return res.status(400).json({ error: "Validation failed", details: errors });

  let shapedData = shapedDataOriginal;

  const hooks = spec.meta?.hooks;
  if (hooks?.beforePatch) {
    let hookResponse = await hooks.beforePatch(shapedDataOriginal, { space, domain, operation: "create", userId });
    if (hookResponse.errors.length > 0) return res.status(400).json({ error: "Validation failed", details: hookResponse.errors });
    shapedData = hookResponse.doc;
  }

  const ok = await checkParentReferences(shapedData, spec, space, res);
  if (!ok) return;

  const Model = getCollectionByName(space, domain);

  // Adjust ordering
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

      // Prevent overwriting the order field again
      delete shapedData.order;
    }
  }


  const updated = await Model.findOneAndUpdate({ reference }, { $set: shapedData }, { new: true });
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
  if (hooks?.afterPatch) {
    hooks.afterPatch(updated.toObject(), { space, domain, operation: "patch", userId }).catch(console.error);
  }
};

export const update = async (req: Request, res: Response) => {
  const { space, domain, reference } = req.params;
  const payload = req.body;
  const userId = req.user?.user_id;

  const spec = getSpecByName(domain);
  if (!spec) return res.status(404).json({ error: `Domain (${domain}) does not exists` });

  const { valid, shapedData: shapedDataOriginal, errors } = validateAndShapePayload(payload, spec);

  let shapedData = shapedDataOriginal;
  const hooks = spec.meta?.hooks;
  if (hooks?.beforeUpdate) {
    let hookResponse = await hooks.beforeUpdate(shapedDataOriginal, { space, domain, operation: "create", userId });
    if (hookResponse.errors.length > 0) return res.status(400).json({ error: "Validation failed", details: hookResponse.errors });
    shapedData = hookResponse.doc;
  }

  if (!valid) return res.status(400).json({ error: "Validation failed", details: errors });

  const ok = await checkParentReferences(shapedData, spec, space, res);
  if (!ok) return;

  const Model = getCollectionByName(space, domain);

  // Adjust ordering
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

      // Prevent overwriting the order field again
      delete shapedData.order;
    }
  }

  const updated = await Model.findOneAndUpdate({ reference }, shapedData, { new: true });
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
  if (hooks?.afterUpdate) {
    hooks.afterUpdate(updated.toObject(), { space, domain, operation: "update", userId }).catch(console.error);
  }
};

export const deleteOne = async (req: Request, res: Response) => {
  const { space, domain, reference } = req.params;

  const spec = getSpecByName(domain);
  if (!spec) {
    return res.status(404).json({ error: `Domain (${domain}) does not exist` });
  }

  const Model = getCollectionByName(space, domain);
  const existing = await Model.findOne({ reference });
  if (!existing) {
    return res.status(404).json({ error: "Not found" });
  }

  const children = spec.meta?.children || [];

  for (const child of children) {
    const { domain: childDomain, field, cascadeDelete } = child;
    const { parent: parentField, child: childField } = field;

    const parentValue = existing[parentField];
    if (parentValue === undefined) continue;

    const ChildModel = getCollectionByName(space, childDomain);

    if (cascadeDelete) {
      // Delete dependent child records
      await ChildModel.deleteMany({ [childField]: parentValue });
    } else {
      // Check for dependent records and block deletion if any
      const dependent = await ChildModel.findOne({ [childField]: parentValue });
      if (dependent) {
        return res.status(400).json({
          error: `Cannot delete ${domain}.${reference} because its value '${parentValue}' in '${parentField}' is referenced in ${childDomain}.${childField}`,
        });
      }
    }
  }

  await Model.deleteOne({ reference });
  res.status(204).send();
};




export const inferTypes = (req: Request, res: Response) => {
  try {
    const types = generateTypesFromSpecs();
    res.header("Content-Type", "text/typescript");
    res.send(types);
  } catch (err: any) {
    res.status(500).json({ error: "Error generating types", details: err.message });
  }
};
