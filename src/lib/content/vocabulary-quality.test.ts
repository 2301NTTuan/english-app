import { describe, expect, it } from "vitest";
import { contentProvenanceBatches } from "@/data/content-provenance";
import { vocabulary } from "@/data/vocabulary";
import { foundationVocabulary001 } from "@/data/vocabulary/foundations-001";
import { masterVocabularySources } from "@/data/vocabulary/master-sources";
import { acceptedVocabularyIds, legacyVocabularyIds } from "@/data/vocabulary/stable-ids";
import { createEmptyAccountState } from "@/lib/storage/app-repository";
import { rankNewVocabulary } from "@/lib/learning/vocabulary-selection";
import type { CEFRLevel } from "@/types/domain";
import { validateLearningContent } from "./validate";
import { auditVocabulary, deterministicVocabularySample } from "./vocabulary-audit";

describe("vocabulary production-quality controls", () => {
  it("preserves every pre-expansion stable ID", () => {
    const ids = new Set(vocabulary.map((item) => item.id));
    expect(legacyVocabularyIds).toHaveLength(192);
    expect(legacyVocabularyIds.filter((id) => !ids.has(id))).toEqual([]);
    expect(acceptedVocabularyIds).toHaveLength(298);
    expect(acceptedVocabularyIds.filter((id) => !ids.has(id))).toEqual([]);
  });

  it("accepts foundational batch 001 as exactly 54 A1 and 52 A2 validated records", () => {
    expect(foundationVocabulary001).toHaveLength(106);
    expect(foundationVocabulary001.filter((item) => item.cefrLevel === "A1")).toHaveLength(54);
    expect(foundationVocabulary001.filter((item) => item.cefrLevel === "A2")).toHaveLength(52);
    expect(foundationVocabulary001.every((item) => item.status === "validated" && item.provenanceId === "vocabulary-foundations-001-2026-08")).toBe(true);
  });

  it("has no structural quality gaps, generic topics, fabricated ranks, or duplicate candidates", () => {
    const audit = auditVocabulary(vocabulary, {
      knownProvenanceIds: new Set(contentProvenanceBatches.map((batch) => batch.id)),
      knownSourceIds: new Set(masterVocabularySources.map((source) => source.id)),
    });
    expect(audit.missingFields).toEqual([]);
    expect(audit.genericTopics).toEqual([]);
    expect(audit.exactFrequencyRanksClaimed).toBe(vocabulary.filter((item) => item.frequencyBasis === "source-backed-rank").length);
    expect(audit.invalidPartsOfSpeech).toEqual([]);
    expect(audit.invalidCefr).toEqual([]);
    expect(audit.invalidFrequencyMetadata).toEqual([]);
    expect(audit.invalidLifecycleStates).toEqual([]);
    expect(audit.brokenProvenance).toEqual([]);
    expect(audit.placeholderText).toEqual([]);
    expect(audit.posDefinitionMismatches).toEqual([]);
    expect(audit.exampleTargetMissing).toEqual([]);
    expect(audit.cefrFrequencyMismatches).toEqual([]);
    expect(audit.duplicateExamples).toEqual([]);
  });

  it("has no repeated definitions in completed CEFR review levels", () => {
    const completedLevels = new Set<CEFRLevel>(["A1", "A2"]);
    expect(auditVocabulary(vocabulary.filter((item) => completedLevels.has(item.cefrLevel))).duplicateCandidates).toEqual([]);
  });

  it("keeps deterministic samples stable and satisfies the 100-per-level gate", () => {
    expect(deterministicVocabularySample(vocabulary, "C1", 3).map((item) => item.id)).toEqual(["master-woo-verb", "master-brainwash-verb", "master-pedicure-noun"]);
    expect(auditVocabulary(vocabulary).samplingGate).toBe(true);
  });

  it("rejects unsupported POS, missing Vietnamese, and editorial ranks presented as precise", () => {
    const base = vocabulary[0];
    const invalid = { ...base, id: "quality-invalid", partOfSpeech: "thing-word", frequencyRank: 42, meanings: [{ ...base.meanings[0], vietnamese: "" }] };
    const errors = validateLearningContent({ vocabulary: [invalid], grammar: [], expressions: [], exercises: [], provenance: contentProvenanceBatches });
    expect(errors.some((error) => error.includes("invalid part of speech"))).toBe(true);
    expect(errors.some((error) => error.includes("missing Vietnamese meaning"))).toBe(true);
    expect(errors.some((error) => error.includes("must not claim an exact rank"))).toBe(true);
  });

  it.each(["A1", "A2", "B1", "B2", "C1"] as CEFRLevel[])("selects level-appropriate frequency material for a %s learner", (level) => {
    const state = createEmptyAccountState(); state.settings.currentLevel = level;
    const queue = rankNewVocabulary(state, vocabulary).slice(0, 10);
    expect(queue.every((item) => item.cefrLevel === level)).toBe(true);
    expect(queue.every((item) => item.frequencyBasis === "editorial-band" || (
      item.frequencyBasis === "source-backed-rank"
      && Number.isInteger(item.frequencyRank)
      && Boolean(item.frequencySourceId)
    ))).toBe(true);
  });

  it("removes converse or merely related words from the antonym channel", () => {
    const byWord = new Map(vocabulary.map((item) => [`${item.word}:${item.partOfSpeech}`, item]));
    expect(byWord.get("answer:noun")?.antonyms).toEqual([]);
    expect(byWord.get("cause:noun")?.antonyms).toEqual([]);
    expect(byWord.get("borrow:verb")?.antonyms).toEqual([]);
    expect(byWord.get("opportunity:noun")?.antonyms).toEqual([]);
    expect(byWord.get("issue:noun")?.antonyms).toEqual([]);
    expect(byWord.get("recommend:verb")?.antonyms).toEqual([]);
    expect(byWord.get("abroad:adverb")?.antonyms).toEqual([]);
    expect(byWord.get("live:verb")?.antonyms).toEqual([]);
    expect(byWord.get("commitment:noun")?.antonyms).toEqual([]);
  });
});
