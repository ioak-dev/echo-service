import { SpecDefinition } from "../specs/types/spec.types";

const OP_MAP: Record<string, string> = {
  "$eq": "$eq",
  "$ne": "$ne",
  "$lt": "$lt",
  "$lte": "$lte",
  "$gt": "$gt",
  "$gte": "$gte",
  "$in": "$in",
  "$nin": "$nin",
  "$contains": "$regex"
};

export const buildQueryFromAdvancedFilters = (filters: any, spec: SpecDefinition): Record<string, any> => {
  const query: Record<string, any> = {};

  for (const field in filters) {
    const condition = filters[field];
    if (typeof condition !== "object") {
      query[field] = condition;
      continue;
    }

    for (const op in condition) {
      if (!OP_MAP[op]) continue;

      if (op === "$contains") {
        query[field] = { $regex: condition[op], $options: "i" };
      } else {
        query[field] = { ...query[field], [OP_MAP[op]]: condition[op] };
      }
    }
  }

  return query;
};
