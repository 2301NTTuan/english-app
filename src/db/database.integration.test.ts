import { createHash, randomUUID } from "node:crypto";
import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { vocabulary } from "@/data/vocabulary";
import { grammarTopics } from "@/data/grammar";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { isEmailUniqueViolation } from "@/lib/auth/registration";
import { scorePlacement } from "@/lib/learning/placement";
import { createEmptyAccountState } from "@/lib/storage/app-repository";
import type { AppState, ReviewState } from "@/types/domain";

vi.mock("server-only", () => ({}));

const databaseUrl = process.env.TEST_DATABASE_URL;
const suite = databaseUrl ? describe : describe.skip;
suite("PostgreSQL migration and ownership", () => {
  const client = new Client({ connectionString: databaseUrl });
  const userIds: string[] = [];
  let completeStudySession: typeof import("@/lib/learning/persistence")["completeStudySession"];
  let completePlacement: typeof import("@/lib/learning/persistence")["completePlacement"];
  let importLegacyLearningState: typeof import("@/lib/learning/persistence")["importLegacyLearningState"];
  let issuePasswordReset: typeof import("@/lib/auth/recovery")["issuePasswordReset"];
  let consumePasswordReset: typeof import("@/lib/auth/recovery")["consumePasswordReset"];
  let issueEmailVerification: typeof import("@/lib/auth/recovery")["issueEmailVerification"];
  let consumeEmailVerification: typeof import("@/lib/auth/recovery")["consumeEmailVerification"];
  let queryVocabularyPage: typeof import("@/lib/content/database")["queryVocabularyPage"];
  let queryExpressionsPage: typeof import("@/lib/content/database")["queryExpressionsPage"];
  let queryGrammarCatalogue: typeof import("@/lib/content/database")["queryGrammarCatalogue"];
  let queryGrammarLesson: typeof import("@/lib/content/database")["queryGrammarLesson"];
  let queryPlacementBank: typeof import("@/lib/content/database")["queryPlacementBank"];
  let loadLearningState: typeof import("@/lib/learning/state-projection")["loadLearningState"];
  let saveLearningPreferences: typeof import("@/lib/learning/persistence")["saveLearningPreferences"];
  let resetLearningData: typeof import("@/lib/learning/persistence")["resetLearningData"];
  let consumeRateLimit: typeof import("@/lib/auth/rate-limit")["consumeRateLimit"];
  let registerAccount: typeof import("@/lib/auth/account")["registerAccount"];
  let prepareVerificationResend: typeof import("@/lib/auth/account")["prepareVerificationResend"];
  let verifyCredentials: typeof import("@/lib/auth/account")["verifyCredentials"];
  let createDatabaseSession: typeof import("@/lib/auth/server")["createDatabaseSession"];
  let verifiedUserForSessionToken: typeof import("@/lib/auth/server")["verifiedUserForSessionToken"];

  beforeAll(async () => {
    const databaseName = new URL(databaseUrl!).pathname.slice(1);
    if (!databaseName.includes("test")) throw new Error(`Refusing to run integration tests against non-test database: ${databaseName}`);
    process.env.DATABASE_URL = databaseUrl;
    await client.connect();
    ({ completeStudySession, completePlacement, importLegacyLearningState, saveLearningPreferences, resetLearningData } = await import("@/lib/learning/persistence"));
    ({ loadLearningState } = await import("@/lib/learning/state-projection"));
    ({ issuePasswordReset, consumePasswordReset, issueEmailVerification, consumeEmailVerification } = await import("@/lib/auth/recovery"));
    ({ queryVocabularyPage, queryExpressionsPage, queryGrammarCatalogue, queryGrammarLesson, queryPlacementBank } = await import("@/lib/content/database"));
    ({ consumeRateLimit } = await import("@/lib/auth/rate-limit"));
    ({ registerAccount, prepareVerificationResend, verifyCredentials } = await import("@/lib/auth/account"));
    ({ createDatabaseSession, verifiedUserForSessionToken } = await import("@/lib/auth/server"));
  });
  afterAll(async () => {
    if (userIds.length) await client.query("delete from users where id = any($1::uuid[])", [userIds]);
    const { getPool } = await import("@/db/client");
    await getPool().end();
    await client.end();
  });

  async function createUser(passwordHash = "hash") {
    const id = randomUUID();
    userIds.push(id);
    await client.query("insert into users (id,name,email,password_hash) values ($1,'Integration',$2,$3)", [id, `${id}@test.invalid`, passwordHash]);
    return id;
  }

  const review = (): ReviewState => ({ difficulty: 5, stability: 3, state: "review", lastReview: new Date(Date.now() - 86_400_000).toISOString(), nextReview: new Date(Date.now() + 86_400_000).toISOString(), scheduledDays: 1, elapsedDays: 1, reviewCount: 2, correctCount: 1, incorrectCount: 1, lapses: 1 });
  const learningState = (): AppState => {
    const state = createEmptyAccountState();
    const item = vocabulary[0];
    const grammar = grammarTopics[0];
    return {
      ...state,
      vocabularyProgress: [{ itemId: item.id, mastery: { recognition: 62, recall: 54, context: 58, spelling: 49, overall: 56 }, review: review() }],
      grammarProgress: [{ topicId: grammar.id, mastery: 61, subtopicMastery: Object.fromEntries(grammar.subtopics.map((subtopic) => [subtopic.id, 61])), review: review() }],
      mistakes: [{ id: randomUUID(), itemId: item.id, label: `Recall ${item.word}`, knowledgeType: "vocabulary", exerciseType: "recall", wrongAnswer: "wrong", correctAnswer: item.word, timestamp: new Date().toISOString(), repeatedCount: 1, resolved: false }],
      activities: [{ id: randomUUID(), date: new Date().toISOString(), label: "Integration session", correct: 1, total: 1, minutes: 1, vocabularyReviewed: 1, newVocabulary: 0, grammarExercises: 0, mistakesCorrected: 0 }],
    };
  };

  it("has the expected migrated tables", async () => {
    const result = await client.query("select to_regclass('users') users, to_regclass('user_state_snapshots') snapshots, to_regclass('email_verification_tokens') verification_tokens, to_regclass('auth_rate_limits') rate_limits");
    expect(result.rows[0]).toEqual({ users: "users", snapshots: "user_state_snapshots", verification_tokens: "email_verification_tokens", rate_limits: "auth_rate_limits" });
  });

  it("enforces one atomic rate limit across concurrent workers", async () => {
    const originalBackend = process.env.RATE_LIMIT_BACKEND;
    const key = `integration:${randomUUID()}`;
    try {
      process.env.RATE_LIMIT_BACKEND = "postgres";
      const results = await Promise.all(Array.from({ length: 8 }, () => consumeRateLimit(key, 3, 60_000)));
      expect(results.filter((result) => result.allowed)).toHaveLength(3);
      expect(results.filter((result) => !result.allowed)).toHaveLength(5);
      const stored = await client.query("select count from auth_rate_limits where key_hash = $1", [createHash("sha256").update(key).digest("hex")]);
      expect(stored.rows[0]?.count).toBe(8);
    } finally {
      if (originalBackend === undefined) delete process.env.RATE_LIMIT_BACKEND; else process.env.RATE_LIMIT_BACKEND = originalBackend;
      await client.query("delete from auth_rate_limits where key_hash = $1", [createHash("sha256").update(key).digest("hex")]);
    }
  });
  it("keeps account data isolated and cascades dependent data", async () => {
    await client.query("begin");
    try {
      const one = randomUUID(); const two = randomUUID();
      await client.query("insert into users (id,name,email,password_hash) values ($1,'One',$2,'hash'),($3,'Two',$4,'hash')", [one, `${one}@test.invalid`, two, `${two}@test.invalid`]);
      await client.query("insert into user_state_snapshots (user_id,state) values ($1,$2),($3,$4)", [one, JSON.stringify({ owner: one }), two, JSON.stringify({ owner: two })]);
      const scoped = await client.query("select state from user_state_snapshots where user_id = $1", [one]); expect(scoped.rowCount).toBe(1); expect(scoped.rows[0].state.owner).toBe(one);
      await client.query("delete from users where id = $1", [one]); const dependent = await client.query("select 1 from user_state_snapshots where user_id = $1", [one]); expect(dependent.rowCount).toBe(0);
    } finally { await client.query("rollback"); }
  });

  it("enforces normalized email, mastery, preference, foreign-key, and content constraints", async () => {
    const userId = await createUser();
    await expect(client.query("insert into users (name,email,password_hash) values ('Invalid','UPPER@test.invalid','hash')")).rejects.toMatchObject({ code: "23514" });
    await expect(client.query("insert into users (name,email,password_hash) values ('Duplicate',$1,'hash')", [`${userId}@test.invalid`])).rejects.toMatchObject({ code: "23505" });
    await expect(client.query("insert into learning_preferences (user_id,daily_target) values ($1,99)", [userId])).rejects.toMatchObject({ code: "23514" });
    await expect(client.query("insert into user_state_snapshots (user_id,state) values ($1,'{}')", [randomUUID()])).rejects.toMatchObject({ code: "23503" });
    const content = await client.query("select id from vocabulary_content limit 1");
    await expect(client.query("insert into vocabulary_progress (user_id,vocabulary_id,overall) values ($1,$2,101)", [userId, content.rows[0].id])).rejects.toMatchObject({ code: "23514" });
    await expect(client.query("insert into vocabulary_content (content_id,word,part_of_speech,level) values ('v1','Duplicate','noun','A1')")).rejects.toMatchObject({ code: "23505" });
  });

  it("commits a normalized study session once for an idempotency key", async () => {
    const userId = await createUser();
    const state = learningState();
    const startedAt = new Date(Date.now() - 60_000).toISOString();
    const input = {
      idempotencyKey: randomUUID(), startedAt, completedAt: new Date().toISOString(), state,
      items: [{ knowledgeType: "vocabulary" as const, knowledgeContentId: state.vocabularyProgress[0].itemId, exerciseType: "recall", answer: "answer", correct: true, rating: "good" as const, position: 0 }],
    };
    expect(await completeStudySession(userId, input)).toMatchObject({ duplicate: false });
    expect(await completeStudySession(userId, input)).toEqual({ duplicate: true });
    const counts = await client.query(`select
      (select count(*)::int from study_sessions where user_id = $1) sessions,
      (select count(*)::int from study_session_items i join study_sessions s on s.id=i.study_session_id where s.user_id = $1) items,
      (select count(*)::int from vocabulary_progress where user_id = $1) vocabulary_progress,
      (select count(*)::int from grammar_progress where user_id = $1) grammar_progress,
      (select count(*)::int from review_states where user_id = $1) reviews,
      (select review_count from review_states where user_id = $1 and knowledge_type = 'vocabulary') review_count,
      (select count(*)::int from mistakes where user_id = $1) mistakes,
      (select count(*)::int from learning_paths where user_id = $1 and active) active_paths`, [userId]);
    expect(counts.rows[0]).toEqual({ sessions: 1, items: 1, vocabulary_progress: 1, grammar_progress: 0, reviews: 1, review_count: 2, mistakes: 1, active_paths: 1 });
  });

  it("keeps normalized learning events authoritative across stale-device saves and conflicts", async () => {
    const userId = await createUser(); const state = learningState(); const startedAt = new Date(Date.now() - 60_000).toISOString();
    const item = { knowledgeType: "vocabulary" as const, knowledgeContentId: state.vocabularyProgress[0].itemId, exerciseType: "recall", answer: "answer", correct: true, rating: "good" as const, position: 0 };
    await completeStudySession(userId, { idempotencyKey: randomUUID(), startedAt, completedAt: new Date().toISOString(), state, items: [item] });
    const stale = createEmptyAccountState(); stale.settings.dailyTarget = 40;
    await saveLearningPreferences(userId, stale);
    const projected = await loadLearningState(userId);
    expect(projected.settings.dailyTarget).toBe(40);
    expect(projected.vocabularyProgress).toHaveLength(1);
    expect(projected.vocabularyProgress[0].review.reviewCount).toBe(2);
    expect(projected.mistakes).toHaveLength(1);
    await expect(completeStudySession(userId, { idempotencyKey: randomUUID(), startedAt, completedAt: new Date().toISOString(), state, items: [item] })).rejects.toThrow("another device");
    const counts = await client.query("select (select count(*)::int from study_sessions where user_id=$1) sessions, (select review_count from review_states where user_id=$1) review_count", [userId]);
    expect(counts.rows[0]).toEqual({ sessions: 1, review_count: 2 });
    const reset = await resetLearningData(userId); expect(reset.vocabularyProgress).toEqual([]);
    const afterReset = await loadLearningState(userId); expect(afterReset).toMatchObject({ vocabularyProgress: [], grammarProgress: [], mistakes: [], activities: [] });
  });

  it("rolls back the session when normalized content validation fails", async () => {
    const userId = await createUser();
    const state = learningState();
    state.vocabularyProgress[0].itemId = `missing-${randomUUID()}`;
    const idempotencyKey = randomUUID();
    await expect(completeStudySession(userId, {
      idempotencyKey, startedAt: new Date(Date.now() - 60_000).toISOString(), completedAt: new Date().toISOString(), state,
      items: [{ knowledgeType: "vocabulary", knowledgeContentId: state.vocabularyProgress[0].itemId, exerciseType: "recall", answer: "answer", correct: false, rating: "again", position: 0 }],
    })).rejects.toThrow("Unknown content references");
    const result = await client.query(`select
      (select count(*)::int from study_sessions where user_id = $1) sessions,
      (select count(*)::int from vocabulary_progress where user_id = $1) progress,
      (select count(*)::int from review_states where user_id = $1) reviews,
      (select count(*)::int from mistakes where user_id = $1) mistakes`, [userId]);
    expect(result.rows[0]).toEqual({ sessions: 0, progress: 0, reviews: 0, mistakes: 0 });
  });

  it("persists placement answers and replaces the active path atomically", async () => {
    const userId = await createUser();
    const state = learningState();
    state.placement = scorePlacement([{ questionId: "integration-question", answer: "answer", correct: true, level: "B1", dimension: "vocabulary", topic: "vocabulary" }]);
    const input = { idempotencyKey: randomUUID(), startedAt: new Date(Date.now() - 120_000).toISOString(), state };
    expect(await completePlacement(userId, input)).toMatchObject({ duplicate: false });
    expect(await completePlacement(userId, input)).toEqual({ duplicate: true });
    const counts = await client.query(`select
      (select count(*)::int from placement_attempts where user_id = $1) attempts,
      (select count(*)::int from placement_answers a join placement_attempts p on p.id=a.placement_attempt_id where p.user_id = $1) answers,
      (select count(*)::int from learning_paths where user_id = $1 and active) active_paths`, [userId]);
    expect(counts.rows[0]).toEqual({ attempts: 1, answers: 1, active_paths: 1 });
  });

  it("enforces the complete password-reset lifecycle without exposing unknown accounts", async () => {
    const oldPassword = "OldPassword1234"; const newPassword = "NewPassword5678";
    const userId = await createUser(await hashPassword(oldPassword));
    const email = `${userId}@test.invalid`;
    await client.query("insert into auth_sessions (token_hash,user_id,expires_at) values ($1,$2,now() + interval '1 day')", [randomUUID(), userId]);

    expect(await issuePasswordReset(`unknown-${randomUUID()}@test.invalid`)).toBeNull();
    expect(await consumePasswordReset(randomUUID(), newPassword)).toBe(false);
    const expired = await issuePasswordReset(email, new Date(Date.now() - 120_000), 60_000);
    expect(expired).toBeTruthy();
    expect(await consumePasswordReset(expired!, newPassword)).toBe(false);

    const token = await issuePasswordReset(email);
    expect(token).toBeTruthy();
    const stored = await client.query("select token_hash from password_reset_tokens where user_id = $1 and used_at is null", [userId]);
    expect(stored.rowCount).toBe(1);
    expect(stored.rows[0].token_hash).not.toBe(token);
    expect(await consumePasswordReset(token!, newPassword)).toBe(true);
    expect(await consumePasswordReset(token!, "AnotherPassword9012")).toBe(false);

    const account = await client.query("select password_hash from users where id = $1", [userId]);
    expect(await verifyPassword(oldPassword, account.rows[0].password_hash)).toBe(false);
    expect(await verifyPassword(newPassword, account.rows[0].password_hash)).toBe(true);
    const sessions = await client.query("select count(*)::int count from auth_sessions where user_id = $1", [userId]);
    expect(sessions.rows[0].count).toBe(0);
  });

  it("stores email-verification tokens hashed, expiring, and single-use", async () => {
    const userId = await createUser();
    const token = await issueEmailVerification(userId);
    const stored = await client.query("select token_hash from email_verification_tokens where user_id = $1 and used_at is null", [userId]);
    expect(stored.rows[0].token_hash).not.toBe(token);
    expect(await consumeEmailVerification(token)).toBe("verified");
    expect(await consumeEmailVerification(token)).toBe("already-verified");
    const user = await client.query("select email_verified_at from users where id = $1", [userId]);
    expect(user.rows[0].email_verified_at).toBeInstanceOf(Date);
  });

  it("creates an unverified account and token atomically without a learning session", async () => {
    const email = `registration-${randomUUID()}@test.invalid`;
    const password = "RegistrationPass1234";
    const account = await registerAccount({ name: "  Registration Test  ", email: email.toUpperCase(), password });
    userIds.push(account.userId);

    const state = await client.query(`select
      u.name, u.email, u.email_verified_at,
      (select count(*)::int from learning_preferences where user_id = u.id) preferences,
      (select count(*)::int from user_state_snapshots where user_id = u.id) snapshots,
      (select count(*)::int from auth_sessions where user_id = u.id) sessions,
      (select count(*)::int from email_verification_tokens where user_id = u.id and used_at is null) verification_tokens
      from users u where u.id = $1`, [account.userId]);
    expect(state.rows[0]).toEqual({ name: "Registration Test", email, email_verified_at: null, preferences: 1, snapshots: 1, sessions: 0, verification_tokens: 1 });
    const stored = await client.query("select token_hash from email_verification_tokens where user_id = $1", [account.userId]);
    expect(stored.rows[0].token_hash).not.toBe(account.verificationToken);
    expect(await verifyCredentials(email, password)).toEqual({ status: "unverified", userId: account.userId });

    const staleToken = randomUUID();
    await client.query("insert into auth_sessions (token_hash,user_id,expires_at) values ($1,$2,now() + interval '1 day')", [createHash("sha256").update(staleToken).digest("hex"), account.userId]);
    expect(await verifiedUserForSessionToken(staleToken)).toBeNull();

    expect(await consumeEmailVerification(account.verificationToken)).toBe("verified");
    expect(await verifyCredentials(email, password)).toEqual({ status: "verified", userId: account.userId });
    const liveToken = await createDatabaseSession(account.userId);
    expect(await verifiedUserForSessionToken(liveToken)).toMatchObject({ id: account.userId, email });
  });

  it("allows only one normalized account across concurrent case and whitespace variants", async () => {
    const localPart = `race-${randomUUID()}`;
    const normalizedEmail = `${localPart}@test.invalid`;
    const attempts = await Promise.allSettled([
      registerAccount({ name: "Race One", email: `  ${localPart.toUpperCase()}@TEST.INVALID  `, password: "RegistrationPass1234" }),
      registerAccount({ name: "Race Two", email: normalizedEmail, password: "RegistrationPass1234" }),
    ]);
    const successes = attempts.filter((attempt): attempt is PromiseFulfilledResult<Awaited<ReturnType<typeof registerAccount>>> => attempt.status === "fulfilled");
    const failures = attempts.filter((attempt): attempt is PromiseRejectedResult => attempt.status === "rejected");
    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(1);
    expect(isEmailUniqueViolation(failures[0].reason)).toBe(true);
    userIds.push(successes[0].value.userId);

    const stored = await client.query("select email from users where email = $1", [normalizedEmail]);
    expect(stored.rows).toEqual([{ email: normalizedEmail }]);
  });

  it("rejects expired verification links and safely replaces resend tokens", async () => {
    const userId = await createUser();
    const email = `${userId}@test.invalid`;
    const expired = await issueEmailVerification(userId, new Date(Date.now() - 120_000), 60_000);
    expect(await consumeEmailVerification(expired)).toBe("expired");
    const first = await prepareVerificationResend(email);
    const second = await prepareVerificationResend(email);
    expect(first?.token).toBeTruthy();
    expect(second?.token).toBeTruthy();
    expect(await consumeEmailVerification(first!.token)).toBe("invalid");
    expect(await consumeEmailVerification(second!.token)).toBe("verified");
    expect(await prepareVerificationResend(email)).toBeNull();
    expect(await prepareVerificationResend(`unknown-${randomUUID()}@test.invalid`)).toBeNull();
  });

  it("imports validated legacy state transactionally without duplicating normalized progress", async () => {
    const userId = await createUser();
    const state = learningState();
    await importLegacyLearningState(userId, state);
    await importLegacyLearningState(userId, state);
    const counts = await client.query(`select
      (select count(*)::int from user_state_snapshots where user_id = $1) snapshots,
      (select count(*)::int from vocabulary_progress where user_id = $1) vocabulary_progress,
      (select count(*)::int from grammar_progress where user_id = $1) grammar_progress,
      (select count(*)::int from mistakes where user_id = $1) mistakes`, [userId]);
    expect(counts.rows[0]).toEqual({ snapshots: 1, vocabulary_progress: 1, grammar_progress: 1, mistakes: 1 });
  });

  it("paginates database vocabulary with preserved CEFR, search, and topic filters", async () => {
    const first = await queryVocabularyPage({ page: 1, pageSize: 24 });
    expect(first.items).toHaveLength(24);
    expect(first.total).toBe(6_000);
    const level = await queryVocabularyPage({ level: "B2" });
    expect(level.items.length).toBeLessThanOrEqual(24);
    expect(level.items.every((item) => item.level === "B2")).toBe(true);
    const search = await queryVocabularyPage({ search: "acquire" });
    expect(search.items.some((item) => item.word.toLowerCase() === "acquire")).toBe(true);
    const expandedSearch = await queryVocabularyPage({ search: "zoology" });
    expect(expandedSearch.items.some((item) => item.id === "master-zoology-noun")).toBe(true);
    const topicName = first.items.find((item) => item.topics.length)?.topics[0];
    expect(topicName).toBeTruthy();
    const topic = await queryVocabularyPage({ topic: topicName });
    expect(topic.items.every((item) => item.topics.includes(topicName!))).toBe(true);
    expect(topic.filters.topic).toBe(topicName);
    const frequency = await queryVocabularyPage({ frequencyBand: "very-common" });
    expect(frequency.items.length).toBeGreaterThan(0);
    expect(frequency.items.every((item) => item.frequencyBand === "very-common")).toBe(true);
    expect(frequency.filters.frequencyBand).toBe("very-common");
    const metadata = await client.query("select count(*) filter (where frequency_rank is not null)::int exact_ranks, count(*) filter (where status = 'validated')::int validated, count(*) filter (where active)::int active, count(*) filter (where provenance_id = 'vocabulary-core-2026-08')::int core, count(*) filter (where provenance_id = 'vocabulary-foundations-001-2026-08')::int foundations, (select published_at from content_versions where version = 'bundled-v1') published_at from vocabulary_content");
    expect(metadata.rows[0]).toEqual({ exact_ranks: 4_130, validated: 6_000, active: 6_000, core: 192, foundations: 106, published_at: null });
  });

  it("keeps production publication strict unless validated-preview is explicit", async () => {
    try {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("CONTENT_RELEASE_CHANNEL", "");
      expect(await queryVocabularyPage({ page: 1, pageSize: 24 })).toMatchObject({ items: [], total: 0, page: 1, pageSize: 24 });

      vi.stubEnv("CONTENT_RELEASE_CHANNEL", "validated-preview");
      const preview = await queryVocabularyPage({ page: 2, pageSize: 24 });
      expect(preview.items).toHaveLength(24);
      expect(preview.total).toBe(6_000);
      expect(preview.pageCount).toBe(250);
      expect(preview.items[0].id).not.toBe((await queryVocabularyPage({ page: 1, pageSize: 24 })).items[0].id);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("serves the complete seeded grammar catalogue outside the former detailed subset", async () => {
    const catalogue = await queryGrammarCatalogue();
    expect(catalogue.total).toBe(138);
    expect(catalogue.byLevel).toEqual({ A1: 24, A2: 24, B1: 26, B2: 25, C1: 24, C2: 15 });
    expect(catalogue.items.map((item) => item.id)).toEqual(grammarTopics.map((item) => item.id));
    expect(catalogue.items.find((item) => item.id === "advanced-cohesive-devices")).toMatchObject({ id: "advanced-cohesive-devices", level: "C2" });
    expect(catalogue.items.find((item) => item.id === "advanced-cohesive-devices")?.examples).toHaveLength(3);
    expect(await queryGrammarLesson("advanced-cohesive-devices")).toMatchObject({ id: "advanced-cohesive-devices", title: "Advanced cohesive devices", level: "C2" });
    expect(await queryGrammarLesson("not-a-real-lesson")).toBeUndefined();
    const counts = await client.query(`select
      (select count(*)::int from grammar_topics where active) topics,
      (select count(*)::int from grammar_lessons l join grammar_topics t on t.id=l.grammar_topic_id where t.active) lessons`);
    expect(counts.rows[0]).toEqual({ topics: 138, lessons: 138 });
  });

  it("paginates and searches the complete seeded Expressions corpus", async () => {
    const first = await queryExpressionsPage({ page: 1, pageSize: 24 });
    expect(first.items).toHaveLength(24);
    expect(first.corpus.total).toBe(1_621);
    expect(first.corpus.byKind).toEqual({ idiom: 303, "phrasal-verb": 310, collocation: 1_001, "common-expression": 7 });
    expect(first.corpus.byLevel).toEqual({ A1: 115, A2: 245, B1: 414, B2: 573, C1: 268, C2: 6 });
    const phrasal = await queryExpressionsPage({ kind: "phrasal-verb", level: "C1" });
    expect(phrasal.items.length).toBeGreaterThan(0);
    expect(phrasal.items.every((item) => item.kind === "phrasal-verb" && item.cefrLevel === "C1")).toBe(true);
    const expanded = await queryExpressionsPage({ search: "legally binding" });
    expect(expanded.items).toHaveLength(1);
    expect(expanded.items[0]).toMatchObject({ id: "collocation-legally-binding", expression: "legally binding", status: "validated" });
    const counts = await client.query(`select
      (select count(*)::int from expressions where active) expressions,
      (select count(*)::int from expressions where active and status = 'validated') validated,
      (select count(*)::int from collocations where active) collocations`);
    expect(counts.rows[0]).toEqual({ expressions: 1_621, validated: 1_621, collocations: 1_001 });
  });

  it("serves the complete validated placement bank and reading passages from PostgreSQL", async () => {
    const bank = await queryPlacementBank();
    expect(bank.items).toHaveLength(612);
    expect(bank.passages).toHaveLength(22);
    expect(bank.items.filter((item) => item.dimension === "vocabulary")).toHaveLength(210);
    expect(bank.items.filter((item) => item.dimension === "grammar")).toHaveLength(200);
    expect(bank.items.filter((item) => item.dimension === "context")).toHaveLength(120);
    expect(bank.items.filter((item) => item.dimension === "reading")).toHaveLength(82);
    expect(bank.items.some((item) => item.id === "placement-reading-c2-metrics-4")).toBe(true);
    expect(bank.passages.some((passage) => passage.id === "reading-c2-metrics")).toBe(true);
  });
});
