# English Mastery

English Mastery is an adaptive CEFR A1–C2 learning platform for Vietnamese learners. This repository contains a production-oriented foundation: Next.js, PostgreSQL/Drizzle migrations, credentials authentication with database-backed sessions, server-enforced account isolation, transactional normalized learning writes, cloud hydration, deterministic content seeding, password-recovery token lifecycle, validation, and CI.

It is not yet approved for a public production launch. See [production gates](docs/test-report.md) and [known limitations](docs/architecture.md).

## Local setup

Requirements: Node.js 20 or newer, npm, and PostgreSQL 17 or newer (Docker Compose is provided).

```bash
cp .env.example .env.local
cp .env.example .env.test.local
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
npm run content:stats
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run build
npm run test:e2e
```

Integration and E2E tests prefer local credentials from the ignored `.env.test.local` file and fall back to `.env.local`. They require a migrated, seeded, disposable database in `TEST_DATABASE_URL`; both suites refuse a database name without `test`. Use `npm run db:test:migrate` and `npm run db:test:seed` to target that URL explicitly. `npm run db:test:reset` deletes both application and Drizzle journal schemas and has the same safety refusal. Build before E2E and install Chromium once with `npx playwright install --with-deps chromium`. The application uses `DATABASE_URL` for production and development migrations, seeding, and runtime access.

## Architecture

```text
Browser → Next.js routes/middleware → validated API/auth boundary
                                      ↓
                       pure learning and scheduling services
                                      ↓
                         Drizzle repositories → PostgreSQL
```

Static authored content is versioned and seeded into normalized content tables. Mutable learner data is account-owned. Session and placement completion use idempotent transactions across normalized mastery, review, mistake, activity, placement, and learning-path rows. A validated, versioned `user_state_snapshots` document remains as the hydration/legacy-import compatibility view.

Key documentation:

- [Architecture and decisions](docs/architecture.md)
- [Database, migration, backup, and restore](docs/database.md)
- [Security model](docs/security.md)
- [Acceptance tests](docs/acceptance-tests.md)
- [Content sources and licensing](docs/content-sources.md)
- [Vocabulary quality audit](docs/vocabulary-quality-audit.md)
- [Master vocabulary inventory](docs/master-vocabulary-inventory.md)
- [Expressions final QA](docs/expressions-final-qa.md)
- [Content roadmap](docs/content-roadmap.md)
- [Latest test report and production gates](docs/test-report.md)

## Content and learning system

The existing pure TypeScript systems include backlog-first daily planning, a deterministic adapter around maintained `ts-fsrs` (FSRS v6), multidimensional mastery, recurring-mistake practice, a bounded 25–50-question four-domain placement assessment, prerequisite-aware personalized paths, and metadata-driven exercises. Placement selection and scoring remain server-scoped so the browser receives only the active item. Content validation checks stable identifiers, duplicate senses, references, relations, cyclic prerequisites, examples, provenance, item parameters, passage links, and answer ambiguity.

Current bundled lesson content includes a 6,000-unit vocabulary master inventory and 6,000 corresponding enriched vocabulary records, all processed by machine QA; 1,621 validated expressions (303 idioms, 310 phrasal verbs, 1,001 collocations, and 7 common expressions); and a 612-item validated placement bank with 22 authored passages. Expressions meet the repository's production engineering baseline: structural/content QA passes, the deterministic semantic sample passes 220/220, and source-to-seed/database/API/browser/planner/session integration passes on the validated-preview release channel. They are not independently educator/native-speaker/Vietnamese-reviewed or production-published. Placement meets the repository's production engineering baseline with 210 vocabulary, 200 grammar, 120 context/use, and 82 reading items; structural/content QA, a deterministic 140/140 semantic sample, adaptive simulations, and source-to-seed/database/API/browser integration pass. It is not psychometrically validated, independently educator-reviewed, or production-published. The grammar curriculum is complete at 138/138 topics and 138/138 lessons meeting the repository's strict production-detail rubric. Grammar machine/content QA passes, its deterministic semantic sample passes 60/60, and source-to-seed/database/API/browser/planner runtime integration passes. Independent educator/Vietnamese review and production publication approval remain pending for grammar; vocabulary also still requires independent review and approval. Run `npm run content:stats` for exact coverage and release gates.

## Operational notes

- Secrets belong in the deployment environment, never in Git. `.env*` is ignored except `.env.example`.
- `/api/health` returns only `ok` or `degraded`; a database failure produces HTTP 503 without leaking connection details.
- Password reset and email-verification tokens are hashed, expiring, and single-use. Outbound delivery supports an environment-configured `resend` adapter; `development` returns local links only outside production, and `disabled` is the safe default. Production requires `APP_BASE_URL`, `EMAIL_FROM`, and provider credentials.
- Authentication throttling uses an atomic PostgreSQL store in production and an in-memory backend only in local/test environments.
- Review the placeholder Privacy and Terms pages with qualified counsel and add the actual operator details before launch.
