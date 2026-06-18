export type AIProvider = "deepseek" | "openai" | "gemini";

export type AIUsage = Record<string, unknown>;

export type GenerateTextInput = {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  retries?: number;
};

export type GenerateTextResult = {
  success: boolean;
  content: string;
  model?: string;
  usage?: AIUsage;
  error?: string;
};
