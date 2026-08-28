import "server-only";

import { logEvent } from "@/lib/observability/logger";

type DeliveryProvider = "disabled" | "development" | "resend";
type DeliveryPurpose = "email-verification" | "password-reset";

interface DeliveryMessage { to: string; subject: string; text: string; html: string; purpose: DeliveryPurpose }
export interface DeliveryResult { status: "disabled" | "development" | "delivered"; developmentUrl?: string }

function provider(): DeliveryProvider {
  const configured = process.env.EMAIL_DELIVERY_PROVIDER ?? "disabled";
  if (configured === "disabled" || configured === "development" || configured === "resend") return configured;
  throw new Error("Unsupported EMAIL_DELIVERY_PROVIDER");
}

function applicationUrl(requestUrl: string): URL {
  const configured = process.env.APP_BASE_URL?.trim();
  if (configured) return new URL(configured);
  if (process.env.NODE_ENV === "production") throw new Error("APP_BASE_URL is required for production email delivery");
  return new URL(requestUrl);
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

async function deliver(message: DeliveryMessage, developmentUrl: string): Promise<DeliveryResult> {
  const selected = provider();
  if (selected === "disabled") return { status: "disabled" };
  if (selected === "development") {
    if (process.env.NODE_ENV === "production") throw new Error("Development email delivery is forbidden in production");
    return { status: "development", developmentUrl };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim(); const from = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !from) throw new Error("RESEND_API_KEY and EMAIL_FROM are required for Resend delivery");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [message.to], subject: message.subject, text: message.text, html: message.html }),
  });
  if (!response.ok) throw new Error(`Email provider rejected ${message.purpose} delivery with status ${response.status}`);
  logEvent("info", "email.delivery_succeeded", { purpose: message.purpose, provider: selected });
  return { status: "delivered" };
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
