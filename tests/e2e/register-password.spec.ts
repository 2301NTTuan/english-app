import { expect, test } from "@playwright/test";

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
        message: "Check your email to continue.",
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
