import { SpecDefinition } from "../types/spec.types";

const storythreadSpec: SpecDefinition = {
    "title": {
        "type": "string",
        "required": true
    },
    "description": {
        "type": "string",
        "required": false
    }
}

export default storythreadSpec;
