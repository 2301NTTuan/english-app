import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { currentUser, queryGrammarCatalogue, queryVocabularyPage, logEvent } = vi.hoisted(() => ({
  currentUser: vi.fn(),
  queryGrammarCatalogue: vi.fn(),
  queryVocabularyPage: vi.fn(),
  logEvent: vi.fn(),
}));
vi.mock("@/lib/auth/server", () => ({ currentUser }));
vi.mock("@/lib/content/database", () => ({ queryGrammarCatalogue, queryVocabularyPage }));
vi.mock("@/lib/observability/logger", () => ({ logEvent }));

import { GET as getGrammar } from "./grammar/route";
import { GET as getVocabulary } from "./vocabulary/route";

describe("content catalogue routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentUser.mockResolvedValue({ id: "user-1" });
  });

  it("returns a populated, paginated vocabulary response", async () => {
    const payload = { items: [{ id: "word-1" }], page: 2, pageSize: 24, total: 6_000, pageCount: 250 };
    queryVocabularyPage.mockResolvedValue(payload);
    const response = await getVocabulary(new Request("https://app.test/api/content/vocabulary?page=2&pageSize=24&level=B2"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(payload);
    expect(queryVocabularyPage).toHaveBeenCalledWith(expect.objectContaining({ page: 2, pageSize: 24, level: "B2" }));
  });

  it("returns a service error instead of a false empty vocabulary result", async () => {
    queryVocabularyPage.mockRejectedValue(new Error("database unavailable"));
    const request = new Request("https://app.test/api/content/vocabulary", { headers: { "x-request-id": "request-123" } });
    const response = await getVocabulary(request);
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "Vocabulary is temporarily unavailable." });
    expect(logEvent).toHaveBeenCalledWith("error", "content.vocabulary_query_failed", { requestId: "request-123" });
  });

  it("returns the grammar catalogue and rejects unauthenticated access", async () => {
    const payload = { items: [{ id: "be" }], total: 1, byLevel: { A1: 1 } };
    queryGrammarCatalogue.mockResolvedValue(payload);
    const success = await getGrammar(new Request("https://app.test/api/content/grammar"));
    expect(success.status).toBe(200);
    expect(await success.json()).toEqual(payload);

    currentUser.mockResolvedValue(null);
    const unauthorized = await getVocabulary(new Request("https://app.test/api/content/vocabulary"));
    expect(unauthorized.status).toBe(401);
    expect(queryVocabularyPage).not.toHaveBeenCalled();
  });
});
