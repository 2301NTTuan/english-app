# Deployment content availability fix

STATUS: COMPLETE — CODE READY; VERCEL ENVIRONMENT CHANGE AND DEPLOYMENT REQUIRED

VOCABULARY ROOT CAUSE: The deployed production process uses the default `published` release gate. Supabase contains 6,000 active vocabulary rows, but all 6,000 are `validated` and none are `published`. `CONTENT_RELEASE_CHANNEL` is missing locally and the deployed API behavior proves no validated-preview override is active.

GRAMMAR ROOT CAUSE: The catalogue and database contain all 138 real lessons, but the grammar browser renders cards/previews without a lesson link and the application has no `/grammar/[id]` detail route. The deployed `/grammar/be` request returns 404.

LAST COMPLETED: Verified the optimized production build against Supabase and passed the full lint, typecheck, unit, PostgreSQL integration, build, and Chromium E2E gates.

NEXT ACTION: In Vercel, set `CONTENT_RELEASE_CHANNEL=validated-preview` for Production and Preview while this deployment remains a public dev/staging environment, then deploy this commit. Remove the Production value before a true published-only launch.

DB COUNTS: Vocabulary 6,000 total / 6,000 active / 6,000 validated / 0 published. Grammar 138 topics / 138 active topics / 138 lessons / 138 active lessons.

ENV FINDINGS: Local DATABASE_URL SET; DATABASE_SSL SET; CONTENT_RELEASE_CHANNEL MISSING; NODE_ENV MISSING outside a Next.js runtime (expected). Vercel DATABASE_URL SET and valid by authenticated database behavior; CONTENT_RELEASE_CHANNEL MISSING by the deployed release result; NODE_ENV SET to production by Next.js/Vercel. Vercel DATABASE_SSL cannot be read without Vercel project settings access, but the live database connection succeeds. Required change: CONTENT_RELEASE_CHANNEL / validated-preview / Production and Preview for the current public dev/staging deployment.

VALIDATION: Baseline deployed: vocabulary API HTTP 200, 0 items, total 0, page 1, pageSize 24, pageCount 1; grammar API HTTP 200, 138 items; `/grammar/be` HTTP 404. Fixed local production mode with Supabase: vocabulary HTTP 200, 24 items/page, total 6,000, 250 pages, distinct page 2; grammar API 138; vocabulary page, grammar page, and `/grammar/be` HTTP 200. Lint PASS. Typecheck PASS. Unit PASS (32 files, 167 tests). Integration PASS (19 tests). Build PASS. Chromium E2E PASS (9 tests), including vocabulary API/page/error states and grammar lesson/invalid-ID navigation.

LAST COMMIT: Fix deployed vocabulary and grammar access (this commit)
