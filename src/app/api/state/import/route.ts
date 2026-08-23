import { currentUser } from "@/lib/auth/server";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { importLegacyLearningState } from "@/lib/learning/persistence";
import { stateEnvelopeSchema } from "@/lib/validation/app-state";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  try {
    const user = await currentUser();
    if (!user) return jsonError("Authentication required.", 401);
    const parsed = stateEnvelopeSchema.safeParse(await readJson(request));
    if (!parsed.success || parsed.data.confirmLegacyImport !== true) return jsonError("Explicit import confirmation is required.", 400);
    await importLegacyLearningState(user.id, parsed.data.state);
    return NextResponse.json({ ok: true });
  } catch (error) { const bodyError = bodyErrorResponse(error); if (bodyError) return bodyError; return jsonError("Learning data could not be imported.", 503); }
}
