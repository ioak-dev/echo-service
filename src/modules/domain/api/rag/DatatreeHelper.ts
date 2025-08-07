import mongoose from 'mongoose';
import { DataTreeSpec, EmbedChildDataTreeSpec } from './types';
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
    const result = await rootCollection.aggregate(pipeline).exec();
    return result[0];
};

const buildPipeline = (spec: DataTreeSpec, rootId: string): any[] => {
    const pipeline: any[] = [];

    pipeline.push({ $match: { _id: new mongoose.Types.ObjectId(rootId) } });

    if (spec.project) {
        pipeline.push({ $project: buildProjection(spec.project) });
    }

    if (spec.relationships) {
        for (const rel of spec.relationships) {
            if (rel.type === "embed") {
                pipeline.push(...buildMergePipeline(rel));
            } else {
                pipeline.push({
                    $lookup: {
                        from: rel.from,
                        localField: rel.parentField,
                        foreignField: rel.childField,
                        as: rel.as || rel.from,
                        pipeline: buildSubPipeline(rel),
                    },
                });
            }
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
            if (rel.type == 'embed') {
                pipeline.push(...buildMergePipeline(rel));
            } else {
                pipeline.push({
                    $lookup: {
                        from: rel.from,
                        localField: rel.parentField,
                        foreignField: rel.childField,
                        as: rel.as || rel.from,
                        pipeline: buildSubPipeline(rel),
                    },
                });
            }
        }
    }

    return pipeline;
};

const assignDotPath = (path: string, valueExpr: any): any => {
    const parts = path.split(".");
    return parts
        .reverse()
        .reduce((acc, key) => ({ [key]: acc }), valueExpr);
};

const buildMergePipeline = (rel: EmbedChildDataTreeSpec): any[] => {
    const mergeStages: any[] = [];
    const mergeMap = rel.embedFieldMap || {};
    const tempLookupField = `__${rel.as || rel.from}`;
    const isArrayMerge = rel.parentField.includes(".");

    if (!isArrayMerge) {
        // Simple merge (non-array field)
        const addFieldsStage: Record<string, any> = {};
        for (const [foreignField, localPath] of Object.entries(mergeMap)) {
            Object.assign(addFieldsStage, assignDotPath(localPath, `$${tempLookupField}.${foreignField}`));
        }

        mergeStages.push(
            {
                $lookup: {
                    from: rel.from,
                    localField: rel.parentField,
                    foreignField: rel.childField,
                    as: tempLookupField,
                    pipeline: rel.project ? [{ $project: buildProjection(rel.project) }] : [],
                },
            },
            { $unwind: { path: `$${tempLookupField}`, preserveNullAndEmptyArrays: true } },
            { $addFields: addFieldsStage },
            { $project: { [tempLookupField]: 0 } }
        );
    } else {
        const [arrayField, innerField] = rel.parentField.split(".");

        mergeStages.push(
            {
                $lookup: {
                    from: rel.from,
                    pipeline: rel.project ? [{ $project: buildProjection(rel.project) }] : [],
                    as: tempLookupField,
                },
            },
            {
                $set: {
                    [arrayField]: {
                        $map: {
                            input: `$${arrayField}`,
                            as: "item",
                            in: {
                                $mergeObjects: [
                                    "$$item",
                                    {
                                        $let: {
                                            vars: {
                                                match: {
                                                    $arrayElemAt: [
                                                        {
                                                            $filter: {
                                                                input: `$${tempLookupField}`,
                                                                as: "ref",
                                                                cond: {
                                                                    $eq: [
                                                                        `$$ref.${rel.childField}`,
                                                                        `$$item.${innerField}`,
                                                                    ],
                                                                },
                                                            },
                                                        },
                                                        0,
                                                    ],
                                                },
                                            },
                                            in: {
                                                $mergeObjects: Object.values(
                                                    Object.entries(mergeMap).map(([foreign, local]) =>
                                                        assignDotPath(local, `$$match.${foreign}`)
                                                    )
                                                ),
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            { $project: { [tempLookupField]: 0 } }
        );
    }

    return mergeStages;
};


export const buildAllDataTrees = async (
    realm: string,
    spec: DataTreeSpec
): Promise<any[]> => {
    const rootCollection = getCollectionByName(realm, spec.from);

    const rootDocs = await rootCollection.find({}, { _id: 1 }).lean().exec();
    const rootIds = rootDocs.map((doc: any) => doc._id);

    const results = await Promise.all(
        rootIds.map((id: string) => buildDataTree(realm, spec, id))
    );

    return results.filter(tree => !!tree);
};
