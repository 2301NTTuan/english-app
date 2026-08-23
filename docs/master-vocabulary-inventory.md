# Master vocabulary inventory audit

Audit date: 23 August 2026.

## Result

The metadata-only master inventory contains 6,000 normalized lemma/POS lexical units:

| CEFR | Count |
| --- | ---: |
| A1 | 750 |
| A2 | 950 |
| B1 | 1,200 |
| B2 | 1,525 |
| C1 | 975 |
| C2 | 600 |

The requested C1 target was 1,100. Only 975 C1 units survived normalization and Open English WordNet lemma/POS verification, so 125 slots were reassigned to well-supported B2 candidates. The total remains 6,000 without restoring rejected or unverified words.

This inventory deliberately contains no generated definitions, translations, examples, lexical relations, collocations, or lesson content.

## Evidence and normalization

- 9,576 raw CEFR-J/Octanove rows were considered.
- 239 malformed or Open English WordNet-unverified content-word rows were rejected.
- 112 cross-source lemma/POS level conflicts were resolved conservatively to the lower CEFR level.
- One record is retained per normalized lemma/POS. Different parts of speech remain legitimate separate lexical units; 790 lemmas have more than one POS.
- Common UK/US spelling pairs are canonicalized during generation. A variant cannot also count as a separate lemma/POS record.
- All 298 enriched records retain their stable IDs, lemma, POS, and current CEFR level. No user reference is regenerated.
- 114 existing records disagree with an available source level and 14 have no matching source row. These 128 remain explicitly `editorial-estimate`; the source is not used to overwrite them silently.
- New stable IDs derive deterministically from normalized lemma and POS.

## Basis counts

| Basis | Count |
| --- | ---: |
| Source-backed CEFR | 5,872 |
| Editorial CEFR | 128 |
| Source-backed NGSL-GR rank | 4,417 |
| Editorial coarse frequency | 1,583 |

Exact duplicate IDs: 0. Exact duplicate lemma/POS units: 0. Unresolved provenance references: 0. Distribution-level suspicious CEFR/frequency flags: 0.

`validated` means source, structure, normalization, provenance, stable-ID, and statistical checks passed. It does not mean independent educator review or production publication. Advanced profile labels remain sense-sensitive and must be reconsidered when definitions are authored.

## Reproduction

The generated TSV checksum is `55e8ca9e59605fda6c77c1cc8afe3213d5f4c5113910f77ef9a60f61eedd22ea`. Source snapshot checksums are in `src/data/vocabulary/master-sources.ts`. `scripts/build-vocabulary-master.ts` rebuilds the TSV from those snapshots and refuses insufficient per-level source capacity instead of padding.

Run:

```bash
npm run validate:content
npm run content:stats
```

The inventory quality gate passes for proceeding to small, separately reviewed enrichment batches. It is not itself a 6,000-entry production lesson corpus.
