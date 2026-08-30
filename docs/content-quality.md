# Content quality and release policy

## Current baseline

Run `npm run content:stats` for the exact machine-derived counts and release gates. The repository keeps the 6,000-unit vocabulary master inventory separate from its one-to-one 6,000-record enriched learner catalogue, distinguishes the full grammar catalogue from detailed lessons, and reports placement coverage by CEFR level, domain, and status.

The core 6,000-record vocabulary enrichment and machine-QA targets are complete. Independent educator/Vietnamese review, publication approval, optional richer senses and lexical relations, and learner-feedback refinement remain. Other content capacity targets are not claims about the current bank; quality gates take priority over bulk generation.

The master inventory is documented in `docs/master-vocabulary-inventory.md`; the original 298-record audit remains as a historical record in `docs/vocabulary-quality-audit.md`; and the completed corpus is summarized in `docs/vocabulary-final-qa.md`. Master rows contain inclusion metadata, while every master ID now maps to an enriched record with original definition, Vietnamese meaning, and example. CEFR and frequency bases continue to distinguish source-backed values from editorial estimates.

The grammar statistics distinguish 35 records previously labelled detailed from lessons that meet the stricter production rubric. Under the automated structural rubric (multiple specific examples and mistakes, substantial phenomenon-specific explanation, and no shared generic explanation tail), zero current lessons qualify. This is an honest production gate failure, not a reason to manufacture templated lesson text.

## Lifecycle

Content uses `draft → validated → reviewed → published → retired`.

- `validated` means automated structural and consistency checks pass.
- `reviewed` means a qualified educator has reviewed language, level, distractors, and explanation.
- `published` means the reviewed record is approved for production selection.
- `retired` records remain identifiable for historical attempts but cannot be selected.

Automated validation never promotes a record to `reviewed` or `published`. The current placement pilot is honestly marked `validated`; consequently, the published-production-bank gate remains closed.

## Automated gates

`npm run validate:content` rejects duplicate IDs and duplicate semantic records, malformed meanings/examples/relations, invalid relation strengths and frequency ranks, broken or cyclic grammar prerequisites, ambiguous answers, repeated choices, weak placement metadata, invalid difficulty/discrimination, missing provenance, and broken reading-passage references. Placement items require four unique choices, one exact answer, an item-specific instructional explanation, domain/topic/subtopic tags, continuous parameters, status, and provenance. Generic explanations that merely say the selected option is correct are rejected.

Enriched-vocabulary validation requires a supported POS, Vietnamese meaning, specific topic, lifecycle status, known provenance, honest CEFR/frequency basis, and consistency between an exact rank and its declared source basis. Master-inventory validation separately enforces source references, exact source-rank integrity, level distribution, one-to-one preservation of all 6,000 enriched IDs, duplicate lemma/POS rejection, spelling-variant collision checks, and suspicious-assignment reporting. Automated checks do not claim to prove semantic correctness.

Stable IDs are immutable. A legitimate new sense of an existing word receives its own ID and definition; an exact word/part-of-speech/definition duplicate is rejected. Retired IDs are never recycled.

## Provenance and licensing decisions

The current pilot passages, prompts, distractors, explanations, and enriched lexical material are repository-authored. Machine-readable batches live in `src/data/content-provenance.ts`. The master inventory uses only suitably licensed third-party headwords, POS labels, CEFR labels, and frequency-list ranks; its source-by-source audit and attribution requirements are in `docs/content-sources.md`.

Sources evaluated but not used in the master inventory are documented in `docs/content-sources.md`. In particular, no proprietary dictionary definitions or examples, non-commercial CEFRLex data, Wiktionary text, Tatoeba sentences, or `wordfreq` data were imported.

The master inventory remains the selection, identity, and provenance source for the enriched catalogue. Every row now has learner-facing content, but all 6,000 records still need independent human editorial review before production publication. Source-backed CEFR labels identify their originating vocabulary profile; they are not universal official CEFR rulings or psychometrically calibrated learner parameters.

## Human review checklist

Before promotion, an educator checks target construct, CEFR plausibility, naturalness, single best answer, distractor plausibility without trick wording, explanation accuracy, cultural assumptions, accessibility, and passage/item independence. A second reviewer resolves flagged advanced-register and near-synonym items. Production publishing also requires sufficient balanced coverage and a signed provenance review.

## Calibration loop

Placement attempts persist item ID, correctness, level, domain, topic/subtopic, difficulty, discrimination, position, and response time. Aggregate calibration should monitor item facility, discrimination, distractor selection, omission rate, response-time distributions, domain reliability, subgroup differential behavior, exposure, and drift by content version. Response time is stored as a weak future signal and does not currently change ability.

No dashboard or threshold may label this assessment as psychometrically validated until a qualified measurement review has accepted the sample, model fit, reliability, fairness, and linking evidence.
