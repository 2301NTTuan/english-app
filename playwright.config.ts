import { defineConfig, devices } from "@playwright/test";
import { loadTestEnvironment } from "./scripts/load-test-env";

loadTestEnvironment();
const testDatabaseUrl = process.env.TEST_DATABASE_URL;
if (!testDatabaseUrl) throw new Error("TEST_DATABASE_URL is required for Playwright.");
const databaseName = new URL(testDatabaseUrl).pathname.slice(1);
if (!databaseName.includes("test")) throw new Error(`Refusing to run Playwright against non-test database: ${databaseName}`);
process.env.DATABASE_URL = testDatabaseUrl;
process.env.PASSWORD_RESET_DELIVERY = "development";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 180_000,
  expect: { timeout: 15_000 },
  globalSetup: "./tests/e2e/global-setup.ts",
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100/login",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
