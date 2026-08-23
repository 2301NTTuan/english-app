import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { userStateSnapshots } from "@/db/schema";
import { currentUser } from "@/lib/auth/server";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { saveLearningState } from "@/lib/learning/persistence";
import { appStateSchema, stateEnvelopeSchema } from "@/lib/validation/app-state";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return jsonError("Authentication required.", 401);
    const [snapshot] = await getDb().select({ state: userStateSnapshots.state, updatedAt: userStateSnapshots.updatedAt }).from(userStateSnapshots).where(eq(userStateSnapshots.userId, user.id)).limit(1);
    if (!snapshot) return jsonError("Learning state not found.", 404);
    const parsed = appStateSchema.safeParse(snapshot.state);
    if (!parsed.success) return jsonError("Stored learning state is invalid.", 500);
    return NextResponse.json({ state: parsed.data, updatedAt: snapshot.updatedAt });
  } catch { return jsonError("Learning data is temporarily unavailable.", 503); }
}

export async function PUT(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  try {
    const user = await currentUser();
    if (!user) return jsonError("Authentication required.", 401);
    const parsed = stateEnvelopeSchema.safeParse(await readJson(request));
    if (!parsed.success) return jsonError("Invalid learning state.", 400);
    await saveLearningState(user.id, parsed.data.state);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const bodyError = bodyErrorResponse(error); if (bodyError) return bodyError;
    return jsonError("Learning data could not be saved.", 503);
  }
}
