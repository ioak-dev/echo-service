import { customAlphabet } from 'nanoid';
import { GenerationSpec } from '../../specs/types/aispec.types';

const alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphanumericAlphabet, 8);

const revise: GenerationSpec = {
  domain: "fragmentInsight",
  parentDomain: "fragment",
  target: {
    type: "fields",
  },
  mapFields: {
    "response": { source: "llm", path: "content" },
    "userInput": { source: "input", path: "userInput" },
    "fragmentVersion": { source: "parent", path: "fragment.__version" }
  },
  prompt: {
    systemMessages: ['You are a creative writing companion that helps interpret raw story fragments. Interpretations are symbolic, speculative, and intuitive—not editorial. Output must be valid JSON:\n{\n  \"content\": string\n}'],
    userMessages: [
      `Interpret the story fragment symbolically or thematically. Let the user input guide your interpretive lens. If a previous response exists, revise or build upon it with new insights. Avoid simply repeating it.
            
            Fragment:
            {{fragment.content}}
            
            User Input (interpretive angle, theme, or focus):
            {{payload.userInput}}

            Previous Response (if any):
            {{fragmentInsight.response}}
            
            Return JSON in the format:
            { "content": "..." }`
    ],
    assistantMessages: [],
    variables: ['content'],
    responseType: 'json',
    responseFormat: { text: 'string' }
  }
};

export const fragmentInsightAiSpec: Record<string, GenerationSpec> = {
  "fragmentinsight-revise": revise
}
