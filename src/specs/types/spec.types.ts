export type BaseType = "string" | "number" | "boolean" | "any";

// Lifecycle hooks for a domain
export interface SpecHooks {
  beforeCreate?: (doc: any, context: HookContext) => Promise<any>;
  beforeUpdate?: (doc: any, context: HookContext) => Promise<any>;
  beforePatch?: (doc: any, context: HookContext) => Promise<any>;
  afterCreate?: (doc: any, context: HookContext) => Promise<void>;
  afterUpdate?: (doc: any, context: HookContext) => Promise<void>;
  afterPatch?: (doc: any, context: HookContext) => Promise<void>;
}

// Optional metadata per domain
export interface SpecMeta {
  children?: string[]; // child domain names
  hooks?: SpecHooks;
}

export interface HookContext {
  space: string;
  domain: string;
  userId?: string;
}

// Base field type
export interface BaseField {
  type: BaseType | "object" | "array";
  required?: boolean;
  parent?: string;
}

// Object field
export interface ObjectField extends BaseField {
  type: "object";
  schema: SpecDefinition;
}

// Array field — allows for both base types and objects
export interface ArrayField extends BaseField {
  type: "array";
  schema: SpecField;
}

// Single field type — can be basic types or objects or arrays
export type SpecField =
  | {
      type: BaseType;
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
      schema: SpecField;  // Schema can be another field (array of objects or base types)
    };

// Full domain spec
export type SpecDefinition = {
  fields: {
    [field: string]: SpecField;
  };
  meta?: {
    hooks?: SpecHooks;
    children?: string[];
  };
};
