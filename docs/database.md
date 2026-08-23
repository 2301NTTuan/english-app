# Database operations

## Schema and migrations

PostgreSQL 17 is the local and deployment target. Drizzle schema is in `src/db/schema.ts`; two generated immutable SQL migrations are in `drizzle/`. The baseline creates five enums and 30 tables; the follow-up adds database check constraints for normalized emails, preference bounds, mastery scores, review counters, exercise difficulty, mistakes, and session totals/timestamps.

```bash
docker compose up -d postgres
cp .env.example .env.local
npm run db:migrate
npm run db:seed
```

`db:seed` is deterministic and idempotent for stable content IDs. It records a SHA-256 checksum and content version, upserts content, and rebuilds owned child records in one transaction. Set `CONTENT_VERSION` for a release label.

Production migrations must run once as a deployment step before application rollout. Back up first, review generated SQL, test forward migration and restore in staging, and never run seed scripts against production without an approved content release.

## Integrity and concurrency

Foreign keys isolate dependent lifecycle behavior. Unique account emails, stable content IDs, per-user review/content records, placement/session idempotency keys, and path item identity prevent common duplicates. Study and placement tables are designed for server transactions. Review state includes a version for optimistic concurrency, but snapshot sync is currently last-write-wins and must be upgraded before claiming robust simultaneous-device editing.

## Backup and recovery runbook

Use encrypted provider snapshots plus regular logical backups. Example commands (credentials should come from secure environment configuration):

```bash
pg_dump --format=custom --no-owner --file=english-mastery.dump "$DATABASE_URL"
createdb english_mastery_restore_test
pg_restore --no-owner --dbname=english_mastery_restore_test english-mastery.dump
```

Verify restore by checking core table counts, sampling content checksums, validating foreign keys, and running integration tests against the restored database. A production operator must choose and document RPO/RTO, retention, encryption keys, access controls, geographic policy, and a quarterly restore drill. Account deletion cascades primary records; backup expiration follows the configured retention window.
