ACTIVE GOAL:
Complete and runtime-verify an engineering-validated, editorially designed CEFR-aligned placement assessment bank.

STATUS: IN_PROGRESS

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

CURRENT DOMAIN: Cross-bank QA
CURRENT CEFR: All levels
LAST COMPLETED: Reading expansion to 82 items across 22 passages and semantic review of all 64 new reading items
NEXT ITEM: First cross-bank structural and answer-pattern audit

ISSUES FOUND: All 108 existing answers occupied option A; the exact prompt `Choose the natural combination.` appeared five times with different option sets; two existing rationales contained unnatural English. Initial vocabulary review found several contexts where a nearby same-POS distractor was also defensible or insufficiently excluded. No duplicate IDs were found.
ISSUES FIXED: The exported bank rotates choices deterministically across A-D while preserving stable IDs and answer text. Five repeated generic stems and two flawed rationales were corrected. All potentially ambiguous vocabulary contexts found in the semantic review were tightened, and the depict/portray contrast was separated across distractor sets.
CRITICAL UNRESOLVED: 0 known across vocabulary, grammar, context/use, or reading; cross-bank QA and runtime verification remain in progress.
HUMAN-REVIEW FLAGS: 0 item-specific flags recorded so far. Independent educator review and empirical learner calibration remain pending.

LAST VALIDATION: `npm run validate:content` PASS (10/10). Direct audit reports 612 scored items across 22 passages; vocabulary 210, grammar 200, context 120, reading 82; zero duplicate IDs, normalized prompts, or broken passage references; correct-answer positions A/B/C/D = 153/153/153/153.
LAST CHECKPOINT COMMIT: Expand placement context bank to 120 items (`251ad13`)
NEXT ACTION: Checkpoint the completed reading phase, then run cross-bank structural QA, adaptive simulations, and runtime/DB/API/UI verification.
