import { customAlphabet } from 'nanoid';
import { getCollectionByName } from "../../../lib/dbutils";
import { SpecDefinition, ToolbarOption } from "../specs/types/spec.types";

const alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphanumericAlphabet, 8);

export const fragmentSpec: SpecDefinition = {
  displayOptions: {
    list: {
      header: {
        title: "Fragment list",
        subtitle: "List of fragments in the system"
      },
      fields: [
        {
          key: "name",
          format: "title"
        },
        {
          key: "content",
          format: "summary"
        },
        {
          key: "createdAt",
          format: "date"
        }
      ],
    },
    item: {
      header: {
        title: "View a selected fragment",
        subtitle: "Lorem ipsum dolor sit",
      }
    }
  },
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
      required: false,
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

  console.log(latestVersion);

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
