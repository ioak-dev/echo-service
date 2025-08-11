import axios, { AxiosResponse } from "axios";
import { Request, Response } from "express";

const config = require("../../../../env");

type ResponseFormat = "string" | "object" | "list";

interface PredictionResponse {
    is_successful: boolean;
    response_text: string;
    response_object?: Record<string, any>;
    response_list?: any[];
    error_details?: string | null;
    error_code?: string | null;
}

interface PredictInput {
    uri: string;
    provider: string;
    model: string;
    payload: Record<string, any>;
    format?: ResponseFormat;
}

interface PredictStreamInput {
    uri: string;
    provider: string;
    model: string;
    payload: any[];
    format?: ResponseFormat;
}

export async function predict(tenant: string, token: string, {
    uri,
    provider,
    model,
    payload,
    format = "string",
}: PredictInput): Promise<PredictionResponse> {
    const endpoint = `${config.AIHUB_URL}/v1/predict/${config.AIHUB_CLIENT}/${tenant}`;

    try {
        const response: AxiosResponse<PredictionResponse> = await axios.post(
            endpoint,
            { uri, provider, model, payload, format, api_key: config.CHATGPT_API_KEY },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            }
        );

        return response.data;
    } catch (error: any) {
        if (error.response) {
            return {
                is_successful: false,
                response_text: "",
                response_object: {},
                response_list: [],
                error_details: error.response.data?.detail || "Unexpected server error",
                error_code: error.response.status.toString(),
            };
        }

        return {
            is_successful: false,
            response_text: "",
            response_object: {},
            response_list: [],
            error_details: error.message,
            error_code: "CLIENT_ERROR",
        };
    }
}


export const predictStream = async (tenant: string, token: string, {
    uri,
    provider,
    model,
    payload,
    format = "string",
}: PredictStreamInput) => {
    const endpoint = `${config.AIHUB_URL}/${config.AIHUB_CLIENT}/${tenant}/predict-stream`;
    const messages = [
        {
            role: "system",
            content: "You are an expert assistant helping users fill out the form fields. Only respond with suggestions related to the field only without going off topic"
        },
        ...payload
    ];
    const predictPayload = {
        provider,
        model,
        uri,
        api_key: config.CHATGPT_API_KEY,
        payload: {
            messages,
            "temperature": 1
        },
    };

    const streamResponse = await axios.post(
        endpoint,
        predictPayload,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            responseType: 'stream',
        },
    );
    return streamResponse;
};


export const chat = async (req: Request, res: Response) => {
    const token = req.token;
    const { space } = req.params;
    const payload: any[] = req.body;
    try {
        const streamResponse = await predictStream(space, token || "", {
            uri: "/v1/chat/completions",
            provider: "chatgpt",
            model: "gpt-4o-mini",
            payload: payload
        })
        res.setHeader('Content-Type', 'text/event-stream');
        streamResponse.data.pipe(res);
    } catch (err: any) {
        console.error('Generation error:', err);
        res.status(500).json({ error: 'Generation failed', details: err.message });
    }
};
