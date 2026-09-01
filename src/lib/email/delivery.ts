import "server-only";

import { logEvent } from "@/lib/observability/logger";

type DeliveryProvider = "disabled" | "development" | "resend";
type DeliveryPurpose = "email-verification" | "password-reset";
type DeliveryFailureReason = "invalid_app_base_url" | "development_forbidden" | "missing_config" | "invalid_api_key" | "invalid_sender" | "network_error" | "provider_rejected" | "invalid_provider_response" | "unexpected";

interface DeliveryMessage { to: string; subject: string; text: string; html: string; purpose: DeliveryPurpose }
export interface DeliveryResult { status: "disabled" | "development" | "delivered"; developmentUrl?: string }

export class EmailDeliveryError extends Error {
  constructor(
    public readonly reason: DeliveryFailureReason,
    public readonly provider: DeliveryProvider,
    public readonly providerStatus?: number,
    public readonly providerErrorType?: string,
  ) {
    super("Email delivery failed");
    this.name = "EmailDeliveryError";
  }
}

export function emailDeliveryLogMetadata(error: unknown) {
  if (error instanceof EmailDeliveryError) return {
    failureReason: error.reason,
    provider: error.provider,
    providerStatus: error.providerStatus,
    providerErrorType: error.providerErrorType,
  };
  return { failureReason: "unexpected", errorType: error instanceof Error ? error.constructor.name : typeof error };
}

function provider(): DeliveryProvider {
  const configured = process.env.EMAIL_DELIVERY_PROVIDER ?? "disabled";
  if (configured === "disabled" || configured === "development" || configured === "resend") return configured;
  throw new Error("Unsupported EMAIL_DELIVERY_PROVIDER");
}

function applicationUrl(requestUrl: string): URL {
  const configured = process.env.APP_BASE_URL?.trim();
  const candidate = configured || (process.env.NODE_ENV === "production" ? "" : requestUrl);
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("unsupported protocol");
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:") throw new Error("production URL must use HTTPS");
    return url;
  } catch {
    throw new EmailDeliveryError("invalid_app_base_url", provider());
  }
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

async function deliver(message: DeliveryMessage, developmentUrl: string): Promise<DeliveryResult> {
  const selected = provider();
  if (selected === "disabled") return { status: "disabled" };
  if (selected === "development") {
    if (process.env.NODE_ENV === "production") throw new EmailDeliveryError("development_forbidden", selected);
    return { status: "development", developmentUrl };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim(); const from = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !from) throw new EmailDeliveryError("missing_config", selected);
  if (!apiKey.startsWith("re_")) throw new EmailDeliveryError("invalid_api_key", selected);
  if (!isValidSender(from)) throw new EmailDeliveryError("invalid_sender", selected);

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "english-mastery/0.1",
      },
      body: JSON.stringify({ from, to: [message.to], subject: message.subject, text: message.text, html: message.html }),
    });
  } catch {
    throw new EmailDeliveryError("network_error", selected);
  }

  const payload = await safeProviderPayload(response);
  if (!response.ok) throw new EmailDeliveryError("provider_rejected", selected, response.status, providerErrorType(payload));
  if (!payload || typeof payload !== "object" || typeof (payload as Record<string, unknown>).id !== "string") {
    throw new EmailDeliveryError("invalid_provider_response", selected, response.status);
  }
  logEvent("info", "email.delivery_succeeded", { purpose: message.purpose, provider: selected });
  return { status: "delivered" };
}

function isValidSender(value: string) {
  const mailbox = value.match(/<([^<>]+)>$/)?.[1] ?? value;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailbox);
}

async function safeProviderPayload(response: Response): Promise<unknown> {
  try { return await response.json() as unknown; }
  catch { return null; }
}

function providerErrorType(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const record = payload as Record<string, unknown>;
  const value = record.name ?? record.type ?? record.code;
  return typeof value === "string" && /^[a-zA-Z0-9_-]{1,80}$/.test(value) ? value : undefined;
}

export async function sendPasswordResetEmail(email: string, token: string, requestUrl: string): Promise<DeliveryResult> {
  if (provider() === "disabled") return { status: "disabled" };
  const resetUrl = new URL("/reset-password", applicationUrl(requestUrl)); resetUrl.searchParams.set("token", token);
  const link = resetUrl.toString();
  return deliver({
    to: email, purpose: "password-reset", subject: "Reset your English Mastery password",
    text: `Use this link within one hour to reset your English Mastery password: ${link}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>Use the link below within one hour to reset your English Mastery password.</p><p><a href="${escapeHtml(link)}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
  }, link);
}

export async function sendVerificationEmail(email: string, token: string, requestUrl: string): Promise<DeliveryResult> {
  if (provider() === "disabled") return { status: "disabled" };
  const verificationUrl = new URL("/verify-email", applicationUrl(requestUrl)); verificationUrl.searchParams.set("token", token);
  const link = verificationUrl.toString();
  return deliver({
    to: email, purpose: "email-verification", subject: "Verify your English Mastery email",
    text: `Use this link within 24 hours to verify your English Mastery email: ${link}\n\nIf you did not create this account, you can ignore this email.`,
    html: `<p>Use the link below within 24 hours to verify your English Mastery email.</p><p><a href="${escapeHtml(link)}">Verify email</a></p><p>If you did not create this account, you can ignore this email.</p>`,
  }, link);
}
