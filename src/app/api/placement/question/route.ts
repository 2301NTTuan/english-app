import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/client";
import { placementAnswers, placementAttempts } from "@/db/schema";
import { placementQuestions, publishedPlacementQuestions } from "@/data/placement";
import { readingPassagesById } from "@/data/placement-reading";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { currentUser } from "@/lib/auth/server";
import { consumeRateLimit, rateLimitKey } from "@/lib/auth/rate-limit";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { answerPlacementQuestion, placementShouldStop, scorePlacement, selectPlacementQuestion } from "@/lib/learning/placement";
import type { PlacementAnswer, PlacementQuestion } from "@/types/domain";

const requestSchema = z.object({ token: z.string().max(100_000).optional(), answer: z.string().max(2_000).optional(), responseTimeMs: z.number().int().nonnegative().max(3_600_000).optional() })
  .refine((value) => Boolean(value.token) === Boolean(value.answer), { message: "Token and answer must be supplied together." });
interface AttemptToken { issuedAt: number; currentQuestionId: string; answers: PlacementAnswer[]; previouslySeenQuestionIds: string[] }

const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");
const encode = (value: AttemptToken, secret: string) => { const payload = Buffer.from(JSON.stringify(value)).toString("base64url"); return `${payload}.${sign(payload, secret)}`; };
function decode(token: string, secret: string): AttemptToken | undefined {
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return undefined;
  const expected = sign(payload, secret);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return undefined;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AttemptToken;
    if (!Array.isArray(value.answers) || !Array.isArray(value.previouslySeenQuestionIds) || Date.now() - value.issuedAt > 2 * 60 * 60_000) return undefined;
    return value;
  } catch { return undefined; }
}

function publicQuestion(question: PlacementQuestion) {
  const passage = question.passageId ? readingPassagesById.get(question.passageId) : undefined;
  return { id: question.id, prompt: question.prompt, options: question.options ?? [], level: question.level, dimension: question.dimension, passage: passage ? { title: passage.title, text: passage.text } : undefined };
}

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  const limit = await consumeRateLimit(rateLimitKey(request, "placement-question"), 120, 30 * 60_000);
  if (!limit.allowed) return jsonError("Too many placement requests. Try again later.", 429, { "Retry-After": String(limit.retryAfter) });
  try {
    const user = await currentUser();
    if (!user) return jsonError("Authentication required.", 401);
    const sessionSecret = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!sessionSecret) return jsonError("Authentication required.", 401);
    const parsed = requestSchema.safeParse(await readJson(request, 120_000));
    if (!parsed.success) return jsonError("Invalid placement request.", 400);
    const preview = process.env.NODE_ENV !== "production" || process.env.PLACEMENT_CONTENT_CHANNEL === "validated-preview";
    const bank = preview ? placementQuestions : publishedPlacementQuestions;
    if (!bank.length) return jsonError("The reviewed placement bank is not published yet.", 503);

    let state: AttemptToken;
    if (!parsed.data.token) {
      const seenRows = await getDb().select({ questionId: placementAnswers.questionId }).from(placementAnswers)
        .innerJoin(placementAttempts, and(eq(placementAnswers.placementAttemptId, placementAttempts.id), eq(placementAttempts.userId, user.id)));
      const previouslySeenQuestionIds = [...new Set(seenRows.map((row) => row.questionId))];
      const first = selectPlacementQuestion(bank, [], { previouslySeenQuestionIds });
      if (!first) return jsonError("No eligible placement question is available.", 503);
      state = { issuedAt: Date.now(), currentQuestionId: first.id, answers: [], previouslySeenQuestionIds };
      return Response.json({ token: encode(state, sessionSecret), question: publicQuestion(first), answeredCount: 0 });
    }

    const verified = decode(parsed.data.token, sessionSecret);
    if (!verified) return jsonError("Placement attempt expired or was modified.", 400);
    const current = bank.find((question) => question.id === verified.currentQuestionId);
    if (!current || verified.answers.some((answer) => answer.questionId === current.id)) return jsonError("Placement question is no longer eligible.", 409);
    const answers = [...verified.answers, answerPlacementQuestion(current, parsed.data.answer!, parsed.data.responseTimeMs)];
    const next = selectPlacementQuestion(bank, answers, { previouslySeenQuestionIds: verified.previouslySeenQuestionIds });
    if (placementShouldStop(answers, Boolean(next))) return Response.json({ result: scorePlacement(answers), answeredCount: answers.length });
    if (!next) return jsonError("The placement bank cannot satisfy the assessment contract.", 503);
    state = { ...verified, currentQuestionId: next.id, answers };
    return Response.json({ token: encode(state, sessionSecret), question: publicQuestion(next), answeredCount: answers.length });
  } catch (error) {
    const bodyError = bodyErrorResponse(error); if (bodyError) return bodyError;
    return jsonError("Placement questions are temporarily unavailable.", 503);
  }
}
