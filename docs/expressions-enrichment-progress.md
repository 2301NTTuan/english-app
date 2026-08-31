ACTIVE GOAL:
Complete and runtime-verify a production-quality engineering baseline for the Expressions corpus.

STATUS: IN_PROGRESS

IDIOMS TARGET: 300 minimum
IDIOMS COMPLETE: 303

PHRASAL VERBS TARGET: 300 minimum
PHRASAL VERBS COMPLETE: 121

COLLOCATIONS TARGET: 1000 minimum
COLLOCATIONS COMPLETE: 40

OTHER EXISTING EXPRESSIONS: 7 common expressions

TOTAL CURRENT: 471
TOTAL PRODUCTION-READY: 471 by the current engineering/Codex gate (independent educator review not complete)

CURRENT CATEGORY: Phrasal verbs
CURRENT CEFR: A1–B1
LAST COMPLETED: First phrasal-verb expansion batch; 91 new high-frequency records with explicit sense and separability metadata
NEXT ITEM: `act on` in the intermediate phrasal-verb batch

CRITICAL ISSUES: 0 unresolved; automated audit reports no duplicate IDs/text/semantic records/examples, malformed records, placeholders, or suspicious near duplicates.
MAJOR ISSUES: The database schema still lacks the new source lifecycle field; the browser reads the bundled source directly instead of the database/API; study sessions do not currently select the Expressions corpus.
MINOR ISSUES: The recurring separability defect was corrected for `take up`, `take over`, `take off`, `carry out`, and `go over`; phrasal-verb and collocation expansion remain incomplete. Lexical multiword verbs such as `deal with`, `look for`, `count on`, and `look forward to` are deliberately retained in the learner-facing phrasal-verb unit and should receive educator taxonomy review.
HUMAN-REVIEW FLAGS: `idiom-hobsons-choice` and `idiom-gild-the-lily` need independent frequency/register and CEFR confirmation. Independent educator/native-speaker and Vietnamese editorial review remain pending for the whole corpus.

LAST VALIDATION: `npm run validate:content` PASS (12/12). Direct Expressions audit: 471 total; idioms 303, phrasal verbs 121, collocations 40, common expressions 7; A1 38, A2 65, B1 128, B2 192, C1 42, C2 6; zero critical issues or near-duplicate groups.
LAST CHECKPOINT COMMIT: Completed idiom category `45ac04e`
NEXT ACTION: Checkpoint phrasal-verb batch 1, then expand phrasal verbs to at least 300 with explicit sense and separability metadata.
