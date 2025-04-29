import fs from "fs";
import path from "path";
import { childrenMap, specsMap } from '../../specs/domains';
import { SpecDefinition } from "../../specs/types/spec.types";


export const loadSpec = (domain: string): SpecDefinition => {
  const spec: SpecDefinition = specsMap[domain];

  if (!spec) {
    throw new Error(`No schema spec found for domain '${domain}'`);
  }

  return spec;
};

export const loadChildren = (domain: string): string[] => {
  return childrenMap[domain] || [];
};

export const validateAndShapePayload = (
  payload: any,
  spec: SpecDefinition,
  path: string = "",
  options: { allowPartial?: boolean } = {}
): { valid: boolean; errors: string[]; shapedData: any } => {
  let errors: string[] = [];
  const shapedData: any = {};
  const allowPartial = options.allowPartial ?? false;

  for (const key in spec.fields) {
    const fieldSpec = spec.fields[key];
    const fullPath = path ? `${path}.${key}` : key;
    const value = payload?.[key];

    const isValuePresent = value !== undefined && value !== null;

    if (!allowPartial && fieldSpec.required && !isValuePresent) {
      errors.push(`${fullPath} is required`);
      continue;
    }

    if (!isValuePresent) {
      // In partial mode, skip assigning defaults for missing fields
      if (!allowPartial) {
        shapedData[key] = getDefaultForType(fieldSpec.type);
      }
      continue;
    }

    if (fieldSpec.type === "object") {
      if (typeof value !== "object" || Array.isArray(value)) {
        errors.push(`${fullPath} should be an object`);
        continue;
      }

      const nested = validateAndShapePayload(
        value,
        fieldSpec.schema || {},
        fullPath,
        options
      );
      errors.push(...nested.errors);
      shapedData[key] = nested.shapedData;
    } else if (fieldSpec.type === "array") {
      if (!Array.isArray(value)) {
        errors.push(`${fullPath} should be an array`);
        continue;
      }

      shapedData[key] = [];
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const itemPath = `${fullPath}[${i}]`;

        if (fieldSpec.schema?.type === "object") {
          const nested = validateAndShapePayload(
            item,
            fieldSpec.schema.schema || {},
            itemPath,
            options
          );
          errors.push(...nested.errors);
          shapedData[key].push(nested.shapedData);
        } else {
          if (typeof item !== fieldSpec.schema.type) {
            errors.push(`${itemPath} should be of type ${fieldSpec.schema.type}`);
          } else {
            shapedData[key].push(item);
          }
        }
      }
    } else {
      if (typeof value !== fieldSpec.type) {
        errors.push(`${fullPath} should be of type ${fieldSpec.type}`);
        continue;
      }

      shapedData[key] = value;
    }
  }

  return { valid: errors.length === 0, errors, shapedData };
};


const getDefaultForType = (type: string) => {
  switch (type) {
    case "string": return undefined;
    case "number": return undefined;
    case "boolean": return undefined;
    case "array": return [];
    case "object": return {};
    default: return undefined;
  }
};

export const fillMissingFields = (
  doc: any,
  spec: SpecDefinition
): any => {
  const shaped: any = { id: doc._id, reference: doc.reference, createdBy: doc.createdBy, createdAt: doc.createdAt, updatedBy: doc.updatedBy, updatedAt: doc.updatedAt };

  for (const field in spec.fields) {
    if (doc.hasOwnProperty(field)) {
      shaped[field] = doc[field];
    } else {
      shaped[field] = spec.fields[field].type === "array" ? [] : null;
    }
  }

  return shaped;
};

export const isOperationAllowed = (domain: string, operation: string): boolean => {
  const filePath = path.join(__dirname, "./specs/domains/", `${domain}.exclude.json`);

  if (!fs.existsSync(filePath)) {
    return true;
  }

  const excludedOps = JSON.parse(fs.readFileSync(filePath, "utf-8")) as string[];

  return !excludedOps.includes("*") && !excludedOps.includes(operation);
};
