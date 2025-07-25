import semver from "semver";
import { differenceWith, isEqual } from "lodash";
import { getCollectionByName } from "../../../lib/dbutils";
import { getSpecByName } from "../specs/specRegistry";
import { customAlphabet } from "nanoid";

const alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphanumericAlphabet, 8);

function calculateFieldDifferences(
    oldDoc: any,
    newDoc: any
): { changes: Record<string, number>; totalChange: number } {
    const changes: Record<string, number> = {};
    let weightedChange = 0;
    let totalWeight = 0;

    const skipFields = [
        "__version", "__columns", "__percentage", "_id", "__v",
        "createdBy", "createdAt", "updatedBy", "updatedAt", "reference"
    ];

    for (const key of Object.keys(newDoc)) {
        if (skipFields.includes(key)) continue;

        const oldVal = oldDoc[key];
        const newVal = newDoc[key];

        const weight = Math.max(
            estimateFieldWeight(oldVal),
            estimateFieldWeight(newVal)
        );

        if (!isEqual(oldVal, newVal)) {
            const percent = calculateChangePercent(oldVal, newVal);
            changes[key] = percent;
            weightedChange += percent * weight;
        }

        totalWeight += weight;
    }

    const totalChange = totalWeight > 0
        ? parseFloat(Math.min(weightedChange / totalWeight, 100).toFixed(2))
        : 0;

    return { changes, totalChange };
}

function estimateFieldWeight(value: any): number {
    if (value === null || value === undefined) return 1;
    return JSON.stringify(value).length || 1;
}

function calculateChangePercent(a: any, b: any): number {
    if (typeof a === 'string' && typeof b === 'string') {
        const aLen = a.length;
        const bLen = b.length;
        const maxLen = Math.max(aLen, bLen, 1);

        let diffCount = 0;
        for (let i = 0; i < maxLen; i++) {
            if (a[i] !== b[i]) diffCount++;
        }

        return parseFloat(((diffCount / maxLen) * 100).toFixed(2));
    }

    if (typeof a === 'number' && typeof b === 'number') {
        const maxVal = Math.max(Math.abs(a), 1);
        return parseFloat(((Math.abs(a - b) / maxVal) * 100).toFixed(2));
    }

    if (Array.isArray(a) && Array.isArray(b)) {
        const diff = differenceWith(a, b, isEqual).length;
        return parseFloat(((diff / Math.max(a.length, 1)) * 100).toFixed(2));
    }

    if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
        const aStr = JSON.stringify(a);
        const bStr = JSON.stringify(b);
        const maxLen = Math.max(aStr.length, 1);
        let diffCount = 0;
        for (let i = 0; i < Math.max(aStr.length, bStr.length); i++) {
            if (aStr[i] !== bStr[i]) diffCount++;
        }
        return parseFloat(((diffCount / maxLen) * 100).toFixed(2));
    }

    return 100.0;
}

export function getNextVersion(prevVersion: string, totalChange: number): string {
    if (totalChange >= 50) return semver.inc(prevVersion, 'major')!;
    if (totalChange >= 10) return semver.inc(prevVersion, 'minor')!;
    if (totalChange > 0) return semver.inc(prevVersion, 'patch')!;
    return prevVersion;
}

export async function handleVersioning({
    space,
    domain,
    doc,
    prevDoc,
}: {
    space: string;
    domain: string;
    doc: any;
    prevDoc?: any;
}): Promise<string | undefined> {
    const spec = getSpecByName(domain);
    const versionMeta = spec?.meta?.versioning;
    if (!versionMeta) return;

    const VersionModel = getCollectionByName(space, versionMeta.domain);
    const referenceField = versionMeta.reference || "parentReference";

    const existingVersions = await VersionModel
        .find({ [referenceField]: doc.reference })
        .sort({ createdAt: -1 })
        .limit(1);
    const lastVersion = existingVersions[0];

    let version = "1.0.0";
    let __columns: Record<string, number> = {};

    if (!lastVersion) {
        await VersionModel.create({
            ...doc,
            _id: undefined,
            __version: version,
            __columns: {},
            reference: nanoid(),
            [referenceField]: doc.reference,
            createdAt: new Date(),
        });
        return version;
    }

    const { changes, totalChange } = calculateFieldDifferences(prevDoc, doc);
    if (totalChange === 0) return;

    version = getNextVersion(lastVersion?.__version ?? "1.0.0", totalChange);
    __columns = changes;

    await VersionModel.create({
        ...doc,
        _id: undefined,
        __version: version,
        __columns,
        __percentage: totalChange,
        reference: nanoid(),
        [referenceField]: doc.reference,
        createdAt: new Date(),
    });

    return version;
}

export async function deleteAllVersions({ space, domain, reference }: {
    space: string;
    domain: string;
    reference: string;
}) {
    const spec = getSpecByName(domain);
    const versionMeta = spec?.meta?.versioning;
    if (!versionMeta) return;

    const VersionModel = getCollectionByName(space, versionMeta.domain);
    await VersionModel.deleteMany({ reference });
}
