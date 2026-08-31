ACTIVE GOAL:
Complete and runtime-verify an engineering-validated, editorially designed CEFR-aligned placement assessment bank.

STATUS: IN_PROGRESS

TOTAL TARGET: 600 minimum
TOTAL CURRENT: 458

VOCABULARY: 210 / 200 minimum
GRAMMAR: 200 / 200 minimum
CONTEXT_USE: 30 / 120 minimum
READING: 18 / 80 minimum

A1: 82
A2: 90
B1: 90
B2: 81
C1: 68
C2: 47

CURRENT DOMAIN: Context / language use
CURRENT CEFR: A1
LAST COMPLETED: Grammar expansion to 200 items and semantic review of all 170 new grammar items
NEXT ITEM: First new A1 context/use item

ISSUES FOUND: All 108 existing answers occupied option A; the exact prompt `Choose the natural combination.` appeared five times with different option sets; two existing rationales contained unnatural English. Initial vocabulary review found several contexts where a nearby same-POS distractor was also defensible or insufficiently excluded. No duplicate IDs were found.
ISSUES FIXED: The exported bank rotates choices deterministically across A-D while preserving stable IDs and answer text. Five repeated generic stems and two flawed rationales were corrected. All potentially ambiguous vocabulary contexts found in the semantic review were tightened, and the depict/portray contrast was separated across distractor sets.
CRITICAL UNRESOLVED: 0 known in the existing, vocabulary, or grammar populations; context/use and reading remain in progress.
HUMAN-REVIEW FLAGS: 0 item-specific flags recorded so far. Independent educator review and empirical learner calibration remain pending.

LAST VALIDATION: `npm run validate:content` PASS (10/10). Direct audit reports 458 scored items; vocabulary 210, grammar 200, context 30, reading 18; zero duplicate IDs, normalized prompts, or option sets; correct-answer positions A/B/C/D = 115/114/114/115. All 138 grammar topic IDs are represented.
LAST CHECKPOINT COMMIT: Expand placement vocabulary bank to 210 items (`07a5022`)
NEXT ACTION: Checkpoint the completed grammar phase, then expand and semantically review context/use to at least 120 items.
