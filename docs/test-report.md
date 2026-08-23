# Validation report

Final local verification date: 23 August 2026.

## Automated results

| Gate | Result | Evidence |
| --- | --- | --- |
| Content validation | PASS | 3/3 tests |
| ESLint | PASS | zero errors/warnings |
| TypeScript | PASS | `tsc --noEmit` |
| Unit tests | PASS | 67/67 tests across 21 files |
| PostgreSQL integration | PASS | 10/10 tests against the migrated and seeded disposable test database |
| Browser E2E | PASS | 2/2 Chromium tests against the production server and disposable test database |
| Production build | PASS | Next.js 16.3.2 Webpack build; all application and API routes compiled and prerendered as expected |
| Runtime smoke | PASS | login/privacy 200, anonymous root 307 to login, health 503/degraded without DB, security headers present |
| Production dependency audit | PASS | zero production vulnerabilities |
| Full dependency audit | FAIL | four moderate development-only esbuild advisories through Drizzle Kit; available automatic change is breaking and was not forced |

Unit coverage includes planning, the FSRS adapter, mastery, mistakes, streak, multidomain placement simulations, stopping/confidence/exposure behavior, frequency-aware vocabulary selection, personalized paths, exercises, prerequisites, content integrity, browser-state migration, password hashing, session-token hashing, rate limiting, request validation, structured-log redaction, and state validation. The database suite covers migrated-table presence and constraints, account isolation and cascades, transactional and idempotent session/placement writes, calibration fields, rollback on unknown content, recovery-token lifecycles, legacy import normalization, and database-backed vocabulary filtering.

## Environment constraint

The configured disposable PostgreSQL database is reachable and all integration tests pass. Docker Desktop's CLI remains unavailable inside this WSL distribution, but it is not needed for the configured test database. Playwright's Chromium runtime and required WSL system libraries are installed; CI installs the same dependencies before E2E.

## Production gates

- Compile, lint, unit/content tests, and production build: pass.
- Generated, reviewable SQL migration: pass.
- Real PostgreSQL migrated/seeded integration verification: pass.
- Browser E2E authentication, learning persistence, accessibility, hostile-input handling, and cross-user isolation: pass.
- Placement item delivery is server-scoped; production E2E verifies that the current-item response omits the answer and explanation: pass.
- Password recovery/email verification token lifecycle: pass; secure outbound delivery and support workflows remain launch blockers.
- Normalized transactional learning-session and placement persistence: pass; non-event snapshot sync remains last-write-wins.
- Content provenance: pass for the repository-authored pilot; educator review and production publication: fail.
- Monitoring, alerting, backup retention, and restore drill: fail (runbook only).

Result: **not production-ready**. The repository is a coherent production foundation with explicit launch blockers.
