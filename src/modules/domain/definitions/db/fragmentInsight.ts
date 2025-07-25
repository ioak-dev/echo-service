import { customAlphabet } from "nanoid";
import { getCollectionByName } from "../../../../lib/dbutils";
import { SpecDefinition } from "../../specs/types/spec.types";
import { interpret } from "./helper/fragmentInsightHelper";

const alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphanumericAlphabet, 8);

export const fragmentInsightSpec: SpecDefinition = {
    // displayOptions: {
    //     list: {
    //         header: { title: "Insights" },
    //         fields: [
    //             {
    //                 key: "userInput",
    //                 format: "title"
    //             },
    //             {
    //                 key: "mode",
    //                 format: "title"
    //             },
    //             {
    //                 key: "response.content",
    //                 format: "summary",
    //                 collapse: true
    //             }
    //         ]
    //     },
    //     item: {
    //     }
    // },
    fields: {
        "fragmentReference": {
            "type": "string",
            "required": true,
            parent: {
                domain: "fragment",
                field: "reference"
            }
        },
        "fragmentVersionReference": {
            "type": "string",
            "required": true,
            parent: {
                domain: "fragmentVersion",
                field: "reference"
            }
        },
        "mode": {
            "type": "enum",
            "options": [{
                label: "Expand",
                value: "expand"
            },
            {
                label: "Interpret",
                value: "interpret"
            },
            {
                label: "Contrast",
                value: "contrast"
            },
            {
                label: "Prompts",
                value: "prompts"
            }],
            "required": true,
        },
        "userInput": {
            "type": "string",
            "required": false,
        },
        "response": {
            "type": "string",
            "required": false,
        },
    },
    meta: {
        versioning: {
            domain: "fragmentInsightVersion",
            reference: "fragmentInsightReference"
        },
        hooks: {
            beforeCreate: async (doc, context) => {
                const output = await interpret({
                    mode: doc.mode,
                    content: context.payload.fragment.content,
                    userInput: doc.userInput
                })
                doc.response = output.responseObject;
                return { doc, errors: [] }
            },
            beforePatch: async (doc, context) => {
                const output = await interpret({
                    mode: doc.mode,
                    content: context.payload.fragment.content,
                    userInput: doc.userInput,
                    response: context.payload.fragmentInsight.response
                })
                doc.response = output.responseObject;
                doc.fragmentVersionReference = context.payload.fragmentVersionReference;
                return { doc, errors: [] }
            },
        },
    },
};
