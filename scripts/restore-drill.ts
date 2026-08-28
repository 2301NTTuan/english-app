import { randomBytes } from "node:crypto";
import { unlink } from "node:fs/promises";
import { spawn } from "node:child_process";
import { Client } from "pg";
import { loadTestEnvironment } from "./load-test-env";

loadTestEnvironment();
const sourceUrl = process.env.TEST_DATABASE_URL;
if (!sourceUrl) throw new Error("TEST_DATABASE_URL is required for the restore drill.");
const parsed = new URL(sourceUrl); const sourceDatabase = parsed.pathname.slice(1);
if (!sourceDatabase.includes("test")) throw new Error(`Refusing restore drill for non-test database: ${sourceDatabase}`);
const targetDatabase = `${sourceDatabase}_restore_drill_${randomBytes(4).toString("hex")}`;
if (!/^[a-zA-Z0-9_]+$/.test(targetDatabase)) throw new Error("Generated restore database name is unsafe.");
const administratorUrl = new URL(sourceUrl); administratorUrl.pathname = "/postgres";
const targetUrl = new URL(sourceUrl); targetUrl.pathname = `/${targetDatabase}`;
const dumpPath = `/tmp/${targetDatabase}.dump`;
const countTables = ["users", "vocabulary_content", "vocabulary_meanings", "vocabulary_examples", "grammar_topics", "grammar_lessons", "placement_items", "placement_passages", "expressions", "study_sessions", "placement_attempts"];

function run(command: string, args: string[], environment = process.env) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { env: environment, stdio: "inherit" });
    child.once("error", reject); child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with status ${code}`)));
  });
}

async function snapshot(url: string) {
  const client = new Client({ connectionString: url }); await client.connect();
  try {
    const countEntries: [string, number][] = [];
    for (const table of countTables) {
      const result = await client.query<{ count: number }>(`select count(*)::int count from ${table}`);
      countEntries.push([table, result.rows[0]?.count ?? -1]);
    }
    const counts = Object.fromEntries(countEntries);
    const checksums = (await client.query<{ version: string; checksum: string }>("select version, checksum from content_versions order by version")).rows;
    return { counts, checksums };
  } finally { await client.end(); }
}

async function main() {
  const administrator = new Client({ connectionString: administratorUrl.toString() }); let created = false;
  try {
    const before = await snapshot(sourceUrl);
    await run("pg_dump", ["--format=custom", "--no-owner", `--file=${dumpPath}`, sourceUrl]);
    await administrator.connect(); await administrator.query(`create database "${targetDatabase}"`); created = true;
    await run("pg_restore", ["--no-owner", `--dbname=${targetUrl.toString()}`, dumpPath]);
    const after = await snapshot(targetUrl.toString());
    if (JSON.stringify(after) !== JSON.stringify(before)) throw new Error(`Restore verification mismatch: ${JSON.stringify({ before, after })}`);
    await run("npx", ["vitest", "run", "--config", "vitest.integration.config.ts"], { ...process.env, DATABASE_URL: targetUrl.toString(), TEST_DATABASE_URL: targetUrl.toString() });
    console.log(JSON.stringify({ status: "pass", sourceDatabase, targetDatabase, counts: after.counts, contentVersions: after.checksums.length }, null, 2));
  } finally {
    if (created) await administrator.query(`drop database if exists "${targetDatabase}" with (force)`);
    await administrator.end().catch(() => undefined);
    await unlink(dumpPath).catch(() => undefined);
  }
}

void main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
