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
            conversationalPrompt: { title: 'What would you like to title this fragment?' },
        },
        {
            name: 'content',
            type: 'text',
            label: "Content",
            conversationalPrompt: { title: 'Can you describe it briefly?' },
            assistant: {
                id: "assistant-fragment-content"
            }
        },
        {
            name: 'summary',
            type: 'text',
            label: "Summary",
            conversationalPrompt: { title: 'Auto generated content' },
        },
        {
            name: 'labels',
            type: 'tag',
            label: "Labels",
            conversationalPrompt: { title: 'Any labels to tag this with?' },
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