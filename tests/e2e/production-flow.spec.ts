import AxeBuilder from "@axe-core/playwright";
import { expect, test, type BrowserContext, type Page } from "@playwright/test";

const nonce = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const userA = { name: "Production Flow A", email: `flow-a-${nonce}@test.invalid`, password: "ProductionFlow1234" };
const userB = { name: "Production Flow B", email: `flow-b-${nonce}@test.invalid`, password: "ProductionFlow5678" };

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

test.describe.serial("production acceptance", () => {
  test("persists the full placement, learning, mistake, review, and relogin flow", async ({ page }) => {
    const consoleErrors: string[] = []; const failedRequests: string[] = [];
    await register(page, userA);
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("requestfailed", (request) => failedRequests.push(`${request.failure()?.errorText ?? "failed"} ${request.url()}`));
    await assertNoSeriousAccessibilityViolations(page);

    const firstQuestionResponse = page.waitForResponse((response) => response.url().includes("/api/placement/question") && response.request().method() === "POST");
    await page.getByRole("button", { name: /Begin test/ }).click();
    const firstQuestionBody = await (await firstQuestionResponse).json();
    expect(firstQuestionBody.question.answer).toBeUndefined();
    expect(firstQuestionBody.question.explanation).toBeUndefined();
    expect(firstQuestionBody.question.options).toHaveLength(4);
    const placementResult = page.getByRole("heading", { name: /Estimated learning level:/ });
    for (let index = 0; index < 50; index += 1) {
      if (await placementResult.isVisible()) break;
      const answers = page.locator(".answer-option");
      await expect(answers.first()).toBeVisible();
      await answers.nth(index % 4).click();
    }
    await expect(placementResult).toBeVisible();
    await page.getByRole("link", { name: /View learning path/ }).click();
    await expect(page.getByRole("heading", { name: /learning path/ })).toBeVisible();

    await page.goto("/");
    await page.getByRole("link", { name: /Start Today's Session/ }).click();
    let sawCorrect = false; let sawIncorrect = false; let answered = 0;
    const completionHeading = page.getByRole("heading", { name: "Strong work today" });
    while (true) {
      const options = page.locator(".answer-option:enabled");
      await expect(options.first().or(completionHeading)).toBeVisible();
      if (await completionHeading.isVisible()) break;
      await options.nth(answered % 4).click();
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

    const maliciousOrigin = await request.put("/api/state", {
      data: {},
      headers: { Origin: "https://example.com" },
    });
    expect(maliciousOrigin.status()).toBe(403);
    const failures = await pageB.evaluate(async () => {
      const invalidType = await fetch("/api/state", { method: "PUT", headers: { "Content-Type": "text/plain" }, body: "{}" });
      const malformed = await fetch("/api/state", { method: "PUT", headers: { "Content-Type": "application/json" }, body: "{" });
      const invalidImport = await fetch("/api/state/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state: { forged: true }, confirmLegacyImport: true }) });
      return [invalidType.status, malformed.status, invalidImport.status];
    });
    expect(failures).toEqual([415, 400, 400]);
    await deleteAccount(pageB, userB.password);
    await contextB.close();
    await deleteAccount(page, userA.password);
  });
});
