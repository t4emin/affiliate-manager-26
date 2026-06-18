import { AppError, type ErrorContext } from "@/lib/errors/AppError";

export class AuthError extends AppError {
  constructor(message = "Authentication required.", context?: ErrorContext) {
    super({
      code: "AUTH_ERROR",
      message,
      userMessage: "Please sign in to continue.",
      context,
    });
  }
}
