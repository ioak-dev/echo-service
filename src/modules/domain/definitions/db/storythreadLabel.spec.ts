import { getCollectionByName } from "../../../../lib/dbutils";
import { normalizeLabel } from "../../../../lib/Utils";
import { SpecDefinition } from "../../specs/types/spec.types";

export const storythreadLabelSpec: SpecDefinition = {
  fields: {
    "name": {
      type: "string",
      required: true
    }
  },
  meta: {
    hooks: {
      beforeCreate: async (doc, context) => {
        const errors: string[] = [];

        const Model = getCollectionByName(context.space, context.domain);
        if (!Model) {
          errors.push("Invalid collection context.");
          return {doc, errors};
        }

        doc.name = normalizeLabel(doc.name);

        const existing = await Model.findOne({ name: doc.name });

        const isDuplicate = existing && (context.operation === "create" || existing._id.toString() !== doc._id.toString());

        if (isDuplicate) {
          errors.push(`Label '${doc.name}' already exists`);
        }

        return { doc, errors };
      }
    }
  }
};
