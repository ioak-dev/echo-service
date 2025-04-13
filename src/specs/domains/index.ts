import { SpecDefinition } from "../types/spec.types";
import { fragmentChildren, fragmentSpec } from "./fragment.spec";
import { fragmentCommentSpec } from "./fragmentComment.spec";
import { fragmentVersionSpec } from "./fragmentVersion.spec";
import { storythreadChildren, storythreadSpec } from "./storythread.spec";
import { userSpec } from "./user.spec";

export const specsMap: Record<string, SpecDefinition> = {
    user: userSpec,
    fragment: fragmentSpec,
    fragmentComment: fragmentCommentSpec,
    fragmentVersion: fragmentVersionSpec,
    storythread: storythreadSpec
};

export const childrenMap: Record<string, string[]> = {
    fragment: fragmentChildren,
    storythread: storythreadChildren
};