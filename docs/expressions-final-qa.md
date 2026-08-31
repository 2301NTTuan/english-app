# Expressions final QA

Final engineering QA date: 31 August 2026.

## Corpus and lifecycle

| Category | Validated records |
| --- | ---: |
| Idioms | 303 |
| Phrasal verbs | 310 |
| Collocations | 1,001 |
| Common expressions | 7 |
| **Total** | **1,621** |

CEFR distribution is A1 115, A2 245, B1 414, B2 573, C1 268, and C2 6. All 1,621 records are `validated`; zero are `reviewed`, `published`, or `retired`. Completing this engineering baseline does not authorize production publication.

## Structural and content QA

- Stable unique IDs: 1,621/1,621; duplicate IDs: zero.
- Exact normalized expression duplicates: zero.
- Duplicate semantic records (kind + expression + meaning): zero.
- Duplicate examples, malformed records, placeholders, and suspicious near-duplicate groups: zero.
- Required English meaning, natural Vietnamese meaning, example, CEFR, topic, usage note, lifecycle, and phrasal-verb metadata checks: pass.
- Corpus gates: idioms >=300, phrasal verbs >=300, collocations >=1,000, and total >=1,600: pass.

The audit preserved existing stable IDs and legitimate miscellaneous expressions. Four repeated English meaning strings occur on different expressions; inspection confirmed that they describe legitimate distinct lexical records rather than duplicate expression/meaning pairs. A recurring phrasal-verb separability defect affecting `take up`, `take over`, `take off`, `carry out`, and `go over` was corrected across the affected population before revalidation.

## Deterministic semantic sample

Result: **220/220 PASS**: 60 idioms, 60 phrasal verbs, and 100 collocations.

Each category is selected deterministically from stable IDs in CEFR buckets and covers at least five CEFR levels. Codex review checked meaning accuracy, natural Vietnamese, whether the example demonstrates the intended sense, genuine modern usage, category, plausible CEFR, and relevant register or phrasal-verb behavior. Automated regression coverage reproduces the sample and verifies its size, uniqueness, level coverage, lifecycle, and required semantic fields.

This is Codex/machine semantic QA, not a replacement for independent educator, native-speaker, or Vietnamese editorial review. Independent review remains incomplete.

## Runtime verification

- Source: 1,621 validated records with the exact category and CEFR counts above.
- Seed: the existing idempotent content seed imports all records, carries lifecycle state, reactivates current IDs, and retires missing IDs.
- Test PostgreSQL: 1,621 active validated expression rows; the normalized collocations table contains 1,001 active rows.
- Server query/API: the authenticated database query supports release-channel filtering, pagination, search, kind, CEFR, and topic. On `validated-preview`, it reports and exposes all 1,621 records.
- Browser: `/expressions` is database/API-backed and paginated. Chromium E2E verifies `1–24 of 1621` and retrieves `collocation-legally-binding`, a record outside the former 107-record corpus.
- Planner/session: the C2 candidate set contains all 1,621 records; unit coverage reaches `collocation-legally-binding` and generates an expression exercise in an adaptive session.

Production's default release channel exposes only `published` records, so these validated records remain unavailable there until editorial approval or an explicitly configured validated-preview environment. They were deliberately not marked `published` to bypass the release gate.

## Human-review flags and known limitations

- `idiom-hobsons-choice`: confirm contemporary frequency, register, and CEFR.
- `idiom-gild-the-lily`: confirm contemporary frequency, register, and CEFR.
- `deal with`, `look for`, `count on`, and `look forward to`: confirm learner-facing phrasal-verb versus lexical multiword/prepositional-verb taxonomy.
- Independent educator/native-speaker and Vietnamese editorial review remains pending for the full corpus.
- Study-session attempts are persisted, but expression-specific mastery/review projection is not yet represented in `AppState`; the current runtime gate covers candidate selection and exercise/session delivery.

## Validation evidence

- Content validation and statistics: pass, including exact count gates and zero critical audit issues.
- ESLint and TypeScript: pass.
- Content validation: 13/13 pass; full unit suite: 108/108 pass.
- Test database migration and seed: pass at 1,621 expressions.
- PostgreSQL integration: 15/15 pass, including category/CEFR counts and expanded-corpus search.
- Production build: pass; `/api/content/expressions` is a dynamic route and `/expressions` builds successfully.
- Chromium E2E: 2/2 pass, including authenticated API and browser retrieval from the expanded corpus.
