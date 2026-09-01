import { z } from "zod";
import { passwordSchema } from "./password-policy";

export const registrationNameSchema = z.string()
  .trim()
  .min(1, "Enter your name.")
  .min(2, "Name must be at least 2 characters.")
  .max(80, "Name must be no more than 80 characters.");

export const registrationEmailSchema = z.string()
  .trim()
  .min(1, "Enter your email address.")
  .max(254, "Email must be no more than 254 characters.")
  .email("Enter a valid email address.");

export const registrationSchema = z.object({
  name: registrationNameSchema,
  email: registrationEmailSchema,
  password: passwordSchema,
});

export const REGISTER_ERROR_CODES = [
  "VALIDATION_ERROR",
  "EMAIL_ALREADY_REGISTERED",
  "RATE_LIMITED",
  "VERIFICATION_DELIVERY_FAILED",
  "SERVICE_UNAVAILABLE",
] as const;

export type RegisterErrorCode = typeof REGISTER_ERROR_CODES[number];
export type RegisterField = "name" | "email" | "password";
export type RegisterFieldErrors = Partial<Record<RegisterField, string[]>>;

export interface RegisterApiPayload {
  ok?: boolean;
  code?: RegisterErrorCode;
  error?: string;
  fieldErrors?: RegisterFieldErrors;
  email?: string;
  verificationRequired?: boolean;
  verificationEmailSent?: boolean;
  deliveryStatus?: "sent" | "failed" | "development";
  developmentVerificationUrl?: string;
}

export function isRegisterErrorCode(value: unknown): value is RegisterErrorCode {
  return typeof value === "string" && (REGISTER_ERROR_CODES as readonly string[]).includes(value);
}

export function isEmailUniqueViolation(error: unknown): boolean {
  const visited = new Set<unknown>();
  let current = error;
  while (typeof current === "object" && current !== null && !visited.has(current)) {
    visited.add(current);
    const record = current as Record<string, unknown>;
    if (record.code === "23505" && record.constraint === "users_email_unique") return true;
    current = record.cause;
  }
  return false;
}

export function registerErrorMessage(code: RegisterErrorCode, retryAfter?: number): string {
  switch (code) {
    case "VALIDATION_ERROR": return "Check the highlighted fields and try again.";
    case "EMAIL_ALREADY_REGISTERED": return "This email is already registered.";
    case "RATE_LIMITED": return retryAfter && retryAfter > 0
      ? `Too many sign-up attempts. Please wait ${retryAfter} seconds and try again.`
      : "Too many sign-up attempts. Please wait a moment and try again.";
    case "VERIFICATION_DELIVERY_FAILED": return "Your account was created, but we couldn't send the verification email. Use Resend verification to try again.";
    case "SERVICE_UNAVAILABLE": return "Sign up is temporarily unavailable. Please try again later.";
  }
}
