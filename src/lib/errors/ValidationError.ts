import { AppError, type ErrorContext } from "@/lib/errors/AppError";

export class ValidationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super({
      code: "VALIDATION_ERROR",
      message,
      userMessage: message,
      context,
    });
  }
}
