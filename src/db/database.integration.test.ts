import { randomUUID } from "node:crypto";
import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const databaseUrl = process.env.TEST_DATABASE_URL;
const suite = databaseUrl ? describe : describe.skip;
suite("PostgreSQL migration and ownership", () => {
  const client = new Client({ connectionString: databaseUrl });
  beforeAll(async () => { await client.connect(); }); afterAll(async () => { await client.end(); });
  it("has the expected migrated tables", async () => { const result = await client.query("select to_regclass('public.users') users, to_regclass('public.user_state_snapshots') snapshots"); expect(result.rows[0]).toEqual({ users: "users", snapshots: "user_state_snapshots" }); });
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
});
