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
- [Content roadmap](docs/content-roadmap.md)
- [Latest test report and production gates](docs/test-report.md)

## Content and learning system

The existing pure TypeScript systems include backlog-first daily planning, a deterministic adapter around maintained `ts-fsrs` (FSRS v6), multidimensional mastery, recurring-mistake practice, a bounded 25–50-question four-domain placement assessment, prerequisite-aware personalized paths, and metadata-driven exercises. Placement selection and scoring remain server-scoped so the browser receives only the active item. Content validation checks stable identifiers, duplicate senses, references, relations, cyclic prerequisites, examples, provenance, item parameters, passage links, and answer ambiguity.

Current bundled lesson content: 298 enriched vocabulary entries, 138 grammar topics (35 enriched lesson records, but zero yet meet the stricter production-detail rubric), 107 expressions (30 idioms, 30 phrasal verbs, 40 collocations, 7 common expressions), and a 108-item validated placement pilot with six authored passages. A separate metadata-only master inventory contains 6,000 source-audited vocabulary lexical units for later enrichment. Run `npm run content:stats` for exact coverage and release gates. Validated content is not educator-reviewed or production-published.

## Operational notes

- Secrets belong in the deployment environment, never in Git. `.env*` is ignored except `.env.example`.
- `/api/health` returns only `ok` or `degraded`; a database failure produces HTTP 503 without leaking connection details.
- Password reset and email-verification tokens are hashed, expiring, and single-use. Outbound delivery supports an environment-configured `resend` adapter; `development` returns local links only outside production, and `disabled` is the safe default. Production requires `APP_BASE_URL`, `EMAIL_FROM`, and provider credentials.
- The in-process authentication limiter must be replaced with a shared store before horizontal scaling.
- Review the placeholder Privacy and Terms pages with qualified counsel and add the actual operator details before launch.
