import { z } from "zod";
import { currentUser } from "@/lib/auth/server";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { resolveMistake } from "@/lib/learning/persistence";

const schema = z.object({ mistakeId: z.string().uuid() });

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  try {
    const user = await currentUser(); if (!user) return jsonError("Authentication required.", 401);
    const parsed = schema.safeParse(await readJson(request, 2_048)); if (!parsed.success) return jsonError("Invalid mistake identifier.", 400);
    if (!await resolveMistake(user.id, parsed.data.mistakeId)) return jsonError("Mistake not found.", 404);
    return Response.json({ ok: true });
  } catch (error) { const bodyError = bodyErrorResponse(error); if (bodyError) return bodyError; return jsonError("Mistake could not be updated.", 503); }
}
