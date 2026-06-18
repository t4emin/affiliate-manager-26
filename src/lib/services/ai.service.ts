import { generateTextWithDeepSeek } from "@/lib/ai/deepseek";
import { generateTextWithOpenAI } from "@/lib/ai/openai";
import type {
  AIProvider,
  GenerateTextInput,
  GenerateTextResult,
} from "@/lib/ai/types";
import { getDeepSeekModel, getOpenAIModel } from "@/lib/config/env";
import { logger } from "@/lib/logger";

export type { AIProvider };

export type GenerateTextRequest = GenerateTextInput & {
  provider: AIProvider;
};

export type GenerateTextResponse = GenerateTextResult & {
  provider: AIProvider;
};

export async function generateText({
  provider,
  prompt,
  systemPrompt,
  model,
  temperature,
  maxTokens,
  timeoutMs,
  retries,
}: GenerateTextRequest): Promise<GenerateTextResponse> {
  logger.info("AI text generation requested", { provider, model });

  if (provider === "deepseek") {
    const result = await generateTextWithDeepSeek({
      prompt,
      systemPrompt,
      model,
      temperature,
      maxTokens,
      timeoutMs,
      retries,
    });

    return {
      provider,
      ...result,
      model: result.model ?? model ?? getDeepSeekModel(),
    };
  }

  if (provider === "openai") {
    const result = await generateTextWithOpenAI({
      prompt,
      systemPrompt,
      model,
      temperature,
      maxTokens,
      timeoutMs,
      retries,
    });

    return {
      provider,
      ...result,
      model: result.model ?? model ?? getOpenAIModel(),
    };
  }

  logger.info("AI provider request succeeded", {
    provider: "gemini",
    model: model ?? "gemini-mock",
    mocked: true,
  });

  return {
    success: true,
    provider,
    model: model ?? "gemini-mock",
    content: `Mock Gemini response for: ${prompt}`,
  };
}
