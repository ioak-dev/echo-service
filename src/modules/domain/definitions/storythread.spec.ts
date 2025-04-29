import { SpecDefinition } from "../specs/types/spec.types";

export const storythreadSpec: SpecDefinition = {
  fields: {
    "name": {
      type: "string",
      required: true
    }
  },
  meta: {
    hooks: {
      beforeCreate: async (doc, context) => {
        console.log(doc, context);
        return {doc, errors: []};
      },
    }
  }
};
