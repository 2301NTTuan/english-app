# Content quality and release policy

## Current baseline

Run `npm run content:stats` for the exact machine-derived counts and release gates. The repository distinguishes the full grammar catalogue from detailed lessons and reports placement coverage by CEFR level, domain, and status. Counts in prose are intentionally avoided because they become stale.

The long-term architecture targets roughly 6,000 vocabulary senses, 110–130 detailed grammar lessons, 300 idioms, 300 phrasal verbs, 1,000 collocations, and 750 calibrated placement items. These are capacity targets, not claims about the current bank. Quality gates take priority over bulk generation.

The current vocabulary audit and representative records are documented in `docs/vocabulary-quality-audit.md`. Vocabulary records now carry status, provenance, CEFR basis, and frequency basis. All current CEFR assignments and coarse frequency bands are explicitly editorial estimates; positional pseudo-ranks were removed.

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

Vocabulary validation also requires a supported POS, Vietnamese meaning, specific topic, lifecycle status, known provenance, honest CEFR/frequency basis, and consistency between an exact rank and its declared source basis. Exact/fuzzy duplicate reporting, stable-ID regression, distribution statistics, and deterministic per-level samples supplement the blocking validator; they do not claim to prove semantic correctness.

Stable IDs are immutable. A legitimate new sense of an existing word receives its own ID and definition; an exact word/part-of-speech/definition duplicate is rejected. Retired IDs are never recycled.

## Provenance and licensing decisions

The current pilot passages, prompts, distractors, explanations, and lexical material are repository-authored and contain no imported third-party text. Machine-readable batches live in `src/data/content-provenance.ts`.

Sources evaluated for later, separately reviewed import pipelines:

- [New General Service List](https://www.newgeneralservicelist.com/new-general-service-list): CC BY-SA 4.0. It may be useful for frequency-informed selection, but no list data was imported in this phase because attribution, share-alike, versioning, and CEFR mapping need an explicit compliant pipeline.
- [Princeton WordNet license](https://wordnet.princeton.edu/documentation/wnlicens7wn): permits use, modification, and distribution when its notices are preserved. It is eligible for later lexical-relation enrichment with required attribution; no WordNet records were imported here.
- [Wiktionary copyright policy](https://en.wiktionary.org/wiki/Wiktionary:Copyrights): dual CC BY-SA/GFDL terms and page-level provenance make untracked copying unsuitable. No definitions or examples were imported.
- [Tatoeba licensing](https://en.wiki.tatoeba.org/articles/show/cc0-contributions): licensing can vary by sentence and translation. No sentences were imported because a compliant pipeline must retain sentence-level author and license metadata.
- [wordfreq repository](https://github.com/rspeer/wordfreq): aggregates data with attribution and share-alike constraints. Its data was not copied or exported.

CEFR levels and frequency values in current repository-authored records are editorial estimates for learning order. They are not official CEFR mappings, corpus measurements, or psychometrically calibrated parameters.

## Human review checklist

Before promotion, an educator checks target construct, CEFR plausibility, naturalness, single best answer, distractor plausibility without trick wording, explanation accuracy, cultural assumptions, accessibility, and passage/item independence. A second reviewer resolves flagged advanced-register and near-synonym items. Production publishing also requires sufficient balanced coverage and a signed provenance review.

## Calibration loop

Placement attempts persist item ID, correctness, level, domain, topic/subtopic, difficulty, discrimination, position, and response time. Aggregate calibration should monitor item facility, discrimination, distractor selection, omission rate, response-time distributions, domain reliability, subgroup differential behavior, exposure, and drift by content version. Response time is stored as a weak future signal and does not currently change ability.

No dashboard or threshold may label this assessment as psychometrically validated until a qualified measurement review has accepted the sample, model fit, reliability, fairness, and linking evidence.
