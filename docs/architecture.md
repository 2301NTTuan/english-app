# Production architecture

## Assessment and preserved systems

The repository began as a well-structured client MVP. Its pure learning modules, stable content IDs, selectors, FSRS boundary, daily planner, placement engine, path engine, content validator, responsive shell, and unit tests were worth preserving. The demo-only boundary was persistence: one browser-owned JSON document, no identity, API, authorization, database, or multi-device concurrency model.

The production foundation adds PostgreSQL and Drizzle without moving learning rules into UI or route handlers. API handlers authenticate, validate, authorize, and persist; pure domain services still decide what to study and how performance changes mastery.

## Components

- `src/data`: authored source content, stable content identifiers, and application fallback data.
- `scripts/seed-content.ts`: idempotent content import with version/checksum tracking.
- `src/lib/learning` and `src/lib/fsrs`: deterministic business rules and a stable adapter around `ts-fsrs` FSRS v6.
- `src/lib/auth`: password, opaque-session, request-origin, body-size, and rate-limit boundaries.
- `src/app/api`: HTTP orchestration. User identity always comes from a verified session.
- `src/db`: normalized PostgreSQL schema and a lazy, bounded connection pool.
- `src/lib/storage`: browser compatibility repository plus authenticated remote repository.
- `src/components/app-provider.tsx`: loads cloud state, debounces writes, and exposes sync status.

## Persistence decision

The normalized schema is the system of record for core learning events. Session completion atomically inserts one idempotent session and its answers, then upserts vocabulary/grammar mastery, review state, mistakes, preferences, an active learning path, audit evidence, and the hydration snapshot. Placement completion follows the same pattern for attempts and diagnostic answers. Unknown content references abort the whole transaction. Replaying an idempotency key returns success without changing review counts or path versions.

The validated, versioned `AppState` snapshot remains a compatibility fallback for explicit browser-data import and recovery. Hydration is projected from normalized preferences, progress, review, mistake, session, and placement rows. General debounced state saves can update preferences only; they cannot overwrite learning events. Per-account advisory locks serialize session and placement completion, and stale review versions return an explicit conflict.

## Technology decisions

Drizzle was selected because its SQL-visible migrations and typed schema fit the existing TypeScript/Next.js code without a generated client runtime. PostgreSQL provides constraints, JSONB for bounded evolving structures, transactional updates, mature backup tools, and local operation with Docker.

Credentials authentication uses bcrypt with cost 12 and random opaque 256-bit tokens. Only SHA-256 token digests are stored for sessions, password recovery, and email verification. Successful password reset consumes its token and revokes all prior sessions in one transaction.

## Scaling and performance

The pool defaults to 10 connections per process. Composite indexes support due-review, user/date, knowledge, active-path, content-level/frequency, and session-idempotency queries. The vocabulary browser uses authenticated database search and filters with a hard 24-record page limit; it does not import its catalogue into the route bundle. Other study planners still use the 298-record authored fallback corpus, so completing route-specific retrieval before expanding content remains a performance milestone. Authentication throttling uses an atomic PostgreSQL table in production and retains an in-memory backend only for local/test use.

## Known limitations

- Middleware checks cookie presence for navigation protection; every API independently verifies the hashed session in PostgreSQL. A forged cookie may reach the shell but cannot read or write account data.
- Password-reset and email-verification lifecycles and an environment-configured outbound adapter exist; deployment still requires provider credentials, sender/domain verification, and support procedures. MFA, administrator/content-editor roles, and session management UI remain pending.
- Structured request, slow-request, unhandled-error, database-health, and authentication-abuse logs are available; deployment still needs a telemetry/error backend and alert routing. No queue, object storage, or CDN design is currently required by implemented product flows.
- Playwright requires the standard Ubuntu Chromium system libraries (`sudo npx playwright install-deps chromium`) in a fresh WSL distribution.
