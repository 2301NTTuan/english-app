import { randomUUID } from "node:crypto";
import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { vocabulary } from "@/data/vocabulary";
import { grammarTopics } from "@/data/grammar";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
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

  beforeAll(async () => {
    const databaseName = new URL(databaseUrl!).pathname.slice(1);
    if (!databaseName.includes("test")) throw new Error(`Refusing to run integration tests against non-test database: ${databaseName}`);
    process.env.DATABASE_URL = databaseUrl;
    await client.connect();
    ({ completeStudySession, completePlacement, importLegacyLearningState } = await import("@/lib/learning/persistence"));
    ({ issuePasswordReset, consumePasswordReset, issueEmailVerification, consumeEmailVerification } = await import("@/lib/auth/recovery"));
    ({ queryVocabularyPage } = await import("@/lib/content/database"));
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
    const result = await client.query("select to_regclass('public.users') users, to_regclass('public.user_state_snapshots') snapshots, to_regclass('public.email_verification_tokens') verification_tokens");
    expect(result.rows[0]).toEqual({ users: "users", snapshots: "user_state_snapshots", verification_tokens: "email_verification_tokens" });
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
    expect(counts.rows[0]).toEqual({ sessions: 1, items: 1, vocabulary_progress: 1, grammar_progress: 1, reviews: 2, review_count: 2, mistakes: 1, active_paths: 1 });
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
    state.placement = {
      completedAt: new Date().toISOString(), estimatedLevel: "B1", dimensionScores: { vocabulary: 70, grammar: 60, context: 65 },
      topicScores: { vocabulary: 70 }, strongAreas: ["vocabulary"], weakAreas: ["grammar"],
      answers: [{ questionId: "integration-question", answer: "answer", correct: true, level: "B1", dimension: "vocabulary", topic: "vocabulary" }],
    };
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
    expect(await consumeEmailVerification(token)).toBe(true);
    expect(await consumeEmailVerification(token)).toBe(false);
    const user = await client.query("select email_verified_at from users where id = $1", [userId]);
    expect(user.rows[0].email_verified_at).toBeInstanceOf(Date);
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
    expect(first.total).toBe(192);
    const level = await queryVocabularyPage({ level: "B2" });
    expect(level.items.length).toBeLessThanOrEqual(24);
    expect(level.items.every((item) => item.level === "B2")).toBe(true);
    const search = await queryVocabularyPage({ search: "acquire" });
    expect(search.items.some((item) => item.word.toLowerCase() === "acquire")).toBe(true);
    const topicName = first.items.find((item) => item.topics.length)?.topics[0];
    expect(topicName).toBeTruthy();
    const topic = await queryVocabularyPage({ topic: topicName });
    expect(topic.items.every((item) => item.topics.includes(topicName!))).toBe(true);
    expect(topic.filters.topic).toBe(topicName);
  });
});
