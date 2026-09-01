import { expect, test } from "@playwright/test";

async function fillValidRegistration(page: import("@playwright/test").Page, email = "password-ux@test.invalid") {
  await page.getByLabel("Name").fill("Password UX");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("Abcdefghijk1");
  await page.getByLabel("Confirm password").fill("Abcdefghijk1");
}

test("checks sign-up passwords in real time without sending confirmation", async ({ page }) => {
  const consoleErrors: string[] = [];
  const requests: Array<Record<string, unknown>> = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  await page.route("**/api/auth/register", async (route) => {
    requests.push(route.request().postDataJSON() as Record<string, unknown>);
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        email: "password-ux@test.invalid",
        verificationEmailSent: true,
        deliveryStatus: "sent",
      }),
    });
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/register");
  const password = page.getByLabel("Password", { exact: true });
  const confirmation = page.getByLabel("Confirm password");

  await expect(page.getByText(/Requirements and strength will update as you type/)).toBeVisible();
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(password).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Show password" }).first().click();
  await expect(password).toHaveAttribute("type", "text");
  await expect(page.getByRole("button", { name: "Hide password" })).toHaveCount(1);
  await page.getByRole("button", { name: "Hide password" }).click();
  await expect(password).toHaveAttribute("type", "password");

  await password.fill("abc");
  await expect(page.getByText("Very weak", { exact: true })).toBeVisible();
  await expect(page.getByText("3 / 12 characters minimum")).toBeVisible();
  await password.fill("abcdefghijk");
  await expect(page.getByText("11 / 12 characters minimum")).toBeVisible();
  await password.fill("abcdefghijkl");
  await expect(page.locator("li").filter({ hasText: "At least 12 characters" })).toContainText("Met: At least 12 characters");
  await expect(page.getByText("Weak", { exact: true })).toBeVisible();
  await password.fill("correct-horse-battery-staple");
  await expect(page.getByText("Strong", { exact: true })).toBeVisible();
  await expect(page.locator("li").filter({ hasText: "At least one uppercase letter" })).toContainText("Not met: At least one uppercase letter");
  await password.fill("Abcdefghijk1");
  await expect(page.getByText("Fair", { exact: true })).toBeVisible();
  await expect(page.getByText("Password meets the registration requirements.")).toBeVisible();

  await page.getByLabel("Name").fill("Password UX");
  await page.getByLabel("Email").fill("password-ux@test.invalid");
  await confirmation.fill("DifferentPass1");
  await expect(page.getByText("Passwords do not match")).toBeVisible();
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(confirmation).toBeFocused();
  expect(requests).toHaveLength(0);

  await confirmation.fill("Abcdefghijk1");
  await expect(page.getByText("Passwords match")).toBeVisible();
  await page.getByRole("button", { name: "Show password" }).last().click();
  await expect(confirmation).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect.poll(() => requests.length).toBe(1);

  expect(requests).toEqual([{
    name: "Password UX",
    email: "password-ux@test.invalid",
    password: "Abcdefghijk1",
  }]);
  expect(consoleErrors).toEqual([]);
});

test("focuses the unmet password requirement and never requests registration", async ({ page }) => {
  let registrationRequests = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/api/auth/register") && request.method() === "POST") registrationRequests += 1;
  });
  await page.goto("/register");
  await page.getByLabel("Name").fill("Password UX");
  await page.getByLabel("Email").fill("password-ux@test.invalid");
  await page.getByLabel("Password", { exact: true }).fill("ShortPass1");
  await page.getByLabel("Confirm password").fill("ShortPass1");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByLabel("Password", { exact: true })).toBeFocused();
  await expect(page.getByText("Password requirement not met: At least 12 characters.", { exact: true })).toBeVisible();
  expect(registrationRequests).toBe(0);
});

test("validates name and email while typing before registration", async ({ page }) => {
  let registrationRequests = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/api/auth/register") && request.method() === "POST") registrationRequests += 1;
  });
  await page.goto("/register");

  await page.getByLabel("Name").fill("A");
  await expect(page.getByText("Name must be at least 2 characters.")).toBeVisible();
  await page.getByLabel("Name").fill("");
  await expect(page.getByText("Enter your name.")).toBeVisible();
  await page.getByLabel("Name").fill("Valid Name");
  await expect(page.getByText("Enter your name.")).toHaveCount(0);

  await page.getByLabel("Email").fill("invalid-email");
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await page.getByLabel("Email").fill("");
  await expect(page.getByText("Enter your email address.")).toBeVisible();
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByLabel("Email")).toBeFocused();
  expect(registrationRequests).toBe(0);
});

