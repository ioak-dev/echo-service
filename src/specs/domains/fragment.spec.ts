import { SpecDefinition } from "../types/spec.types";

const fragmentSpec: SpecDefinition = {
    "name": {
        "type": "string",
        "required": true
    },
    "latestContent": {
        "type": "string",
        "required": false
    },
    "storythreadId": {
        "type": "string",
        "required": true
    },
    "labels": {
        "type": "array",
        "required": false,
        "schema": {
            "type": "object",
            "schema": {
                "label": {
                    "type": "string"
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

export default fragmentSpec;