import { SpecDefinition } from "../types/spec.types";

export const fragmentSpec: SpecDefinition = {
    "name": {
        "type": "string",
        "required": true
    },
    "latestContent": {
        "type": "string",
        "required": false
    },
    "storythreadReference": {
        "type": "string",
        "required": true,
        "parent": "storythread"
    },
    "labels": {
        "type": "array",
        "required": true,
        "schema": {
            "type": "object",
            "schema": {
                "label": {
                    "type": "string",
                    "parent": "storythread",
                    "required": true
                },
                "value": {
                    "type": "string"
                }
            }
        }
    },
    "colors": {
        "type": "array",
        "required": false,
        "schema": {
            "type": "number"
        }
    }
}

export const fragmentChildren: string[] = ["fragmentComment", "fragmentVersion"];