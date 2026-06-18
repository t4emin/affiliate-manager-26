import { AppError, type ErrorContext } from "@/lib/errors/AppError";

export class DatabaseError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super({
      code: "DATABASE_ERROR",
      message,
      userMessage: "We could not save your changes. Please try again.",
      context,
    });
  }
}
