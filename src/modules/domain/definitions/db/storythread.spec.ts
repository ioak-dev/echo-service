import { SpecDefinition } from "../../specs/types/spec.types";

export const storythreadSpec: SpecDefinition = {
  fields: {
    "name": {
      type: "string",
      required: true,
    },
    "description": {
      type: "string",
      required: true,
    },
    "labels": {
      type: "array",
      required: false,
      itemType: "string",
      parent: {
        domain: "storythreadLabel", field: "reference"
      },
    }
  },
  meta: {
    hooks: {
      beforeCreate: async (doc, context) => {
        console.log(doc, context);
        return { doc, errors: [] };
      },
    }
  }
};
