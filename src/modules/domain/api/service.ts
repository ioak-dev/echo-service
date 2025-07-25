import { Request, Response } from "express";
import { customAlphabet } from 'nanoid';
import { getCollectionByName } from "../../../lib/dbutils";
import { fillMissingFields, validateAndShapePayload } from "../utils/schemaValidator";
import { getSpecByName } from "../specs/specRegistry";
import { LLMGenerationSpec, SpecDefinition, SpecField } from "../specs/types/spec.types";
import { buildQueryFromAdvancedFilters, buildSortQuery } from "../filterBuilder";
import { generateTypesFromSpecs } from "../utils/typeInference";
import * as LlmHelper from './aiHelper';
import { populateTagFields, preprocessTagFields } from "./tagUtils";
import { createDocument, patchDocument, updateDocument } from "./createHelper";
import { getAiSpec } from "../specs/aiSpecRegistry";
import { GenerationSpec } from "../specs/types/aispec.types";
import { deleteAllVersions, handleVersioning } from "./versioningHelper";
import { LlmRunner } from "aihub";
const alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphanumericAlphabet, 8);
const config = require("../../../../env");
export const applyShapeResponse = async (
  doc: any,
  spec: SpecDefinition,
  context: any
): Promise<any | null> => {
  const hooks = spec.meta?.hooks;
  if (hooks?.shapeResponse) {
    const result = await hooks.shapeResponse(doc, context);
    if (result.errors.length > 0) {
      throw new Error(`shapeResponse errors: ${result.errors.join(", ")}`);
    }
    return result.doc ?? null;
  }

  if (doc) {
    await populateTagFields(doc, spec, context.space);
  }

  return doc;
}


