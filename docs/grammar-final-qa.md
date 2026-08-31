# Grammar final QA

## Corpus

- Total curriculum: 138 stable, unique topics.
- Production-ready by the repository rubric: 138.
- CEFR counts: A1 24, A2 24, B1 26, B2 25, C1 24, C2 15.
- Incomplete/deprecated: 0 / 0. Near-duplicate progression topics retain their stable IDs and distinct scopes.
- Lifecycle: grammar has an `active` database flag but no per-lesson editorial status. Machine validation is complete; independent educator/Vietnamese review and publication approval are not.

## Machine validation

`grammarLessonIssues` and the complete content validator report zero missing fields, placeholder lessons, duplicate IDs/examples, broken prerequisites, prerequisite cycles, or malformed example/correction records. The seed and integration assertions require all 138 active topics to have 138 lesson rows and exact source-order IDs.

## Deterministic semantic sample

Method: for each CEFR level, select 10 curriculum positions using `floor(i * (levelCount - 1) / 9)` for `i = 0..9`. Each of the 60 lessons was checked for rule accuracy, learner clarity, Vietnamese support, form, natural target examples, genuine explained errors, useful contrast/restrictions, and CEFR/register fit.

- A1: `be`, `a1-object-pronouns`, `articles`, `a1-demonstratives`, `present-simple`, `a1-present-simple-vs-present-continuous`, `a1-possessive-s`, `a1-much-many`, `a1-prepositions-of-time`, `a1-basic-conjunctions`.
- A2: `past-simple`, `a2-past-simple-vs-past-continuous`, `a2-present-continuous-for-future`, `a2-superlatives`, `a2-must`, `must-have-to`, `present-perfect`, `a2-already-yet-just`, `a2-relative-clauses-basics`, `a2-both-either-neither-basics`.
- B1: `perfect-vs-past`, `b1-present-perfect-vs-present-perfect-continuous`, `b1-future-continuous`, `b1-first-conditional-review`, `reported-speech`, `b1-non-defining-relative-clauses`, `gerund-infinitive`, `b1-get-used-to`, `b1-so-such`, `b1-articles-intermediate`.
- B2: `third-conditional`, `advanced-passive`, `b2-should-have`, `b2-must-have`, `wish`, `b2-reporting-verbs-basics`, `b2-inversion-basics`, `b2-cleft-sentences`, `b2-subjunctive-basics`, `modal-perfect`.
- C1: `inversion`, `c1-not-only-but-also-inversion`, `c1-were-i-to`, `c1-advanced-modality`, `nominalisation`, `c1-substitution`, `c1-pseudo-cleft-sentences`, `c1-complex-prepositions`, `c1-advanced-emphasis`, `c1-advanced-conditionals`.
- C2: `stylistic-inversion`, `c2-complex-ellipsis`, `aspect-nuance`, `c2-formal-subjunctive`, `c2-register-dependent-grammar`, `c2-advanced-discourse-structures`, `c2-complex-embedded-clauses`, `c2-rhetorical-structures`, `c2-stylistic-fronting`, `advanced-cohesive-devices`.

Result: PASS 60/60 after one localized correction and re-review. The `advanced-cohesive-devices` sample originally used a less explicit *latter* reference than its explanation claimed; the example was replaced with two parallel, unambiguous antecedents. Nearby fronting punctuation, pseudo-cleft wording, and modal-perfect restriction wording were clarified. Re-review found no remaining issue and no systematic affected population.

## Runtime and database

- Source: 138 topics / 138 detailed / 138 production-ready; exact CEFR counts above.
- Seed: the existing idempotent seed imports every source topic and lesson, reactivates current IDs, and deactivates removed IDs.
- Development PostgreSQL after reseed: 138 active topics, 138 active lessons, 0 inactive topics; `advanced-cohesive-devices` is present with three examples.
- Server query/API: the database catalogue query returns 138 complete lessons in stable source order; `/api/content/grammar` exposes that query to authenticated clients. Integration coverage includes the final C2 lesson.
- Browser: `/grammar` receives the database catalogue, derives displayed level counts from it, and renders all 15 C2 topics. E2E coverage checks the count and final C2 title.
- Planner/session: the planner and generator use the complete authored `grammarTopics` corpus. Unit coverage forces selection of `advanced-cohesive-devices`, outside the former detailed subset.

## Human-review flags and limitations

Three targeted variety/editorial checks remain: `a1-prepositions-of-time` (BrE/AmE *weekend* usage), `a2-already-yet-just` (AmE past-simple alternative), and `c2-register-dependent-grammar` (*data* agreement across disciplines). The lessons already label these as variable rather than absolute.

This QA is machine/Codex review, not independent educator, translator, dialect, accessibility, or learner-outcome validation. Grammar still lacks per-lesson `validated/reviewed/published/retired` metadata.

## Final validation

All final gates passed:

- `npm run validate:content`: 2 files, 10 tests.
- `npm run content:stats`: 138 catalogue records, 138 detailed records, 138 production-qualified records, zero grammar quality issues or validation errors.
- `npm run lint` and `npm run typecheck`: pass.
- `npm test`: 25 files, 96 tests.
- `npm run test:integration`: 1 file, 13 tests against the test PostgreSQL database.
- `npm run build`: pass; `/api/content/grammar` and `/grammar` are dynamic routes.
- `npm run test:e2e`: 2 browser tests pass, including the authenticated API and 15-topic C2 browser assertions.
- Development and test `db:seed`: pass with checksum `28ae8df5f910` and 138 grammar topics.
- Deterministic semantic QA: 60/60 pass after the documented correction and re-review.
