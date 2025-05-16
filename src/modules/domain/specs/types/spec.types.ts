export interface HookContext {
  space: string;
  domain: string;
  operation: "create" | "update" | "patch" | "delete";
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

interface BaseField<TValidation = {}> {
  required?: boolean;
  validate?: TValidation & BaseValidation;
  displayOptions?: {
    label?: string; labelDesc?: string;
    placeholder?: string;
    tooltip?: string;
    [key: string]: any;
  };
}

type CommonDisplayOptions = {
  label?: string;
  labelDesc?: string;
  placeholder?: string;
  tooltip?: string;
};

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

// Extend the CommonDisplayOptions interface to add the toolbarOptions
interface RichTextDisplayOptions extends CommonDisplayOptions {
  type: "richtext";
  toolbarOptions?: ToolbarOption[];  // Only supports valid toolbar options
}

// Other string display options
interface DefaultStringDisplayOptions extends CommonDisplayOptions {
  type?: "text" | "textarea" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "select" | "autocomplete";
  optionsLookupKey?: string;
}

type StringDisplayOptions = RichTextDisplayOptions | DefaultStringDisplayOptions;

export type StringField = BaseField<StringValidation> & {
  type: 'string';
  parent?: { domain: string; field: string };
  displayOptions?: StringDisplayOptions;
};

export type NumberField = BaseField<NumberValidation> & {
  type: 'number';
  parent?: { domain: string, field: string };
  displayOptions?: {
    label?: string; labelDesc?: string;
    placeholder?: string;
    tooltip?: string;
    type?: "number" | "select" | "autocomplete";
    optionsLookupKey?: string;
  };
};

export type BooleanField = BaseField & {
  type: 'boolean';
  displayOptions?: {
    label?: string; labelDesc?: string;
    type?: "checkbox";
  };
};

export type EnumField = BaseField & {
  type: 'enum';
  options: { label: string; value: string }[];
  displayOptions?: {
    label?: string; labelDesc?: string;
    placeholder?: string;
    tooltip?: string;
    type?: "radio-group" | "select" | "autocomplete";
  };
};

export type ObjectField = BaseField & {
  type: 'object';
  fields: {
    [field: string]: SpecField;
  };
  displayOptions?: {
    label?: string; labelDesc?: string;
    type?: "group";
  };
};

type BaseArrayField = BaseField<ArrayValidation> & {
  type: 'array';
  parent?: { domain: string; field: string };
  fields?: { [field: string]: SpecField };
};

type ObjectArrayField = BaseArrayField & {
  itemType: 'object';
  displayOptions?: {
    label?: string; labelDesc?: string;
    type?: 'array';
  };
};

type PrimitiveArrayField = BaseArrayField & {
  itemType: 'string' | 'number';
  displayOptions?: {
    label?: string; labelDesc?: string;
    placeholder?: string;
    tooltip?: string;
    type?: "select" | "autocomplete" | "array";
    optionsLookupKey?: string;
  };
};

export type ArrayField = ObjectArrayField | PrimitiveArrayField;


export type SpecField =
  | StringField
  | NumberField
  | BooleanField
  | EnumField
  | ObjectField
  | ArrayField;

export type SpecDefinition = {
  fields: {
    [field: string]: SpecField;
  };
  meta?: {
    hooks?: SpecHooks;
    children?: { domain: string, field: { parent: string, child: string }, cascadeDelete?: boolean }[];
    ordering?: string[];
  };
};
