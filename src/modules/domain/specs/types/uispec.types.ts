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
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
    customValidator?: (value: any) => string | null;
}

export interface FormFieldSchema {
    name: string;
    type: FieldType;

    label?: string;
    description?: string;
    placeholder?: string;
    defaultValue?: any;
    options?: { label: string, value: string | number }[];
    validation?: FieldValidation;
    multiple?: boolean;

    visibleIf?: {
        referenceField: string,
        value?: any
    }[],
    editableIf?: {
        referenceField: string,
        value?: any
    }[],

    conversationalPrompt?: string;
    fields?: FormFieldSchema[];
}

export interface FormAction {
    label: string;
    type: "edit" | "delete" | "generate" | "custom";

    generation?: {
        id: string;
        inputFields?: FormFieldSchema[];
        confirmPrompt?: {
            title?: string;
            message?: string;
            confirmLabel?: string;
            cancelLabel?: string;
        };
    };
}

export interface FormSchema {
    header?: {
        title?: { type: "static" | "dynamic", field?: string, value?: string };
        subtitle?: { type: "static" | "dynamic", field?: string, value?: string };
        actions?: FormAction[];
    };
    fields: FormFieldSchema[];
}