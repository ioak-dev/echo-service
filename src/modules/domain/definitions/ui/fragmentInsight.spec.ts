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
                conversationalPrompt: { title: "What kind of insight would you like to generate?" },
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
                conversationalPrompt: { title: "What would you like to do?" }
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
                conversationalPrompt: { title: "How would you like to refine the content?" }
            }
        ]
    }
}

const insideFragmentView: FormSchema = {
    header: {
        title: {
            type: "static", value: "Insights"
        },
        actions: [
            ACTION_GENERATE_NEW_INSIGHT
        ]
    },
    versioning: true,
    actions: {
        primaryMenu: [
            ACTION_REGENERATE_INSIGHT,
            {
                label: "Version history",
                type: "version"
            }
        ],
        contextMenu: [
            {
                label: "Delete",
                type: "delete"
            },
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

export const fragmentInsightUiSchemas: Record<string, FormSchema> = {
    insideFragmentView
}