import { FormAction, FormSchema } from "../../specs/types/uispec.types";

const ACTION_GENERATE_NEW_INSIGHT: FormAction = {
    type: "generate",
    label: "New insight",
    generation: {
        id: "fragment-insight",
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

const ACTION_REGENERATE_INSIGHT: FormAction = {
    type: "generate",
    label: "Revise",
    generation: {
        id: "fragmentinsight-revise",
        inputFields: [
            {
                name: "userInput",
                type: "textarea",
                label: "Prompt",
                conversationalPrompt: "How would you like to refine the content?"
            }
        ]
    }
}

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
            listSchema: {
                header: {
                    title: {
                        type: "static", value: "Insights"
                    },
                    actions: [
                        ACTION_GENERATE_NEW_INSIGHT
                    ]
                },
                actions: {
                    primaryMenu: [
                        {
                            label: "Delete",
                            type: "delete",
                            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg>'
                        },
                        ACTION_REGENERATE_INSIGHT
                    ],
                    contextMenu: [
                        {
                            label: "Delete",
                            type: "delete"
                        },
                        ACTION_REGENERATE_INSIGHT
                    ]
                },
                fields: [
                    {
                        name: "mode",
                        type: "text",
                    },
                    {
                        name: "userInput",
                        type: "text",
                    },
                    {
                        name: "response",
                        type: "text",
                    }
                ]
            }
        }
    ]
}

export const fragmentUiSchemas: Record<string, FormSchema> = {
    default: defaultSchema
}