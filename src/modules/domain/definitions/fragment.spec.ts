import { customAlphabet } from 'nanoid';
import { getCollectionByName } from "../../../lib/dbutils";
import { SpecDefinition, ToolbarOption } from "../specs/types/spec.types";

const alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphanumericAlphabet, 8);

export const fragmentSpec: SpecDefinition = {
  fields: {
    "name": {
      type: "string",
      required: true,
      displayOptions: {
        type: "h2",
        // label: "Fragment name"
      }
    },
    "content": {
      type: "string",
      required: false,
      displayOptions: {
        type: "richtext",
        toolbarOptions: [
          ToolbarOption.Bold,
          ToolbarOption.Italic,
          ToolbarOption.Underline,
          ToolbarOption.AlignLeft,
          ToolbarOption.AlignCenter,
          ToolbarOption.AlignRight,
          ToolbarOption.AlignJustify,
          ToolbarOption.Heading,
          ToolbarOption.BulletList,
          ToolbarOption.OrderedList,
          // ToolbarOption.ClearFormatting,
        ]
        // label: "Draft"
      }
    },
    // "contentTest": {
    //   type: "string",
    //   required: false,
    //   displayOptions: {
    //     type: "richtext",
    //     toolbarOptions: [
    //       ToolbarOption.Heading,
    //       ToolbarOption.BulletList,
    //       ToolbarOption.OrderedList,
    //     ]
    //   }
    // },
    "labels": {
      type: "array",
      required: true,
      itemType: "string",
      parent: {
        domain: "fragmentLabel", field: "reference"
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
      afterCreate: async (doc, context) => {
        const FragmentVersion = getCollectionByName(context.space, "fragmentVersion");

        // Direct insert, no content check
        const timestamp = new Date();
        await FragmentVersion.create({
          reference: nanoid(),
          fragmentReference: doc.reference,
          content: doc.content,
          versionTag: generateVersionTag(),
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
    }
  }
};

const maybeAddFragmentVersion = async (doc: any, context: any) => {
  const FragmentVersion = getCollectionByName(context.space, "fragmentVersion");

  const latestVersion = await FragmentVersion.findOne(
    { fragmentReference: doc.reference },
    null,
    { sort: { createdAt: -1 } }
  );

  console.log(latestVersion);

  if (!latestVersion || latestVersion.content !== doc.content) {
    const timestamp = new Date();
    await FragmentVersion.create({
      reference: nanoid(),
      fragmentReference: doc.reference,
      content: doc.content,
      versionTag: generateVersionTag(),
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: context.userId,
      updatedBy: context.userId
    });
  }
};

const generateVersionTag = (): string => {
  const now = new Date();
  return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}_` +
    `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}.${String(now.getSeconds()).padStart(2, '0')}`;
};