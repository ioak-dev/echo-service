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

interface BaseField<TValidation = {}> {
  required?: boolean;
  validate?: TValidation & BaseValidation;
  displayOptions?: {
    label?: string;
    labelDesc?: string;
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

interface RichTextDisplayOptions extends CommonDisplayOptions {
  type: "richtext";
  toolbarOptions?: ToolbarOption[];
}

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
  parent?: { domain: string; field: string };
  displayOptions?: {
    label?: string;
    labelDesc?: string;
    placeholder?: string;
    tooltip?: string;
    type?: "number" | "select" | "autocomplete";
    optionsLookupKey?: string;
  };
};

export type BooleanField = BaseField & {
  type: 'boolean';
  displayOptions?: {
    label?: string;
    labelDesc?: string;
    type?: "checkbox";
  };
};

export type EnumField = BaseField & {
  type: 'enum';
  options: { label: string; value: string }[];
  displayOptions?: {
    label?: string;
    labelDesc?: string;
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
    label?: string;
    labelDesc?: string;
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
    label?: string;
    labelDesc?: string;
    type?: 'array';
  };
};

type PrimitiveArrayField = BaseArrayField & {
  itemType: 'string' | 'number';
  displayOptions?: {
    label?: string;
    labelDesc?: string;
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

// === LLM Generation Support ===

export type GenerationTarget =
  | { type: "field"; field: string }
  | { type: "childRecords"; domain: string; parentField: string };

export interface PromptTemplate {
  prompt: string;
  variables: string[];
}

export interface LLMGenerationSpec {
  id: string;
  description?: string;

  target: GenerationTarget;
  prompt: PromptTemplate;

  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };

  postProcess?: {
    mapFields?: { [generatedField: string]: string };
    validate?: boolean;
  };
}

// === Generation LLM Support ===

export type SpecDisplayOptions = {
  list: {
    header?: {
      title?: string;
      subtitle?: string;
      icon?: string; // e.g., material-icon or URL
      showSearch?: boolean;
      filters?: Array<{
        field: string;
        type: "text" | "select" | "date";
        label?: string;
        optionsLookupKey?: string;
      }>;
      actions?: Array<{
        type: "button" | "link";
        label: string;
        icon?: string;
        action: "create" | "export" | string; // supports custom actions
        visibleIf?: string; // optional expression string or condition
      }>;
    };
    options?: {
      showSelectOnRight?: boolean
    };
    fields: Array<{
      key: string;
      format?: "date" | "title" | "summary" | "html" | "tags" | "boolean";
      collapse?: boolean;
    }>;
    rowActions?: Array<{
      type: "icon" | "button";
      icon?: string;
      label?: string;
      action: "edit" | "delete" | "view" | string;
      confirm?: boolean;
      visibleIf?: string;
    }>;
  };
  item: {
    header?: {
      title?: string;
      subtitle?: string;
      actions?: Array<{
        type: "button" | "link";
        label: string;
        action: "edit" | "delete" | "custom";
        icon?: string;
        confirm?: boolean;
        visibleIf?: string;
      }>;
    };
  };
}

export type SpecDefinition = {
  displayOptions?: SpecDisplayOptions,
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
  };
};



// UI types

export interface OptionsObjectType {
  name: string | number;
  value: string;
}
export interface DynamicFormProps {
  data: any;
  metadata: SpecDefinition;
  optionsLookupDictionary: { [key: string]: OptionsObjectType[] }
  onChange: (name: string, value: any) => void;
  onSubmit?: (formData: FormData) => void;
  editMode?: boolean;
  editor?: any;
  className?: string;
}


export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface DynamicFormHandle {
  submit: () => void;
  reset: () => void;
  validate: () => ValidationResult;
}