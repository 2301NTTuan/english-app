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
- Versioned browser persistence with migration, validation, JSON backup/restore, and no account or backend requirement

## Architecture

```text
src/
  app/                 Next.js App Router pages
  components/          shared shell, UI, state provider, session player
  data/                curated vocabulary, grammar, expressions, exercises
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
npm run build
```

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
- Seed content currently includes 120 words, the full 137-topic A1–C2 grammar catalogue with 15 richer representative lessons, and 107 expressions (30 idioms, 30 phrasal verbs, 40 collocations, and 7 common expressions).
- State is browser-local and intended for one learner and one device.
- Generated sessions still rely on a deliberately small curated content set and exercise template library.
- No authentication, backend, audio, speech recognition, AI tutor, or complete A1–C2 corpus.

## Recommended next phase

1. Replace scheduling internals with `ts-fsrs`, calibrate desired retention, and add scheduler simulation tests.
2. Add content-driven exercise generators and dedicated grammar lesson flows with richer bilingual explanations.
3. Move persistence to IndexedDB with schema migration, import/export, and robust session resume support.
