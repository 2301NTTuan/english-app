import { getDb } from "@/db/client";
import { auditLogs, userStateSnapshots } from "@/db/schema";
import { currentUser } from "@/lib/auth/server";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { stateEnvelopeSchema } from "@/lib/validation/app-state";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  try {
    const user = await currentUser();
    if (!user) return jsonError("Authentication required.", 401);
    const parsed = stateEnvelopeSchema.safeParse(await readJson(request));
    if (!parsed.success || parsed.data.confirmLegacyImport !== true) return jsonError("Explicit import confirmation is required.", 400);
    await getDb().transaction(async (tx) => {
      await tx.insert(userStateSnapshots).values({ userId: user.id, schemaVersion: 1, state: parsed.data.state, importedLegacyAt: new Date(), updatedAt: new Date() })
        .onConflictDoUpdate({ target: userStateSnapshots.userId, set: { state: parsed.data.state, schemaVersion: 1, importedLegacyAt: new Date(), updatedAt: new Date() } });
      await tx.insert(auditLogs).values({ userId: user.id, action: "learning_state.legacy_imported", entityType: "user_state", entityId: user.id });
    });
    return NextResponse.json({ ok: true });
  } catch (error) { const bodyError = bodyErrorResponse(error); if (bodyError) return bodyError; return jsonError("Learning data could not be imported.", 503); }
}
