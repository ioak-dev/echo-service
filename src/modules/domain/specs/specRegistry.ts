import { fragmentSpec } from "../definitions/db/fragment.spec";
import { fragmentInsightSpec } from "../definitions/db/fragmentInsight";
import { fragmentInsightVersionSpec } from "../definitions/db/fragmentInsightVersion.spec";
import { fragmentLabelSpec } from "../definitions/db/fragmentLabel.spec";
import { fragmentVersionSpec } from "../definitions/db/fragmentVersion.spec";
import { storythreadSpec } from "../definitions/db/storythread.spec";
import { storythreadFragmentSpec } from "../definitions/db/storythreadFragment.spec";
import { SpecDefinition } from "./types/spec.types";

const specRegistry: Record<string, SpecDefinition> = {
    storythread: storythreadSpec,
    fragment: fragmentSpec,
    fragmentVersion: fragmentVersionSpec,
    fragmentLabel: fragmentLabelSpec,
    fragmentInsight: fragmentInsightSpec,
    fragmentInsightVersion: fragmentInsightVersionSpec,
    storythreadFragment: storythreadFragmentSpec
};

export const getSpecByName = (name: string): SpecDefinition | undefined => {
    return specRegistry[name];
};

export const listAllSpecs = (): string[] => Object.keys(specRegistry);
