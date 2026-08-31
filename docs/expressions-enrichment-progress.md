ACTIVE GOAL:
Complete and runtime-verify a production-quality engineering baseline for the Expressions corpus.

STATUS: IN_PROGRESS

IDIOMS TARGET: 300 minimum
IDIOMS COMPLETE: 303

PHRASAL VERBS TARGET: 300 minimum
PHRASAL VERBS COMPLETE: 310

COLLOCATIONS TARGET: 1000 minimum
COLLOCATIONS COMPLETE: 281

OTHER EXISTING EXPRESSIONS: 7 common expressions

TOTAL CURRENT: 901
TOTAL PRODUCTION-READY: 901 by the current engineering/Codex gate (independent educator review not complete)

CURRENT CATEGORY: Collocations
CURRENT CEFR: B1
LAST COMPLETED: General collocation batch; 121 new A1–B2 records spanning education, work, business, communication, relationships, travel, health, environment, technology, decisions, and success
NEXT ITEM: First B1 topical collocation in the next batch

CRITICAL ISSUES: 0 unresolved; automated audit reports no duplicate IDs/text/semantic records/examples, malformed records, placeholders, or suspicious near duplicates.
MAJOR ISSUES: The database schema still lacks the new source lifecycle field; the browser reads the bundled source directly instead of the database/API; study sessions do not currently select the Expressions corpus.
MINOR ISSUES: The recurring separability defect was corrected for `take up`, `take over`, `take off`, `carry out`, and `go over`; collocation expansion remains incomplete. Lexical multiword verbs such as `deal with`, `look for`, `count on`, and `look forward to` are deliberately retained in the learner-facing phrasal-verb unit and should receive educator taxonomy review.
HUMAN-REVIEW FLAGS: `idiom-hobsons-choice` and `idiom-gild-the-lily` need independent frequency/register and CEFR confirmation. Independent educator/native-speaker and Vietnamese editorial review remain pending for the whole corpus.

LAST VALIDATION: `npm run validate:content` PASS (12/12). Direct Expressions audit: 901 total; idioms 303, phrasal verbs 310, collocations 281, common expressions 7; A1 107, A2 186, B1 249, B2 291, C1 62, C2 6; zero critical issues or near-duplicate groups. One exact-text collision (`lose touch`) was caught and corrected to `lose contact` before checkpointing.
LAST CHECKPOINT COMMIT: Basic collocation batch `a40e32b`
NEXT ACTION: Checkpoint the general batch, then continue through B1 thematic collocations.
