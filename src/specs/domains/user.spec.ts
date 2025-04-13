import { SpecDefinition } from "../types/spec.types";

export const userSpec: SpecDefinition = {
    "name": {
        "type": "string",
        "required": true
    },
    "profile": {
        "type": "object",
        "required": true,
        "schema": {
            "age": {
                "type": "number"
            },
            "bio": {
                "type": "string"
            },
            "address": {
                "type": "object",
                "required": true,
                "schema": {
                    "city": {
                        "required": true,
                        "type": "string"
                    },
                    "zip": {
                        "type": "number"
                    }
                }
            }
        }
    },
    "tags": {
        "type": "array",
        "required": true,
        "schema": {
            "type": "object",
            "schema": {
                "label": {
                    "required": true,
                    "type": "string"
                },
                "value": {
                    "type": "string"
                }
            }
        }
    }
}
