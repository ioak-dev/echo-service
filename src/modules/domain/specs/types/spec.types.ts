import { PromptBuilder } from 'aihub';

export interface HookContext {
  space: string;
  domain: string;
  operation: "create" | "update" | "patch" | "delete" | "generate";
  payload: any;
  userId?: string;
}

interface HookResponse {
  doc: any;
  errors: string[];
}

// Lifecycle hooks for a domain
export interface SpecHooks {
  beforeCreate?: (doc: any, context: HookContext) => Promise<HookResponse>;
  beforeUpdate?: (doc: any, context: HookContext) => Promise<HookResponse>;
  beforePatch?: (doc: any, context: HookContext) => Promise<HookResponse>;
  afterCreate?: (doc: any, context: HookContext) => Promise<void>;
  afterUpdate?: (doc: any, context: HookContext) => Promise<void>;
  afterPatch?: (doc: any, context: HookContext) => Promise<void>;
  beforeGenerate?: (doc: any, context: HookContext) => Promise<HookResponse>;
  afterGenerate?: (doc: any, context: HookContext) => Promise<HookResponse>;
  validate?: (doc: any, context: HookContext) => Promise<string[]>;
  shapeResponse?: (doc: any, context: HookContext) => Promise<HookResponse>;
}

interface BaseValidation {
  custom?: (value: any) => boolean;
}

interface StringValidation {
  minLength?: number;
  maxLength?: number;
  regex?: string;
}

interface NumberValidation {
  min?: number;
  max?: number;
}

interface ArrayValidation {
  minItems?: number;
  maxItems?: number;
}

interface TagValidation {
  maxTags?: number;
  allowCustomTags?: boolean;
}

interface BaseField<TValidation = {}> {
  required?: boolean;
  validate?: TValidation & BaseValidation;
}

// Richtext-specific extension
export enum ToolbarOption {
  Bold = "bold",
  Italic = "italic",
  Underline = "underline",
  Strikethrough = "strikethrough",
  Heading = "heading",
  AlignLeft = "alignLeft",
  AlignCenter = "alignCenter",
  AlignRight = "alignRight",
  AlignJustify = "alignJustify",
  BulletList = "bulletList",
  OrderedList = "orderedList",
  BlockQuote = "blockQuote",
  Code = "code",
  CodeBlock = "codeBlock",
  FontColor = "fontColor",
  HighlightColor = "highlightColor",
  Link = "link",
  ClearFormatting = "clearFormatting",
  HorizontalRule = "horizontalRule",
  Image = "image",
  AddTable = "addTable",
  YouTubeVideo = "youTubeVideo",
  Undo = "undo",
  Redo = "redo",
}

export type StringField = BaseField<StringValidation> & {
  type: 'string';
  parent?: { domain: string; field: string };
};

export type NumberField = BaseField<NumberValidation> & {
  type: 'number';
  parent?: { domain: string; field: string };
};

export type BooleanField = BaseField & {
  type: 'boolean';
};

export type EnumField = BaseField & {
  type: 'enum';
  options: { label: string; value: string }[];
};

export type ObjectField = BaseField & {
  type: 'object';
  fields: {
    [field: string]: SpecField;
  };
};

type BaseArrayField = BaseField<ArrayValidation> & {
  type: 'array';
  parent?: { domain: string; field: string };
  fields?: { [field: string]: SpecField };
};

type ObjectArrayField = BaseArrayField & {
  itemType: 'object';
};

type PrimitiveArrayField = BaseArrayField & {
  itemType: 'string' | 'number';
};

export type ArrayField = ObjectArrayField | PrimitiveArrayField;

export type TagField = BaseField<TagValidation> & {
  type: 'tag';
  parent?: { domain: string; field: string };
};

export type SpecField =
  | StringField
  | NumberField
  | BooleanField
  | EnumField
  | ObjectField
  | ArrayField
  | TagField;

// === LLM Generation Support ===

export type GenerationTarget =
  | { type: "field"; }
  | { type: "childRecords"; domain: string; parentField?: string };

export interface PromptTemplate {
  prompt: string;
  variables: string[];
}

export interface FieldMapping {
  source: "llm" | "parent" | "input" | "static";
  path?: string; // supports dot notation
  value?: any;  // if source is "static"
}

export interface LLMGenerationSpec {
  id: string;
  target: GenerationTarget;
  prompt: PromptBuilder.Types.UniversalPrompt;
  parentDomain?: string;

  mapFields: {
    [targetField: string]: FieldMapping;
  };
}

export type SpecDefinition = {
  fields: {
    [field: string]: SpecField;
  };
  meta?: {
    hooks?: SpecHooks;
    children?: {
      domain: string;
      field: { parent: string; child: string };
      cascadeDelete?: boolean;
    }[];
    ordering?: string[];
    generation?: LLMGenerationSpec[];
    versioning?: {
      domain: string;
      reference: string; // name of the column in child table that will reference the parent
    }
  };
};
