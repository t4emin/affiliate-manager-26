import { getOpenAIEnv } from "@/lib/config/env";
import { AIProviderError } from "@/lib/errors/AIProviderError";
import type { GenerateTextInput, GenerateTextResult } from "@/lib/ai/types";
import { logger } from "@/lib/logger";

type ReviewContentInput = {
  title?: string;
  body: string;
  criteria?: string[];
};

type GenerateImageInput = {
  prompt: string;
  size?: "1024x1024" | "1024x1536" | "1536x1024";
};

type ProviderResult<T> = {
  provider: "openai";
  mocked: boolean;
  data: T;
};

type OpenAIResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  usage?: Record<string, unknown>;
  error?: {
    message?: string;
  };
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestOpenAI(
  input: Required<Pick<GenerateTextInput, "prompt" | "timeoutMs">> &
    Pick<
      GenerateTextInput,
      "systemPrompt" | "temperature" | "model" | "maxTokens"
    >,
  apiKey: string,
  defaultModel: string,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), input.timeoutMs);

  try {
    const messages = [
      input.systemPrompt
        ? { role: "system", content: input.systemPrompt }
        : null,
      { role: "user", content: input.prompt },
    ].filter(Boolean);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: input.model ?? defaultModel,
        messages,
        temperature: input.temperature ?? 0.7,
        max_tokens: input.maxTokens,
      }),
      signal: controller.signal,
    });

    const payload = (await response.json()) as OpenAIResponse;

    if (!response.ok) {
      throw new AIProviderError(
        payload.error?.message ?? `OpenAI returned ${response.status}.`,
      );
    }

    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateTextWithOpenAI(
  input: GenerateTextInput,
): Promise<GenerateTextResult> {
  try {
    const { apiKey, model } = getOpenAIEnv();
    const modelUsed = input.model ?? model;
    const retries = input.retries ?? 1;
    const timeoutMs = input.timeoutMs ?? 30_000;
    let lastError: unknown;

    logger.info("AI provider request started", {
      provider: "openai",
      model: modelUsed,
      retries,
    });

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const payload = await requestOpenAI(
          {
            prompt: input.prompt,
            systemPrompt: input.systemPrompt,
            temperature: input.temperature,
            model: input.model,
            maxTokens: input.maxTokens,
            timeoutMs,
          },
          apiKey,
          model,
        );
        const content = payload.choices?.[0]?.message?.content ?? "";

        logger.info("AI provider request succeeded", {
          provider: "openai",
          model: modelUsed,
          attempt: attempt + 1,
        });

        return {
          success: true,
          content,
          model: modelUsed,
          usage: payload.usage,
        };
      } catch (error) {
        lastError = error;
        logger.warn("OpenAI request failed", {
          provider: "openai",
          model: modelUsed,
          attempt: attempt + 1,
          retries,
          error: error instanceof Error ? error.message : String(error),
        });

        if (attempt < retries) {
          await sleep(500 * (attempt + 1));
        }
      }
    }

    const message =
      lastError instanceof Error ? lastError.message : "OpenAI request failed.";

    return {
      success: false,
      content: "",
      model: modelUsed,
      error: message,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "OpenAI is not configured.";
    logger.error("OpenAI generation failed", { error: message });

    return {
      success: false,
      content: "",
      model: input.model,
      error: message,
    };
  }
}

export async function reviewContentWithOpenAI(
  input: ReviewContentInput,
): Promise<ProviderResult<{ score: number; notes: string[] }>> {
  return {
    provider: "openai",
    mocked: true,
    data: {
      score: 0,
      notes: [`Mock OpenAI review for ${input.title ?? "untitled content"}.`],
    },
  };
}

export async function generateImageWithOpenAI(
  input: GenerateImageInput,
): Promise<ProviderResult<{ imageUrl: string | null; prompt: string }>> {
  return {
    provider: "openai",
    mocked: true,
    data: {
      imageUrl: null,
      prompt: input.prompt,
    },
  };
}
