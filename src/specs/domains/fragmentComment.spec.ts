import { SpecDefinition } from "../types/spec.types";

const fragmentCommentSpec: SpecDefinition = {
    "fragmentId": {
        "type": "string",
        "required": true
    },
    "fragmentVersionId": {
        "type": "string",
        "required": true
    },
    "mode": {
        "type": "string",
        "required": true
    },
    "userPrompt": {
        "type": "string",
        "required": true
    },
    "content": {
        "type": "string",
        "required": false
    }
}

export default fragmentCommentSpec;
