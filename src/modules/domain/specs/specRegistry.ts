
import { answerSpec } from "../definitions/answer.spec";
import { courseSpec } from "../definitions/course.spec";
import { enrollmentSpec } from "../definitions/enrollment.spec";
import { exampleSpec } from "../definitions/example.spec";
import { fragmentSpec } from "../definitions/fragment.spec";
import { fragmentLabelSpec } from "../definitions/fragmentLabel.spec";
import { fragmentVersionSpec } from "../definitions/fragmentVersion.spec";
import { personProfileSpec } from "../definitions/person.spec";
import { storythreadSpec } from "../definitions/storythread.spec";
import { storythreadFragmentSpec } from "../definitions/storythreadFragment.spec";
import { SpecDefinition } from "./types/spec.types";

// Import all your spec files here

// Registry object mapping spec names to definitions
const specRegistry: Record<string, SpecDefinition> = {
    // course: courseSpec,
    // enrollment: enrollmentSpec,
    // answer: answerSpec,
    storythread: storythreadSpec,
    fragment: fragmentSpec,
    fragmentVersion: fragmentVersionSpec,
    fragmentLabel: fragmentLabelSpec,
    // person: personProfileSpec,
    // example: exampleSpec,
    storythreadFragment: storythreadFragmentSpec
};

// Export a function to get spec by domain name
export const getSpecByName = (name: string): SpecDefinition | undefined => {
    return specRegistry[name];
};

// Optional: List of all available domains
export const listAllSpecs = (): string[] => Object.keys(specRegistry);
