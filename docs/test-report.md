# Validation report

Latest full local browser verification date: 31 August 2026. It covers the completed Vocabulary, Grammar, Placement, and Expressions engineering baselines, pronunciation controls and accessibility, a migrated/seeded disposable test database, production build, and Playwright browser E2E. A focused pronunciation playback-state regression run on 1 September 2026 passed lint, typecheck, 121/121 unit tests, and the production build; the browser E2E result below remains from the 31 August run and was not rerun for this event-state-only fix. [GitHub CI run #15](https://github.com/2301NTTuan/english-app/actions/runs/33340474000) is retained only as historical CI evidence for earlier commit `be3d4b1`; it does not verify the current content head.

## Automated results

| Gate | Result | Evidence |
| --- | --- | --- |
| Content validation | PASS | 13/13 tests across two files, including Vocabulary, Grammar, Placement, Expressions, provenance, and master-inventory gates |
| ESLint | PASS | zero errors/warnings |
| TypeScript | PASS | `tsc --noEmit` |
| Unit tests | PASS | 121/121 tests across 26 files, including browser pronunciation voice selection, cancellation/stale-event handling, adaptive Placement simulations, and expanded-corpus planner/session selection |
| PostgreSQL integration | PASS | 15/15 tests against the freshly seeded disposable test database; 6,000 Vocabulary rows, 138 Grammar lessons, 612 Placement items/22 passages, and 1,621 Expressions verified |
| Browser E2E | PASS | 2/2 Chromium tests against the production server and disposable test database, including accessible UK/US pronunciation controls across representative A1–C2 Vocabulary records, Placement delivery, complete Grammar C2 catalogue, and Expressions retrieval beyond the former 107-record corpus |
| Production build | PASS | Next.js 16.3.2 Webpack build; application and API routes compiled, including PostgreSQL-backed Placement and Expressions routes |
| Runtime smoke | PASS | login/attribution 200, anonymous root 307, anonymous vocabulary API 401, health 200/ok with DB and 503/degraded against a deliberately unreachable DB, security headers present |
| Production dependency audit | PASS | zero production vulnerabilities |
| Full dependency audit | FAIL | four moderate development-only esbuild advisories through Drizzle Kit; available automatic change is breaking and was not forced |

Unit coverage includes UK/US browser pronunciation locale selection, cancellation, unavailable-voice and unsupported-API behavior, accessible labels, planning, the FSRS adapter, mastery, mistakes, streak, multidomain Placement simulations, stopping/confidence/exposure behavior, frequency-aware Vocabulary selection, complete Grammar/Expressions candidate selection, expression exercise generation, personalized paths, unambiguous exercise generation, prerequisites, content integrity, browser-state migration, password hashing, session-token hashing, rate limiting, request validation, health-response redaction, structured-log redaction, outbound email provider safety, and state validation. The database suite covers migrated-table presence and constraints, account isolation and cascades, atomic shared rate limiting, transactional and idempotent session/Placement writes, stale-device conflict rejection, authoritative state projection, reset, rollback on unknown Vocabulary/Grammar content, recovery-token lifecycles, legacy import normalization, database-backed Vocabulary filtering, complete Grammar retrieval, Placement bank delivery, and Expressions pagination/search/lifecycle counts.

## Environment constraint

The configured disposable PostgreSQL database is reachable and all integration tests pass. Docker Desktop's CLI remains unavailable inside this WSL distribution, but it is not needed for the configured test database. Playwright's Chromium runtime and required WSL system libraries are installed; CI installs the same dependencies before E2E.

## Production gates

- Compile, lint, unit/content tests, and production build: pass.
- Generated, reviewable SQL migration: pass.
- Real PostgreSQL migrated/seeded integration verification: pass.
- Browser E2E authentication, learning persistence, serious/critical axe checks on representative pages, hostile-input handling, wrong/unknown credential parity, forged/expired/revoked sessions, and cross-user isolation: pass.
- Placement item delivery is PostgreSQL-backed and server-scoped; production E2E verifies API-visible bank size 612, reading-passage rendering, and omission of the answer and explanation: pass.
- Expressions delivery is PostgreSQL-backed and authenticated; integration/E2E verify 1,621 validated-preview records, exact category/CEFR totals, pagination, and search retrieval of `collocation-legally-binding` beyond the former corpus: pass.
- Password recovery/email verification token lifecycle and provider adapter: pass. Deployment credentials, verified sender/domain, delivery monitoring, and operator support workflows remain launch blockers; no paid provider was configured.
- Normalized transactional learning-session and placement persistence: pass; per-account advisory locks and review-version checks reject stale event writes, while generic state sync is restricted to preferences.
- Content provenance: pass for repository-authored Grammar, Placement, Expressions, and enriched Vocabulary batches plus the licensed master Vocabulary inventory; independent review and production publication: incomplete.
- Bounded server-side Vocabulary and Expressions browse/search/filter retrieval: pass over all 6,000 and 1,621 seeded validated records respectively in local/test and `validated-preview`; searches reach records beyond the former 298/107 subsets. Placement uses its separate validated-preview channel. Default production filtering still exposes only `published` records for lifecycle-managed corpora, currently zero, so validated content is not silently promoted. Grammar has active flags but no per-lesson publication lifecycle.
- User-visible audited-source attribution: pass. Privacy/Terms operator identity and jurisdiction configuration: fail.
- Structured request/error/health/auth-abuse logging and request correlation: pass. External monitoring backend, alert routing, and backup retention remain deployment configuration. The 29 August restore drill passed using an isolated disposable schema without granting `CREATEDB`; row counts, content checksums, users, progress, reviews, and all 12 integration tests present at the time matched the source backup.

Result: **not production-ready**. The repository is a coherent production foundation with explicit launch blockers.

## Content Quality Audit

- Machine validated: the 6,000-unit master inventory, all 6,000 enriched Vocabulary records, 138 Grammar lessons, all 612 Placement items and 22 passages, all 1,621 Expressions, stable IDs, provenance links, duplicate candidates, metadata consistency, relation structure, Grammar prerequisites, and deterministic learning/Placement simulations.
- Machine-assisted vocabulary QA processed all 6,000 records and resolved 927 critical, 2,713 major, and 389 minor findings with zero unresolved. This is implementation QA, not independent educator review.
- Placement engineering baseline: **PASS** (612 items; vocabulary 210, grammar 200, context/use 120, reading 82; 22 passages; deterministic semantic sample 140/140; database/API/browser path verified).
- Grammar engineering baseline: **PASS** (138/138 production-detail lessons; deterministic semantic sample 60/60; database/API/browser/planner path verified).
- Expressions engineering baseline: **PASS** (303 idioms, 310 phrasal verbs, 1,001 collocations, 7 common expressions; 1,621 total; deterministic semantic sample 220/220; database/API/browser/planner/session path verified).
- Still requires independent review: English/Vietnamese editorial review, CEFR judgments, synonym/antonym/collocation nuance, polysemy modelling, Placement educator/distractor review, publication approval, learner calibration, reliability/fairness analysis, and psychometric validation.
- Vocabulary master inventory: **PASS** (6,000, provenance resolved, all stable IDs preserved).
- Core vocabulary enrichment: **PASS** (6,000/6,000 master IDs mapped to learner-facing records).
- Machine validation and QA: **PASS** (6,000/6,000 processed; zero unresolved critical, major, or minor findings).
- Independent educator/Vietnamese review: **EXTERNAL / NOT COMPLETE**.
- Production publication approval: **NOT COMPLETE**. Vocabulary, Placement, and Expressions have zero `published` records; Grammar lacks per-lesson lifecycle metadata. Grammar's three targeted human-review flags and Expressions' documented idiom/taxonomy flags remain open. Independent educator/native-speaker/Vietnamese review remains pending where documented; Placement empirical calibration, reliability/fairness analysis, and psychometric validation are also pending.

See the final QA summaries for [Vocabulary](vocabulary-final-qa.md), [Grammar](grammar-final-qa.md), [Placement](placement-final-qa.md), and [Expressions](expressions-final-qa.md); the [Placement assessment contract](placement-assessment.md); the [historical master Vocabulary inventory report](master-vocabulary-inventory.md); and the [historical 298-record Vocabulary audit](vocabulary-quality-audit.md) for inspectable evidence and exact limitations.
