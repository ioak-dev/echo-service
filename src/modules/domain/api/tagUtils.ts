import { getCollectionByName } from "../../../lib/dbutils";
import { SpecDefinition, TagField } from "../specs/types/spec.types";

export const preprocessTagFields = async (
    doc: any,
    spec: SpecDefinition,
    space: string
): Promise<void> => {
    for (const fieldName of Object.keys(spec.fields)) {
        const field = spec.fields[fieldName];
        const value = doc[fieldName];

        if (!Array.isArray(value) || value.length === 0) continue;

        const parent = (field as TagField).parent;
        if (!parent) continue;

        const parentCollection = getCollectionByName(space, parent.domain);
        const labelField = parent.field || "name";

        const ids: string[] = [];

        for (const item of value) {
            if (!item || typeof item !== "object") continue;

            const { id, value } = item;

            if (id) {
                ids.push(id);
                continue;
            }

            if (!value) continue;

            const existing = await parentCollection.findOne({ [labelField]: value });
            if (existing) {
                ids.push(existing._id.toString());
            } else {
                const result = await parentCollection.create({ [labelField]: value });
                console.log(result);
                ids.push(result._id.toString());
            }
        }

        doc[fieldName] = ids;
    }
};

export const populateTagFields = async (
    doc: any,
    spec: SpecDefinition,
    space: string
): Promise<void> => {
    for (const fieldName of Object.keys(spec.fields)) {
        const field = spec.fields[fieldName];
        const value = doc[fieldName];

        if (!Array.isArray(value) || value.length === 0) continue;

        const parent = (field as TagField).parent;
        if (!parent) continue;

        const tagModel = getCollectionByName(space, parent.domain);
        const labelField = parent.field || "name";

        const tagDocs = await tagModel.find({ _id: { $in: value } });

        doc[fieldName] = value.map((id: string) => {
            const match = tagDocs.find((doc: any) => doc._id.toString() === id);
            return {
                id,
                value: match?.[labelField] ?? id,
            };
        });
    }
};
