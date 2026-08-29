# Validation report

Latest local verification date: 29 August 2026.

## Automated results

| Gate | Result | Evidence |
| --- | --- | --- |
| Content validation | PASS | 9/9 tests across the enriched content and master inventory suites |
| ESLint | PASS | zero errors/warnings |
| TypeScript | PASS | `tsc --noEmit` |
| Unit tests | PASS | 92/92 tests across 25 files |
| PostgreSQL integration | PASS | 12/12 tests against the freshly migrated and twice-seeded disposable test database |
| Browser E2E | PASS | 2/2 Chromium tests against the production server and disposable test database |
| Production build | PASS | Next.js 16.3.2 Webpack build; all application and API routes compiled and prerendered as expected |
| Runtime smoke | PASS | login/attribution 200, anonymous root 307, anonymous vocabulary API 401, health 200/ok with DB and 503/degraded against a deliberately unreachable DB, security headers present |
| Production dependency audit | PASS | zero production vulnerabilities |
| Full dependency audit | FAIL | four moderate development-only esbuild advisories through Drizzle Kit; available automatic change is breaking and was not forced |

Unit coverage includes planning, the FSRS adapter, mastery, mistakes, streak, multidomain placement simulations, stopping/confidence/exposure behavior, frequency-aware vocabulary selection, personalized paths, unambiguous exercise generation, prerequisites, content integrity, browser-state migration, password hashing, session-token hashing, rate limiting, request validation, health-response redaction, structured-log redaction, outbound email provider safety, and state validation. The database suite covers migrated-table presence and constraints, account isolation and cascades, atomic shared rate limiting, transactional and idempotent session/placement writes, stale-device conflict rejection, authoritative state projection, reset, rollback on unknown content, recovery-token lifecycles, legacy import normalization, and database-backed vocabulary filtering including frequency.

## Environment constraint

The configured disposable PostgreSQL database is reachable and all integration tests pass. Docker Desktop's CLI remains unavailable inside this WSL distribution, but it is not needed for the configured test database. Playwright's Chromium runtime and required WSL system libraries are installed; CI installs the same dependencies before E2E.

## Production gates

- Compile, lint, unit/content tests, and production build: pass.
- Generated, reviewable SQL migration: pass.
- Real PostgreSQL migrated/seeded integration verification: pass.
- Browser E2E authentication, learning persistence, serious/critical axe checks on representative pages, hostile-input handling, wrong/unknown credential parity, forged/expired/revoked sessions, and cross-user isolation: pass.
- Placement item delivery is server-scoped; production E2E verifies that the current-item response omits the answer and explanation: pass.
- Password recovery/email verification token lifecycle and provider adapter: pass. Deployment credentials, verified sender/domain, delivery monitoring, and operator support workflows remain launch blockers; no paid provider was configured.
- Normalized transactional learning-session and placement persistence: pass; per-account advisory locks and review-version checks reject stale event writes, while generic state sync is restricted to preferences.
- Content provenance: pass for repository-authored placement/enriched vocabulary batches and the licensed master vocabulary inventory; educator review and production publication: fail.
- Bounded server-side vocabulary browse/search/filter retrieval: pass for the 298 enriched records; the 6,000-unit inventory is still metadata-only and is not presented as learner-ready content.
- User-visible audited-source attribution: pass. Privacy/Terms operator identity and jurisdiction configuration: fail.
- Structured request/error/health/auth-abuse logging and request correlation: pass. External monitoring backend, alert routing, and backup retention remain deployment configuration. Restore drill: pass using an isolated disposable schema without granting `CREATEDB`; row counts, content checksum, users, progress, reviews, and 12 integration tests matched the source backup.

Result: **not production-ready**. The repository is a coherent production foundation with explicit launch blockers.

## Content Quality Audit

- Machine validated: the 6,000-unit metadata-only master inventory, all 298 enriched vocabulary records, all 108 placement items, six reading passages, stable IDs, provenance links, duplicate candidates, metadata consistency, relation structure, grammar prerequisites, and deterministic learning/placement simulations.
- Manually inspected in this run: the full 106-record foundational vocabulary batch, corrected vocabulary seed rules and relation removals, deterministic level/edge samples, and the 36 core placement explanations rewritten to teach the specific answer.
- Still requires independent review: English/Vietnamese editorial review, CEFR judgments, synonym/antonym/collocation nuance, polysemy modelling, placement ambiguity and distractor review, publication approval, learner calibration, reliability/fairness analysis, and psychometric validation.
- Current gates: master vocabulary inventory **PASS** (6,000/5,800–6,200, provenance resolved, 298 existing IDs preserved); enriched production vocabulary corpus **FAIL** (298 enriched, zero published), grammar corpus **FAIL** (0/110 strictly qualifying), placement bank **FAIL** (108/600 validated, zero reviewed/published).

See [the master vocabulary inventory report](master-vocabulary-inventory.md), [the enriched vocabulary audit](vocabulary-quality-audit.md), and [representative placement items](placement-assessment.md#representative-validated-pilot-items) for inspectable content samples and exact limitations.
