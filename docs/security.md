# Security model

All browser input is untrusted. APIs accept JSON with content-type and size limits and validate it with Zod. Account identity is derived solely from an HttpOnly session cookie, whose random token is hashed before database storage. APIs never accept a user ID for account-scoped state.

Passwords are limited to 128 characters, require a minimum of 12 with basic complexity, and are hashed with bcrypt cost 12. Login performs a dummy bcrypt comparison for unknown emails. Login responses use a generic invalid-credentials error. Sessions expire after 30 days, use HttpOnly, SameSite=Lax, Path=/, and Secure in production, and are revocable on logout.

Password reset uses random 256-bit opaque tokens, stores only SHA-256 hashes, expires tokens after one hour, invalidates an earlier outstanding token, and atomically marks the token used, changes the bcrypt hash, and revokes existing sessions. Requests do not reveal whether an email exists. Production responses and logs never expose reset tokens. Email verification uses the same hashed, expiring, single-use design. An environment-configured outbound adapter supports disabled, local-development, and Resend delivery modes; provider credentials and the canonical application URL never live in source.

Mutating routes check same-origin requests and require JSON. Security headers disable framing and MIME sniffing, restrict referrers and browser permissions, and establish a CSP/HSTS baseline. Database failures and health responses do not expose stack traces, credentials, or query details.

## Threats and remaining controls

- Credential stuffing: partial mitigation through bcrypt and rate limiting; add shared limiting, breached-password checks, email alerts, and optional MFA.
- Session theft: cookie controls and stored hashes reduce impact; add session rotation, device/session management, and anomaly detection.
- CSRF: same-origin checks and SameSite cookies; add explicit tokens if cross-origin clients or form endpoints are introduced.
- XSS: React escaping and CSP baseline; remove `unsafe-inline` through CSP nonces before a high-assurance launch.
- SQL injection: parameterized Drizzle/pg calls; restrict runtime and migration database roles separately.
- Cross-account access: session-derived predicates plus integration and API-level browser coverage; user-supplied account IDs are ignored.
- Dependency risk: lockfile and CI audit; triage advisories and configure automated dependency updates.

The authentication limiter is in process only. A horizontally scaled deployment requires a shared atomic store and trusted-proxy configuration. Structured logs preserve request IDs and event names while filtering passwords, tokens, secrets, email/name fields, and answers. Password recovery and email verification require provider credentials, a verified sender/domain, delivery monitoring, and an operator support workflow before launch.
