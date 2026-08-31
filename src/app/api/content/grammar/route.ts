import { currentUser } from "@/lib/auth/server";
import { jsonError } from "@/lib/auth/request";
import { queryGrammarCatalogue } from "@/lib/content/database";
import { logEvent } from "@/lib/observability/logger";

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return jsonError("Authentication required.", 401);
    return Response.json(await queryGrammarCatalogue());
  } catch {
    logEvent("error", "content.grammar_query_failed", { requestId: request.headers.get("x-request-id") });
    return jsonError("Grammar is temporarily unavailable.", 503);
  }
}
