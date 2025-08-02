import mongoose from 'mongoose';
import { DataTreeSpec } from './types';
import { getCollectionByName } from '../../../../lib/dbutils';

const buildProjection = (fields: string[]): Record<string, 1 | 0> => {
    const projection: Record<string, 1 | 0> = {};
    for (const field of fields) {
        projection[field] = 1;
    }

    if (!fields.includes('_id')) {
        projection._id = 0;
    }
    return projection;
};

export const buildDataTree = async (
    realm: string,
    spec: DataTreeSpec,
    rootId: string
): Promise<any> => {
    const rootCollection = getCollectionByName(realm, spec.from);

    const pipeline = buildPipeline(spec, rootId);
    console.log(JSON.stringify(pipeline, null, 2));
    const result = await rootCollection.aggregate(pipeline).exec();
    return result[0]; // assuming rootId is unique
};

const buildPipeline = (spec: DataTreeSpec, rootId: string): any[] => {
    const pipeline: any[] = [];

    pipeline.push({ $match: { _id: new mongoose.Types.ObjectId(rootId) } });

    if (spec.project) {
        pipeline.push({ $project: buildProjection(spec.project) });
    }

    if (spec.relationships) {
        for (const rel of spec.relationships) {
            pipeline.push({
                $lookup: {
                    from: rel.from,
                    localField: rel.parentField,
                    foreignField: rel.childField,
                    as: rel.as || rel.from,
                    pipeline: rel ? buildSubPipeline(rel) : [],
                },
            });
        }
    }

    return pipeline;
};

const buildSubPipeline = (spec: DataTreeSpec): any[] => {
    const pipeline: any[] = [];

    if (spec.project) {
        pipeline.push({ $project: buildProjection(spec.project) });
    }

    if (spec.relationships) {
        for (const rel of spec.relationships) {
            pipeline.push({
                $lookup: {
                    from: rel.from,
                    localField: rel.parentField,
                    foreignField: rel.childField,
                    as: rel.as || rel.from,
                    pipeline: rel ? buildSubPipeline(rel) : [],
                },
            });

            // Keep as array for one-to-many — no $unwind
        }
    }

    return pipeline;
};

export const buildAllDataTrees = async (
    realm: string,
    spec: DataTreeSpec
): Promise<any[]> => {
    const rootCollection = getCollectionByName(realm, spec.from);

    const rootDocs = await rootCollection.find({}, { _id: 1 }).lean().exec();
    const rootIds = rootDocs.map((doc: any) => doc._id);

    const results: any[] = [];

    for (const id of rootIds) {
        const tree = await buildDataTree(realm, spec, id);
        if (tree) {
            results.push(tree);
        }
    }

    return results;
};
