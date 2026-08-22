import { PostgrestError } from "@supabase/supabase-js";

export type AppErrorCode =
  | "not_found"
  | "forbidden"
  | "conflict"
  | "validation"
  | "network"
  | "unknown";

/**
 * Normalized error shape for anything surfaced to the UI. Every Supabase call in a
 * module's api.ts should funnel through `toAppError` so components/hooks never handle
 * raw PostgrestError/AuthError shapes directly (see ARCHITECTURE.md §16).
 */
export class AppError extends Error {
  code: AppErrorCode;
  override cause?: unknown;

  constructor(message: string, code: AppErrorCode = "unknown", cause?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.cause = cause;
  }
}

const POSTGRES_CODE_MAP: Record<string, AppErrorCode> = {
  "23505": "conflict", // unique_violation
  "23503": "validation", // foreign_key_violation
  "23514": "validation", // check_violation
  PGRST116: "not_found", // no rows returned for .single()
  "42501": "forbidden", // insufficient_privilege (RLS denial)
};

const FRIENDLY_MESSAGES: Partial<Record<AppErrorCode, string>> = {
  not_found: "We couldn't find that record.",
  forbidden: "You don't have permission to do that.",
  conflict: "That value is already in use.",
  validation: "That change isn't valid — check the related fields and try again.",
  network: "Couldn't reach the server. Check your connection and try again.",
  unknown: "Something went wrong. Please try again.",
};

function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (isPostgrestError(error)) {
    const code = POSTGRES_CODE_MAP[error.code] ?? "unknown";
    return new AppError(FRIENDLY_MESSAGES[code] ?? FRIENDLY_MESSAGES.unknown!, code, error);
  }

  if (error instanceof TypeError && /fetch/i.test(error.message)) {
    return new AppError(FRIENDLY_MESSAGES.network!, "network", error);
  }

  if (error instanceof Error) {
    return new AppError(error.message, "unknown", error);
  }

  return new AppError(FRIENDLY_MESSAGES.unknown!, "unknown", error);
}
