import { getCollectionByName } from "../../../lib/dbutils";
import { SpecDefinition } from "../specs/types/spec.types";

const applyVersionTagIfMissing = async (doc: any) => {
    if (!doc.versionTag) {
        const now = new Date();
        const versionTag = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}_` +
            `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}.${String(now.getSeconds()).padStart(2, '0')}`;
        doc.versionTag = versionTag;
    }
    return { doc, errors: [] };
};

export const fragmentVersionSpec: SpecDefinition = {
    fields: {
        "fragmentReference": {
            "type": "string",
            "required": true,
            parent: {
                domain: "fragment",
                field: "reference"
            }
        },
        "content": {
            "type": "string",
            "required": true,
        },
        "versionTag": {
            "type": "string",
            "required": false,
            displayOptions: {
                label: "Version tag",
                type: "text"
            }
        },
        "userNote": {
            "type": "string",
            "required": false,
            displayOptions: {
                label: "Change note",
                type: "textarea"
            }
        }
    },
    meta: {
        generation: [
            {
                id: "contrast",
                prompt: {
                    prompt: "",
                    variables: []
                },
                target: {
                    type: "childRecords",
                    domain: "fragmentInsight",
                    parentField: "fragmentVersion"
                }
            }
        ],
        hooks: {
            beforeCreate: async (doc, context) => {
                return applyVersionTagIfMissing(doc);
            },
            afterCreate: async (doc, context) => {
                try {
                    const Fragment = getCollectionByName(context.space, "fragment");
                    const updatedFragment = await Fragment.findOneAndUpdate(
                        { reference: doc.fragmentReference },
                        {
                            $set: {
                                content: doc.content,
                                updatedAt: new Date(),
                                updatedBy: context.userId
                            }
                        },
                        { new: true }
                    );

                    if (!updatedFragment) {
                        return;
                    }
                } catch (err: any) {
                    console.error("Error updating fragment content:", err.message);
                }
            },
            afterUpdate: async (doc, context) => {
                console.log(`Fragment updated: ${doc.reference}`);
            },
        },
    },
};