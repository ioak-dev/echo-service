import { Model, Types } from 'mongoose';
import { getCollectionByName } from '../../../../lib/dbutils';
import {
    DataTreeSpec,
    DataTreeRelationship,
    LookupRelationship,
    NestedRelationship,
} from './types';

const isNestedRelationship = (rel: DataTreeRelationship): rel is NestedRelationship => {
    return 'nestedSpec' in rel;
};

function buildPipeline(spec: Omit<DataTreeSpec, 'rootCollection'>, parentPipeline: any[] = []): any[] {
    const currentPipeline = [...parentPipeline];

    // 1. Initial Projection for the current level's fields.
    if (spec.project && spec.project.length > 0) {
        const projectionStage = { $project: {} };
        spec.project.forEach(field => {
            (projectionStage.$project as any)[field] = 1;
        });
        currentPipeline.push(projectionStage);
    }

    // 2. Handle Relationships (Lookups, Embedded, and Nested).
    if (spec.relationships && spec.relationships.length > 0) {
        for (const rel of spec.relationships) {
            if (isNestedRelationship(rel)) {
                const nestedSpec = rel.nestedSpec;

                // Push a $lookup stage with a nested pipeline for deep joins.
                currentPipeline.push({
                    $lookup: {
                        from: rel.collection,
                        let: { parentId: `$${rel.localField}` },
                        pipeline: [
                            { $match: { $expr: { $eq: [`$${rel.fromField}`, '$$parentId'] } } },
                            ...buildPipeline(nestedSpec, []),
                        ],
                        as: rel.as,
                    },
                });
            } else if (rel.relationshipType === 'lookup') {
                const lookupRel = rel as LookupRelationship;

                // Push a standard $lookup stage.
                currentPipeline.push({
                    $lookup: {
                        from: lookupRel.collection,
                        localField: lookupRel.localField,
                        foreignField: lookupRel.fromField,
                        as: lookupRel.as,
                    },
                });

                // Nested Projection for the looked-up data to optimize performance.
                if (lookupRel.project && lookupRel.project.length > 0) {
                    const projectFields: { [key: string]: number } = {};
                    lookupRel.project.forEach(field => {
                        projectFields[`${lookupRel.as}.${field}`] = 1;
                    });
                    currentPipeline.push({ $project: { ...projectFields, _id: 1 } });
                }
            } else if (rel.relationshipType === 'embedded') {
                // Embedded relationships are handled implicitly by projections, so no
                // explicit aggregation stage is needed here.
            }
        }
    }

    return currentPipeline;
}

export async function buildDataTree<T = any>(
    realm: string,
    rootId: string,
    spec: DataTreeSpec
): Promise<T | null> {
    const rootModel: Model<any> = getCollectionByName(realm, spec.rootCollection);

    // Start the pipeline with a match stage for the root document using Mongoose ObjectId.
    const initialPipeline = [
        { $match: { _id: new Types.ObjectId(rootId) } },
    ];

    // Build the full aggregation pipeline recursively.
    const fullPipeline = buildPipeline(spec, initialPipeline);

    try {
        // Execute the aggregation using Mongoose's aggregate method, which returns
        // a then-able object that can be awaited.
        const result: T[] = await rootModel.aggregate<T>(fullPipeline).exec();

        // Return the first element of the result array, since we matched on a single ID.
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error(`Failed to build data tree for rootId ${rootId}:`, error);
        throw error;
    }
}

export async function buildAllDataTrees<T = any>(
    realm: string,
    spec: DataTreeSpec
): Promise<T[]> {
    const rootModel: Model<any> = getCollectionByName(realm, spec.rootCollection);

    try {
        // Fetch all document IDs from the root collection.
        // Using .lean() for performance, as we only need the ID.
        const allRootIds = await rootModel.find({}, { _id: 1 }).lean().exec();

        if (!allRootIds || allRootIds.length === 0) {
            console.warn(`No records found in the root collection '${spec.rootCollection}'.`);
            return [];
        }

        // Create an array of promises, each for a single `buildDataTree` call.
        const treePromises = allRootIds.map((doc: any) => buildDataTree(realm, doc._id, spec));

        // Use Promise.all to run all aggregation pipelines concurrently.
        // This is significantly more performant than running them sequentially.
        const results = await Promise.all(treePromises);

        // Filter out any potential null results (if a record was deleted mid-process).
        const consolidatedResult = results.filter((result): result is T => result !== null);

        return consolidatedResult;
    } catch (error) {
        console.error(`Failed to build data trees for realm '${realm}' and spec '${spec.rootCollection}':`, error);
        throw error;
    }
}
