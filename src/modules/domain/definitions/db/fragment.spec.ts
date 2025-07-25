import { customAlphabet } from 'nanoid';
import { getCollectionByName } from "../../../../lib/dbutils";
import { SpecDefinition, ToolbarOption } from "../../specs/types/spec.types";

const alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphanumericAlphabet, 8);

export const fragmentSpec: SpecDefinition = {
  fields: {
    "name": {
      type: "string",
      required: true,
    },
    "content": {
      type: "string",
      required: false,
    },
    "summary": {
      type: "string",
      required: false,
    },
    "labels": {
      type: "tag",
      required: false,
      parent: {
        domain: "fragmentLabel", field: "label"
      },
    }
  },
  meta: {
    versioning: {
      domain: "fragmentVersion",
      reference: "fragmentReference"
    },
    hooks: {
      beforeCreate: async (doc, context) => {
        return { doc, errors: [] };
      },
    },
    children: [
      {
        domain: "fragmentVersion",
        field: {
          parent: "reference", child: "fragmentReference"
        },
        cascadeDelete: true,
      },
      {
        domain: "fragmentInsight",
        field: {
          parent: "reference", child: "fragmentReference"
        },
        cascadeDelete: true,
      }
    ]
  }
};
