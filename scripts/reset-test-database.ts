import { Client } from "pg";
import { loadTestEnvironment } from "./load-test-env";

loadTestEnvironment();

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Refusing to reset a test database in production mode.");
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error("TEST_DATABASE_URL is required.");
  const expectedDatabase = new URL(url).pathname.slice(1);
  if (!expectedDatabase.includes("test")) throw new Error(`Refusing to reset non-test database: ${expectedDatabase}`);

  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    const result = await client.query<{ name: string }>("select current_database() name");
    if (result.rows[0]?.name !== expectedDatabase) throw new Error("Connected database does not match TEST_DATABASE_URL.");
    await client.query("drop schema if exists drizzle cascade");
    await client.query("drop schema public cascade");
    await client.query("create schema public authorization current_user");
  } finally {
    await client.end();
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Test database reset failed.");
  process.exitCode = 1;
});
