import { Request, Response } from "express";
import { seedDatabase } from "./testdata";
import { buildAllDataTrees, buildDataTree } from "./main";
import { universityDataTreeSpec } from "./spec";

export const ragTest = async (req: Request, res: Response) => {
    const { space } = req.params;

    await seedDatabase(space);

    const output = await buildAllDataTrees(space, universityDataTreeSpec);

    res.status(200).json(output);
};