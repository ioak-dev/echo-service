import { Request, Response } from "express";
import { customAlphabet } from 'nanoid';
import { loadSpec, validateAndShapePayload, fillMissingFields, isOperationAllowed } from "./schemaValidator";
import { getCollectionByName } from "../../lib/dbutils";
import { buildQueryFromAdvancedFilters, buildQueryFromFilters } from "./filterBuilder";
import { generateTypes } from "./typeInference";

const alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphanumericAlphabet, 8)

export const getAll = async (req: Request, res: Response) => {
    const { space, domain } = req.params;

    if (!isOperationAllowed(domain, "search")) {
        return res.status(404).json({ error: "Operation 'search' is not supported for this domain" });
    }

    const { page = 1, limit = 10, ...rawFilters } = req.query;

    if (+page < 1) {
        return res.status(400).json({ error: "Page number must be 1 or greater." });
    }

    if (+limit < 1) {
        return res.status(400).json({ error: "Limit must be 1 or greater." });
    }

    try {
        const Model = getCollectionByName(space, domain);
        const spec = loadSpec(domain);
        const filters = buildQueryFromFilters(rawFilters, spec);

        const docs = await Model.find(filters)
            .skip((+page - 1) * +limit)
            .limit(+limit);

        const total = await Model.countDocuments(filters);
        const shaped = docs.map((doc: any) => fillMissingFields(doc.toObject(), spec));

        const totalPages = Math.ceil(total / +limit);
        res.json({ data: shaped, total, page: +page, limit: +limit, totalPages });
    } catch (err: any) {
        res.status(500).json({ error: "Failed to fetch records", details: err.message });
    }
};

export const search = async (req: Request, res: Response) => {
    const { space, domain } = req.params;
    const { filters = {}, pagination = {} } = req.body;
    const { page = 1, limit = 10 } = pagination;

    if (+page < 1) {
        return res.status(400).json({ error: "Page number must be 1 or greater." });
    }

    if (+limit < 1) {
        return res.status(400).json({ error: "Limit must be 1 or greater." });
    }

    try {
        const Model = getCollectionByName(space, domain);
        const spec = loadSpec(domain);
        const mongoQuery = buildQueryFromAdvancedFilters(filters, spec);

        const docs = await Model.find(mongoQuery)
            .skip((+page - 1) * +limit)
            .limit(+limit);

        const total = await Model.countDocuments(mongoQuery);
        const shaped = docs.map((doc: any) =>
            fillMissingFields(doc.toObject(), spec)
        );

        const totalPages = Math.ceil(total / +limit);
        res.json({ data: shaped, total, page: +page, limit: +limit, totalPages });
    } catch (err: any) {
        res.status(500).json({ error: "Search failed", details: err.message });
    }
};


export const getByReference = async (req: Request, res: Response) => {
    const { space, domain, reference } = req.params;

    if (!isOperationAllowed(domain, "get")) {
        return res.status(404).json({ error: "Operation 'get' is not supported for this domain" });
    }

    try {
        const Model = getCollectionByName(space, domain);
        const spec = loadSpec(domain);

        const doc = await Model.findOne({ reference });
        if (!doc) return res.status(404).json({ error: "Not found" });

        res.json(fillMissingFields(doc.toObject(), spec));
    } catch (err: any) {
        res.status(500).json({ error: "Error fetching document", details: err.message });
    }
};

export const createOne = async (req: Request, res: Response) => {
    const { space, domain } = req.params;


    if (!isOperationAllowed(domain, "create")) {
        return res.status(404).json({ error: "Operation 'create' is not supported for this domain" });
    }

    const userId = req.user?.user_id;

    try {
        const spec = loadSpec(domain);
        const result = validateAndShapePayload(req.body, spec);

        if (!result.valid) {
            return res.status(400).json({ error: "Validation failed", details: result.errors });
        }

        const Model = getCollectionByName(space, domain);
        const timestamp = new Date();

        const doc = new Model({
            ...result.shapedData,
            reference: nanoid(),
            createdAt: timestamp,
            updatedAt: timestamp,
            createdBy: userId,
            updatedBy: userId,
        });

        await doc.save();
        res.status(201).json(fillMissingFields(doc.toObject(), spec));
    } catch (err: any) {
        res.status(500).json({ error: "Error creating document", details: err.message });
    }
};

export const updateOne = async (req: Request, res: Response) => {
    const { space, domain, reference } = req.params;

    if (!isOperationAllowed(domain, "update")) {
        return res.status(404).json({ error: "Operation 'update' is not supported for this domain" });
    }

    const userId = req.user?.user_id;

    try {
        const spec = loadSpec(domain);
        const result = validateAndShapePayload(req.body, spec);

        if (!result.valid) {
            return res.status(400).json({ error: "Validation failed", details: result.errors });
        }

        const Model = getCollectionByName(space, domain);
        const updateData = {
            ...result.shapedData,
            updatedAt: new Date(),
            updatedBy: userId,
        };

        const doc = await Model.findOneAndUpdate({ reference }, updateData, { new: true });
        if (!doc) return res.status(404).json({ error: "Not found" });
        res.json(fillMissingFields(doc.toObject(), spec));
    } catch (err: any) {
        res.status(500).json({ error: "Error updating document", details: err.message });
    }
};

export const deleteOne = async (req: Request, res: Response) => {
    const { space, domain, reference } = req.params;

    if (!isOperationAllowed(domain, "delete")) {
        return res.status(404).json({ error: "Operation 'delete' is not supported for this domain" });
    }

    try {
        const Model = getCollectionByName(space, domain);
        const doc = await Model.findOneAndDelete({ reference });
        if (!doc) return res.status(404).json({ error: "Not found" });
        res.status(204).send();
    } catch (err: any) {
        res.status(500).json({ error: "Error deleting document", details: err.message });
    }
};

export const inferTypes = (req: Request, res: Response) => {
    const { space } = req.params;

    try {
        const types = generateTypes(space);

        res.header("Content-Type", "text/typescript");

        res.send(types);
    } catch (err: any) {
        res.status(500).json({ error: "Error generating types", details: err.message });
    }
};