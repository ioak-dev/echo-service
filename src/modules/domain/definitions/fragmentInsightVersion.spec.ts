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

export const fragmentInsightVersionSpec: SpecDefinition = {
    fields: {
        "fragmentInsightReference": {
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
        "versionTag": {
            "type": "string",
            "required": false,
            displayOptions: {
                label: "Version tag",
                type: "text"
            }
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
                return applyVersionTagIfMissing(doc);
            },
            afterUpdate: async (doc, context) => {
                console.log(`Fragment updated: ${doc.reference}`);
            },
        },
    },
};