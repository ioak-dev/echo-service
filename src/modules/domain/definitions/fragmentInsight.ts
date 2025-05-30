import { customAlphabet } from "nanoid";
import { getCollectionByName } from "../../../lib/dbutils";
import { SpecDefinition } from "../specs/types/spec.types";
import { interpret } from "./helper/fragmentInsightHelper";

const alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphanumericAlphabet, 8);

export const fragmentInsightSpec: SpecDefinition = {
    fields: {
        "fragmentReference": {
            "type": "string",
            "required": true,
            parent: {
                domain: "fragment",
                field: "reference"
            }
        },
        "fragmentVersionReference": {
            "type": "string",
            "required": true,
            parent: {
                domain: "fragmentVersion",
                field: "reference"
            }
        },
        "mode": {
            "type": "enum",
            "options": [{
                label: "Expand",
                value: "expand"
            },
            {
                label: "Interpret",
                value: "interpret"
            },
            {
                label: "Contrast",
                value: "contrast"
            },
            {
                label: "Prompts",
                value: "prompts"
            }],
            "required": true,
        },
        "userInput": {
            "type": "string",
            "required": false,
        },
        "response": {
            "type": "string",
            "required": false,
        },
    },
    meta: {
        hooks: {
            beforeCreate: async (doc, context) => {
                const output = await interpret({
                    mode: doc.mode,
                    content: context.payload.fragment.content,
                    userInput: doc.userInput
                })
                doc.response = output.responseObject;
                return { doc, errors: [] }
            },
            afterCreate: async (doc, context) => {
                await addFragmentVersion(doc, context);
            },
            afterUpdate: async (doc, context) => {
                await addFragmentVersion(doc, context);
            },
            beforePatch: async (doc, context) => {
                const output = await interpret({
                    mode: doc.mode,
                    content: context.payload.fragment.content,
                    userInput: doc.userInput,
                    response: context.payload.fragmentInsight.response
                })
                doc.response = output.responseObject;
                doc.fragmentVersionReference = context.payload.fragmentVersionReference;
                return { doc, errors: [] }
            },
            afterPatch: async (doc, context) => {
                await addFragmentVersion(doc, context);
            },
        },
    },
};

const addFragmentVersion = async (doc: any, context: any) => {
    const FragmentInsightVersion = getCollectionByName(context.space, "fragmentInsightVersion");

    const timestamp = new Date();
    const versionTag = await generateVersionTag(FragmentInsightVersion, doc.reference);

    await FragmentInsightVersion.create({
        reference: nanoid(),
        fragmentInsightReference: doc.reference,
        fragmentVersionReference: doc.fragmentVersionReference,
        userInput: doc.userInput,
        response: doc.response,
        versionTag,
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: context.userId,
        updatedBy: context.userId
    });
};

const generateVersionTag = async (FragmentInsightVersion: any, fragmentInsightReference: string): Promise<string> => {
    const latest = await FragmentInsightVersion.find({
        fragmentInsightReference
    })
        .sort({ versionTag: -1 })
        .limit(1);

    const latestVersion = latest.length > 0 ? parseInt(latest[0].versionTag, 10) : 0;

    return (latestVersion + 1).toString();
};
