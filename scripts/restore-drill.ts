import { randomBytes } from "node:crypto";
import { readFile, unlink, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { Client } from "pg";
import { loadTestEnvironment } from "./load-test-env";

loadTestEnvironment();
const sourceUrl = process.env.TEST_DATABASE_URL ?? (() => { throw new Error("TEST_DATABASE_URL is required for the restore drill."); })();
const sourceDatabase = new URL(sourceUrl).pathname.slice(1);
if (!sourceDatabase.includes("test")) throw new Error(`Refusing restore drill for non-test database: ${sourceDatabase}`);

const targetSchema = `restore_drill_${randomBytes(4).toString("hex")}`;
const dumpPath = `/tmp/english_mastery_${targetSchema}.sql`;
const countTables = [
  "users", "learning_preferences", "vocabulary_content", "vocabulary_meanings", "vocabulary_examples",
  "grammar_topics", "grammar_lessons", "placement_items", "placement_passages", "expressions",
  "review_states", "vocabulary_progress", "grammar_progress", "mistakes", "study_sessions",
  "study_session_items", "placement_attempts", "placement_answers",
];

function run(command: string, args: string[], environment = process.env) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { env: environment, stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with status ${code}`)));
  });
}

function schemaUrl(url: string, schema: string) {
  const result = new URL(url);
  result.searchParams.set("options", `-c search_path=${schema},pg_catalog`);
  return result.toString();
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
  const administrator = new Client({ connectionString: sourceUrl });
  let created = false;
  try {
    const before = await snapshot(sourceUrl);
    await run("pg_dump", ["--format=plain", "--no-owner", "--no-privileges", "--schema=public", `--file=${dumpPath}`, sourceUrl]);
    await administrator.connect();

    const dump = await readFile(dumpPath, "utf8");
    const remapped = dump
      .replaceAll("SCHEMA public", `SCHEMA "${targetSchema}"`)
      .replaceAll("public.", `"${targetSchema}".`)
      .replaceAll("search_path = public", `search_path = "${targetSchema}"`);
    if (remapped === dump || remapped.includes("public.")) throw new Error("Restore dump schema remapping was incomplete.");
    await writeFile(dumpPath, remapped, { encoding: "utf8", mode: 0o600 });
    created = true;
    await run("psql", ["--no-psqlrc", "--set=ON_ERROR_STOP=1", `--dbname=${sourceUrl}`, `--file=${dumpPath}`]);

    const targetUrl = schemaUrl(sourceUrl, targetSchema);
    const after = await snapshot(targetUrl);
    if (JSON.stringify(after) !== JSON.stringify(before)) throw new Error(`Restore verification mismatch: ${JSON.stringify({ before, after })}`);
    await run("npx", ["vitest", "run", "--config", "vitest.integration.config.ts"], { ...process.env, DATABASE_URL: targetUrl, TEST_DATABASE_URL: targetUrl });
    console.log(JSON.stringify({ status: "pass", strategy: "isolated-schema", sourceDatabase, targetSchema, counts: after.counts, contentVersions: after.checksums.length }, null, 2));
  } finally {
    if (created) await administrator.query(`drop schema if exists "${targetSchema}" cascade`);
    await administrator.end().catch(() => undefined);
    await unlink(dumpPath).catch(() => undefined);
  }
}

void main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
