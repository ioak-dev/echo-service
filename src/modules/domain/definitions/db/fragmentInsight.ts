import { customAlphabet } from "nanoid";
import { getCollectionByName } from "../../../../lib/dbutils";
import { SpecDefinition } from "../../specs/types/spec.types";
import { interpret } from "./helper/fragmentInsightHelper";

const alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphanumericAlphabet, 8);

export const fragmentInsightSpec: SpecDefinition = {
    fields: {
        "fragmentReference": {
            "type": "string",
            "required": true,
            parent: {
                domain: "fragment",
                field: "reference"
            }
        },
        "fragmentVersion": {
            "type": "string",
            "required": true,
            parent: {
                domain: "fragmentVersion",
                field: "__version"
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
    },
};
