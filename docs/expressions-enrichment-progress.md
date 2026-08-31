ACTIVE GOAL:
Complete and runtime-verify a production-quality engineering baseline for the Expressions corpus.

STATUS: IN_PROGRESS

IDIOMS TARGET: 300 minimum
IDIOMS COMPLETE: 303

PHRASAL VERBS TARGET: 300 minimum
PHRASAL VERBS COMPLETE: 310

COLLOCATIONS TARGET: 1000 minimum
COLLOCATIONS COMPLETE: 1001

OTHER EXISTING EXPRESSIONS: 7 common expressions

TOTAL CURRENT: 1621
TOTAL PRODUCTION-READY: 1621 by the current engineering/Codex gate (independent educator review not complete)

CURRENT CATEGORY: Final semantic and runtime QA
CURRENT CEFR: A1–C2
LAST COMPLETED: Collocation expansion and semantic review to 1,001/1,000; total Expressions corpus 1,621/1,600
NEXT ITEM: Deterministic stratified semantic sample and runtime integration fixes

CRITICAL ISSUES: 0 unresolved; automated audit reports no duplicate IDs/text/semantic records/examples, malformed records, placeholders, or suspicious near duplicates.
MAJOR ISSUES: The database schema still lacks the new source lifecycle field; the browser reads the bundled source directly instead of the database/API; study sessions do not currently select the Expressions corpus.
MINOR ISSUES: The recurring separability defect was corrected for `take up`, `take over`, `take off`, `carry out`, and `go over`. Lexical multiword verbs such as `deal with`, `look for`, `count on`, and `look forward to` are deliberately retained in the learner-facing phrasal-verb unit and should receive educator taxonomy review.
HUMAN-REVIEW FLAGS: `idiom-hobsons-choice` and `idiom-gild-the-lily` need independent frequency/register and CEFR confirmation. Independent educator/native-speaker and Vietnamese editorial review remain pending for the whole corpus.

LAST VALIDATION: `npm run validate:content` PASS (12/12). Direct Expressions audit: 1,621 total; idioms 303, phrasal verbs 310, collocations 1,001, common expressions 7; A1 115, A2 245, B1 414, B2 573, C1 268, C2 6; zero critical issues or near-duplicate groups. Engineering count gate is satisfied.
LAST CHECKPOINT COMMIT: Discipline-specific collocation batch `66c8b47`
NEXT ACTION: Checkpoint the completed corpus, run the deterministic 220-record semantic sample, then implement and verify lifecycle/database/API/UI/study-session integration.
