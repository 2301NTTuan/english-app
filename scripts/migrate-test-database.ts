import { spawn } from "node:child_process";
import { loadTestEnvironment } from "./load-test-env";

loadTestEnvironment();

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Refusing to migrate a test database in production mode.");
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error("TEST_DATABASE_URL is required.");
  const databaseName = new URL(url).pathname.slice(1);
  if (!databaseName.includes("test")) throw new Error(`Refusing to migrate non-test database: ${databaseName}`);

  await new Promise<void>((resolve, reject) => {
    const child = spawn("npx", ["drizzle-kit", "migrate"], {
      env: { ...process.env, DATABASE_URL: url },
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`drizzle-kit exited with status ${code}`)));
  });
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Test database migration failed.");
  process.exitCode = 1;
});
