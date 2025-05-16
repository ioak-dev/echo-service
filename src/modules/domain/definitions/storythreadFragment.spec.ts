import { getCollectionByName } from "../../../lib/dbutils";
import { SpecDefinition } from "../specs/types/spec.types";

export const storythreadFragmentSpec: SpecDefinition = {
  fields: {
    storythreadReference: {
      type: "string",
      required: true,
    },
    fragmentReference: {
      type: "string",
      required: true,
    },
  },
  meta: {
    hooks: {

      beforeCreate: async (doc, context) => {
        const errors: string[] = [];

        const Model = getCollectionByName(context.space, context.domain);
        if (!Model) {
          errors.push("Invalid collection context.");
          return { doc, errors };
        }

        const existing = await Model.findOne({ storythreadReference: doc.storythreadReference, fragmentReference: doc.fragmentReference });

        const isDuplicate = existing && (context.operation === "create" || existing._id.toString() !== doc._id.toString());

        if (isDuplicate) {
          errors.push(`Link already exists`);
        }

        return { doc, errors };
      },
      shapeResponse: async (doc, context) => {
        const { space } = context;

        try {
          const FragmentModel = getCollectionByName(space, "fragment");
          const fragmentDoc = await FragmentModel.findOne({ reference: doc.fragmentReference });

          if (!fragmentDoc) {
            // Return null doc and no errors
            return { doc: null, errors: [] };
          }

          // Merge in storythreadReference to fragment data
          const shaped = {
            ...fragmentDoc.toObject(),
            storythreadReference: doc.storythreadReference,
          };

          return { doc: shaped, errors: [] };
        } catch (err: any) {
          return {
            doc: null,
            errors: [err.message || "Error in shapeResponse"],
          };
        }
      },
    },
    ordering: ["storythreadReference"],
  },
};
