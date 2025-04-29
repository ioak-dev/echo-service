import { SpecDefinition } from "../types/spec.types";

export const fragmentCommentSpec: SpecDefinition = {
    fields: {
        "fragmentReference": {
            "type": "string",
            "required": true
        },
        "fragmentVersionId": {
            "type": "string",
            "required": true
        },
        "content": {
            "type": "string",
            "required": false
        }
    }
}
