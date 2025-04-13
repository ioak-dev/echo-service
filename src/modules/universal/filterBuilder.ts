import { SpecDefinition } from "../../specs/types/spec.types";

export const buildQueryFromFilters = (
  queryParams: any,
  spec: SpecDefinition
): Record<string, any> => {
  const mongoQuery: Record<string, any> = {};

  for (const field in queryParams) {
    const filterValue = queryParams[field];
    const fieldSpec = spec[field];
    if (!fieldSpec) continue;

    switch (fieldSpec.filter) {
      case "like":
        mongoQuery[field] = { $regex: new RegExp(filterValue, "i") };
        break;
      case "in":
        mongoQuery[field] = { $in: Array.isArray(filterValue) ? filterValue : [filterValue] };
        break;
      case "gt":
        mongoQuery[field] = { $gt: filterValue };
        break;
      case "lt":
        mongoQuery[field] = { $lt: filterValue };
        break;
      case "gte":
        mongoQuery[field] = { $gte: filterValue };
        break;
      case "lte":
        mongoQuery[field] = { $lte: filterValue };
        break;
      case "exact":
      default:
        mongoQuery[field] = filterValue;
        break;
    }
  }

  return mongoQuery;
};

export const buildQueryFromAdvancedFilters = (
    filters: any,
    spec: SpecDefinition
  ): Record<string, any> => {
    const mongoQuery: Record<string, any> = {};
  
    for (const field in filters) {
      const value = filters[field];
      const fieldSpec = spec[field];
      if (!fieldSpec) continue;
  
      if (typeof value === "object" && !Array.isArray(value)) {
        // Support operators like gte, lte, in
        const operators: Record<string, string> = {
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
  
        const mongoOps: Record<string, any> = {};
  
        for (const op in value) {
          if (operators[op]) {
            mongoOps[operators[op]] = value[op];
          }
        }
  
        mongoQuery[field] = mongoOps;
      } else {
        mongoQuery[field] = value;
      }
    }
  
    return mongoQuery;
  };