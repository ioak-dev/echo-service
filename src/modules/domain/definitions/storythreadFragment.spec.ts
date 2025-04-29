import { SpecDefinition } from "../specs/types/spec.types";

export const storythreadFragmentSpec: SpecDefinition = {
  fields: {
    "storythreadReference": {
      type: "string",
      required: true
    },
    "fragmentReference": {
      type: "string",
      required: true
    }
  },
  meta: {
    hooks: {
      beforeCreate: async (doc, context) => {
        console.log(doc, context);
        return { doc, errors: [] };
      },
    },
    ordering: [
      "storythreadReference"
    ]
  }
};
