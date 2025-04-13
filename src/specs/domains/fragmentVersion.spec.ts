import { SpecDefinition } from "../types/spec.types";

const fragmentVersionSpec: SpecDefinition = {
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

export default fragmentVersionSpec;
