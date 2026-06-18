import { z } from "zod";
import { AppError } from "@/lib/errors/AppError";

const publicSupabaseSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL."),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required."),
});

const deepSeekSchema = z.object({
  DEEPSEEK_API_KEY: z.string().min(1, "DEEPSEEK_API_KEY is required."),
});

const openAiSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required."),
});

function formatEnvError(error: z.ZodError) {
  return error.issues
    .map((issue) => {
      const name = issue.path.join(".") || "environment";
      return `${name}: ${issue.message}`;
    })
    .join(" ");
}

export function getPublicSupabaseEnv() {
  const result = publicSupabaseSchema.safeParse(process.env);

  if (!result.success) {
    throw new AppError({
      code: "ENV_ERROR",
      message: `Invalid Supabase environment: ${formatEnvError(result.error)}`,
      userMessage:
        "Supabase is not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    });
  }

  return result.data;
}

export function getDeepSeekEnv() {
  const result = deepSeekSchema.safeParse(process.env);

  if (!result.success) {
    throw new AppError({
      code: "ENV_ERROR",
      message: `Invalid DeepSeek environment: ${formatEnvError(result.error)}`,
      userMessage: "DeepSeek is not configured. Check DEEPSEEK_API_KEY.",
    });
  }

  return {
    apiKey: result.data.DEEPSEEK_API_KEY,
    model: getDeepSeekModel(),
  };
}

export function getDeepSeekModel() {
  return process.env.DEEPSEEK_MODEL ?? "deepseek-chat";
}

export function getOpenAIEnv() {
  const result = openAiSchema.safeParse(process.env);

  if (!result.success) {
    throw new AppError({
      code: "ENV_ERROR",
      message: `Invalid OpenAI environment: ${formatEnvError(result.error)}`,
      userMessage: "OpenAI is not configured. Check OPENAI_API_KEY.",
    });
  }

  return {
    apiKey: result.data.OPENAI_API_KEY,
    model: getOpenAIModel(),
  };
}

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL ?? "gpt-4o-mini";
}
