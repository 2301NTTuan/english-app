# Placement final QA

Final engineering QA date: 31 August 2026.

## Bank and lifecycle

| Dimension | Validated items |
| --- | ---: |
| Vocabulary | 210 |
| Grammar | 200 |
| Context/use | 120 |
| Reading | 82 |
| **Total** | **612** |

The bank contains 22 authored reading passages. CEFR distribution is A1 100, A2 122, B1 122, B2 113, C1 90, and C2 65. All items and passages are `validated`; zero are `reviewed` or `published`. Completing this engineering baseline does not authorize production selection.

## Structural and content QA

- Content schema/reference validation: pass.
- Duplicate question IDs, normalized prompts, option sets, and passage IDs: zero.
- Broken passage references and passages without questions: zero.
- Four unique options and exactly one answer per question: pass for 612/612.
- Correct-answer positions A/B/C/D: 153/153/153/153.
- Mean correct-answer length versus mean distractor length: 31.78 versus 30.83 characters; no configured length-outlier warnings.
- Difficulty, discrimination, provenance, lifecycle, domain, topic, and subtopic metadata: pass.

The initial 108-item bank placed every answer in option A. Export-time deterministic rotation now balances A–D without changing stable IDs or answer text. Five repeated generic context stems, two unnatural rationales, and the vocabulary contexts identified as allowing a second defensible same-part-of-speech answer were corrected during full-bank review.

## Semantic sample

Result: **140/140 PASS**.

The deterministic sample contains 40 vocabulary, 40 grammar, 30 context/use, and 30 reading questions. Within each domain it samples every CEFR level with evenly spaced source-order indexes; vocabulary and grammar use 7 items at A1–B2 and 6 at C1–C2, while context/use and reading use 5 per level. Review covered the prompt or passage, target construct, single-best-answer status, distractor plausibility, register, naturalness, explanation accuracy, and CEFR progression. No critical, major, minor, or item-specific human-review flags remained in the sampled set.

This is implementation/editorial review by Codex, not an independent educator, Vietnamese-language reviewer, accessibility specialist, or psychometrician. Independent educator review remains incomplete.

## Adaptive simulations

Automated deterministic profiles pass for stable A1, A2, B1, B2, C1, and C2 learners; vocabulary-strong/grammar-weak; vocabulary-weak/grammar-strong; noisy answers; a B1/B2 boundary; chance-like answers; and retake exposure. Every completed run stays within 25–50 questions, covers all four domains with at least five questions, and contains no repeated current-attempt ID. Near-chance evidence remains low confidence, and a severe weak-domain gap constrains the overall estimate.

These simulations are regression evidence for the authored heuristic. They are not empirical item calibration or proof of CEFR validity, reliability, or fairness.

## Runtime verification

Phase-completion snapshot: the command and test totals below were recorded when Placement completed. See [the consolidated validation report](test-report.md) for current repository-wide totals after the later Expressions work.

- Source validation and content statistics: pass at 612 items and 22 passages.
- ESLint, TypeScript, and unit suites: pass (105/105 unit tests across 25 files; 11/11 content tests).
- Development PostgreSQL reseed: 612 validated items, 22 validated passages, 82 validated reading items.
- Disposable test PostgreSQL reset/migrate/reseed: same counts.
- Database integration: pass, including exact domain totals and a terminal C2 reading item/passage beyond the former bank.
- Placement question API: reads release-eligible items/passages from PostgreSQL and reports an API-visible bank size of 612 without exposing answer or explanation.
- Adaptive engine and token flow: pass.
- Production build: pass.
- Chromium E2E: pass; authenticated UI completed the bounded assessment and rendered a reading passage.

## Remaining release gates

Independent educator/editorial review, learner piloting, empirical difficulty/discrimination calibration, reliability and fairness analysis, qualified psychometric review, accessibility review of the complete assessment experience, and publication approval remain pending. The application must continue describing results as learning estimates rather than official CEFR certification.
