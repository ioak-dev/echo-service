import { SpecDefinition } from "../types/spec.types";

export const storythreadSpec: SpecDefinition = {
    "title": {
        "type": "string",
        "required": true
    },
    "description": {
        "type": "string",
        "required": false
    }
}

export const storythreadChildren: string[] = ["fragment"]