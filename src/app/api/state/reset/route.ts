import { z } from "zod";
import { currentUser } from "@/lib/auth/server";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { resetLearningData } from "@/lib/learning/persistence";

const schema = z.object({ confirmation: z.literal("RESET") });

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  try {
    const user = await currentUser(); if (!user) return jsonError("Authentication required.", 401);
    const parsed = schema.safeParse(await readJson(request, 2_048)); if (!parsed.success) return jsonError("Explicit reset confirmation is required.", 400);
    return Response.json({ ok: true, state: await resetLearningData(user.id) });
  } catch (error) { const bodyError = bodyErrorResponse(error); if (bodyError) return bodyError; return jsonError("Learning data could not be reset.", 503); }
}
