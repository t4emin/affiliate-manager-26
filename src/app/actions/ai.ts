"use server";

import { generateText, type AIProvider } from "@/lib/services/ai.service";
import type { AIUsage } from "@/lib/ai/types";

export type AiTestState = {
  success?: boolean;
  provider?: AIProvider;
  model?: string;
  content?: string;
  usage?: AIUsage;
  error?: string;
};

function isAiProvider(value: string): value is AIProvider {
  return value === "deepseek" || value === "openai" || value === "gemini";
}

function optionalNumber(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  if (!text) return undefined;

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function testAiProvider(
  _previousState: AiTestState,
  formData: FormData,
): Promise<AiTestState> {
  const providerValue = String(formData.get("provider") ?? "deepseek");
  const prompt = String(formData.get("prompt") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim() || undefined;
  const temperature = optionalNumber(formData.get("temperature"));
  const maxTokens = optionalNumber(formData.get("maxTokens"));

  if (!isAiProvider(providerValue)) {
    return { success: false, error: "Choose a supported AI provider." };
  }

  if (!prompt) {
    return {
      success: false,
      provider: providerValue,
      error: "Prompt is required.",
    };
  }

  const result = await generateText({
    provider: providerValue,
    prompt,
    model,
    temperature,
    maxTokens,
  });

  return result;
}
