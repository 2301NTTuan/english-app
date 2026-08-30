# Final vocabulary QA summary

Completed: 30 August 2026.

## Corpus

| Measure | Count |
| --- | ---: |
| Master inventory | 6,000 |
| Enriched records | 6,000 |
| Machine-QA processed | 6,000 |
| A1 | 750 |
| A2 | 950 |
| B1 | 1,200 |
| B2 | 1,525 |
| C1 | 975 |
| C2 | 600 |

Every accepted master ID maps to exactly one enriched record. All original stable IDs remain valid.

## Findings

| Severity | Found | Fixed | Unresolved |
| --- | ---: | ---: | ---: |
| Critical | 927 | 927 | 0 |
| Major | 2,713 | 2,713 | 0 |
| Minor | 389 | 389 | 0 |

The final full-corpus report found zero structural blockers, semantic review candidates, repeated definitions, or repeated Vietnamese groups. The detailed execution record remains in [vocabulary-qa-progress.md](vocabulary-qa-progress.md).

## Runtime verification

- `content:stats` reports 6,000 master and 6,000 enriched records with the same CEFR distribution, zero duplicate IDs/lexical units, and zero unresolved provenance issues.
- The idempotent seed imports 6,000 active, validated vocabulary rows into PostgreSQL.
- Authenticated browse/search queries the database catalogue and can reach `master-zoology-noun`, outside the original 298-record set.
- Daily planning, learning paths, and study sessions select from the full bundled catalogue after learner-level and progress filtering.
- Local/test and explicit `validated-preview` database queries include validated content. Default production filtering includes only `published` content, currently zero, so publication approval cannot be bypassed.

## Known limitations

Machine QA is not equivalent to independent educator or Vietnamese editorial review. CEFR and frequency metadata retain their documented source-backed/editorial distinctions; richer senses, IPA, high-confidence synonyms/antonyms, word families, and collocations remain optional improvements. Production publication still requires appropriate editorial approval.
