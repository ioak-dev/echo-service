import { fragmentSpec } from "../definitions/fragment.spec";
import { fragmentInsightSpec } from "../definitions/fragmentInsight";
import { fragmentInsightVersionSpec } from "../definitions/fragmentInsightVersion.spec";
import { fragmentLabelSpec } from "../definitions/fragmentLabel.spec";
import { fragmentVersionSpec } from "../definitions/fragmentVersion.spec";
import { storythreadSpec } from "../definitions/storythread.spec";
import { storythreadFragmentSpec } from "../definitions/storythreadFragment.spec";
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
