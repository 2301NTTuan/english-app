# Acceptance test catalogue

| Feature | Input | Expected output | Automated evidence |
| --- | --- | --- | --- |
| Register | valid name/email/strong password | account, defaults, snapshot, session | database integration and Playwright |
| Register | duplicate email | safe 409; no duplicate account | database integration |
| Login | correct credentials | revocable HttpOnly session | Playwright |
| Login | wrong or unknown credentials | same generic 401 | Playwright production flow |
| Protected route | no cookie | redirect to `/login` with internal return path | runtime smoke |
| State API | no/forged/expired/revoked session | 401; no data | Playwright production flow |
| Account isolation | two users and scoped query | only session owner’s row | database integration test (requires PostgreSQL) |
| Daily planner | backlog exceeds target | reviews dominate; zero new material | unit tests |
| Grammar path | unmet prerequisite | dependent topic locked | unit tests |
| Review | Again/Hard/Good/Easy | ordered, distinct scheduling behavior | unit tests |
| Placement | strong/foundation/uneven/random evidence | bounded multidomain estimate and calibrated confidence | simulations and Playwright |
| Placement delivery | active attempt | one server-selected item; no corpus or answer key | Playwright production flow |
| Session answer | correct and incorrect | unambiguous feedback, mistake/relearning, FSRS and mastery update | unit, integration, and Playwright |
| Import | malformed or over 1 MB | rejected without state change | schema unit and Playwright |
| Delete account | password plus `DELETE` | account and owned rows removed | cascade integration and Playwright |
| Health | database unavailable | HTTP 503 `{status:"degraded"}` only | runtime smoke |
| Vocabulary catalogue | search/CEFR/POS/topic/frequency/page | authenticated bounded database response over 6,000 seeded rows, max 24 rows; terminal corpus ID remains reachable | PostgreSQL integration and production build |
| Password reset request | known or unknown email | same generic response; production omits token URL | integration, unit delivery adapter, and route implementation |
| Email verification | valid/expired/reused token | one successful use; later/expired use rejected | PostgreSQL integration and verification UI/API |
| Hostile/invalid API input | foreign origin, wrong media type, malformed or oversized JSON | 403/415/400/413 without mutation | Playwright production flow |

Automate these with Playwright against an isolated migrated database before release:

1. Registration validates input, creates exactly one account/default state, and sets an HttpOnly session. Duplicate registration is safe.
2. Login rejects wrong and unknown credentials generically, throttles attempts through an atomic PostgreSQL backend in production, creates a revocable session, and logout invalidates it. Generic rejection, shared throttling, and revocation are automated.
3. Anonymous navigation redirects to login; expired, revoked, or forged cookies cannot read `/api/state`.
4. Two accounts save distinct state. Supplying another user ID has no effect. Deleting one account does not modify the other.
5. Learning survives refresh and another device. Completion retries do not duplicate records, stale review versions return a conflict, and preference sync cannot overwrite normalized progress or events.
6. Legacy/file imports require confirmation, reject malformed/oversized payloads, and replace only the signed-in account.
7. Export/import round-trips state. Reset requires confirmation. Deletion requires password and `DELETE`, clears the cookie, and cascades owned rows.
8. Content seed is idempotent; validation passes; stable IDs and relationships survive a second seed.
9. Health returns 200/`ok` with PostgreSQL and 503/`degraded` against a deliberately unreachable endpoint, with no topology or stack diagnostics.
10. Keyboard navigation reaches the skip link, labeled forms, errors, menu, core learning controls, and legal links; layouts remain usable under zoom.

The 29 August 2026 Playwright run covers registration, email verification, adaptive placement, correct and incorrect learning answers, mistake/FSRS persistence, logout/login persistence, wrong/unknown credentials, forged/expired/revoked sessions, cross-account scope, hostile origin, wrong media type, malformed JSON, oversized JSON, password reset, and account deletion. Duplicate and stale session submissions are covered by PostgreSQL integration tests. The most recent execution evidence and environment details are in `docs/test-report.md`.
