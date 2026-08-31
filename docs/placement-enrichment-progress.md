ACTIVE GOAL:
Complete and runtime-verify an engineering-validated, editorially designed CEFR-aligned placement assessment bank.

STATUS: COMPLETE

TOTAL TARGET: 600 minimum
TOTAL CURRENT: 612

VOCABULARY: 210 / 200 minimum
GRAMMAR: 200 / 200 minimum
CONTEXT_USE: 120 / 120 minimum
READING: 82 / 80 minimum

A1: 100
A2: 122
B1: 122
B2: 113
C1: 90
C2: 65

CURRENT DOMAIN: Complete
CURRENT CEFR: All levels
LAST COMPLETED: Full structural/semantic QA, adaptive simulations, and source-to-seed/database/API/browser runtime verification
NEXT ITEM: None in the engineering baseline

ISSUES FOUND: All 108 existing answers occupied option A; the exact prompt `Choose the natural combination.` appeared five times with different option sets; two existing rationales contained unnatural English. Initial vocabulary review found several contexts where a nearby same-POS distractor was also defensible or insufficiently excluded. No duplicate IDs were found.
ISSUES FIXED: The exported bank rotates choices deterministically across A-D while preserving stable IDs and answer text. Five repeated generic stems and two flawed rationales were corrected. All potentially ambiguous vocabulary contexts found in the semantic review were tightened, and the depict/portray contrast was separated across distractor sets.
CRITICAL UNRESOLVED: 0 known across vocabulary, grammar, context/use, reading, adaptive behavior, or runtime integration.
HUMAN-REVIEW FLAGS: 0 item-specific flags recorded. Independent educator review, learner calibration, psychometric validation, and publication approval remain pending.

LAST VALIDATION: PASS — `npm run validate:content` (11/11), `npm run content:stats`, `npm run lint`, `npm run typecheck`, `npm test` (105/105), `npm run test:integration` (14/14), `npm run build`, and `npm run test:e2e` (2/2). Development and test PostgreSQL each contain 612 validated items, 22 validated passages, and 82 validated reading items. The deterministic semantic sample passed 140/140; direct QA reports zero critical issues or warnings and exact A/B/C/D positions of 153/153/153/153.
LAST CHECKPOINT COMMIT: Expand placement reading bank to 82 items (`fa9de2e`)
NEXT ACTION: Independent educator review, learner piloting/calibration, reliability/fairness and psychometric review, then publication approval; do not extend the engineering corpus merely to raise counts.
