import { FormSchema } from "../../specs/types/uispec.types";

const defaultSchema: FormSchema = {
    header: {
        title: { type: "dynamic", field: "name" },
        subtitle: { type: "static", value: "your disconnected thoughts" },
        actions: [
        ]
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            label: "Title",
            conversationalPrompt: 'What would you like to title this fragment?',
        },
        {
            name: 'content',
            type: 'text',
            label: "Content",
            conversationalPrompt: 'Can you describe it briefly?',
        },
        {
            name: 'labels',
            type: 'tag',
            label: "Labels",
            conversationalPrompt: 'Any labels to tag this with?',
        },
    ],
}

export const fragmentUiSchemas: Record<string, FormSchema> = {
    default: defaultSchema
}