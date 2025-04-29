import {
  SpecDefinition,
  SpecField,
  ObjectField,
  ArrayField
} from "./specs/types/spec.types";

// MongoDB operator mapping
const OP_MAP: Record<string, string> = {
  eq: "$eq",
  ne: "$ne",
  gt: "$gt",
  gte: "$gte",
  lt: "$lt",
  lte: "$lte",
  in: "$in",
  nin: "$nin",
  regex: "$regex"
};

/**
 * Resolves a dot-notated field path (e.g. "lessons.quizzes.questions.prompt")
 * against a nested SpecDefinition.
 */
const resolveFieldSpec = (
  path: string[],
  spec: SpecDefinition
): SpecField | null => {
  let currentField: SpecField | undefined;

  let currentFields: Record<string, SpecField> = spec.fields;

  for (let i = 0; i < path.length; i++) {
    const part = path[i];
    currentField = currentFields[part];

    if (!currentField) return null;

    if (currentField.type === "object") {
      currentFields = (currentField as ObjectField).fields;
    } else if (currentField.type === "array") {
      const arrayField = currentField as ArrayField;

      if (arrayField.itemType === "object" && arrayField.fields) {
        currentFields = arrayField.fields;
      } else if (i < path.length - 1) {
        // Reached non-object array but path continues
        return null;
      }
    } else {
      if (i < path.length - 1) {
        // Reached primitive type before end of path
        return null;
      }
    }
  }

  return currentField ?? null;
};

export const buildSortQuery = (sort: Record<string, "asc" | "desc" | 1 | -1>) => {
  const mongoSort: Record<string, 1 | -1> = {};

  for (const key in sort) {
    const direction = sort[key];
    mongoSort[key] = direction === "desc" || direction === -1 ? -1 : 1;
  }

  return mongoSort;
};

export const buildQueryFromAdvancedFilters = (
  filters: Record<string, any>,
  spec: SpecDefinition
): Record<string, any> => {
  const mongoQuery: Record<string, any> = {};

  for (const rawField in filters) {
    const value = filters[rawField];
    const path = rawField.split(".");

    const fieldSpec = resolveFieldSpec(path, spec);
    if (!fieldSpec) continue;

    if (typeof value === "object" && !Array.isArray(value)) {
      const mongoOps: Record<string, any> = {};

      for (const op in value) {
        if (OP_MAP[op]) {
          mongoOps[OP_MAP[op]] = op === "regex"
            ? new RegExp(value[op], "i")
            : value[op];
        }
      }

      mongoQuery[rawField] = mongoOps;
    } else {
      mongoQuery[rawField] = value;
    }
  }

  return mongoQuery;
};
