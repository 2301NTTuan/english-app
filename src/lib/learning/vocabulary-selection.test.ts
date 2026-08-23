import { describe, expect, it } from "vitest";
import { createInitialState } from "@/lib/storage/app-repository";
import type { VocabularyItem } from "@/types/domain";
import { rankNewVocabulary } from "./vocabulary-selection";

const item = (id: string, cefrLevel: VocabularyItem["cefrLevel"], frequencyRank: number, frequencyBand: VocabularyItem["frequencyBand"]): VocabularyItem => ({ id, word: id, cefrLevel, frequencyRank, frequencyBand, partOfSpeech: "noun", meanings: [{ definition: id }], examples: [`Use ${id} here.`], synonyms: [], antonyms: [], wordFamily: [], collocations: [], topics: [], tags: [] });

describe("rankNewVocabulary", () => {
  it("prefers level-appropriate common words over rarer material", () => {
    const state = createInitialState(); state.settings.currentLevel = "A2";
    const ranked = rankNewVocabulary(state, [item("rare", "B2", 1, "advanced"), item("common", "A2", 50, "common"), item("basic", "A1", 10, "very-common")]);
    expect(ranked[0].id).toBe("common");
    expect(ranked.at(-1)?.id).toBe("rare");
  });
});
