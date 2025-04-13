import { SpecDefinition } from "../types/spec.types";

export const fragmentVersionSpec: SpecDefinition = {
    "fragmentId": {
        "type": "string",
        "required": true
    },
    "content": {
        "type": "string",
        "required": true
    },
    "versionTag": {
        "type": "string",
        "required": false
    },
    "userNote": {
        "type": "string",
        "required": false
    }
}

