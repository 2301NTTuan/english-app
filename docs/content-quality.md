# Content quality and release policy

## Current baseline

Run `npm run content:stats` for the exact machine-derived counts and release gates. The repository distinguishes the metadata-only vocabulary master inventory from enriched vocabulary lessons, distinguishes the full grammar catalogue from detailed lessons, and reports placement coverage by CEFR level, domain, and status.

The long-term architecture targets roughly 6,000 vocabulary senses, 110–130 detailed grammar lessons, 300 idioms, 300 phrasal verbs, 1,000 collocations, and 750 calibrated placement items. These are capacity targets, not claims about the current bank. Quality gates take priority over bulk generation.

The master inventory is documented in `docs/master-vocabulary-inventory.md`; the 298 enriched records and their representative audit remain documented in `docs/vocabulary-quality-audit.md`. Master rows contain only inclusion metadata. Their CEFR and frequency bases explicitly distinguish source-backed values from editorial estimates, while the enriched records retain their existing editorial bases until each is reviewed during enrichment.

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

Enriched-vocabulary validation requires a supported POS, Vietnamese meaning, specific topic, lifecycle status, known provenance, honest CEFR/frequency basis, and consistency between an exact rank and its declared source basis. Master-inventory validation separately enforces source references, exact source-rank integrity, level distribution, stable preservation of all 298 enriched IDs, duplicate lemma/POS rejection, spelling-variant collision checks, and suspicious-assignment reporting. Automated checks do not claim to prove semantic correctness.

Stable IDs are immutable. A legitimate new sense of an existing word receives its own ID and definition; an exact word/part-of-speech/definition duplicate is rejected. Retired IDs are never recycled.

## Provenance and licensing decisions

The current pilot passages, prompts, distractors, explanations, and enriched lexical material are repository-authored. Machine-readable batches live in `src/data/content-provenance.ts`. The master inventory uses only suitably licensed third-party headwords, POS labels, CEFR labels, and frequency-list ranks; its source-by-source audit and attribution requirements are in `docs/content-sources.md`.

Sources evaluated but not used in the master inventory are documented in `docs/content-sources.md`. In particular, no proprietary dictionary definitions or examples, non-commercial CEFRLex data, Wiktionary text, Tatoeba sentences, or `wordfreq` data were imported.

The master inventory is a candidate-selection asset, not a production lesson bank. Every row still needs sense selection and human editorial review before definitions, translations, examples, or relations are added. Source-backed CEFR labels identify their originating vocabulary profile; they are not universal official CEFR rulings or psychometrically calibrated learner parameters.

## Human review checklist

Before promotion, an educator checks target construct, CEFR plausibility, naturalness, single best answer, distractor plausibility without trick wording, explanation accuracy, cultural assumptions, accessibility, and passage/item independence. A second reviewer resolves flagged advanced-register and near-synonym items. Production publishing also requires sufficient balanced coverage and a signed provenance review.

## Calibration loop

Placement attempts persist item ID, correctness, level, domain, topic/subtopic, difficulty, discrimination, position, and response time. Aggregate calibration should monitor item facility, discrimination, distractor selection, omission rate, response-time distributions, domain reliability, subgroup differential behavior, exposure, and drift by content version. Response time is stored as a weak future signal and does not currently change ability.

No dashboard or threshold may label this assessment as psychometrically validated until a qualified measurement review has accepted the sample, model fit, reliability, fairness, and linking evidence.
