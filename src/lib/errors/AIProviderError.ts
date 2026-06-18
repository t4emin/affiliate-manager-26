import { AppError, type ErrorContext } from "@/lib/errors/AppError";

export class AIProviderError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super({
      code: "AI_PROVIDER_ERROR",
      message,
      userMessage: "The AI provider could not complete the request.",
      context,
    });
  }
}
