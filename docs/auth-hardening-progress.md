# Authentication hardening progress

STATUS: COMPLETE
CURRENT PHASE: Completed
LAST COMPLETED: Full validation, local production smoke testing, reviewed commit `Fix signup validation and error handling`, and clean working-tree verification.
NEXT ACTION: None for this task; do not push.

REGISTER FINDINGS: Duplicate registration was reaching a PostgreSQL `23505` unique violation and the route handled every `23505` as a message-only conflict. The client trusted response prose, so unexpected/unmapped failures could collapse into generic unavailable UX. Name/email lacked live feedback, rate-limit storage failures were indistinguishable from exhausted limits, and the pending state lacked a synchronous guard against same-tick repeated submits.

FIXES: Added a stable register code/field-error contract; recognized only wrapped `users_email_unique` violations; preserved trim/lowercase normalization plus the database constraint; mapped codes to deterministic UI copy; added duplicate sign-in, forgot-password, and enumeration-safe resend actions; added live name/email checks; retained shared password/confirmation feedback and visibility toggles; made account/state/token creation atomic; kept email delivery after commit with a recoverable failure state; prevented registration sessions until verification; distinguished 429 + Retry-After from 503; and guarded simultaneous form submits with a ref plus disabled/loading UI.

TEST STATUS: PASS — lint (0 warnings/errors), typecheck, unit (154/154), integration (18/18), build, focused registration E2E (6/6), production auth/security E2E (2/2). Local production HTTP smoke confirmed 201 new account, 409 exact duplicate, 409 case/space duplicate, 400 invalid email, 400 short password, and 429 with Retry-After; smoke data was removed afterward.

REGISTER: Account initialization and the hashed verification token are transactional; trim/lowercase normalization and the users_email_unique constraint prevent case variants; no session is created; known delivery failure is reported without rolling back the account.
LOGIN: Password is validated before a structured `EMAIL_NOT_VERIFIED` result; only verified accounts receive sessions.
EMAIL VERIFICATION: Random hashed expiring single-use tokens return verified, already-verified, expired, and invalid outcomes.
RESEND VERIFICATION: Public, IP/account rate limited, enumeration-safe, replaces outstanding tokens, and skips unknown or verified accounts.
FORGOT PASSWORD: Enumeration-safe token issuance, delivery adapter, clear wording, and production E2E coverage are in place.
RESET PASSWORD: Hashed expiring single-use tokens, session revocation, and shared live password/confirmation feedback are in place.
SESSION SECURITY: Opaque hashed database sessions and secure cookie controls exist; current-user resolution and protected navigation reject stale sessions for unverified accounts.
RATE LIMITING: Registration, login, verification, resend, forgot, and reset routes use the shared limiter; registration distinguishes exhausted limits (429 + Retry-After) from unavailable limiter storage (503); production refuses process-local storage.
EMAIL DELIVERY: Disabled/development/Resend adapter and trusted `APP_BASE_URL` behavior exist; registration distinguishes sent from known delivery failure without rolling back the account.
AUTH UI: Registration/login show verification-required states; duplicate email maps by code to a specific message plus sign-in, forgot-password, and enumeration-safe resend actions; registration validates all fields live and prevents simultaneous requests.
TESTS: Complete required matrix passes at schema, route, database integration, and production-browser levels; raw database detail and passwords are not returned or logged.

CRITICAL ISSUES: None currently known.
LAST VALIDATION: `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:integration`, `npm run build`, focused registration E2E, production auth E2E, and local production HTTP smoke all PASS.
LAST COMMIT: `Fix signup validation and error handling` (current task).
