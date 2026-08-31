"use client";

import { Volume2 } from "lucide-react";
import { useEffect, useId, useState } from "react";

export type PronunciationLocale = "en-GB" | "en-US";

type SpeechEngine = Pick<SpeechSynthesis, "cancel" | "getVoices" | "speak">;
type UtteranceConstructor = new (text?: string) => SpeechSynthesisUtterance;

interface PlaybackDependencies {
  synthesis?: SpeechEngine;
  Utterance?: UtteranceConstructor;
  onError?: () => void;
}

export type PronunciationResult =
  | { status: "spoken"; utterance: SpeechSynthesisUtterance }
  | { status: "unsupported" | "voice-unavailable" | "empty-word" | "playback-error" };

const localeLabel: Record<PronunciationLocale, { button: string; accent: string }> = {
  "en-GB": { button: "UK", accent: "British" },
  "en-US": { button: "US", accent: "American" },
};

function normalizedLanguage(value: string) {
  return value.trim().replaceAll("_", "-").toLocaleLowerCase();
}

function regionalNameMatch(voice: SpeechSynthesisVoice, locale: PronunciationLocale) {
  const name = `${voice.name} ${voice.voiceURI}`;
  return locale === "en-GB"
    ? /\b(?:british|england|united kingdom|uk)\b/i.test(name)
    : /\b(?:american|united states|us)\b/i.test(name);
}

function deterministicVoiceOrder(left: SpeechSynthesisVoice, right: SpeechSynthesisVoice) {
  return Number(right.localService) - Number(left.localService)
    || Number(right.default) - Number(left.default)
    || left.name.localeCompare(right.name)
    || left.voiceURI.localeCompare(right.voiceURI);
}

export function selectPronunciationVoice(voices: SpeechSynthesisVoice[], locale: PronunciationLocale) {
  const requested = locale.toLocaleLowerCase();
  const ordered = [...voices].sort(deterministicVoiceOrder);
  const exact = ordered.find((voice) => normalizedLanguage(voice.lang) === requested);
  if (exact) return exact;

  return ordered.find((voice) => {
    const language = normalizedLanguage(voice.lang);
    const regionalLanguage = locale === "en-GB"
      ? language === "en-uk" || language.startsWith("en-gb-") || language.startsWith("en-uk-")
      : language.startsWith("en-us-");
    return regionalLanguage || (language === "en" && regionalNameMatch(voice, locale));
  });
}

export function playVocabularyPronunciation(word: string, locale: PronunciationLocale, dependencies: PlaybackDependencies = {}): PronunciationResult {
  const text = word.trim();
  if (!text) return { status: "empty-word" };

  const synthesis = dependencies.synthesis ?? (typeof window !== "undefined" ? window.speechSynthesis : undefined);
  const Utterance = dependencies.Utterance ?? (typeof SpeechSynthesisUtterance !== "undefined" ? SpeechSynthesisUtterance : undefined);
  if (!synthesis || !Utterance) return { status: "unsupported" };

  const voice = selectPronunciationVoice(synthesis.getVoices(), locale);
  if (!voice) return { status: "voice-unavailable" };

  try {
    const utterance = new Utterance(text);
    utterance.lang = locale;
    utterance.voice = voice;
    utterance.rate = 1;
    utterance.onerror = () => dependencies.onError?.();
    synthesis.cancel();
    synthesis.speak(utterance);
    return { status: "spoken", utterance };
  } catch {
    return { status: "playback-error" };
  }
}

export function VocabularyPronunciation({ word }: { word: string }) {
  const statusId = useId();
  const [support, setSupport] = useState<"checking" | "loading" | "ready" | "unsupported">("checking");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [playbackMessage, setPlaybackMessage] = useState("");

  useEffect(() => {
    let active = true;
    if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") {
      queueMicrotask(() => { if (active) setSupport("unsupported"); });
      return () => { active = false; };
    }

    const synthesis = window.speechSynthesis;
    let loadingExpired = false;
    const refreshVoices = () => {
      if (!active) return;
      const available = synthesis.getVoices();
      setVoices(available);
      setSupport(available.length > 0 || loadingExpired ? "ready" : "loading");
      if (available.length > 0) window.clearTimeout(loadingTimer);
    };
    queueMicrotask(refreshVoices);
    const loadingTimer = window.setTimeout(() => {
      loadingExpired = true;
      refreshVoices();
    }, 1_500);
    synthesis.addEventListener("voiceschanged", refreshVoices);
    return () => {
      active = false;
      window.clearTimeout(loadingTimer);
      synthesis.removeEventListener("voiceschanged", refreshVoices);
    };
  }, []);

  useEffect(() => () => {
    window.speechSynthesis?.cancel();
  }, [word]);

  const voiceByLocale = {
    "en-GB": selectPronunciationVoice(voices, "en-GB"),
    "en-US": selectPronunciationVoice(voices, "en-US"),
  };
  const statusMessage = playbackMessage
    || (support === "unsupported" ? "Pronunciation is not available in this browser." : "")
    || (support === "loading" || support === "checking" ? "Loading pronunciation voices…" : "");

  const play = (locale: PronunciationLocale) => {
    setPlaybackMessage("");
    const result = playVocabularyPronunciation(word, locale, {
      onError: () => setPlaybackMessage("Pronunciation playback failed on this device."),
    });
    if (result.status === "voice-unavailable") setPlaybackMessage(`${localeLabel[locale].button} voice is not available on this device.`);
    if (result.status === "unsupported") setPlaybackMessage("Pronunciation is not available in this browser.");
    if (result.status === "playback-error") setPlaybackMessage("Pronunciation playback failed on this device.");
  };

  return <div className="mt-3">
    <div className="flex flex-wrap gap-2" aria-label={`Pronunciation of ${word}`}>
      {(["en-GB", "en-US"] as PronunciationLocale[]).map((locale) => {
        const label = localeLabel[locale];
        const disabled = support !== "ready" || !word.trim();
        return <button
          key={locale}
          type="button"
          className="btn-secondary min-h-11 gap-1.5 px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Play ${label.accent} pronunciation of ${word}`}
          aria-describedby={statusMessage ? statusId : undefined}
          title={support === "ready" && !voiceByLocale[locale] ? `${label.button} voice is not available on this device.` : undefined}
          disabled={disabled}
          onClick={() => play(locale)}
        >
          <Volume2 size={16} aria-hidden="true"/>{label.button}
        </button>;
      })}
    </div>
    {statusMessage && <p id={statusId} className={playbackMessage || support === "unsupported" ? "muted mt-1.5 text-xs" : "sr-only"} role={playbackMessage ? "status" : undefined}>{statusMessage}</p>}
  </div>;
}
