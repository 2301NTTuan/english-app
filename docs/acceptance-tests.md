# Acceptance test catalogue

| Feature | Input | Expected output | Automated evidence |
| --- | --- | --- | --- |
| Register | valid name/email/strong password | account, defaults, snapshot, session | database/E2E pending |
| Register | duplicate email | safe 409; no duplicate account | database/E2E pending |
| Login | correct credentials | revocable HttpOnly session | E2E pending |
| Login | wrong or unknown credentials | same generic 401 | unit primitives; E2E pending |
| Protected route | no cookie | redirect to `/login` with internal return path | runtime smoke |
| State API | no/forged/expired session | 401; no data | database/E2E pending |
| Account isolation | two users and scoped query | only session owner’s row | database integration test (requires PostgreSQL) |
| Daily planner | backlog exceeds target | reviews dominate; zero new material | unit tests |
| Grammar path | unmet prerequisite | dependent topic locked | unit tests |
| Review | Again/Hard/Good/Easy | ordered, distinct scheduling behavior | unit tests |
| Placement | beginner/intermediate/advanced evidence | bounded CEFR learning estimate | unit tests |
| Session answer | incorrect | mistake/relearning and mastery update | unit tests; normalized integration pending |
| Import | malformed or over 1 MB | rejected without state change | schema unit; E2E pending |
| Delete account | password plus `DELETE` | account and owned rows removed | cascade integration; E2E pending |
| Health | database unavailable | HTTP 503 `{status:"degraded"}` only | runtime smoke |

Automate these with Playwright against an isolated migrated database before release:

1. Registration validates input, creates exactly one account/default state, and sets an HttpOnly session. Duplicate registration is safe.
2. Login rejects wrong and unknown credentials generically, throttles attempts, creates a revocable session, and logout invalidates it.
3. Anonymous navigation redirects to login; expired or forged cookies cannot read or update `/api/state`.
4. Two accounts save distinct state. Supplying another user ID has no effect. Deleting one account does not modify the other.
5. Learning survives refresh and a second browser. Completion retries do not duplicate records once normalized writes are enabled.
6. Legacy/file imports require confirmation, reject malformed/oversized payloads, and replace only the signed-in account.
7. Export/import round-trips state. Reset requires confirmation. Deletion requires password and `DELETE`, clears the cookie, and cascades owned rows.
8. Content seed is idempotent; validation passes; stable IDs and relationships survive a second seed.
9. Health returns 200/`ok` with PostgreSQL and 503/`degraded` without it, with no diagnostics.
10. Keyboard navigation reaches the skip link, labeled forms, errors, menu, core learning controls, and legal links; layouts remain usable under zoom.

This catalogue is not evidence that browser E2E tests have run. Results are in `docs/test-report.md`.
