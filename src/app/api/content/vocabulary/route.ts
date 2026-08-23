import { z } from "zod";
import { currentUser } from "@/lib/auth/server";
import { jsonError } from "@/lib/auth/request";
import { queryVocabularyPage } from "@/lib/content/database";
import { logEvent } from "@/lib/observability/logger";

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1), pageSize: z.coerce.number().int().positive().max(24).default(24),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
  search: z.string().trim().max(100).optional(), topic: z.string().trim().max(100).optional(), partOfSpeech: z.string().trim().max(80).optional(),
});

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return jsonError("Authentication required.", 401);
    const url = new URL(request.url);
    const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!parsed.success) return jsonError("Invalid vocabulary query.", 400);
    return Response.json(await queryVocabularyPage(parsed.data));
  } catch {
    logEvent("error", "content.vocabulary_query_failed", { requestId: request.headers.get("x-request-id") });
    return jsonError("Vocabulary is temporarily unavailable.", 503);
  }
}
