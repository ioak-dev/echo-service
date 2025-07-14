import { ChatGpt } from "aihub";
import { getInterpretationPrompt } from "./fragmentInsightPrompt";

const config = require("../../../../../../env");

export const interpret = async (args: {
    mode: string,
    content: string,
    userInput: string,
    response?: string
}) => {
    const gptResponse = await ChatGpt.process(
        config.CHATGPT_API_KEY,
        "/v1/chat/completions",
        getInterpretationPrompt(args),
        "object"
      );
    return gptResponse;
};