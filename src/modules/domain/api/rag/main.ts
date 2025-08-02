import mongoose from 'mongoose';
import { DataTreeSpec } from './types';
import { getCollectionByName } from '../../../../lib/dbutils';

const buildProjection = (fields: string[]): Record<string, 1 | 0> => {
    const projection: Record<string, 1> = {};
    for (const field of fields) {
        projection[field] = 1;
    }

    // 👇 Make sure to exclude everything else explicitly
    // If you want to allow _id, leave it included
    return projection;
};


export const buildDataTree = async (
    realm: string,
    spec: DataTreeSpec,
    rootId: string
): Promise<any> => {
    const rootCollection = getCollectionByName(realm, spec.collection);

    const pipeline = buildPipeline(spec, rootId);
    console.log(JSON.stringify(pipeline, null, 2));
    const result = await rootCollection.aggregate(pipeline).exec();
    return result[0]; // assuming rootId is unique
};

const buildPipeline = (spec: DataTreeSpec, rootId: string): any[] => {
    const pipeline: any[] = [];

    // Match the root document
    pipeline.push({ $match: { _id: new mongoose.Types.ObjectId(rootId) } });

    // Project root fields
    if (spec.project) {
        pipeline.push({ $project: buildProjection(spec.project) });
    }

    // Process relationships
    if (spec.relationships) {
        for (const rel of spec.relationships) {
            pipeline.push({
                $lookup: {
                    from: rel.from!,
                    localField: rel.localField!,
                    foreignField: rel.foreignField!,
                    as: rel.name,
                    pipeline: rel.spec ? buildSubPipeline(rel.spec) : [],
                },
            });

            // DO NOT UNWIND here — keep as array (one-to-many)
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
                    from: rel.from!,
                    localField: rel.localField!,
                    foreignField: rel.foreignField!,
                    as: rel.name,
                    pipeline: rel.spec ? buildSubPipeline(rel.spec) : [],
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
    const rootCollection = getCollectionByName(realm, spec.collection);

    // Load all root IDs (project only _id for efficiency)
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
