export type ErrorContext = Record<string, unknown>;

export class AppError extends Error {
  readonly code: string;
  readonly userMessage: string;
  readonly context?: ErrorContext;

  constructor({
    code,
    message,
    userMessage,
    context,
  }: {
    code: string;
    message: string;
    userMessage?: string;
    context?: ErrorContext;
  }) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.userMessage = userMessage ?? "Something went wrong.";
    this.context = context;
  }
}

export function getUserFacingMessage(error: unknown) {
  if (error instanceof AppError) {
    return error.userMessage;
  }

  return "Something went wrong. Please try again.";
}
