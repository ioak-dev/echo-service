import { FormAction, FormSchema } from "../../specs/types/uispec.types";

const defaultSchema: FormSchema = {
    header: {
        title: { type: "dynamic", field: "name" },
        subtitle: { type: "static", value: "your disconnected thoughts" },
        actions: [
            {
                type: "save",
                label: "Save",
            },
            {
                type: "reset",
                label: "Reset",
            },
            {
                type: "generate",
                label: "Generate summary",
                generation: {
                    id: "fragment-summary",
                }
            },
        ]
    },
    versioning: true,
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
            name: 'summary',
            type: 'text',
            label: "Summary",
            conversationalPrompt: 'Auto generated content',
        },
        {
            name: 'labels',
            type: 'tag',
            label: "Labels",
            conversationalPrompt: 'Any labels to tag this with?',
        },
    ],
    children: [
        {
            domain: "fragmentInsight",
            field: {
                parent: "reference", child: "fragmentReference"
            },
            formSchemaId: "insideFragmentView"
        }
    ]
}

export const fragmentUiSchemas: Record<string, FormSchema> = {
    default: defaultSchema
}