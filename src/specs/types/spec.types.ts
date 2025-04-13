export type BaseType = "string" | "number" | "boolean" | "any";

export interface BaseField {
  type: BaseType | "object" | "array";
  required?: boolean;
  parent?: string; // domain name of parent
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
export type FieldDefinition = BaseField | ObjectField | ArrayField;

// Domain-level metadata
export interface SpecMeta {
  children?: string[]; // child domain names
}

// A domain spec is a dictionary of fields + optional meta info
export type SpecField =
  | {
    type: "string" | "number" | "boolean";
    required?: boolean;
    parent?: string;
    filter?: any;
  }
  | {
    type: "object";
    required?: boolean;
    schema: SpecDefinition;
  }
  | {
    type: "array";
    required?: boolean;
    schema: SpecField;
  }


export type SpecDefinition = {
  [field: string]: SpecField;
};
