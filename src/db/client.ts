import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let pool: Pool | undefined; let database: NodePgDatabase<typeof schema> | undefined;
export function getPool(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required for database operations");
  pool ??= new Pool({ connectionString: url, max: Number(process.env.DATABASE_POOL_MAX ?? 10), idleTimeoutMillis: 30_000, connectionTimeoutMillis: 5_000, ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : undefined });
  return pool;
}
export function getDb(): NodePgDatabase<typeof schema> { database ??= drizzle(getPool(), { schema }); return database; }
export async function checkDatabase(): Promise<void> { const client = await getPool().connect(); try { await client.query("select 1"); } finally { client.release(); } }
