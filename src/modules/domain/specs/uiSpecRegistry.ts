import { fragmentUiSchemas } from "../definitions/ui/fragment.spec";
import { fragmentInsightUiSchemas } from "../definitions/ui/fragmentInsight.spec";

import { FormSchema } from "./types/uispec.types";

const uiSpecRegistry: Record<string, Record<string, FormSchema>> = {
    fragment: fragmentUiSchemas,
    fragmentInsight: fragmentInsightUiSchemas
};

export const getUiSpec = (domainName: string, formName: string): FormSchema | undefined => {
    if (!uiSpecRegistry[domainName]) {
        return undefined;
    };
    return uiSpecRegistry[domainName][formName || "default"];
};
