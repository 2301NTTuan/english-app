# Placement assessment contract

## Construct and limits

The assessment estimates an application learning start point across vocabulary meaning, grammar control, natural language in context, and reading comprehension. It does not assess speaking, listening, pronunciation, interactive communication, or official CEFR attainment. Results must always be described as application estimates.

## Item-bank contract

Items are stored independently from UI code and seed into normalized placement item and passage tables. Every record has a stable ID, level, domain, topic, subtopic, prompt, four options, exact answer, explanation, continuous difficulty from 0–1, editorial discrimination from 0.45–2.2, lifecycle status, provenance batch, and optional passage reference. Production selection is restricted to `published`; validated pilot content is available only while the release gate is visibly closed.

Reading passages are repository-authored. Several questions may reference one passage, but selection balances subskills and must avoid over-counting a single passage as independent evidence in future calibration work.

## Adaptive heuristic

The test begins with a B1-centred prior. A bounded logistic maximum-a-posteriori heuristic updates ability and standard error from correctness, item difficulty, and discrimination. A multiple-choice chance floor reduces the effect of lucky correct answers. Parameters are editorial inputs, not validated IRT estimates.

Selection prioritizes:

1. minimum coverage of five items in each of four domains;
2. difficulty near the current estimate;
3. under-sampled topics and subtopics;
4. higher-discrimination items;
5. unseen items on retakes.

Current-attempt items never repeat. Previously seen items receive a strong penalty but remain a fallback for a small bank. A production service should load only the current item and passage from the server; it must not ship the full bank or answer key to the browser.

## Stopping and confidence

The assessment asks at least 25 and at most 50 questions. It can stop after minimum domain coverage when standard error and response-pattern fit reach conservative thresholds. Inconsistent or chance-level patterns continue to the upper bound. Confidence combines uncertainty, domain coverage, model fit, and evidence above the four-choice chance rate. Labels are `low`, `developing`, `moderate`, and `high`.

The overall estimate blends all evidence with a constraint from the weakest sufficiently sampled domain. This prevents a strong vocabulary result from hiding a major grammar or reading gap. Each domain also has its own ability, uncertainty, level estimate, raw score, and item count.

## Persistence and downstream use

Attempts store the overall ability, uncertainty, confidence, multidomain estimates, topic diagnostics, and per-answer calibration fields. Learning paths consume the estimated level and weak topics. Review scheduling and mastery remain stronger ongoing evidence after placement; placement is an initial prior, not a permanent label.

## Required validation

Automated simulations cover strong, foundation-level, uneven-domain, and random-answer profiles; stopping bounds; minimum coverage; no repeats; exposure penalty; and weak-domain constraints. Before production publication, add educator review, item-level pilot data, reliability/fairness analysis, and end-to-end tests against a server-scoped item-delivery API.

## Automated acceptance matrix

| Scenario | Deterministic simulation | Current expected result |
| --- | --- | --- |
| Foundation | correct at A1, incorrect above | A1/A2 estimate; 25–50 items |
| Advanced | correct through C1, incorrect at C2 | C1/C2 estimate; may stop early |
| Grammar weak | correct non-grammar through B2, incorrect grammar | grammar A1/A2 and overall no higher than B1 |
| Random guess | every fourth answer correct | low confidence, non-advanced estimate, 50 items |
| Retake | equivalent items with one prior ID | unseen equivalent selected first |
| Consistent | stable threshold response pattern | stop after coverage/confidence threshold |
| Inconsistent | chance-like contradictory pattern | continue to 50-item upper bound |

These are regression expectations for the editorial heuristic, not empirical validity evidence.
