ACTIVE GOAL:
Complete and runtime-verify a production-quality engineering baseline for the Expressions corpus.

STATUS: IN_PROGRESS

IDIOMS TARGET: 300 minimum
IDIOMS COMPLETE: 303

PHRASAL VERBS TARGET: 300 minimum
PHRASAL VERBS COMPLETE: 310

COLLOCATIONS TARGET: 1000 minimum
COLLOCATIONS COMPLETE: 641

OTHER EXISTING EXPRESSIONS: 7 common expressions

TOTAL CURRENT: 1261
TOTAL PRODUCTION-READY: 1261 by the current engineering/Codex gate (independent educator review not complete)

CURRENT CATEGORY: Collocations
CURRENT CEFR: B2–C1
LAST COMPLETED: Social/science collocation batch; 120 new records spanning science, healthcare, environment, society, law, politics, media, behavior, quantity, comparison, cause/effect, and conditions
NEXT ITEM: First B2–C1 formal/advanced collocation in the next batch

CRITICAL ISSUES: 0 unresolved; automated audit reports no duplicate IDs/text/semantic records/examples, malformed records, placeholders, or suspicious near duplicates.
MAJOR ISSUES: The database schema still lacks the new source lifecycle field; the browser reads the bundled source directly instead of the database/API; study sessions do not currently select the Expressions corpus.
MINOR ISSUES: The recurring separability defect was corrected for `take up`, `take over`, `take off`, `carry out`, and `go over`; collocation expansion remains incomplete. Lexical multiword verbs such as `deal with`, `look for`, `count on`, and `look forward to` are deliberately retained in the learner-facing phrasal-verb unit and should receive educator taxonomy review.
HUMAN-REVIEW FLAGS: `idiom-hobsons-choice` and `idiom-gild-the-lily` need independent frequency/register and CEFR confirmation. Independent educator/native-speaker and Vietnamese editorial review remain pending for the whole corpus.

LAST VALIDATION: `npm run validate:content` PASS (12/12). Direct Expressions audit: 1,261 total; idioms 303, phrasal verbs 310, collocations 641, common expressions 7; A1 115, A2 245, B1 408, B2 425, C1 62, C2 6; zero critical issues or near-duplicate groups.
LAST CHECKPOINT COMMIT: Academic/professional collocation batch `8480a48`
NEXT ACTION: Checkpoint the social/science batch, then continue through B2–C1 formal and advanced collocations.
