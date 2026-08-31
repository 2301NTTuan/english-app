ACTIVE GOAL:
Complete and runtime-verify a production-quality engineering baseline for the Expressions corpus.

STATUS: IN_PROGRESS

IDIOMS TARGET: 300 minimum
IDIOMS COMPLETE: 124

PHRASAL VERBS TARGET: 300 minimum
PHRASAL VERBS COMPLETE: 30

COLLOCATIONS TARGET: 1000 minimum
COLLOCATIONS COMPLETE: 40

OTHER EXISTING EXPRESSIONS: 7 common expressions

TOTAL CURRENT: 201
TOTAL PRODUCTION-READY: 201 by the current engineering/Codex gate (independent educator review not complete)

CURRENT CATEGORY: Idioms
CURRENT CEFR: All levels
LAST COMPLETED: Audited the 107 existing records, corrected recurring phrasal-verb separability inference, and added/semantically reviewed 94 modern idioms
NEXT ITEM: Next B1 idiom after `ahead of the curve`

CRITICAL ISSUES: 0 unresolved; automated audit reports no duplicate IDs/text/semantic records/examples, malformed records, placeholders, or suspicious near duplicates.
MAJOR ISSUES: The database schema still lacks the new source lifecycle field; the browser reads the bundled source directly instead of the database/API; study sessions do not currently select the Expressions corpus.
MINOR ISSUES: The recurring separability defect was corrected for `take up`, `take over`, `take off`, `carry out`, and `go over`; advanced CEFR coverage remains intentionally sparse until later batches.
HUMAN-REVIEW FLAGS: Independent educator/native-speaker and Vietnamese editorial review remain pending for the whole corpus.

LAST VALIDATION: `npm run validate:content` PASS (12/12). Direct Expressions audit: 201 total; idioms 124, phrasal verbs 30, collocations 40, common expressions 7; A1 7, A2 26, B1 73, B2 93, C1 2, C2 0; zero critical issues or near-duplicate groups.
LAST CHECKPOINT COMMIT: Placement final milestone `45ffc4f`; no Expressions checkpoint yet
NEXT ACTION: Checkpoint the audited first idiom expansion, then continue idioms in reviewable batches to at least 300.
