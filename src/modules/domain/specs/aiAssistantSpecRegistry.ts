import { fragmentAssistantAiSpec } from "../definitions/ai/assistant/fragment.spec";
import { AssistantSpec, GenerationSpec } from "./types/aispec.types";

const aiAssistantSpecRegistry: Record<string, AssistantSpec> = {
    ...fragmentAssistantAiSpec
};

export const getAiAssistantSpec = (id: string): AssistantSpec | undefined => {
    if (!aiAssistantSpecRegistry[id]) {
        return undefined;
    };
    return aiAssistantSpecRegistry[id];
};
