ACTIVE GOAL:
Complete and runtime-verify an engineering-validated, editorially designed CEFR-aligned placement assessment bank.

STATUS: IN_PROGRESS

TOTAL TARGET: 600 minimum
TOTAL CURRENT: 548

VOCABULARY: 210 / 200 minimum
GRAMMAR: 200 / 200 minimum
CONTEXT_USE: 120 / 120 minimum
READING: 18 / 80 minimum

A1: 92
A2: 110
B1: 110
B2: 101
C1: 78
C2: 57

CURRENT DOMAIN: Reading
CURRENT CEFR: A1
LAST COMPLETED: Context/use expansion to 120 items and semantic review of all 90 new context items
NEXT ITEM: First new A1 reading passage and question set

ISSUES FOUND: All 108 existing answers occupied option A; the exact prompt `Choose the natural combination.` appeared five times with different option sets; two existing rationales contained unnatural English. Initial vocabulary review found several contexts where a nearby same-POS distractor was also defensible or insufficiently excluded. No duplicate IDs were found.
ISSUES FIXED: The exported bank rotates choices deterministically across A-D while preserving stable IDs and answer text. Five repeated generic stems and two flawed rationales were corrected. All potentially ambiguous vocabulary contexts found in the semantic review were tightened, and the depict/portray contrast was separated across distractor sets.
CRITICAL UNRESOLVED: 0 known in the existing, vocabulary, grammar, or context/use populations; reading remains in progress.
HUMAN-REVIEW FLAGS: 0 item-specific flags recorded so far. Independent educator review and empirical learner calibration remain pending.

LAST VALIDATION: `npm run validate:content` PASS (10/10). Direct audit reports 548 scored items; vocabulary 210, grammar 200, context 120, reading 18; zero duplicate IDs, normalized prompts, or option sets; correct-answer positions A/B/C/D = 137/137/137/137.
LAST CHECKPOINT COMMIT: Expand placement grammar bank to 200 items (`03b44b9`)
NEXT ACTION: Checkpoint the completed context/use phase, then expand reading to at least 80 scored items with passage-dependent questions.
