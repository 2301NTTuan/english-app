ACTIVE GOAL:
Complete and runtime-verify a production-quality engineering baseline for the Expressions corpus.

STATUS: IN_PROGRESS

IDIOMS TARGET: 300 minimum
IDIOMS COMPLETE: 303

PHRASAL VERBS TARGET: 300 minimum
PHRASAL VERBS COMPLETE: 224

COLLOCATIONS TARGET: 1000 minimum
COLLOCATIONS COMPLETE: 40

OTHER EXISTING EXPRESSIONS: 7 common expressions

TOTAL CURRENT: 574
TOTAL PRODUCTION-READY: 574 by the current engineering/Codex gate (independent educator review not complete)

CURRENT CATEGORY: Phrasal verbs
CURRENT CEFR: B1–B2
LAST COMPLETED: Intermediate phrasal-verb batch; 103 additional records with explicit sense and separability metadata
NEXT ITEM: `account for` in the upper-intermediate/advanced phrasal-verb batch

CRITICAL ISSUES: 0 unresolved; automated audit reports no duplicate IDs/text/semantic records/examples, malformed records, placeholders, or suspicious near duplicates.
MAJOR ISSUES: The database schema still lacks the new source lifecycle field; the browser reads the bundled source directly instead of the database/API; study sessions do not currently select the Expressions corpus.
MINOR ISSUES: The recurring separability defect was corrected for `take up`, `take over`, `take off`, `carry out`, and `go over`; phrasal-verb and collocation expansion remain incomplete. Lexical multiword verbs such as `deal with`, `look for`, `count on`, and `look forward to` are deliberately retained in the learner-facing phrasal-verb unit and should receive educator taxonomy review.
HUMAN-REVIEW FLAGS: `idiom-hobsons-choice` and `idiom-gild-the-lily` need independent frequency/register and CEFR confirmation. Independent educator/native-speaker and Vietnamese editorial review remain pending for the whole corpus.

LAST VALIDATION: `npm run validate:content` PASS (12/12). Direct Expressions audit: 574 total; idioms 303, phrasal verbs 224, collocations 40, common expressions 7; A1 38, A2 75, B1 181, B2 232, C1 42, C2 6; zero critical issues or near-duplicate groups.
LAST CHECKPOINT COMMIT: Phrasal-verb batch 1 `e3496fc`
NEXT ACTION: Checkpoint the intermediate batch, then add the final upper-intermediate/advanced batch to exceed 300 phrasal verbs.
