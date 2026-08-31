ACTIVE GOAL:
Complete and runtime-verify a production-quality engineering baseline for the Expressions corpus.

STATUS: IN_PROGRESS

IDIOMS TARGET: 300 minimum
IDIOMS COMPLETE: 303

PHRASAL VERBS TARGET: 300 minimum
PHRASAL VERBS COMPLETE: 310

COLLOCATIONS TARGET: 1000 minimum
COLLOCATIONS COMPLETE: 40

OTHER EXISTING EXPRESSIONS: 7 common expressions

TOTAL CURRENT: 660
TOTAL PRODUCTION-READY: 660 by the current engineering/Codex gate (independent educator review not complete)

CURRENT CATEGORY: Collocations
CURRENT CEFR: A1–A2
LAST COMPLETED: Phrasal-verb expansion and semantic review to 310/300 across A1–C1
NEXT ITEM: First new high-frequency collocation after the 40 preserved records

CRITICAL ISSUES: 0 unresolved; automated audit reports no duplicate IDs/text/semantic records/examples, malformed records, placeholders, or suspicious near duplicates.
MAJOR ISSUES: The database schema still lacks the new source lifecycle field; the browser reads the bundled source directly instead of the database/API; study sessions do not currently select the Expressions corpus.
MINOR ISSUES: The recurring separability defect was corrected for `take up`, `take over`, `take off`, `carry out`, and `go over`; collocation expansion remains incomplete. Lexical multiword verbs such as `deal with`, `look for`, `count on`, and `look forward to` are deliberately retained in the learner-facing phrasal-verb unit and should receive educator taxonomy review.
HUMAN-REVIEW FLAGS: `idiom-hobsons-choice` and `idiom-gild-the-lily` need independent frequency/register and CEFR confirmation. Independent educator/native-speaker and Vietnamese editorial review remain pending for the whole corpus.

LAST VALIDATION: `npm run validate:content` PASS (12/12). Direct Expressions audit: 660 total; idioms 303, phrasal verbs 310, collocations 40, common expressions 7; A1 38, A2 76, B1 188, B2 290, C1 62, C2 6; zero critical issues or near-duplicate groups.
LAST CHECKPOINT COMMIT: Phrasal-verb batch 2 `45e062d`
NEXT ACTION: Checkpoint the completed phrasal-verb category, then expand collocations to at least 1,000 with explicit pattern, meaning, translation, example, and usage metadata.
