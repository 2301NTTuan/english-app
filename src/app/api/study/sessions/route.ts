import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth/server";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { completeStudySession } from "@/lib/learning/persistence";
import { studySessionWriteSchema } from "@/lib/validation/learning-write";
import { logEvent } from "@/lib/observability/logger";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  try {
    const user = await currentUser();
    if (!user) return jsonError("Authentication required.", 401);
    const parsed = studySessionWriteSchema.safeParse(await readJson(request));
    if (!parsed.success) return jsonError("Invalid study session.", 400);
    const result = await completeStudySession(user.id, parsed.data);
    return NextResponse.json({ ok: true, duplicate: result.duplicate });
  } catch (error) {
    const bodyError = bodyErrorResponse(error);
    if (bodyError) return bodyError;
    logEvent("error", "learning.study_session_transaction_failed", { requestId: request.headers.get("x-request-id") });
    return jsonError("Study session could not be saved.", 503);
  }
}
