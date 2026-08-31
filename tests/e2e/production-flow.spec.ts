import AxeBuilder from "@axe-core/playwright";
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { createHash, randomBytes } from "node:crypto";
import { Client } from "pg";
import { buildStudySession } from "../../src/lib/learning/session";
import type { AppState, SessionExercise } from "../../src/types/domain";

const nonce = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const userA = { name: "Production Flow A", email: `flow-a-${nonce}@test.invalid`, password: "ProductionFlow1234" };
const userB = { name: "Production Flow B", email: `flow-b-${nonce}@test.invalid`, password: "ProductionFlow5678" };

function sessionAnswerMap(session: SessionExercise[]) {
  const answers = new Map<string, string>();
  const key = (prompt: string, options: string[]) => `${prompt}\u0000${[...options].sort().join("\u0000")}`;
  const add = (exercise: Pick<SessionExercise, "prompt" | "options" | "answer">) => {
    if (!exercise.options) throw new Error(`Generated session exercise has no options: ${exercise.prompt}`);
    const exerciseKey = key(exercise.prompt, exercise.options);
    const existing = answers.get(exerciseKey);
    if (existing && existing !== exercise.answer) throw new Error(`Ambiguous generated session choices: ${exercise.prompt}`);
    answers.set(exerciseKey, exercise.answer);
  };
  session.forEach(add);
  return answers;
}

async function register(page: Page, user: typeof userA) {
  await page.goto("/register");
  await page.getByLabel("Name").fill(user.name);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill(user.password);
  await page.getByLabel("Confirm password").fill(user.password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/placement$/);
}

async function deleteAccount(page: Page, password: string) {
  await page.goto("/settings");
  await page.getByLabel("Type DELETE").fill("DELETE");
  await page.getByLabel("Current password").fill(password);
  await page.getByRole("button", { name: "Delete account" }).click();
  await expect(page).toHaveURL(/\/register$/);
}

async function assertNoSeriousAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
}

async function installOneTimeToken(email: string, table: "email_verification_tokens" | "password_reset_tokens") {
  const token = randomBytes(32).toString("hex");
  const database = new Client({ connectionString: process.env.DATABASE_URL }); await database.connect();
  try {
    const user = await database.query<{ id: string }>("select id from users where email = $1", [email]);
    const userId = user.rows[0]?.id; if (!userId) throw new Error("E2E account was not created.");
    await database.query(`delete from ${table} where user_id = $1`, [userId]);
    await database.query(`insert into ${table} (token_hash,user_id,expires_at) values ($1,$2,now() + interval '1 hour')`, [createHash("sha256").update(token).digest("hex"), userId]);
  } finally { await database.end(); }
  return token;
}

