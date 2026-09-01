import { NextResponse } from "next/server";
import { isEmailUniqueViolation, registrationSchema, registerErrorMessage, type RegisterFieldErrors } from "@/lib/auth/registration";
import { consumeRateLimit, rateLimitKey } from "@/lib/auth/rate-limit";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { logEvent } from "@/lib/observability/logger";
import { registerAccount } from "@/lib/auth/account";
import { emailDeliveryLogMetadata, sendVerificationEmail } from "@/lib/email/delivery";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403, undefined, { code: "VALIDATION_ERROR" });
  const limit = await consumeRateLimit(rateLimitKey(request, "register"), 5);
  if (limit.unavailable) return jsonError(registerErrorMessage("SERVICE_UNAVAILABLE"), 503, undefined, { code: "SERVICE_UNAVAILABLE" });
  if (!limit.allowed) return jsonError(registerErrorMessage("RATE_LIMITED"), 429, { "Retry-After": String(limit.retryAfter) }, { code: "RATE_LIMITED" });
  try {
    const parsed = registrationSchema.safeParse(await readJson(request, 16_384));
    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors;
      const fieldErrors: RegisterFieldErrors = {
        ...(flattened.name?.length ? { name: flattened.name } : {}),
        ...(flattened.email?.length ? { email: flattened.email } : {}),
        ...(flattened.password?.length ? { password: flattened.password } : {}),
      };
      return jsonError(registerErrorMessage("VALIDATION_ERROR"), 400, undefined, { code: "VALIDATION_ERROR", fieldErrors });
    }
    const account = await registerAccount(parsed.data);
    let developmentVerificationUrl: string | undefined;
    let deliveryStatus: "sent" | "failed" | "development" = "failed";
    try {
      const result = await sendVerificationEmail(account.email, account.verificationToken, request.url);
      developmentVerificationUrl = result.developmentUrl;
      deliveryStatus = result.status === "delivered" ? "sent" : result.status === "development" ? "development" : "failed";
      if (result.status === "disabled") logEvent("warn", "email.verification_delivery_disabled", { requestId: request.headers.get("x-request-id"), provider: "disabled" });
    } catch (error) {
      logEvent("error", "email.verification_delivery_failed", { requestId: request.headers.get("x-request-id"), ...emailDeliveryLogMetadata(error) });
    }
    const code = deliveryStatus === "sent" ? undefined : "VERIFICATION_DELIVERY_FAILED";
    return NextResponse.json({
      ok: true,
      verificationRequired: true,
      verificationEmailSent: deliveryStatus === "sent",
      email: account.email,
      deliveryStatus,
      ...(code ? { code } : {}),
      ...(developmentVerificationUrl ? { developmentVerificationUrl } : {}),
    }, { status: 201 });
  } catch (error) {
    const bodyError = bodyErrorResponse(error, "VALIDATION_ERROR"); if (bodyError) return bodyError;
    if (isEmailUniqueViolation(error)) {
      logEvent("warn", "auth.registration_duplicate", { requestId: request.headers.get("x-request-id") });
      return jsonError(registerErrorMessage("EMAIL_ALREADY_REGISTERED"), 409, undefined, { code: "EMAIL_ALREADY_REGISTERED" });
    }
    logEvent("error", "auth.registration_unavailable", { requestId: request.headers.get("x-request-id"), errorType: error instanceof Error ? error.constructor.name : typeof error });
    return jsonError(registerErrorMessage("SERVICE_UNAVAILABLE"), 503, undefined, { code: "SERVICE_UNAVAILABLE" });
  }
}
