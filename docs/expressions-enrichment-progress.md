ACTIVE GOAL:
Complete and runtime-verify a production-quality engineering baseline for the Expressions corpus.

STATUS: IN_PROGRESS

IDIOMS TARGET: 300 minimum
IDIOMS COMPLETE: 303

PHRASAL VERBS TARGET: 300 minimum
PHRASAL VERBS COMPLETE: 310

COLLOCATIONS TARGET: 1000 minimum
COLLOCATIONS COMPLETE: 160

OTHER EXISTING EXPRESSIONS: 7 common expressions

TOTAL CURRENT: 780
TOTAL PRODUCTION-READY: 780 by the current engineering/Codex gate (independent educator review not complete)

CURRENT CATEGORY: Collocations
CURRENT CEFR: A2–B1
LAST COMPLETED: Basic collocation batch; 120 new records across home, food, travel, shopping, time, people, weather, health, education, work, and communication
NEXT ITEM: First lower-intermediate collocation in the next thematic batch

CRITICAL ISSUES: 0 unresolved; automated audit reports no duplicate IDs/text/semantic records/examples, malformed records, placeholders, or suspicious near duplicates.
MAJOR ISSUES: The database schema still lacks the new source lifecycle field; the browser reads the bundled source directly instead of the database/API; study sessions do not currently select the Expressions corpus.
MINOR ISSUES: The recurring separability defect was corrected for `take up`, `take over`, `take off`, `carry out`, and `go over`; collocation expansion remains incomplete. Lexical multiword verbs such as `deal with`, `look for`, `count on`, and `look forward to` are deliberately retained in the learner-facing phrasal-verb unit and should receive educator taxonomy review.
HUMAN-REVIEW FLAGS: `idiom-hobsons-choice` and `idiom-gild-the-lily` need independent frequency/register and CEFR confirmation. Independent educator/native-speaker and Vietnamese editorial review remain pending for the whole corpus.

LAST VALIDATION: `npm run validate:content` PASS (12/12). Direct Expressions audit: 780 total; idioms 303, phrasal verbs 310, collocations 160, common expressions 7; A1 103, A2 131, B1 188, B2 290, C1 62, C2 6; zero critical issues or near-duplicate groups.
LAST CHECKPOINT COMMIT: Completed phrasal-verb category `cee173a`
NEXT ACTION: Checkpoint the basic collocation batch, then continue through A2–B1 thematic collocations.
