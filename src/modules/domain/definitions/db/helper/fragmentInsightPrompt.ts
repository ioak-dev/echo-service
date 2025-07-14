import { getPrompt, replaceVariables } from "../../../../../lib/gptutils";

const _MODEL_NAME_GPT3 = "gpt-3.5-turbo";
const _MODEL_NAME_GPT4 = "gpt-4o";
const _MODEL_NAME_GPT4_MINI = "gpt-4o-mini";
const _MODEL_NAME = process.env.CHATGPT_MODEL_NAME || "gpt-4o-mini";

export const getInterpretationPrompt = (args: {
  mode: string,
  content: string,
  userInput: string,
  response?: string
}) => {
  return getPrompt(_getPromptByMode(args.mode), {
    content: args.content,
    userInput: args.userInput,
    previousResponse: args.response
  });
};

const _getPromptByMode = (mode: string) => {
  return {
    model: _MODEL_NAME,
    messages: _PROMPT_MAP[mode],
    temperature: 1,
    max_tokens: 4096,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  }
}

const _PROMPT_MAP: { [key: string]: { role: string, content: string }[] } = {
  "interpret": [
    {
      role: "system",
      content: "You are a creative writing companion that helps interpret raw story fragments. Interpretations are symbolic, speculative, and intuitive—not editorial. Output must be valid JSON:\n{\n  \"content\": string\n}"
    },
    {
      role: "user",
      content:
        `Interpret the story fragment symbolically or thematically. Let the user input guide your interpretive lens. If a previous response exists, revise or build upon it with new insights. Avoid simply repeating it.

Fragment:
{{content}}

User Input (interpretive angle, theme, or focus):
{{userInput}}

Previous Response (if any):
{{previousResponse}}

Return JSON in the format:
{ "content": "..." }`
    }
  ],

  "expand": [
    {
      role: "system",
      content: "You are a creative writing companion that expands rough story fragments. Your job is to follow the tone and atmosphere and imaginatively continue the story. Output must be valid JSON:\n{\n  \"content\": string\n}"
    },
    {
      role: "user",
      content:
        `Expand the story fragment using the user input as guidance (theme, length, tone, etc.). If a previous response exists, revise or rewrite it accordingly. Make meaningful changes—do not repeat it verbatim.

Fragment:
{{content}}

User Input (how to expand or change):
{{userInput}}

Previous Response (if any):
{{previousResponse}}

Return JSON in the format:
{ "content": "..." }`
    }
  ],

  "echo": [
    {
      role: "system",
      content: "You are a creative writing companion that echoes the emotional atmosphere of a fragment using poetic, metaphorical, or reflective language. This is not a summary. Output must be valid JSON:\n{\n  \"content\": string\n}"
    },
    {
      role: "user",
      content:
        `Reflect the mood or emotional tone of the story fragment in poetic or symbolic language. Use the user input to shape the emotional quality. If a previous echo is provided, refine or deepen it—avoid repetition.

Fragment:
{{content}}

User Input (emotion or tone to highlight):
{{userInput}}

Previous Response (if any):
{{previousResponse}}

Return JSON:
{ "content": "..." }`
    }
  ],

  "contrast": [
    {
      role: "system",
      content: "You are a creative writing companion that imagines the opposite or shadow form of a story fragment. This is a thoughtful contrast, not parody. Output must be valid JSON:\n{\n  \"content\": string\n}"
    },
    {
      role: "user",
      content:
        `Write a contrasting version of this fragment—different tone, outcome, or perspective. Use user input to decide what contrast to apply. If a previous contrast is provided, revise it meaningfully.

Fragment:
{{content}}

User Input (what kind of contrast to apply):
{{userInput}}

Previous Response (if any):
{{previousResponse}}

Return JSON:
{ "content": "..." }`
    }
  ],

  "collapse": [
    {
      role: "system",
      content: "You are a creative writing companion that collapses story fragments to their symbolic or thematic core. Think like a mythologist or dream interpreter. Output must be valid JSON:\n{\n  \"content\": string\n}"
    },
    {
      role: "user",
      content:
        `Distill the story fragment into its core symbolic or thematic meaning. Let user input suggest what essence to highlight. If a previous version exists, refine or reframe it to be clearer and more essential.

Fragment:
{{content}}

User Input (thematic focus or style of distillation):
{{userInput}}

Previous Response (if any):
{{previousResponse}}

Return JSON:
{ "content": "..." }`
    }
  ],

  "reverse": [
    {
      role: "system",
      content: "You are a creative writing companion that rewrites fragments as if they’ve been reversed in tone, perspective, or outcome. Output must be valid JSON:\n{\n  \"content\": string\n}"
    },
    {
      role: "user",
      content:
        `Rewrite this story fragment from a reversed perspective, tone, or outcome. Let the user input shape what reversal to apply. If a previous reversed version exists, revise it in a fresh way.

Fragment:
{{content}}

User Input (type of reversal to apply):
{{userInput}}

Previous Response (if any):
{{previousResponse}}

Return JSON:
{ "content": "..." }`
    }
  ]
};
