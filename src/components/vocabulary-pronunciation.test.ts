import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  playVocabularyPronunciation,
  selectPronunciationVoice,
  VocabularyPronunciation,
} from "./vocabulary-pronunciation";

class MockUtterance {
  text: string;
  lang = "";
  voice: SpeechSynthesisVoice | null = null;
  rate = 0;
  onerror: (() => void) | null = null;

  constructor(text = "") {
    this.text = text;
  }
}

const Utterance = MockUtterance as unknown as new (text?: string) => SpeechSynthesisUtterance;

function voice(name: string, lang: string, localService = true): SpeechSynthesisVoice {
  return { default: false, lang, localService, name, voiceURI: name };
}

function speechEngine(voices: SpeechSynthesisVoice[]) {
  const calls: string[] = [];
  return {
    calls,
    synthesis: {
      getVoices: vi.fn(() => voices),
      cancel: vi.fn(() => calls.push("cancel")),
      speak: vi.fn(() => calls.push("speak")),
    },
  };
}

describe("vocabulary pronunciation", () => {
  it("speaks the current word with an exact British English voice", () => {
    const british = voice("British Voice", "en-GB");
    const engine = speechEngine([voice("American Voice", "en-US"), british]);

    const result = playVocabularyPronunciation("ability", "en-GB", { synthesis: engine.synthesis, Utterance });

    expect(result.status).toBe("spoken");
    if (result.status !== "spoken") return;
    expect(result.utterance).toMatchObject({ text: "ability", lang: "en-GB", rate: 1, voice: british });
    expect(engine.calls).toEqual(["cancel", "speak"]);
  });

  it("speaks the current word with an exact American English voice", () => {
    const american = voice("American Voice", "en-US");
    const engine = speechEngine([voice("British Voice", "en-GB"), american]);

    const result = playVocabularyPronunciation("well-being", "en-US", { synthesis: engine.synthesis, Utterance });

    expect(result.status).toBe("spoken");
    if (result.status !== "spoken") return;
    expect(result.utterance).toMatchObject({ text: "well-being", lang: "en-US", rate: 1, voice: american });
    expect(engine.calls).toEqual(["cancel", "speak"]);
  });

  it("uses a deterministic region-labelled English fallback", () => {
    const remote = voice("UK English Remote", "en", false);
    const local = voice("British Local", "en", true);

    expect(selectPronunciationVoice([remote, local], "en-GB")).toBe(local);
  });

  it("does not substitute the opposite regional voice", () => {
    const engine = speechEngine([voice("American Voice", "en-US")]);

    expect(playVocabularyPronunciation("ability", "en-GB", { synthesis: engine.synthesis, Utterance })).toEqual({ status: "voice-unavailable" });
    expect(engine.synthesis.cancel).not.toHaveBeenCalled();
    expect(engine.synthesis.speak).not.toHaveBeenCalled();
  });

  it("handles unsupported speech synthesis without throwing", () => {
    expect(playVocabularyPronunciation("ability", "en-GB", { Utterance })).toEqual({ status: "unsupported" });
  });

  it("handles synchronous playback failures without crashing", () => {
    const synthesis = {
      getVoices: () => [voice("British Voice", "en-GB")],
      cancel: vi.fn(),
      speak: vi.fn(() => { throw new Error("device failure"); }),
    };

    expect(playVocabularyPronunciation("ability", "en-GB", { synthesis, Utterance })).toEqual({ status: "playback-error" });
  });

  it("renders clear accessible names for both pronunciation controls", () => {
    const markup = renderToStaticMarkup(createElement(VocabularyPronunciation, { word: "ability" }));

    expect(markup).toContain('aria-label="Play British pronunciation of ability"');
    expect(markup).toContain('aria-label="Play American pronunciation of ability"');
    expect(markup).toContain("UK");
    expect(markup).toContain("US");
  });
});
