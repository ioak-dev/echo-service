import { fragmentUiSchemas } from "../definitions/ui/fragment.spec";

import { SpecDefinition } from "./types/spec.types";
import { FormSchema } from "./types/uispec.types";

const uiSpecRegistry: Record<string, Record<string, FormSchema>> = {
    fragment: fragmentUiSchemas,
};

export const getUiSpec = (domainName: string, formName: string): FormSchema | undefined => {
    if (!uiSpecRegistry[domainName]) {
        return undefined;
    };
    return uiSpecRegistry[domainName][formName || "default"];
};