test("maps duplicate, rate-limit, and service errors by code", async ({ page }) => {
  let responseKind: "duplicate" | "rate" | "service" = "duplicate";
  await page.route("**/api/auth/register", async (route) => {
    const responses = {
      duplicate: { status: 409, headers: {}, body: { code: "EMAIL_ALREADY_REGISTERED", error: "untrusted duplicate prose" } },
      rate: { status: 429, headers: { "Retry-After": "9" }, body: { code: "RATE_LIMITED", error: "untrusted rate prose" } },
      service: { status: 503, headers: {}, body: { code: "SERVICE_UNAVAILABLE", error: "raw database detail" } },
    } as const;
    const selected = responses[responseKind];
    await route.fulfill({ status: selected.status, headers: selected.headers, contentType: "application/json", body: JSON.stringify(selected.body) });
  });

  await page.goto("/register");
  await fillValidRegistration(page, " Existing@Example.COM ");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("This email is already registered.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Forgot password?" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Resend verification" })).toBeVisible();
  await expect(page.getByText("Sign up is temporarily unavailable. Please try again later.")).toHaveCount(0);
  await expect(page.getByText("untrusted duplicate prose")).toHaveCount(0);

  responseKind = "rate";
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Too many sign-up attempts. Please wait 9 seconds and try again.")).toBeVisible();

  responseKind = "service";
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Sign up is temporarily unavailable. Please try again later.")).toBeVisible();
  await expect(page.getByText("raw database detail")).toHaveCount(0);
});

test("shows an accurate recoverable state when verification delivery fails", async ({ page }) => {
  await page.route("**/api/auth/register", (route) => route.fulfill({
    status: 201,
    contentType: "application/json",
    body: JSON.stringify({
      ok: true,
      code: "VERIFICATION_DELIVERY_FAILED",
      verificationRequired: true,
      verificationEmailSent: false,
      email: "delivery-failed@example.test",
      deliveryStatus: "failed",
    }),
  }));
  await page.goto("/register");
  await fillValidRegistration(page, " Delivery-Failed@Example.Test ");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "Account created" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Check your email" })).toHaveCount(0);
  await expect(page.getByText("delivery-failed@example.test", { exact: true })).toBeVisible();
  await expect(page.getByText(/account was created, but we couldn't send the verification email/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Resend verification email" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to sign in" })).toBeVisible();
});

test("shows a development-only verification path without claiming email delivery", async ({ page }) => {
  await page.route("**/api/auth/register", (route) => route.fulfill({
    status: 201,
    contentType: "application/json",
    body: JSON.stringify({
      ok: true,
      code: "VERIFICATION_DELIVERY_FAILED",
      verificationRequired: true,
      verificationEmailSent: false,
      email: "local-verification@example.test",
      deliveryStatus: "development",
      developmentVerificationUrl: "/verify-email?token=development-token",
    }),
  }));
  await page.goto("/register");
  await fillValidRegistration(page, "local-verification@example.test");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "Verify locally" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Check your email" })).toHaveCount(0);
  await expect(page.getByText(/Email delivery is in development mode/i)).toBeVisible();
  await expect(page.getByRole("link", { name: "Open local verification link" })).toBeVisible();
});

test("prevents simultaneous registration submissions", async ({ page }) => {
  let releaseResponse: (() => void) | undefined;
  const responseGate = new Promise<void>((resolve) => { releaseResponse = resolve; });
  let requests = 0;
  await page.route("**/api/auth/register", async (route) => {
    requests += 1;
    await responseGate;
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, verificationRequired: true, verificationEmailSent: true, email: "double-submit@test.invalid", deliveryStatus: "sent" }),
    });
  });
  await page.goto("/register");
  await fillValidRegistration(page, "double-submit@test.invalid");

  await page.getByRole("button", { name: "Create account" }).evaluate((button: HTMLButtonElement) => {
    button.click();
    button.click();
  });
  await expect.poll(() => requests).toBe(1);
  await expect(page.getByRole("button", { name: "Please wait…" })).toBeDisabled();
  releaseResponse?.();
  await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();
  expect(requests).toBe(1);
});
