ACTIVE GOAL:
Complete and runtime-verify a production-quality engineering baseline for the Expressions corpus.

STATUS: COMPLETE

IDIOMS TARGET: 300 minimum
IDIOMS COMPLETE: 303

PHRASAL VERBS TARGET: 300 minimum
PHRASAL VERBS COMPLETE: 310

COLLOCATIONS TARGET: 1000 minimum
COLLOCATIONS COMPLETE: 1001

OTHER EXISTING EXPRESSIONS: 7 common expressions

TOTAL CURRENT: 1621
TOTAL PRODUCTION-READY: 1621 by the current engineering/Codex gate (independent educator review not complete)

CURRENT CATEGORY: Complete
CURRENT CEFR: A1–C2
LAST COMPLETED: Full final validation and documentation reconciliation; deterministic semantic sample 220/220 and source-to-session runtime verification PASS
NEXT ITEM: None in the Expressions engineering-baseline task

CRITICAL ISSUES: 0 unresolved; automated audit reports no duplicate IDs/text/semantic records/examples, malformed records, placeholders, or suspicious near duplicates.
MAJOR ISSUES: 0 unresolved.
MINOR ISSUES: Lexical multiword verbs such as `deal with`, `look for`, `count on`, and `look forward to` are deliberately retained in the learner-facing phrasal-verb unit and should receive educator taxonomy review. Expression attempts are persisted as study-session items, but expression-specific mastery/review projection is not yet exposed in `AppState`.
HUMAN-REVIEW FLAGS: `idiom-hobsons-choice` and `idiom-gild-the-lily` need independent frequency/register and CEFR confirmation. `deal with`, `look for`, `count on`, and `look forward to` need learner-facing phrasal-verb versus lexical multiword/prepositional-verb taxonomy confirmation. Independent educator/native-speaker and Vietnamese editorial review remain pending for the whole corpus.

LAST VALIDATION: `validate:content` 13/13, content stats/count gate, lint, typecheck, unit 108/108, integration 15/15, production build, and Chromium E2E 2/2 PASS. Expressions total 1,621 and semantic sample 220/220 PASS; test DB contains 1,621 active validated expressions. Exact counts: idioms 303, phrasal verbs 310, collocations 1,001, common expressions 7; A1 115, A2 245, B1 414, B2 573, C1 268, C2 6; zero critical issues or near-duplicate groups.
LAST CHECKPOINT COMMIT: Runtime integration `a933437`
NEXT ACTION: Independent educator/native-speaker and Vietnamese editorial review, then publication approval; outside this completed task.
