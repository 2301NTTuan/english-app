import { Client } from "pg";

export default async function globalSetup() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required for Playwright setup.");
  const expected = new URL(url).pathname.slice(1);
  if (!expected.includes("test")) throw new Error(`Refusing Playwright setup for non-test database: ${expected}`);
  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    const database = await client.query<{ name: string }>("select current_database() name");
    if (database.rows[0]?.name !== expected) throw new Error("Connected test database does not match TEST_DATABASE_URL.");
    const content = await client.query<{ count: number }>("select count(*)::int count from vocabulary_content");
    if ((content.rows[0]?.count ?? 0) < 1) throw new Error("The E2E test database must be migrated and seeded before Playwright runs.");
    await client.query("delete from auth_rate_limits");
  } finally {
    await client.end();
  }
}
