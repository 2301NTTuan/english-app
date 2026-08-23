import { defineConfig } from "vitest/config";
import path from "node:path";
import { loadTestEnvironment } from "./scripts/load-test-env";

loadTestEnvironment();

if (!process.env.TEST_DATABASE_URL) {
  throw new Error("TEST_DATABASE_URL is required for integration tests.");
}

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    environment: "node",
    include: ["src/**/*.integration.test.ts"],
    testTimeout: 20_000,
    hookTimeout: 20_000,
    sequence: { concurrent: false },
  },
});
