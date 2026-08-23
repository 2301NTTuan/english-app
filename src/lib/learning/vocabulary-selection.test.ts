import { describe, expect, it } from "vitest";
import { createInitialState } from "@/lib/storage/app-repository";
import type { VocabularyItem } from "@/types/domain";
import { rankNewVocabulary } from "./vocabulary-selection";

const item = (id: string, cefrLevel: VocabularyItem["cefrLevel"], frequencyRank: number, frequencyBand: VocabularyItem["frequencyBand"]): VocabularyItem => ({ id, word: id, cefrLevel, frequencyRank, frequencyBand, status: "validated", provenanceId: "test", cefrBasis: "editorial-estimate", frequencyBasis: "source-backed-rank", partOfSpeech: "noun", meanings: [{ definition: id }], examples: [`Use ${id} here.`], synonyms: [], antonyms: [], wordFamily: [], collocations: [], topics: [], tags: [] });

describe("rankNewVocabulary", () => {
  it("prefers level-appropriate common words over rarer material", () => {
    const state = createInitialState(); state.settings.currentLevel = "A2";
    const ranked = rankNewVocabulary(state, [item("rare", "B2", 1, "advanced"), item("common", "A2", 50, "common"), item("basic", "A1", 10, "very-common")]);
    expect(ranked[0].id).toBe("common");
    expect(ranked.at(-1)?.id).toBe("rare");
  });

  it("uses frequency rank to order otherwise equivalent words", () => {
    const state = createInitialState(); state.settings.currentLevel = "A1";
    const ranked = rankNewVocabulary(state, [item("later", "A1", 900, "common"), item("earlier", "A1", 100, "common")]);
    expect(ranked.map((candidate) => candidate.id)).toEqual(["earlier", "later"]);
  });

  it("penalizes a CEFR mismatch more strongly than a frequency advantage", () => {
    const state = createInitialState(); state.settings.currentLevel = "A1";
    const ranked = rankNewVocabulary(state, [item("advanced", "C1", 1, "very-common"), item("target", "A1", 2_000, "less-common")]);
    expect(ranked[0].id).toBe("target");
  });
});
