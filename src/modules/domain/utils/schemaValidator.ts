import { SpecDefinition, SpecField, ObjectField, ArrayField } from "../specs/types/spec.types";

type ValidationResult = {
  valid: boolean;
  shapedData: any;
  errors: string[];
};

export function validateAndShapePayload(
  payload: any,
  spec: SpecDefinition,
  path = "",
  options: { allowPartial?: boolean } = {}
): ValidationResult {
  const errors: string[] = [];
  const shapedData: any = {};

  for (const key in spec.fields) {
    const field = spec.fields[key];
    const value = payload?.[key];
    const fullPath = path ? `${path}.${key}` : key;

    const isMissing = value === undefined || value === null;
    const isRequired = field.required === true;

    if (isMissing) {
      if (isRequired && !options.allowPartial) {
        errors.push(`${fullPath} is required`);
      }
      continue;
    }

    const validateBase = () => {
      if (typeof field.validate?.custom === "function") {
        try {
          if (!field.validate.custom(value)) {
            errors.push(`${fullPath} failed custom validation`);
          }
        } catch (e: any) {
          errors.push(`${fullPath} failed custom validation: ${e.message}`);
        }
      }
    };

    switch (field.type) {
      case "string":
        if (typeof value !== "string") {
          errors.push(`${fullPath} must be a string`);
        } else {
          if (field.validate?.minLength && value.length < field.validate.minLength) {
            errors.push(`${fullPath} must be at least ${field.validate.minLength} characters`);
          }
          if (field.validate?.maxLength && value.length > field.validate.maxLength) {
            errors.push(`${fullPath} must be at most ${field.validate.maxLength} characters`);
          }
          if (field.validate?.regex && !(new RegExp(field.validate.regex).test(value))) {
            errors.push(`${fullPath} does not match required pattern`);
          }
        }
        validateBase();
        shapedData[key] = value;
        break;

      case "number":
        if (typeof value !== "number") {
          errors.push(`${fullPath} must be a number`);
        } else {
          if (field.validate?.min !== undefined && value < field.validate.min) {
            errors.push(`${fullPath} must be at least ${field.validate.min}`);
          }
          if (field.validate?.max !== undefined && value > field.validate.max) {
            errors.push(`${fullPath} must be at most ${field.validate.max}`);
          }
        }
        validateBase();
        shapedData[key] = value;
        break;

      case "boolean":
        if (typeof value !== "boolean") {
          errors.push(`${fullPath} must be a boolean`);
        } else {
          validateBase();
          shapedData[key] = value;
        }
        break;

      case "enum":
        if (!field.options.map(o => o.value).includes(value)) {
          errors.push(`${fullPath} must be one of ${field.options.map(o => o.value).join(", ")}`);
        }
        validateBase();
        shapedData[key] = value;
        break;

      case "object":
        if (typeof value !== "object" || Array.isArray(value)) {
          errors.push(`${fullPath} must be an object`);
        } else {
          const nestedResult = validateAndShapePayload(value, { fields: field.fields }, fullPath, options);
          if (!nestedResult.valid) {
            errors.push(...nestedResult.errors);
          } else {
            shapedData[key] = nestedResult.shapedData;
          }
        }
        break;

      case "array":
        if (!Array.isArray(value)) {
          errors.push(`${fullPath} must be an array`);
        } else {
          if (field.validate?.minItems !== undefined && value.length < field.validate.minItems) {
            errors.push(`${fullPath} must have at least ${field.validate.minItems} items`);
          }
          if (field.validate?.maxItems !== undefined && value.length > field.validate.maxItems) {
            errors.push(`${fullPath} must have at most ${field.validate.maxItems} items`);
          }

          const itemType = field.itemType;
          const shapedArray: any[] = [];

          for (let i = 0; i < value.length; i++) {
            const item = value[i];
            const itemPath = `${fullPath}[${i}]`;

            if (itemType === "object" && field.fields) {
              const nested = validateAndShapePayload(item, { fields: field.fields }, itemPath, options);
              if (!nested.valid) {
                errors.push(...nested.errors);
              } else {
                shapedArray.push(nested.shapedData);
              }
            } else {
              const expectedType = itemType;
              if (typeof item !== expectedType) {
                errors.push(`${itemPath} must be a ${expectedType}`);
              } else {
                shapedArray.push(item);
              }
            }
          }

          shapedData[key] = shapedArray;
        }
        break;

      default:
        errors.push(`${fullPath} has unsupported field type`);
        break;
    }
  }

  return {
    valid: errors.length === 0,
    shapedData,
    errors
  };
}

export const fillMissingFields = (
  doc: any,
  spec: SpecDefinition
): any => {
  const shaped: any = {
    id: doc._id ?? doc.id,
    reference: doc.reference,
    createdBy: doc.createdBy,
    createdAt: doc.createdAt,
    updatedBy: doc.updatedBy,
    updatedAt: doc.updatedAt,
  };

  for (const key in spec.fields) {
    const field = spec.fields[key];
    const value = doc[key];

    if (value !== undefined && value !== null) {
      // Directly use existing field value
      shaped[key] = value;
    } else {
      // Handle defaults based on type
      shaped[key] = getDefaultValueForField(field);
    }
  }

  return shaped;
};

const getDefaultValueForField = (field: SpecField): any => {
  switch (field.type) {
    case "string":
    case "number":
    case "boolean":
    case "enum":
      return null;

    case "object":
      const nested: any = {};
      for (const subField in field.fields) {
        nested[subField] = getDefaultValueForField(field.fields[subField]);
      }
      return nested;

    case "array":
      return [];

    default:
      return null;
  }
};
