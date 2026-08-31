# Validation report

Latest full local repository verification date: 31 August 2026. The current verification includes the completed 612-item Placement engineering baseline, freshly seeded development/test databases, production build, and Playwright browser E2E. The latest CI evidence documented here remains [GitHub CI run #15](https://github.com/2301NTTuan/english-app/actions/runs/33340474000) for the earlier commit `be3d4b1` (`Fix full-corpus E2E validation`); the current local Placement changes have not been pushed.

## Automated results

| Gate | Result | Evidence |
| --- | --- | --- |
| Content validation | PASS | 11/11 tests across the enriched content, Placement quality, and master inventory suites |
| ESLint | PASS | zero errors/warnings |
| TypeScript | PASS | `tsc --noEmit` |
| Unit tests | PASS | 105/105 tests across 25 files, including 16 adaptive Placement simulations and full-corpus identity/terminal-entry selection |
| PostgreSQL integration | PASS | 14/14 tests against the freshly seeded disposable test database; 6,000 active vocabulary rows, 138 grammar lessons, 612 Placement items, and 22 passages verified |
| Browser E2E | PASS | 2/2 Chromium tests against the production server and disposable test database, including Placement API bank size 612, hidden answer key, reading-passage UI, authenticated grammar API, and complete C2 browser catalogue |
| Production build | PASS | Next.js 16.3.2 Webpack build; application and API routes compiled, including the PostgreSQL-backed Placement question route |
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
- Placement item delivery is PostgreSQL-backed and server-scoped; production E2E verifies API-visible bank size 612, reading-passage rendering, and omission of the answer and explanation: pass.
- Password recovery/email verification token lifecycle and provider adapter: pass. Deployment credentials, verified sender/domain, delivery monitoring, and operator support workflows remain launch blockers; no paid provider was configured.
- Normalized transactional learning-session and placement persistence: pass; per-account advisory locks and review-version checks reject stale event writes, while generic state sync is restricted to preferences.
- Content provenance: pass for repository-authored placement/enriched vocabulary batches and the licensed master vocabulary inventory; educator review and production publication: fail.
- Bounded server-side vocabulary browse/search/filter retrieval: pass over all 6,000 seeded enriched records in local/test and `validated-preview`; search reaches `master-zoology-noun`, outside the original 298-record set. Default production filtering still exposes only `published` records, currently zero, so validated content is not silently promoted.
- User-visible audited-source attribution: pass. Privacy/Terms operator identity and jurisdiction configuration: fail.
- Structured request/error/health/auth-abuse logging and request correlation: pass. External monitoring backend, alert routing, and backup retention remain deployment configuration. The 29 August restore drill passed using an isolated disposable schema without granting `CREATEDB`; row counts, content checksums, users, progress, reviews, and all 12 integration tests present at the time matched the source backup.

Result: **not production-ready**. The repository is a coherent production foundation with explicit launch blockers.

## Content Quality Audit

- Machine validated: the 6,000-unit master inventory, all 6,000 enriched vocabulary records, all 612 Placement items, 22 reading passages, stable IDs, provenance links, duplicate candidates, metadata consistency, relation structure, grammar prerequisites, and deterministic learning/placement simulations.
- Machine-assisted vocabulary QA processed all 6,000 records and resolved 927 critical, 2,713 major, and 389 minor findings with zero unresolved. This is implementation QA, not independent educator review.
- Placement engineering baseline: **PASS** (612 items; vocabulary 210, grammar 200, context/use 120, reading 82; 22 passages; deterministic semantic sample 140/140; database/API/browser path verified).
- Still requires independent review: English/Vietnamese editorial review, CEFR judgments, synonym/antonym/collocation nuance, polysemy modelling, Placement educator/distractor review, publication approval, learner calibration, reliability/fairness analysis, and psychometric validation.
- Vocabulary master inventory: **PASS** (6,000, provenance resolved, all stable IDs preserved).
- Core vocabulary enrichment: **PASS** (6,000/6,000 master IDs mapped to learner-facing records).
- Machine validation and QA: **PASS** (6,000/6,000 processed; zero unresolved critical, major, or minor findings).
- Independent educator/Vietnamese review: **EXTERNAL / NOT COMPLETE**.
- Production publication approval: **NOT COMPLETE** (zero vocabulary or Placement records are `published`). Grammar is complete at 138/138 production-detail lessons: machine/content QA, the deterministic 60/60 semantic sample, and source-to-seed/database/API/browser/planner runtime integration all pass. Its three targeted human-review flags (`a1-prepositions-of-time`, `a2-already-yet-just`, and `c2-register-dependent-grammar`) and independent educator/Vietnamese review remain pending.

See [the final Placement QA summary](placement-final-qa.md), [the Placement assessment contract](placement-assessment.md), [the final vocabulary QA summary](vocabulary-final-qa.md), [the historical master vocabulary inventory report](master-vocabulary-inventory.md), and [the historical 298-record vocabulary audit](vocabulary-quality-audit.md) for inspectable evidence and exact limitations.
