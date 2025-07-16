import { FormSchema } from "../../specs/types/uispec.types";

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
                    id: "summary",
                }
            },
            {
                type: "generate",
                label: "Generate insight",
                generation: {
                    id: "insight",
                    inputFields: [
                        {
                            name: "mode",
                            type: "select",
                            label: "Mode",
                            conversationalPrompt: "What kind of insight would you like to generate?",
                            options: [
                                {
                                    label: "Interpret",
                                    value: "interpret"
                                },
                                {
                                    label: "Expand",
                                    value: "expand"
                                }
                            ]
                        },
                        {
                            name: "userInput",
                            type: "textarea",
                            label: "Prompt",
                            conversationalPrompt: "What would you like to do?"
                        }
                    ]
                }
            }
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