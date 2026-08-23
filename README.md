# English Mastery

English Mastery is an adaptive CEFR A1–C2 learning platform for Vietnamese learners. This repository contains a production-oriented foundation: Next.js, PostgreSQL/Drizzle migrations, credentials authentication with database-backed sessions, server-enforced account isolation, cloud learning-state sync, deterministic content seeding, validation, and CI.

It is not yet approved for a public production launch. See [production gates](docs/test-report.md) and [known limitations](docs/architecture.md).

## Local setup

Requirements: a current Node.js LTS release, npm, and PostgreSQL 17 (Docker Compose is provided).

```bash
cp .env.example .env.local
docker compose up -d postgres
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`, register an account, and sign in. WSL users must enable Docker Desktop’s WSL integration for the distribution before `docker compose` works.

## Verification

```bash
npm run validate:content
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run build
```

Integration tests require a migrated, disposable database in `TEST_DATABASE_URL`; never point them at production. The application uses `DATABASE_URL` for migrations, seeding, and runtime access.

## Architecture

```text
Browser → Next.js routes/middleware → validated API/auth boundary
                                      ↓
                       pure learning and scheduling services
                                      ↓
                         Drizzle repositories → PostgreSQL
```

Static authored content is versioned and seeded into normalized content tables. Mutable learner data is account-owned. A validated, versioned `user_state_snapshots` document is currently the compatibility bridge between the existing pure learning engine and normalized progress tables; moving every session write to transactional normalized rows is the next persistence milestone.

Key documentation:

- [Architecture and decisions](docs/architecture.md)
- [Database, migration, backup, and restore](docs/database.md)
- [Security model](docs/security.md)
- [Acceptance tests](docs/acceptance-tests.md)
- [Content sources and licensing](docs/content-sources.md)
- [Content roadmap](docs/content-roadmap.md)
- [Latest test report and production gates](docs/test-report.md)

## Content and learning system

The existing pure TypeScript systems remain intact: backlog-first daily planning, an FSRS-inspired scheduling adapter, multidimensional mastery, recurring-mistake practice, a bounded 30-question placement test, prerequisite-aware personalized paths, and metadata-driven exercises. Content validation checks stable identifiers, duplicate senses, references, relations, prerequisites, examples, and answer ambiguity.

Current bundled content: 192 vocabulary entries, 138 grammar topics (35 fully detailed lessons), and 107 expressions (30 idioms, 30 phrasal verbs, 40 collocations, 7 common expressions).

## Operational notes

- Secrets belong in the deployment environment, never in Git. `.env*` is ignored except `.env.example`.
- `/api/health` returns only `ok` or `degraded`; a database failure produces HTTP 503 without leaking connection details.
- Password reset email delivery and email verification are not enabled. Do not claim these capabilities at launch.
- The in-process authentication limiter must be replaced with a shared store before horizontal scaling.
- Review the placeholder Privacy and Terms pages with qualified counsel and add the actual operator details before launch.
