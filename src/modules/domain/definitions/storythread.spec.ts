import { SpecDefinition } from "../specs/types/spec.types";

export const storythreadSpec: SpecDefinition = {
  fields: {
    "name": {
      type: "string",
      required: true,
      displayOptions: {
        type: "text",
        label: "Name",
        placeholder: "Storythread name"
      }
    },
    "description": {
      type: "string",
      required: true,
      displayOptions: {
        type: "textarea",
        label: "Description",
        placeholder: "Type description",
      }
    },
    "labels": {
      type: "array",
      required: false,
      itemType: "string",
      parent: {
        domain: "storythreadLabel", field: "reference"
      },
      displayOptions: {
        type: "autocomplete",
        label: "Labels"
      }
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
