# Validation report

Final local verification date: 23 August 2026.

## Automated results

| Gate | Result | Evidence |
| --- | --- | --- |
| Content validation | PASS | 3/3 tests |
| ESLint | PASS | zero errors/warnings |
| TypeScript | PASS | `tsc --noEmit` |
| Unit tests | PASS | 55/55 tests across 20 files |
| PostgreSQL integration | NOT AVAILABLE | 2 tests skipped because `TEST_DATABASE_URL`/Docker WSL integration is unavailable |
| Browser E2E | NOT AVAILABLE | acceptance catalogue exists; no Playwright suite |
| Production build | PASS | Next.js 16.3.2 Webpack build; 26 routes |
| Runtime smoke | PASS | login/privacy 200, anonymous root 307 to login, health 503/degraded without DB, security headers present |
| Production dependency audit | PASS | zero production vulnerabilities |
| Full dependency audit | FAIL | four moderate development-only esbuild advisories through Drizzle Kit; available automatic change is breaking and was not forced |

Unit coverage includes planning, scheduler behavior, mastery, mistakes, streak, placement, personalized paths, exercises, prerequisites, content integrity, browser-state migration, password hashing, session-token hashing, rate limiting, and state validation. The database suite covers migrated-table presence, account-scoped reads, and deletion cascades when a real test database is supplied.

## Environment constraint

Docker Desktop is installed on Windows but WSL integration for this distribution is unavailable, and no local `psql` client exists. PostgreSQL migration execution, seed execution, integration tests, and authenticated runtime flows therefore cannot be truthfully marked passed locally. CI provisions PostgreSQL and runs those gates.

## Production gates

- Compile, lint, unit/content tests, and production build: pass.
- Generated, reviewable SQL migration: pass.
- Real PostgreSQL migration/seed/integration verification: fail (not available locally).
- Browser E2E authentication and cross-user isolation: fail (suite not implemented).
- Password recovery/email verification: fail (not implemented).
- Normalized transactional learning-session persistence: fail (snapshot bridge remains).
- Content provenance/editorial approval: fail (process documented, review incomplete).
- Monitoring, alerting, backup retention, and restore drill: fail (runbook only).

Result: **not production-ready**. The repository is a coherent production foundation with explicit launch blockers.
