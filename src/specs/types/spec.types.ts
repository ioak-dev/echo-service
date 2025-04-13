export type BaseType = "string" | "number" | "boolean" | "any";

export interface BaseField {
  type: BaseType | "object" | "array";
  required?: boolean;
  filter?: "like" | "in" | "gt" | "lt" | "gte" | "lte" | "exact";
}

// Object field — supports nested schema
export interface ObjectField extends BaseField {
  type: "object";
  schema: SpecDefinition;
}

// Array field — supports either base types or object definitions
export interface ArrayField extends BaseField {
  type: "array";
  schema: FieldDefinition; // type of array elements
}

// A single field can be base, object, or array
export type FieldDefinition =
  | BaseField
  | ObjectField
  | ArrayField;

// A domain spec is an object of fields
export type SpecDefinition = {
  [fieldName: string]: FieldDefinition;
};
