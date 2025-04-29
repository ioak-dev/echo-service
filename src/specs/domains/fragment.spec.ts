import { SpecDefinition } from "../types/spec.types";

// Define label object schema
const labelSchema: SpecDefinition = {
  fields: {
    label: {
      type: "string",
      required: true,
    },
    value: {
      type: "string",
      required: false,
    }
  }
};

export const fragmentSpec: SpecDefinition = {
  fields: {
    "name": {
      type: "string",
      required: true
    },
    "content": {
      type: "string",
      required: false
    },
    "storythreadReference": {
      type: "string",
      required: true,
      parent: "storythread"
    },
    "labels": {
      type: "array",  // This is an array field
      required: true,
      schema: {
        type: "object",  // Inside the array, each item is an object
        schema: labelSchema,  // Reusing the label schema here
      }
    }
  },
  meta: {
    hooks: {
      beforeCreate: async (doc, context) => {
        // Example of beforeCreate hook logic
        return doc;
      }
    }
  }
};

export const fragmentChildren: string[] = ["fragmentComment", "fragmentVersion"];
