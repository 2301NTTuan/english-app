# Vocabulary quality audit

Audit date: 23 August 2026. Run `npm run content:stats -- --json` for the reproducible machine report and deterministic sample IDs.

> **HISTORICAL AUDIT**
> This document records the vocabulary corpus at the time of the 298-entry audit. The current corpus contains 6,000 enriched entries and has completed machine QA. See [the final vocabulary QA summary](vocabulary-final-qa.md).

## Content Quality Audit

All 298 records were machine-audited for identity, required metadata, lifecycle/provenance, definition and Vietnamese presence, examples, POS vocabulary, CEFR/frequency basis, topic specificity, exact and fuzzy lexical-unit duplicates, duplicated examples, relation structure, collocations, and stable IDs. The implementation agent manually inspected the complete 106-record foundational batch, the original seed lists, the full pre-correction antonym report, every generic-topic fallback, and representative content from each available level.

This is not independent human editorial review. All records remain `validated`, not `reviewed` or `published`.

| Finding | Before | After |
| --- | ---: | ---: |
| Exact ranks without a licensed corpus source | 192 | 0 |
| Generic `general` topics | 68 | 0 |
| Synonym relations | 193 | 177 |
| Antonym relations | 150 | 89 |
| Duplicate lexical-unit candidates | 0 | 0 |
| Duplicate examples | 0 | 0 |
| Missing required fields | 0 | 0 |
| Missing legacy IDs | 0 | 0 |

Two critical semantic defects were corrected: `brief` used a Vietnamese gloss suggesting concise wording while its sense/example concerned duration; `pragmatic` mixed practical and linguistic senses across its definition, translation, example, and C2 assignment. Three systemic major defect classes were corrected: fabricated positional ranks, generic topic fallback, and weak/converse relation generation. Seventy-seven questionable relation links were removed rather than replaced with filler; the final edge review caught six of these (`opportunity–obstacle`, `issue–solution`, `recommend–discourage`, `abroad–locally`, `live–die` for the “reside” sense, and `commitment–indifference`).

- Vocabulary records machine-audited: 298
- A1: 100; A2: 100; B1: 59; B2: 27; C1: 10; C2: 2
- Critical defects found/corrected/remaining: 2 / 2 / 0 known
- Major defect classes found/corrected/remaining: 3 / 3 / 0 known
- Minor defects recorded: 0
- Batches rejected: 0; batches corrected: 1 existing repository batch; batches accepted after validation: 1 (106 records)
- Duplicate candidates found/resolved/remaining: 0 / 0 / 0
- Provenance issues resolved: machine-readable repository-authored batch and honest editorial bases
- Provenance/editorial issues remaining: independent educator review and publication approval

“Zero known” means the implemented checks and this run’s inspection found none remaining; it does not prove corpus-wide semantic perfection.

## Sampling gate

The prompt requires 100 deterministic random records per CEFR level after corpus generation. A1 and A2 now have exactly 100 records and are fully sampled. The tool also samples all 59 B1, 27 B2, 10 C1, and 2 C2 records. The per-level sampling gate remains **FAIL** because four levels are below 100; it would be misleading to repeat records to claim a 600-record audit.

## Targeted edge audit

The reproducible edge queues inspect 50 of 109 verb-like entries, all 12 C1/C2 entries, 50 of 176 entries with synonyms, 50 of 95 with antonyms, all 10 entries with word families, and both entries with multiple collocations. The current model has no record with multiple `meanings`; polysemy is therefore a known modelling/editorial gap rather than a completed 50-record audit. Phrasal verbs currently live in the separate expression bank, not the vocabulary corpus.

The implementation agent inspected the generated edge queues and relationship inventories for structural and obvious semantic conflicts. Automated heuristics cannot establish interchangeability, register, collocational naturalness, or complete sense coverage. Those remain independent educator-review tasks before any relation-rich record can be published.

## Representative records

| CEFR | Word | POS | Definition | Vietnamese | Example | Frequency |
| --- | --- | --- | --- | --- | --- | --- |
| A1 | water | noun | the clear liquid people drink | nước | Drink enough water every day. | very-common, editorial |
| A1 | decide | verb | to make a choice | quyết định | I decided to study tonight. | very-common, editorial |
| A1 | house | noun | a building where people live | ngôi nhà | Their house has a small garden. | very-common, editorial |
| A2 | benefit | noun | a helpful or good effect | lợi ích | Daily practice has a lasting benefit. | common, editorial |
| A2 | experience | noun | knowledge gained by doing something | kinh nghiệm | Volunteering gave her useful experience. | common, editorial |
| A2 | repair | verb | to fix something damaged | sửa chữa | They repaired the broken window. | common, editorial |
| B1 | adapt | verb | to change to suit new conditions | thích nghi | It takes time to adapt to a new culture. | common, editorial |
| B1 | issue | noun | an important problem or topic | vấn đề | The report discusses a social issue. | common, editorial |
| B1 | deadline | noun | the latest time by which work must be finished | hạn chót | We met the project deadline. | common, editorial |
| B2 | acquire | verb | to gain knowledge or obtain something | đạt được, có được | She acquired valuable skills abroad. | less-common, editorial |
| B2 | maintain | verb | to continue something or keep it in good condition | duy trì | Maintain a steady study routine. | less-common, editorial |
| B2 | precise | adjective | exact and accurate | chính xác | Use precise language in the summary. | less-common, editorial |
| C1 | subtle | adjective | not obvious and requiring attention | tinh tế, khó nhận thấy | There is a subtle difference in tone. | advanced, editorial |
| C1 | pragmatic | adjective | focused on practical solutions and effects | thực tế, thực dụng | We took a pragmatic approach to the budget problem. | advanced, editorial |
| C1 | tentative | adjective | not fully certain or decided | thăm dò, chưa chắc chắn | The conclusion remains tentative. | advanced, editorial |
| C2 | ubiquitous | adjective | present or found everywhere | phổ biến khắp nơi | Smartphones have become ubiquitous. | advanced, editorial |
| C2 | equivocal | adjective | open to more than one interpretation | nước đôi, mơ hồ | His response was deliberately equivocal. | advanced, editorial |

Only two C2 records exist, so a third representative example cannot honestly be shown.

## Relationship samples

- Synonym overlap: `acquire → gain/obtain`, with a non-interchangeability note.
- Antonym: `temporary ↔ permanent` for the adjective senses.
- Word family: `decide → decision (noun), decisive (adjective), decisively (adverb)`.
- Collocations: `make a decision`, `gain experience`, `take responsibility`, `raise a concern`.

Optional relations remain optional. Missing data is preferred to a weak synonym, false antonym, invented family, or unnatural collocation.

Relation targets are stored as explicit lexical strings; 43 currently match another vocabulary record and 223 are authored external lexical targets. External targets are not dangling database foreign keys, but they still require independent editorial confirmation before publication.

## Learning-queue inspection

Deterministic empty-account simulations selected the following starts. Existing mastery filtering and backlog-first review behavior remain covered separately by planner tests.

- A1: arrive, begin, buy, carry, city, clean, family, friend, happy, help
- A2: abroad, appointment, available, customer, environment, experience, healthy, invite, journey, manage
- B1: advantage, behavior, commitment, concern, convince, deadline, efficient, encourage, expectation, goal
- B2: acquire, appropriate, contract, derive, explicit, infer, permanent, precise, evaluate, maintain
- C1: register, rhetorical, tentative, subtle, coherent, ambiguous, compelling, convey, nuance, pragmatic

No exact corpus ordering is claimed. Within an editorial frequency band, stable-ID ordering is deterministic; a licensed frequency import may refine ordering later without inventing precision.
