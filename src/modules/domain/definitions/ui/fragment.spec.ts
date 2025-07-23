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
                    actionMap: {
                        noneSelect: [
                            ACTION_GENERATE_NEW_INSIGHT
                        ],
                        singleSelect: [
                            {
                                label: "Delete",
                                type: "delete"
                            },
                            ACTION_REGENERATE_INSIGHT
                        ],
                        multiSelect: [
                            {
                                label: "Delete selected",
                                type: "delete"
                            },
                            ACTION_REGENERATE_INSIGHT
                        ]
                    }
                },
                actions: {
                    primaryMenu: [
                        {
                            label: "Delete",
                            type: "delete"
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