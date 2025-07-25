import { customAlphabet } from 'nanoid';
import { GenerationSpec } from '../../specs/types/aispec.types';

const alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphanumericAlphabet, 8);

const fragmentSummary: GenerationSpec = {
  domain: "fragment",
  target: {
    type: "fields",
  },
  mapFields: {
    "summary": {
      source: "llm",
      path: "text"
    }
  },
  prompt: {
    systemMessages: ['You are an AI assistant tasked with summarizing text.'],
    userMessages: [
      'Please summarize the following content into a single sentence: {{fragment.content}}'
    ],
    assistantMessages: ['Here is the summary of the content:'],
    variables: ['content'],
    responseType: 'json',
    responseFormat: { text: 'string' }
  }
};

const fragmentInsight: GenerationSpec = {
  domain: "fragmentInsight",
  parentDomain: "fragment",
  target: {
    domain: "fragmentInsight",
    type: "childRecords",
  },
  mapFields: {
    "response": { source: "llm", path: "content" },
    "mode": { source: "parent", path: "payload.mode" },
    "userInput": { source: "parent", path: "payload.userInput" },
    "fragmentVersion": { source: "parent", path: "fragment.__version" },
    "fragmentReference": { source: "parent", path: "params.parentReference" }
  },
  prompt: {
    systemMessages: ['You are a creative writing companion that helps interpret raw story fragments. Interpretations are symbolic, speculative, and intuitive—not editorial. Output must be valid JSON:\n{\n  \"content\": string\n}'],
    userMessages: [
      `Interpret the story fragment symbolically or thematically. Let the user input guide your interpretive lens. If a previous response exists, revise or build upon it with new insights. Avoid simply repeating it.
            
            Fragment:
            {{fragment.content}}
            
            User Input (interpretive angle, theme, or focus):
            {{payload.userInput}}
            
            Return JSON in the format:
            { "content": "..." }`
    ],
    assistantMessages: [],
    variables: ['content'],
    responseType: 'json',
    responseFormat: { text: 'string' }
  }
};

export const fragmentAiSpec: Record<string, GenerationSpec> = {
  "fragment-summary": fragmentSummary,
  "fragment-insight": fragmentInsight
}
