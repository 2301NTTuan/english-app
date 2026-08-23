# Production architecture

## Assessment and preserved systems

The repository began as a well-structured client MVP. Its pure learning modules, stable content IDs, selectors, FSRS boundary, daily planner, placement engine, path engine, content validator, responsive shell, and unit tests were worth preserving. The demo-only boundary was persistence: one browser-owned JSON document, no identity, API, authorization, database, or multi-device concurrency model.

The production foundation adds PostgreSQL and Drizzle without moving learning rules into UI or route handlers. API handlers authenticate, validate, authorize, and persist; pure domain services still decide what to study and how performance changes mastery.

## Components

- `src/data`: authored source content, stable content identifiers, and application fallback data.
- `scripts/seed-content.ts`: idempotent content import with version/checksum tracking.
- `src/lib/learning` and `src/lib/fsrs`: deterministic business rules with unit tests.
- `src/lib/auth`: password, opaque-session, request-origin, body-size, and rate-limit boundaries.
- `src/app/api`: HTTP orchestration. User identity always comes from a verified session.
- `src/db`: normalized PostgreSQL schema and a lazy, bounded connection pool.
- `src/lib/storage`: browser compatibility repository plus authenticated remote repository.
- `src/components/app-provider.tsx`: loads cloud state, debounces writes, and exposes sync status.

## Persistence decision

The normalized schema is the intended system of record. The current user flow persists a validated, versioned `AppState` snapshot scoped to the account. This bridge avoids an unsafe rewrite of the tested learning engine and enables authentication and cross-device sync. It is deliberately transitional: session completion should ultimately write `study_sessions`, `study_session_items`, review state, mastery, mistakes, and activity in one server transaction with optimistic version checks.

## Technology decisions

Drizzle was selected because its SQL-visible migrations and typed schema fit the existing TypeScript/Next.js code without a generated client runtime. PostgreSQL provides constraints, JSONB for bounded evolving structures, transactional updates, mature backup tools, and local operation with Docker.

Credentials authentication uses bcrypt with cost 12 and random opaque 256-bit tokens. Only SHA-256 token digests are stored. This is simpler to revoke than stateless JWTs and keeps authorization anchored to current database state.

## Scaling and performance

The pool defaults to 10 connections per process. Composite indexes support due-review, user/date, knowledge, active-path, content-level/frequency, and session-idempotency queries. Browser lists already render bounded pages. Current bundled content remains in the client bundle, so the next performance milestone is server-side content pagination/search and route-specific loading. The in-memory rate limiter is single-process only.

## Known limitations

- Snapshot persistence is not yet the final normalized write path and uses last-write-wins across devices.
- Middleware checks cookie presence for navigation protection; every API independently verifies the hashed session in PostgreSQL. A forged cookie may reach the shell but cannot read or write account data.
- No password-reset delivery, email verification, MFA, administrator/content-editor roles, or session management UI.
- No telemetry backend, error tracker, queue, object storage, CDN design, or shared rate-limit store.
- No real-browser E2E suite or verified database integration run in the current WSL environment.
- The scheduler is FSRS-inspired, not a complete audited FSRS implementation.
