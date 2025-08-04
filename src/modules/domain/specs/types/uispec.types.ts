export type FieldType =
    | 'text'
    | 'textarea'
    | 'number'
    | 'select'
    | 'multiselect'
    | 'date'
    | 'boolean'
    | 'email'
    | 'phone'
    | 'password'
    | 'tag'
    | 'group'
    | 'array'
    | 'custom';

export interface FieldOption {
    name: string;
    value: string | number | boolean;
}

export interface FieldValidation {
    type: "required" | "min" | "max" | "pattern";
    messageTemplate?: string; // handlebar template
    expected?: number | string; // number for min or max, string for pattern type
}

export interface FormFieldSchema {
    name: string;
    type: FieldType;

    label?: string;
    description?: string;
    placeholder?: string;
    defaultValue?: any;
    options?: { label: string, value: string | number }[];
    validation?: FieldValidation[];
    multiple?: boolean;

    visibleIf?: {
        referenceField: string,
        value?: any
    }[],
    editableIf?: {
        referenceField: string,
        value?: any
    }[],

    conversationalPrompt?: {
        title: string;
        subtitle?: string;
    };
    fields?: FormFieldSchema[];
    assistant?: {
        id: string;
    }
}

export interface FormAction {
    label: string;
    type: "save" | "reset" | "cancel" | "delete" | "generate" | "version" | "custom";
    icon?: any;

    generation?: {
        id: string;
        inputFields?: FormFieldSchema[];
    };
}

export interface FormSchema {
    header?: {
        title?: { type: "static" | "dynamic", field?: string, value?: string };
        subtitle?: { type: "static" | "dynamic", field?: string, value?: string };
        actions?: FormAction[];
    };
    versioning?: boolean;
    fields: FormFieldSchema[];
    actions?: {
        primaryMenu?: FormAction[],
        contextMenu?: FormAction[]
    },
    children?: {
        domain: string;
        field: { parent: string; child: string };
        formSchemaId: string;
    }[]
}

// common types
export interface DomainVersion {
    _id: string;
    __version: string;
    __columns: Record<string, number>;
    __percentage: number;
    reference: string;
    updatedBy: string;
    updatedAt: Date
    createdBy: string;
    createdAt: Date;
}
