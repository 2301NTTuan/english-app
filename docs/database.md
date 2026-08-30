# Database operations

## Schema and migrations

PostgreSQL 17+ is the local and deployment target. Drizzle schema is in `src/db/schema.ts`; six generated immutable SQL migrations are in `drizzle/`. The migrations create five enums and 31 tables, database checks, the email-verification token lifecycle, and the unique mistake business key used by transactional upserts.

```bash
docker compose up -d postgres
cp .env.example .env.local
npm run db:migrate
npm run db:seed
```

`db:seed` is deterministic and idempotent for stable content IDs. It records a SHA-256 checksum and content version, upserts content, and rebuilds owned child records in one transaction. Set `CONTENT_VERSION` for a release label.

For disposable test databases only, `npm run db:test:migrate` applies migrations and `npm run db:test:seed` loads content into `TEST_DATABASE_URL` explicitly; `npm run db:test:reset` drops both `public` and Drizzle's migration-journal schema. All refuse production mode, a missing test URL, or a database name without `test`; reset additionally verifies the connected database name. Never adapt these commands for production.

Production migrations must run once as a deployment step before application rollout. Back up first, review generated SQL, test forward migration and restore in staging, and never run seed scripts against production without an approved content release.

## Integrity and concurrency

Foreign keys isolate dependent lifecycle behavior. Unique account emails, stable content IDs, per-user review/content records, mistake business keys, placement/session idempotency keys, and path item identity prevent common duplicates. Study and placement completion are server transactions protected by per-account advisory locks. Normalized event rows are authoritative, stale review versions return a conflict instead of overwriting another device, and generic state sync can update preferences only. Snapshot documents remain a compatibility projection for legacy import and recovery, not an event write path.

## Backup and recovery runbook

Use encrypted provider snapshots plus regular logical backups. Example commands (credentials should come from secure environment configuration):

```bash
pg_dump --format=custom --no-owner --file=english-mastery.dump "$DATABASE_URL"
createdb english_mastery_restore_test
pg_restore --no-owner --dbname=english_mastery_restore_test english-mastery.dump
```

Verify restore by checking core table counts, sampling content checksums, validating foreign keys, and running integration tests against the restored database. A production operator must choose and document RPO/RTO, retention, encryption keys, access controls, geographic policy, and a quarterly restore drill. Account deletion cascades primary records; backup expiration follows the configured retention window.

For a repeatable local drill against the configured disposable test database, run `npm run db:restore:drill`. The script refuses a source database whose name does not contain `test`, remaps a plain logical dump into a uniquely named isolated schema, compares core row counts and all content-version checksums, runs the PostgreSQL integration suite against the restored schema, and removes both the schema and `/tmp` dump afterward. This validates the repository-level logical restore procedure only; it does not prove a cloud provider snapshot, retention policy, encryption, or production RPO/RTO.

Previous attempt: **FAIL, 28 August 2026**. `pg_dump` completed against the disposable test database, but the configured least-privilege test role could not create the uniquely named restore database (`SQLSTATE 42501: permission denied to create database`). Restoration, checksum comparison, and integration tests against that copy therefore did not run. The temporary `/tmp` dump was removed by the script.

Latest verified drill: **PASS, 29 August 2026**. `npm run db:restore:drill` restored the logical dump into an isolated schema without granting `CREATEDB`; core row counts and content-version checksums matched, all 12 PostgreSQL integration tests passed against the restored schema, and the temporary schema and dump were removed.