test.describe.serial("production acceptance", () => {
  test("persists the full placement, learning, mistake, review, and relogin flow", async ({ page }) => {
    const consoleErrors: string[] = []; const failedRequests: string[] = [];
    await register(page, userA);
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("requestfailed", (request) => failedRequests.push(`${request.failure()?.errorText ?? "failed"} ${request.url()}`));
    const verificationToken = await installOneTimeToken(userA.email, "email_verification_tokens");
    await page.goto(`/verify-email?token=${verificationToken}`);
    await expect(page.getByText("Your email is verified.")).toBeVisible();
    await page.getByRole("link", { name: "Continue to placement" }).click();
    await assertNoSeriousAccessibilityViolations(page);

    const firstQuestionResponse = page.waitForResponse((response) => response.url().includes("/api/placement/question") && response.request().method() === "POST");
    await page.getByRole("button", { name: /Begin test/ }).click();
    const firstQuestionBody = await (await firstQuestionResponse).json();
    expect(firstQuestionBody.bankSize).toBe(612);
    expect(firstQuestionBody.question.answer).toBeUndefined();
    expect(firstQuestionBody.question.explanation).toBeUndefined();
    expect(firstQuestionBody.question.options).toHaveLength(4);
    const placementResult = page.getByRole("heading", { name: /Estimated learning level:/ });
    let sawReadingPassage = await page.locator("article").isVisible();
    for (let index = 0; index < 50; index += 1) {
      if (await placementResult.isVisible()) break;
      const answers = page.locator(".answer-option");
      await expect(answers.first()).toBeVisible();
      await answers.nth(index % 4).click();
      sawReadingPassage ||= await page.locator("article").isVisible();
    }
    await expect(placementResult).toBeVisible();
    expect(sawReadingPassage).toBe(true);
    await page.getByRole("link", { name: /View learning path/ }).click();
    await expect(page.getByRole("heading", { name: /learning path/ })).toBeVisible();

    const grammarCatalogue = await page.evaluate(async () => {
      const response = await fetch("/api/content/grammar");
      return { status: response.status, body: await response.json() };
    });
    expect(grammarCatalogue.status).toBe(200);
    expect(grammarCatalogue.body.total).toBe(138);
    expect(grammarCatalogue.body.byLevel).toEqual({ A1: 24, A2: 24, B1: 26, B2: 25, C1: 24, C2: 15 });
    expect(grammarCatalogue.body.items.some((item: { id: string }) => item.id === "advanced-cohesive-devices")).toBe(true);
    await page.goto("/grammar");
    await page.getByRole("button", { name: /^C2/ }).click();
    await expect(page.getByText("15 topics", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Advanced cohesive devices" })).toBeVisible();

    const expressionCatalogue = await page.evaluate(async () => {
      const response = await fetch("/api/content/expressions?search=legally%20binding");
      return { status: response.status, body: await response.json() };
    });
    expect(expressionCatalogue.status).toBe(200);
    expect(expressionCatalogue.body.corpus.total).toBe(1_621);
    expect(expressionCatalogue.body.corpus.byKind).toEqual({ idiom: 303, "phrasal-verb": 310, collocation: 1_001, "common-expression": 7 });
    expect(expressionCatalogue.body.items[0]).toMatchObject({ id: "collocation-legally-binding", expression: "legally binding" });
    await page.goto("/expressions");
    await expect(page.getByRole("heading", { name: "Expressions" })).toBeVisible();
    await expect(page.getByText("1–24 of 1621")).toBeVisible();
    await page.getByLabel("Search").fill("legally binding");
    await expect(page.getByRole("heading", { name: "legally binding" })).toBeVisible();
    await expect(page.getByText("1–1 of 1")).toBeVisible();

    const stateResponse = await page.evaluate(async () => {
      const response = await fetch("/api/state");
      return { status: response.status, body: await response.json() };
    }) as { status: number; body: { state: AppState } };
    expect(stateResponse.status).toBe(200);
    const authoredSessionAnswers = sessionAnswerMap(buildStudySession(stateResponse.body.state));

    await page.goto("/");
    await page.getByRole("link", { name: /Start Today's Session/ }).click();
    let sawCorrect = false; let sawIncorrect = false; let answered = 0;
    const completionHeading = page.getByRole("heading", { name: "Strong work today" });
    while (true) {
      const options = page.locator(".answer-option:enabled");
      await expect(options.first().or(completionHeading)).toBeVisible();
      if (await completionHeading.isVisible()) break;
      const prompt = await page.locator("#exercise-prompt").innerText();
      const optionTexts = await options.locator("span.flex-1").allInnerTexts();
      const authoredAnswer = authoredSessionAnswers.get(`${prompt}\u0000${[...optionTexts].sort().join("\u0000")}`);
      expect(authoredAnswer, `Missing authored answer for session prompt: ${prompt}`).toBeTruthy();
      const selectedIndex = answered === 0 ? optionTexts.indexOf(authoredAnswer!) : optionTexts.findIndex((option) => option !== authoredAnswer);
      expect(selectedIndex).toBeGreaterThanOrEqual(0);
      await options.nth(selectedIndex).click();
      await page.getByRole("button", { name: /Check answer/ }).click();
      const feedback = page.locator('[aria-labelledby="exercise-prompt"] [aria-live="polite"]');
      await expect(feedback).not.toBeEmpty();
      const text = await feedback.innerText();
      sawCorrect ||= text.includes("Correct");
      sawIncorrect ||= text.includes("Not quite");
      await page.getByRole("button", { name: /good/i }).click();
      answered += 1;
      expect(answered).toBeLessThanOrEqual(60);
    }
    expect(sawCorrect).toBe(true);
    expect(sawIncorrect).toBe(true);
    await expect(page.getByText(/reviews are recorded/)).toBeVisible();

    await page.goto("/mistakes");
    await expect(page.getByRole("heading", { name: "Mistake bank" })).toBeVisible();
    const patternBadge = page.getByText(/\d+ patterns/);
    await expect(patternBadge).toBeVisible();
    expect(Number((await patternBadge.innerText()).split(" ")[0])).toBeGreaterThan(0);
    await page.goto("/progress");
    await expect(page.getByText("Adaptive daily session")).toBeVisible();
    await assertNoSeriousAccessibilityViolations(page);

    const stateBeforeLogout = await page.evaluate(async () => (await fetch("/api/state")).json());
    expect(stateBeforeLogout.state.activities.length).toBeGreaterThan(0);
    expect(stateBeforeLogout.state.vocabularyProgress.length + stateBeforeLogout.state.grammarProgress.length).toBeGreaterThan(0);
    expect({ consoleErrors, failedRequests }).toEqual({ consoleErrors: [], failedRequests: [] });
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.getByLabel("Email").fill(userA.email);
    await page.getByLabel("Password").fill(userA.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/$/);
    const stateAfterLogin = await page.evaluate(async () => (await fetch("/api/state")).json());
    expect(stateAfterLogin.state.activities[0].id).toBe(stateBeforeLogout.state.activities[0].id);
  });

  test("keeps user state server-scoped and rejects unsafe API requests", async ({ browser, page, request }) => {
    const anonymous = await request.get("/api/state");
    expect(anonymous.status()).toBe(401);

    await page.goto("/login?next=//example.com/escape");
    await page.getByLabel("Email").fill(userA.email);
    await page.getByLabel("Password").fill(userA.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/127\.0\.0\.1:3100\/$/);
    const userAIdentity = await page.evaluate(async () => (await fetch("/api/auth/me")).json());

    const contextB: BrowserContext = await browser.newContext();
    const pageB = await contextB.newPage();
    await register(pageB, userB);
    const forged = await pageB.evaluate(async (userId) => {
      const response = await fetch(`/api/state?userId=${encodeURIComponent(userId)}`);
      return { status: response.status, body: await response.json() };
    }, userAIdentity.user.id);
    expect(forged.status).toBe(200);
    expect(forged.body.state.activities).toEqual([]);
    expect(forged.body.state.placement).toBeUndefined();

    const loginHeaders = { Origin: "http://127.0.0.1:3100", "Content-Type": "application/json" };
    const wrongCredentials = await request.post("/api/auth/login", { headers: loginHeaders, data: { email: userA.email, password: "WrongPassword1234" } });
    const unknownCredentials = await request.post("/api/auth/login", { headers: loginHeaders, data: { email: `unknown-${nonce}@test.invalid`, password: "WrongPassword1234" } });
    expect({ status: wrongCredentials.status(), body: await wrongCredentials.json() }).toEqual({ status: 401, body: { error: "Invalid email or password." } });
    expect({ status: unknownCredentials.status(), body: await unknownCredentials.json() }).toEqual({ status: 401, body: { error: "Invalid email or password." } });
    const forgedSession = await request.get("/api/state", { headers: { Cookie: "english_mastery_session=forged-session-token" } });
    expect(forgedSession.status()).toBe(401);

    const userBIdentity = await pageB.evaluate(async () => (await fetch("/api/auth/me")).json());
    const database = new Client({ connectionString: process.env.DATABASE_URL }); await database.connect();
    try { await database.query("update auth_sessions set expires_at = now() - interval '1 minute' where user_id = $1", [userBIdentity.user.id]); } finally { await database.end(); }
    expect(await pageB.evaluate(async () => (await fetch("/api/state")).status)).toBe(401);
    await pageB.goto("/login"); await pageB.getByLabel("Email").fill(userB.email); await pageB.getByLabel("Password").fill(userB.password); await pageB.getByRole("button", { name: "Sign in" }).click(); await expect(pageB).toHaveURL(/\/$/);
    const liveSession = (await contextB.cookies()).find((cookie) => cookie.name === "english_mastery_session"); expect(liveSession).toBeTruthy();
    await pageB.evaluate(async () => { await fetch("/api/auth/logout", { method: "POST" }); });
    await contextB.addCookies([liveSession!]);
    expect(await pageB.evaluate(async () => (await fetch("/api/state")).status)).toBe(401);
    await pageB.goto("/login"); await pageB.getByLabel("Email").fill(userB.email); await pageB.getByLabel("Password").fill(userB.password); await pageB.getByRole("button", { name: "Sign in" }).click(); await expect(pageB).toHaveURL(/\/$/);

    const maliciousOrigin = await request.put("/api/state", {
      data: {},
      headers: { Origin: "https://example.com" },
    });
    expect(maliciousOrigin.status()).toBe(403);
    const failures = await pageB.evaluate(async () => {
      const invalidType = await fetch("/api/state", { method: "PUT", headers: { "Content-Type": "text/plain" }, body: "{}" });
      const malformed = await fetch("/api/state", { method: "PUT", headers: { "Content-Type": "application/json" }, body: "{" });
      const invalidImport = await fetch("/api/state/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state: { forged: true }, confirmLegacyImport: true }) });
      const oversized = await fetch("/api/state", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ padding: "x".repeat(1_100_000) }) });
      return [invalidType.status, malformed.status, invalidImport.status, oversized.status];
    });
    expect(failures).toEqual([415, 400, 400, 413]);
    await deleteAccount(pageB, userB.password);
    await contextB.close();

    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill(userA.email);
    await page.getByRole("button", { name: "Request reset" }).click();
    await expect(page.getByRole("status")).toContainText("If an account matches that email");
    const resetToken = await installOneTimeToken(userA.email, "password_reset_tokens");
    const newPassword = "ProductionFlow9012";
    await page.goto(`/reset-password?token=${resetToken}`);
    await page.getByLabel("New password").fill(newPassword);
    await page.getByLabel("Confirm password").fill(newPassword);
    await page.getByRole("button", { name: "Update password" }).click();
    await expect(page.getByText(/password has been updated/)).toBeVisible();
    await page.getByRole("link", { name: /Sign in with new password/ }).click();
    await page.getByLabel("Email").fill(userA.email);
    await page.getByLabel("Password").fill(newPassword);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/$/);
    await deleteAccount(page, newPassword);
  });
});
