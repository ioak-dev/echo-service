import { Request, Response } from "express";
import { seedDatabase } from "./example/testdata";
import { buildAllDataTrees, buildDataTree } from "./DatatreeHelper";
import { universityChunkSpecs, universityDataTreeSpec } from "./example/example";
import { generateChunks } from "./ChunkBuilder";

export const ragTest = async (req: Request, res: Response) => {
    const { space } = req.params;

    await seedDatabase(space);

    const output = await buildAllDataTrees(space, universityDataTreeSpec);

    res.status(200).json(output);
};

export const ragTestChunkStage = async (req: Request, res: Response) => {
    const { space } = req.params;

    await seedDatabase(space);

    const dataTree = await buildAllDataTrees(space, universityDataTreeSpec);

    const output = await generateChunks({ students: dataTree }, universityChunkSpecs);

    res.status(200).json(output);
};