import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth/server";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { saveLearningPreferences } from "@/lib/learning/persistence";
import { loadLearningState } from "@/lib/learning/state-projection";
import { stateEnvelopeSchema } from "@/lib/validation/app-state";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return jsonError("Authentication required.", 401);
    return NextResponse.json({ state: await loadLearningState(user.id) });
  } catch { return jsonError("Learning data is temporarily unavailable.", 503); }
}

export async function PUT(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  try {
    const user = await currentUser();
    if (!user) return jsonError("Authentication required.", 401);
    const parsed = stateEnvelopeSchema.safeParse(await readJson(request));
    if (!parsed.success) return jsonError("Invalid learning state.", 400);
    await saveLearningPreferences(user.id, parsed.data.state);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const bodyError = bodyErrorResponse(error); if (bodyError) return bodyError;
    return jsonError("Learning data could not be saved.", 503);
  }
}
