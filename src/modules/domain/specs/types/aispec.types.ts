import { PromptBuilder } from 'aihub';

export type GenerationTarget =
  | { type: "fields"; }
  | { type: "childRecords"; domain: string; };

export interface PromptTemplate {
  prompt: string;
  variables: string[];
}

export interface FieldMapping {
  source: "llm" | "parent" | "input" | "static";
  path?: string; // supports dot notation
  value?: any;  // if source is "static"
}

export interface GenerationSpec {
  target: GenerationTarget;
  prompt: PromptBuilder.Types.UniversalPrompt;
  domain: string;
  parentDomain?: string;

  mapFields: {
    [targetField: string]: FieldMapping;
  };
}

export interface AssistantSpec {
  systemPrompt: any;
  minLength?: number;
  maxLength?: number;
  html?: boolean;
}
