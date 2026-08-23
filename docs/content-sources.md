# Content sources and licensing

Source audit date: 23 August 2026. This is an engineering record, not legal advice.

## Sources incorporated into the master inventory

| Source | License / permission | Commercial use | Redistribution | Attribution | Fields used |
| --- | --- | --- | --- | --- | --- |
| [CEFR-J Vocabulary Profile 1.5](https://github.com/openlanguageprofiles/olp-en-cefrj) | Open Language Profiles terms: research and commercial use without charge with proper citation; copyright Tono Laboratory, TUFS | Yes | Yes, for this cited normalized dataset | CEFR-J Wordlist 1.5, Yukio Tono, Tono Laboratory, Tokyo University of Foreign Studies; Open Language Profiles | Headword, POS, A1–B2 CEFR-J level |
| [Octanove Vocabulary Profile C1/C2 1.0](https://github.com/openlanguageprofiles/olp-en-cefrj) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Yes | Yes; attribution and share-alike required | Octanove Labs via Open Language Profiles | Headword, POS, C1/C2 level |
| [NGSL-GR 1.0](https://www.newgeneralservicelist.com/ngsl-graded-reader) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Yes | Yes; attribution and share-alike required | Browne and Culligan, New General Service List – Graded Reader 1.0 | Headword evidence and list-local rank |
| [NAWL 1.2](https://www.newgeneralservicelist.com/new-academic-word-list) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Yes | Yes; attribution and share-alike required | Browne, Culligan, and Phillips, New Academic Word List 1.2 | Academic-list membership used to prioritize candidates |
| [BSL 1.2](https://www.newgeneralservicelist.com/business-service-list) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Yes | Yes; attribution and share-alike required | Browne and Culligan, Business Service List 1.2 | Business-list membership used to prioritize candidates |
| [Open English WordNet 2025](https://en-word.net/downloads) | [CC BY 4.0 plus the underlying Princeton WordNet license](https://github.com/globalwordnet/english-wordnet/blob/main/LICENSE.md) | Yes | Yes; preserve both attributions and license notices | Open English WordNet Team and Princeton University WordNet | Lemma/POS existence checks only |

Machine-readable source metadata, retrieval dates, exact snapshot SHA-256 values, attribution text, and fields used live in `src/data/vocabulary/master-sources.ts`. The normalized `master-inventory.tsv` derivative is distributed under CC BY-SA 4.0; see `src/data/vocabulary/MASTER_INVENTORY_LICENSE.md`.

CEFR-J is a localized pedagogical profile, and Octanove is an external vocabulary profile. Their labels are recorded as source-backed, but they are not described as official Council of Europe certification. Existing English Mastery entries retain their editorial CEFR when the profile disagrees or has no matching lemma/POS record.

NGSL-GR ranks are list-local evidence. They are never presented as universal corpus ranks. The downloaded 1.0 snapshot contains ranks 1–5,050; the project maps ranks 1–1,500 to `very-common`, 1,501–3,500 to `common`, and 3,501–5,050 to `less-common`. Records absent from NGSL-GR receive a documented editorial coarse band; NAWL/BSL membership affects candidate priority but is not converted into a fabricated global rank.

No definitions, examples, Vietnamese translations, synonyms, antonyms, collocations, or WordNet synsets were copied into the master inventory.

## Evaluated but not used

| Source | Decision |
| --- | --- |
| Cambridge English Vocabulary Profile | Not used. Cambridge offers dictionary-data licensing, but no compatible open redistribution grant was established for copying EVP records into this repository. |
| EFLLex / CEFRLex | Not used. The published resource is CC BY-NC-SA; the noncommercial restriction is incompatible with the required commercial-use posture. |
| Oxford, Cambridge, Longman, Merriam-Webster, commercial textbooks and paid word lists | Not used for definitions, examples, selection, or metadata. No redistribution rights were established. |
| Wiktionary / Kaikki | Legally reusable under CC BY-SA/GFDL, but not needed. Avoiding it keeps this phase free of definitions, examples, and page-level attribution complexity. |
| `wordfreq` | Not used. Its aggregated-data attribution/share-alike chain was unnecessary because NGSL-GR supplied a directly licensed list-local commonness signal. |

## Repository-authored content

The 298 enriched vocabulary records, grammar explanations, examples, mistakes, expressions, placement passages, and placement items remain repository-authored. Their machine-readable batches live in `src/data/content-provenance.ts`. The master inventory maps those 298 vocabulary IDs without deleting or regenerating them.

Before any master row becomes an enriched lesson record, it still requires sense selection, English/Vietnamese editorial work, duplicate/sense review, and publication approval under `docs/content-quality.md`.
