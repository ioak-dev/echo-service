import { Request, Response } from "express";
import { getUiSpec } from "../specs/uiSpecRegistry";

export const getUiMeta = async (req: Request, res: Response) => {
    const { space, domain, formName } = req.params;

    const spec = getUiSpec(domain, formName);
    if (!spec) return res.status(404).json({ error: `Form (${formName}) does not exists in  Domain (${domain})` });

    res.json(spec);
};