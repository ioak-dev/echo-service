import { fragmentAiSpec } from "../definitions/ai/fragment.spec";
import { fragmentInsightAiSpec } from "../definitions/ai/fragmentInsight.spec";
import { GenerationSpec } from "./types/aispec.types";

const aiSpecRegistry: Record<string, GenerationSpec> = {
    ...fragmentAiSpec,
    ...fragmentInsightAiSpec
};

export const getAiSpec = (id: string): GenerationSpec | undefined => {
    if (!aiSpecRegistry[id]) {
        return undefined;
    };
    return aiSpecRegistry[id];
};
