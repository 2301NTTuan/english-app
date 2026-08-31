ACTIVE GOAL:
Complete and runtime-verify a production-quality engineering baseline for the Expressions corpus.

STATUS: IN_PROGRESS

IDIOMS TARGET: 300 minimum
IDIOMS COMPLETE: 303

PHRASAL VERBS TARGET: 300 minimum
PHRASAL VERBS COMPLETE: 30

COLLOCATIONS TARGET: 1000 minimum
COLLOCATIONS COMPLETE: 40

OTHER EXISTING EXPRESSIONS: 7 common expressions

TOTAL CURRENT: 380
TOTAL PRODUCTION-READY: 380 by the current engineering/Codex gate (independent educator review not complete)

CURRENT CATEGORY: Phrasal verbs
CURRENT CEFR: A1/A2
LAST COMPLETED: Idiom expansion and semantic review to 303/300 across A2–C2
NEXT ITEM: First new high-frequency phrasal verb after the 30 preserved records

CRITICAL ISSUES: 0 unresolved; automated audit reports no duplicate IDs/text/semantic records/examples, malformed records, placeholders, or suspicious near duplicates.
MAJOR ISSUES: The database schema still lacks the new source lifecycle field; the browser reads the bundled source directly instead of the database/API; study sessions do not currently select the Expressions corpus.
MINOR ISSUES: The recurring separability defect was corrected for `take up`, `take over`, `take off`, `carry out`, and `go over`; phrasal-verb and collocation expansion remain incomplete.
HUMAN-REVIEW FLAGS: `idiom-hobsons-choice` and `idiom-gild-the-lily` need independent frequency/register and CEFR confirmation. Independent educator/native-speaker and Vietnamese editorial review remain pending for the whole corpus.

LAST VALIDATION: `npm run validate:content` PASS (12/12). Direct Expressions audit: 380 total; idioms 303, phrasal verbs 30, collocations 40, common expressions 7; A1 7, A2 26, B1 107, B2 192, C1 42, C2 6; zero critical issues or near-duplicate groups.
LAST CHECKPOINT COMMIT: Idiom batch 1 `fa74cab`
NEXT ACTION: Checkpoint the completed idiom category, then expand phrasal verbs to at least 300 with explicit sense and separability metadata.
