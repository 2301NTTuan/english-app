# English Mastery

English Mastery is a local-first, responsive English-learning MVP for systematic CEFR study from A1 to C2. It prioritizes overdue reviews and weak knowledge before introducing new material.

## Implemented features

- Adaptive dashboard with generated daily plan, estimated time, streak, due reviews, weak knowledge, and progress
- Plan-driven guided sessions composed from real overdue, due, weak, mistake, and new items
- Vocabulary, grammar, and collocation exercises with immediate feedback, confidence ratings, and a completion summary
- Vocabulary library with bilingual meanings, examples, lexical relations, collocations, and multidimensional mastery
- Structured A1–C2 grammar curriculum, representative lessons, dependencies, topic mastery, and subtopic mastery
- Idioms, phrasal verbs, collocations, and common expressions with Vietnamese support and usage notes
- Mistake bank that groups repeated errors and returns them to planning
- Review queue, FSRS-inspired scheduling adapter, progress analytics, recent activity, and adjustable settings
- A 30-question adaptive placement test with vocabulary, grammar, and natural-context diagnostics
- Dynamic learning paths derived from placement, mastery, prerequisites, due reviews, and recurring mistakes
- Frequency-aware new-word selection and metadata-driven exercise generation with ambiguity safeguards
- Versioned browser persistence with migration, validation, JSON backup/restore, and no account or backend requirement

## Architecture

```text
src/
  app/                 Next.js App Router pages
  components/          shared shell, UI, state provider, session player
  data/                curated vocabulary, grammar, expressions, exercises
    vocabulary/        stable-ID CEFR/topic vocabulary batches
    placement.ts       authored adaptive placement pool
  lib/content/         normalization and whole-dataset validation
  lib/learning/        daily-plan, mastery, prerequisite logic and tests
  lib/fsrs/            replaceable scheduling adapter
  lib/storage/         local persistence repository
  types/               domain contracts
```

Business rules are pure TypeScript modules. UI components consume selectors and a single application provider; they do not access `localStorage` directly. The scheduling boundary can later wrap a full FSRS package without changing feature code. The repository can similarly be replaced by IndexedDB or an API.

## Install and run

Requires a current Node.js LTS release and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Validation commands:

```bash
npm run lint
npm run typecheck
npm test
npm run validate:content
npm run build
```

## Content architecture and validation

Vocabulary is split into a core catalogue and independently maintainable batches under `src/data/vocabulary/`. IDs are authored and stable because review history references them; never derive an ID from array position for new batches or rename a published ID casually. Each item may include CEFR, frequency band/rank, practical topics, bilingual meanings, examples, lexical relations, word families, and collocations.

`npm run validate:content` runs the complete dataset through duplicate, schema, relationship, prerequisite, and exercise-reference checks. It rejects duplicate IDs/senses, empty meanings, malformed examples and relations, self-references, synonym/antonym conflicts, broken grammar prerequisites, and ambiguous exercise option sets. Add vocabulary in a new CEFR/topic batch, export it from `src/data/vocabulary.ts`, then run content validation. Add grammar through the structured catalogue and ensure every prerequisite uses an existing stable topic ID.

The vocabulary browser searches words, English/Vietnamese meanings, topics, synonyms, and collocations, and renders 24 records at a time so larger catalogues do not create thousands of live cards.

## Placement and personalized learning

The placement route uses a 36-question A1–C2 pool and asks 30 bounded adaptive questions. Correct evidence moves challenge selection upward; incorrect evidence moves it downward while the selector balances vocabulary, grammar, and context. Results store the estimated learning level, dimension scores, topic scores, strong/weak areas, date, and individual answers. The wording deliberately treats this as a learning estimate rather than certification.

The learning path is recalculated from placement diagnostics, current mastery, grammar prerequisites, FSRS due state, mistake recurrence, CEFR suitability, frequency, and exposure. It determines which new content is appropriate; the scheduler remains responsible for when learned content returns.

## Exercise generator

Metadata-driven generators currently cover recognition, bilingual/definition recall, contextual selection, synonym, antonym, word-family, grammar contrast, and error correction, alongside curated fill-in-the-blank and collocation exercises. Distractors are ranked by part of speech, CEFR proximity, topic, frequency, and lexical exclusions. Generated choice sets are skipped unless they contain four unique options and exactly one correct answer. Each exercise carries inferred difficulty and targets one mastery dimension.

## Adaptive learning system

`buildDailyPlan` fills daily capacity in this order:

1. Overdue vocabulary and grammar
2. Due vocabulary and grammar
3. Previous mistakes
4. Weak vocabulary and grammar dimensions
5. New vocabulary
6. New grammar

All due reviews remain in the plan even when they exceed the daily target. New words use only capacity remaining after reviews, weaknesses, and mistakes. At or above the target, the new-word allowance becomes zero. `maxNewWordsPerDay` is a ceiling, never a forced quota.

The session builder translates each allocation into a suitable exercise and targets the learner's weakest vocabulary dimension. Vocabulary review state tracks difficulty, stability, retrievability-sensitive intervals, scheduling state, review dates, successes, failures, and lapses. Desired retention changes future intervals. Grammar recommendations require prerequisite mastery, and practice updates both topic and weakest-subtopic mastery.

## Current limitations

- The scheduler is a compact FSRS-inspired adapter, not a full FSRS implementation.
- Seed content currently includes 192 words, the full 138-topic A1–C2 grammar catalogue with 35 richer representative lessons, and 107 expressions (30 idioms, 30 phrasal verbs, 40 collocations, and 7 common expressions).
- State is browser-local and intended for one learner and one device.
- Generated sessions still rely on a deliberately small curated content set and exercise template library.
- No authentication, backend, audio, speech recognition, AI tutor, or complete A1–C2 corpus.

## Recommended next phase

1. Continue high-quality modular vocabulary batches toward broad A1–C2 coverage.
2. Expand the remaining grammar catalogue entries into fully authored bilingual lessons.
3. Replace scheduling internals with `ts-fsrs` and move persistence to IndexedDB when dataset/session scale requires it.