export const checkParentReferences = async (
  shapedData: any,
  spec: SpecDefinition,
  space: string,
  res: Response,
  path = ""
): Promise<boolean> => {
  for (const fieldName in spec.fields) {
    const fieldSpec = spec.fields[fieldName];
    const value = shapedData?.[fieldName];
    const fullPath = path ? `${path}.${fieldName}` : fieldName;

    if (value === undefined || value === null) continue;

    if ('parent' in fieldSpec) {
      if (
        ["string", "number"].includes(fieldSpec.type) &&
        fieldSpec.parent &&
        typeof value === 'string'
      ) {
        const parentModel = getCollectionByName(space, fieldSpec.parent.domain);
        const found = await parentModel.findOne({ [fieldSpec.parent.field]: value });

        if (!found) {
          res.status(400).json({
            error: `Invalid parent reference '${value}' for '${fullPath}' in domain '${fieldSpec.parent.domain}', field '${fieldSpec.parent.field}'`
          });
          return false;
        }
      }
    }

    if (fieldSpec.type === 'object') {
      const ok = await checkParentReferences(value, { fields: fieldSpec.fields }, space, res, fullPath);
      if (!ok) return false;
    }

    if (fieldSpec.type === 'array' && Array.isArray(value)) {
      const itemFields = fieldSpec.fields;

      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const itemPath = `${fullPath}[${i}]`;

        if (fieldSpec.itemType === 'object' && itemFields) {
          const ok = await checkParentReferences(item, { fields: itemFields }, space, res, itemPath);
          if (!ok) return false;
        }

        if (
          ["string", "number"].includes(fieldSpec.itemType) &&
          fieldSpec.parent &&
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
    ...spec,
    domain,
    // fields: spec.fields,
    // children: spec.meta?.children || [],
    // supportedHooks,
    endpoints
  };

  res.json(meta);
};

export const getVersionHistory = async (req: Request, res: Response) => {
  const { space, domain, reference } = req.params;

  const spec = getSpecByName(domain);
  if (!spec) {
    return res.status(404).json({ error: `Domain (${domain}) does not exist` });
  }

  const MainModel = getCollectionByName(space, domain);
  const mainDoc = await MainModel.findOne({ reference });
  if (!mainDoc) {
    return res.status(404).json({ error: `Reference (${reference}) not found in domain (${domain})` });
  }

  const versionMeta = spec?.meta?.versioning;
  if (!versionMeta) {
    return res.status(400).json({ error: `Versioning is not enabled for domain: ${domain}` });
  }

  const VersionModel = getCollectionByName(space, versionMeta.domain);
  const referenceField = versionMeta.reference || "parentReference";

  const versions = await VersionModel.find({ [referenceField]: reference })
    .sort({ createdAt: -1 })
    .select('__version __columns __percentage reference createdAt createdBy updatedAt updatedBy ')
    .lean();

  res.json(versions);
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

    const docs = await Model.find(mongoQuery)
      .sort(mongoSort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Model.countDocuments(mongoQuery);

    const shapedPromises = docs.map(async (doc: any) => {
      const filled = fillMissingFields(doc.toObject(), spec);
      try {
        return await applyShapeResponse(filled, spec, { space, domain, operation: "search" });
      } catch (err) {
        console.error("shapeResponse error:", err);
        return null;
      }
    });

    const shapedResults = (await Promise.all(shapedPromises)).filter(doc => doc !== null);

    res.json({
      data: shapedResults,
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
  const { version } = req.query;

  const spec = getSpecByName(domain);
  if (!spec) return res.status(404).json({ error: `Domain (${domain}) does not exists` });

  if (version) {
    const versionMeta = spec?.meta?.versioning;
    if (!versionMeta) {
      return res.status(400).json({ error: `Versioning not enabled for domain ${domain}` });
    }

    const VersionModel = getCollectionByName(space, versionMeta.domain);
    const referenceField = versionMeta.reference || "parentReference";

    const versionedDoc = await VersionModel.findOne({
      [referenceField]: reference,
      __version: version,
    });

    if (!versionedDoc) {
      return res.status(404).json({ error: `Version ${version} not found for reference ${reference}` });
    }

    const filled = fillMissingFields(versionedDoc.toObject(), spec);
    const shaped = await applyShapeResponse(filled, spec, { space, domain, operation: "getOne" });

    return res.json(shaped);
  }

  const Model = getCollectionByName(space, domain);
  const doc = await Model.findOne({ reference });
  if (!doc) return res.status(404).json({ error: "Not found" });

  const filled = fillMissingFields(doc.toObject(), spec);
  const shaped = await applyShapeResponse(filled, spec, { space, domain, operation: "getOne" });
  res.json(shaped);
};

export const create = async (req: Request, res: Response) => {
  const { space, domain } = req.params;
  const userId = req.user?.user_id;
  const payload = req.body;

  try {
    const result = await createDocument({ space, domain, payload, userId });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
export const patch = async (req: Request, res: Response) => {
  const { space, domain, reference } = req.params;
  const payload = req.body;
  const userId = req.user?.user_id;

  try {
    const result = await patchDocument({ space, domain, reference, payload, userId });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  const { space, domain, reference } = req.params;
  const payload = req.body;
  const userId = req.user?.user_id;

  try {
    const result = await updateDocument({ space, domain, reference, payload, userId });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
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
      await ChildModel.deleteMany({ [childField]: parentValue });
    } else {
      const dependent = await ChildModel.findOne({ [childField]: parentValue });
      if (dependent) {
        return res.status(400).json({
          error: `Cannot delete ${domain}.${reference} because its value '${parentValue}' in '${parentField}' is referenced in ${childDomain}.${childField}`,
        });
      }
    }
  }

  await Model.deleteOne({ reference });
  await deleteAllVersions({ space, domain, reference });
  res.status(204).send();
};

interface GenerateQueryType {
  reference?: string;
  parentReference?: string;
  parentVersion?: string;
}

export const generate = async (req: Request, res: Response) => {
  const { space, generationId } = req.params;
  const payload = req.body;

  const { reference, parentReference, parentVersion }: GenerateQueryType = req.query;

  if (!generationId) {
    return res.status(400).json({ error: 'Missing generationId in payload' });
  }

  if (!reference && !parentReference) {
    return res.status(400).json({ error: 'Missing both reference and parentReference in query parameters' });
  }

  const spec: GenerationSpec | undefined = getAiSpec(generationId);

  if (!spec) {
    return res.status(404).json({ error: `Generation spec with id (${generationId}) not found` });
  }

  try {
    const result = await LlmHelper.runGeneration({
      space,
      spec,
      reference,
      parentReference,
      parentVersion,
      payload
    });
    res.status(200).json({ data: result });
  } catch (err: any) {
    console.error('Generation error:', err);
    res.status(500).json({ error: 'Generation failed', details: err.message });
  }
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

export const chat = async (req: Request, res: Response) => {
  const payload: any[] = req.body.messages;
  try {
    const messages = [
      {
        role: "system",
        content: "You are an expert assistant helping users fill out the form fields. Only respond with suggestions related to the field only without going off topic"
      },
      ...payload
    ];
    const streamResponse = await LlmRunner.runner.chatgpt.stream(
      config.CHATGPT_API_KEY,
      "/v1/chat/completions",
      messages
    )
    res.setHeader('Content-Type', 'text/event-stream');
    streamResponse.pipe(res);
  } catch (err: any) {
    console.error('Generation error:', err);
    res.status(500).json({ error: 'Generation failed', details: err.message });
  }
};