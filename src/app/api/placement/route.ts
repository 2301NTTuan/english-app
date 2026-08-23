import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth/server";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { completePlacement } from "@/lib/learning/persistence";
import { placementWriteSchema } from "@/lib/validation/learning-write";
import { logEvent } from "@/lib/observability/logger";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  try {
    const user = await currentUser();
    if (!user) return jsonError("Authentication required.", 401);
    const parsed = placementWriteSchema.safeParse(await readJson(request));
    if (!parsed.success) return jsonError("Invalid placement result.", 400);
    const result = await completePlacement(user.id, parsed.data);
    return NextResponse.json({ ok: true, duplicate: result.duplicate });
  } catch (error) {
    const bodyError = bodyErrorResponse(error);
    if (bodyError) return bodyError;
    logEvent("error", "learning.placement_transaction_failed", { requestId: request.headers.get("x-request-id") });
    return jsonError("Placement result could not be saved.", 503);
  }
}
