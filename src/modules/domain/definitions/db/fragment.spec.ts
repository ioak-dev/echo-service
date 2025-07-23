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
    hooks: {
      beforeCreate: async (doc, context) => {
        return { doc, errors: [] };
      },
      afterCreate: async (doc, context) => {
        const FragmentVersion = getCollectionByName(context.space, "fragmentVersion");

        // Direct insert, no content check
        const timestamp = new Date();
        const versionTag = await generateVersionTag(FragmentVersion, doc.reference);
        await FragmentVersion.create({
          reference: nanoid(),
          fragmentReference: doc.reference,
          content: doc.content,
          versionTag,
          createdAt: timestamp,
          updatedAt: timestamp,
          createdBy: context.userId,
          updatedBy: context.userId
        });
      },
      afterUpdate: async (doc, context) => {
        await maybeAddFragmentVersion(doc, context);
      },
      afterPatch: async (doc, context) => {
        await maybeAddFragmentVersion(doc, context);
      }
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

const maybeAddFragmentVersion = async (doc: any, context: any) => {
  const FragmentVersion = getCollectionByName(context.space, "fragmentVersion");

  const latestVersion = await FragmentVersion.findOne(
    { fragmentReference: doc.reference },
    null,
    { sort: { createdAt: -1 } }
  );

  if (!latestVersion || latestVersion.content !== doc.content) {
    const timestamp = new Date();
    const versionTag = await generateVersionTag(FragmentVersion, doc.reference);
    await FragmentVersion.create({
      reference: nanoid(),
      fragmentReference: doc.reference,
      content: doc.content,
      versionTag,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: context.userId,
      updatedBy: context.userId
    });
  }
};

const generateVersionTag = async (FragmentVersion: any, fragmentReference: string): Promise<string> => {
  const latest = await FragmentVersion.find({ fragmentReference })
    .sort({ versionTag: -1 })
    .limit(1);

  const latestVersion = latest.length > 0 ? parseInt(latest[0].versionTag, 10) : 0;
  return (latestVersion + 1).toString();
};
