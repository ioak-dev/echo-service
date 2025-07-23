import { customAlphabet } from "nanoid";
import { getCollectionByName } from "../../../../lib/dbutils";
import { SpecDefinition } from "../../specs/types/spec.types";
import { interpret } from "./helper/fragmentInsightHelper";

const alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphanumericAlphabet, 8);

export const fragmentInsightSpec: SpecDefinition = {
    // displayOptions: {
    //     list: {
    //         header: { title: "Insights" },
    //         fields: [
    //             {
    //                 key: "userInput",
    //                 format: "title"
    //             },
    //             {
    //                 key: "mode",
    //                 format: "title"
    //             },
    //             {
    //                 key: "response.content",
    //                 format: "summary",
    //                 collapse: true
    //             }
    //         ]
    //     },
    //     item: {
    //     }
    // },
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
        generation: [
            {
                id: "generate",
                target: {
                    type: "childRecords",
                    domain: "fragment"
                },
                mapFields:
                {
                    "response": { source: "llm", path: "content" },
                    "mode": { source: "input", path: "mode" },
                    "userInput": { source: "input", path: "userInput" },
                    "fragmentVersionReference": { source: "static", value: "pKETVTOn" }
                },
                prompt: {
                    systemMessages: ['You are a creative writing companion that helps interpret raw story fragments. Interpretations are symbolic, speculative, and intuitive—not editorial. Output must be valid JSON:\n{\n  \"content\": string\n}'],
                    userMessages: [
                        `Interpret the story fragment symbolically or thematically. Let the user input guide your interpretive lens. If a previous response exists, revise or build upon it with new insights. Avoid simply repeating it.
            
            Fragment:
            {{content}}
            
            User Input (interpretive angle, theme, or focus):
            {{userInput}}
            
            Return JSON in the format:
            { "content": "..." }`
                    ],
                    assistantMessages: [],
                    variables: ['content'],
                    responseType: 'json',
                    responseFormat: { text: 'string' }
                }
            },
            {
                id: "regenerate",
                target: {
                    type: "field"
                },
                mapFields:
                {
                    "response": { source: "llm", path: "content" },
                    "userInput": { source: "input", path: "userInput" },
                },
                prompt: {
                    systemMessages: ['You are a creative writing companion that helps interpret raw story fragments. Interpretations are symbolic, speculative, and intuitive—not editorial. Output must be valid JSON:\n{\n  \"content\": string\n}'],
                    userMessages: [
                        `Interpret the story fragment symbolically or thematically. Let the user input guide your interpretive lens. If a previous response exists, revise or build upon it with new insights. Avoid simply repeating it.
            
            Fragment:
            {{content}}
            
            User Input (interpretive angle, theme, or focus):
            {{userInput}}
            
            Previous Response (if any):
            {{previousResponse}}
            
            Return JSON in the format:
            { "content": "..." }`
                    ],
                    assistantMessages: [],
                    variables: ['content'],
                    responseType: 'json',
                    responseFormat: { text: 'string' }
                }
            }
        ],
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
