"use client";

import Link from "next/link";
import { CheckCircle2, ChevronRight, Clock3, RotateCcw, XCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useAppState } from "@/components/app-provider";
import { ProgressBar } from "@/components/ui";
import { VocabularyPronunciation } from "@/components/vocabulary-pronunciation";
import { vocabulary } from "@/data/vocabulary";
import { scheduleReview } from "@/lib/fsrs/scheduler";
import { buildStudySession } from "@/lib/learning/session";
import { updateMastery } from "@/lib/learning/mastery";
import { evaluateAnswer, ratingForAnswer } from "@/lib/learning/evaluation";
import { upsertMistake } from "@/lib/storage/app-repository";
import { grammarTopics } from "@/data/grammar";
import type { AppState, GrammarProgress, MasteryDimensions, Rating, ReviewState, SessionExercise } from "@/types/domain";

type RecordedAttempt = { knowledgeType: "vocabulary" | "grammar" | "expression"; knowledgeContentId: string; exerciseType: string; answer: string; correct: boolean; rating: Rating; position: number };
type CompletionPayload = { idempotencyKey: string; startedAt: string; completedAt: string; state: AppState; items: RecordedAttempt[] };

const ratingStyle: Record<Rating, string> = {
  again: "border-[color-mix(in_srgb,var(--danger)_30%,var(--line))] bg-[var(--danger-soft)] text-[var(--danger)] hover:border-[var(--danger)]",
  hard: "border-[color-mix(in_srgb,var(--warning)_30%,var(--line))] bg-[var(--warning-soft)] text-[var(--warning)] hover:border-[var(--warning)]",
  good: "border-[color-mix(in_srgb,var(--success)_30%,var(--line))] bg-[var(--success-soft)] text-[var(--success)] hover:border-[var(--success)]",
  easy: "border-[color-mix(in_srgb,var(--info)_30%,var(--line))] bg-[var(--info-soft)] text-[var(--info)] hover:border-[var(--info)]",
};
const sourceLabel: Record<SessionExercise["source"], string> = {
  overdueVocabulary: "Overdue vocabulary", overdueGrammar: "Overdue grammar", dueVocabulary: "Due vocabulary", dueGrammar: "Due grammar",
  weakVocabulary: "Weak vocabulary", weakGrammar: "Weak grammar", mistakes: "Mistake review", newVocabulary: "New vocabulary", newGrammar: "New grammar",
  newExpressions: "New expression", mixedPractice: "Mixed practice",
};
const vocabularyById = new Map(vocabulary.map((item) => [item.id, item]));

function initialReview(): ReviewState {
  return { difficulty: 5, stability: 1, state: "new", nextReview: new Date().toISOString(), scheduledDays: 0, elapsedDays: 0, reviewCount: 0, correctCount: 0, incorrectCount: 0, lapses: 0 };
}

function updateGrammarProgress(progress: GrammarProgress[], exercise: SessionExercise, correct: boolean, rating: Rating, desiredRetention: number): GrammarProgress[] {
  const existing = progress.find((item) => item.topicId === exercise.itemId);
  const topic = grammarTopics.find((item) => item.id === exercise.itemId);
  const review = scheduleReview(existing?.review ?? initialReview(), rating, new Date(), desiredRetention);
  if (!existing) return [...progress, { topicId: exercise.itemId, mastery: correct ? 12 : 3, subtopicMastery: Object.fromEntries((topic?.subtopics ?? []).map((subtopic, index) => [subtopic.id, index === 0 ? (correct ? 12 : 3) : 0])), review }];
  const weakest = Object.entries(existing.subtopicMastery).sort((a, b) => a[1] - b[1])[0]?.[0] ?? topic?.subtopics[0]?.id;
  const subtopicMastery = weakest ? { ...existing.subtopicMastery, [weakest]: Math.max(0, Math.min(100, (existing.subtopicMastery[weakest] ?? 0) + (correct ? 4 : -9))) } : existing.subtopicMastery;
  return progress.map((item) => item.topicId === exercise.itemId ? { ...item, mastery: Math.max(0, Math.min(100, item.mastery + (correct ? 3 : -8))), subtopicMastery, review } : item);
}

export function SessionPlayer() {
  const { state, setState, hydrated } = useAppState();
  if (!hydrated) return <div className="card mx-auto max-w-3xl p-8"><div className="skeleton h-2"/><div className="skeleton mt-8 h-8 w-3/4"/><div className="mt-8 grid gap-3">{[1, 2, 3, 4].map((value) => <div key={value} className="skeleton h-14"/>)}</div><span className="sr-only">Loading your study session</span></div>;
  return <HydratedSession initialState={state} setState={setState}/>;
}

function HydratedSession({ initialState, setState }: { initialState: ReturnType<typeof useAppState>["state"]; setState: ReturnType<typeof useAppState>["setState"] }) {
  const [session] = useState(() => buildStudySession(initialState));
  const [startedAt] = useState(() => new Date().toISOString());
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const stateRef = useRef(initialState);
  const attemptsRef = useRef<RecordedAttempt[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [mistakesCorrected, setMistakesCorrected] = useState(0);
  const [missedPrompts, setMissedPrompts] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [completionPayload, setCompletionPayload] = useState<CompletionPayload | null>(null);
  const item = session[index];
  const vocabularyItem = item?.knowledgeType === "vocabulary" ? vocabularyById.get(item.itemId) : undefined;

  const applyState = (update: (current: AppState) => AppState) => {
    const next = update(stateRef.current);
    stateRef.current = next;
    setState(next);
    return next;
  };

  const saveCompletion = async (payload: CompletionPayload) => {
    setSaving(true);
    setSaveError("");
    try {
      const response = await fetch("/api/study/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("The session could not be recorded.");
      setCompletionPayload(null);
      setIndex(session.length);
    } catch {
      setSaveError("We could not record this session. Your answers remain on this screen—please retry.");
    } finally {
      setSaving(false);
    }
  };

  if (!item) {
    const accuracy = session.length ? Math.round(correct / session.length * 100) : 0;
    return <section className="card panel-raised mx-auto max-w-2xl p-6 text-center sm:p-10" aria-labelledby="session-complete-title">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--success-soft)] text-[var(--success)]"><CheckCircle2 size={32}/></span>
      <div className="eyebrow mt-5">Session complete</div>
      <h1 id="session-complete-title" className="mt-2 text-3xl font-extrabold">Strong work today</h1>
      <p className="muted mt-2">Today&apos;s reviews are recorded and your next intervals have been updated.</p>
      <div className="my-7 grid grid-cols-3 gap-2">
        <SummaryMetric value={`${accuracy}%`} label="Accuracy"/><SummaryMetric value={correct} label="Correct"/><SummaryMetric value={mistakes} label="To revisit"/>
      </div>
      <div className="mb-7 grid gap-2 text-left sm:grid-cols-2"><SummaryLine label="Vocabulary reviewed" value={session.filter((entry) => entry.knowledgeType === "vocabulary" && entry.source !== "newVocabulary").length}/><SummaryLine label="New vocabulary" value={session.filter((entry) => entry.source === "newVocabulary").length}/><SummaryLine label="Grammar exercises" value={session.filter((entry) => entry.knowledgeType === "grammar").length}/><SummaryLine label="Mistakes corrected" value={mistakesCorrected}/></div>
      {missedPrompts.length > 0 ? <div className="feedback feedback-warning mb-7 text-left"><b className="text-sm">Needs more practice</b><p className="mt-1 text-sm">{missedPrompts.slice(0, 2).join(" · ")}</p></div> : <div className="feedback feedback-success mb-7 text-left"><b className="text-sm">Strong improvement</b><p className="mt-1 text-sm">You completed the session without an incorrect answer.</p></div>}
      <div className="flex flex-col justify-center gap-2 sm:flex-row"><Link href="/" className="btn-primary">Back to dashboard</Link><Link href="/progress" className="btn-secondary">View progress</Link></div>
    </section>;
  }

  const isCorrect = evaluateAnswer(selected, item.answer);
  const submit = () => {
    if (!selected || checked) return;
    setChecked(true);
    setCorrect((value) => value + (isCorrect ? 1 : 0));
    setMistakes((value) => value + (isCorrect ? 0 : 1));
    if (isCorrect && item.source === "mistakes") setMistakesCorrected((value) => value + 1);
    if (!isCorrect) setMissedPrompts((value) => [...value, item.prompt]);
    if (!isCorrect) applyState((current) => ({ ...current, mistakes: upsertMistake(current.mistakes, { itemId: item.itemId, label: item.prompt, knowledgeType: item.knowledgeType, exerciseType: item.type, wrongAnswer: selected, correctAnswer: item.answer }) }));
  };

  const rate = async (rating: Rating) => {
    if (saving || completionPayload) return;
    const effectiveRating = ratingForAnswer(isCorrect, rating);
    const attempt: RecordedAttempt = { knowledgeType: item.knowledgeType, knowledgeContentId: item.itemId, exerciseType: item.type, answer: selected, correct: isCorrect, rating: effectiveRating, position: index };
    attemptsRef.current = [...attemptsRef.current, attempt];
    const finished = index === session.length - 1;
    const finalState = applyState((current) => {
      const masteryCorrect = effectiveRating !== "again";
      let vocabularyProgress = current.vocabularyProgress;
      let grammarProgress = current.grammarProgress;
      if (item.knowledgeType === "vocabulary") {
        const existing = vocabularyProgress.find((entry) => entry.itemId === item.itemId);
        const mastery: MasteryDimensions = existing?.mastery ?? { recognition: 0, recall: 0, context: 0, spelling: 0, overall: 0 };
        const dimension = item.targetDimension ?? (item.type === "recall" ? "recall" : item.type === "recognition" ? "recognition" : "context");
        const updated = { itemId: item.itemId, mastery: updateMastery(mastery, dimension, masteryCorrect), review: scheduleReview(existing?.review ?? initialReview(), effectiveRating, new Date(), current.settings.desiredRetention) };
        vocabularyProgress = existing ? vocabularyProgress.map((entry) => entry.itemId === item.itemId ? updated : entry) : [...vocabularyProgress, updated];
      } else if (item.knowledgeType === "grammar") {
        grammarProgress = updateGrammarProgress(grammarProgress, item, masteryCorrect, effectiveRating, current.settings.desiredRetention);
      }
      const minutes = Math.max(1, Math.round((Date.now() - new Date(startedAt).getTime()) / 60_000));
      const completedCorrect = attemptsRef.current.filter((attempt) => attempt.correct).length;
      const completedMistakes = attemptsRef.current.length - completedCorrect;
      const activities = finished ? [{ id: `a-${Date.now()}`, date: new Date().toISOString(), label: "Adaptive daily session", correct: completedCorrect, total: session.length, minutes, masteryDelta: completedCorrect > completedMistakes ? 3 : 1, vocabularyReviewed: session.filter((entry) => entry.knowledgeType === "vocabulary" && entry.source !== "newVocabulary").length, newVocabulary: session.filter((entry) => entry.source === "newVocabulary").length, grammarExercises: session.filter((entry) => entry.knowledgeType === "grammar").length, mistakesCorrected }, ...current.activities].slice(0, 30) : current.activities;
      const mistakeRecords = item.source === "mistakes" && masteryCorrect ? current.mistakes.map((mistake) => mistake.itemId === item.itemId ? { ...mistake, resolved: true } : mistake) : current.mistakes;
      return { ...current, vocabularyProgress, grammarProgress, mistakes: mistakeRecords, activities };
    });
    if (finished) {
      const payload = { idempotencyKey, startedAt, completedAt: new Date().toISOString(), state: finalState, items: attemptsRef.current };
      setCompletionPayload(payload);
      await saveCompletion(payload);
      return;
    }
    setIndex((value) => value + 1);
    setSelected("");
    setChecked(false);
  };

  return <div className="mx-auto max-w-3xl">
    <div className="mb-5 flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 sm:gap-4 sm:px-4" aria-label={`Question ${index + 1} of ${session.length}`}>
      <span className="shrink-0 text-sm font-extrabold text-[var(--ink-strong)]">{index + 1}<span className="muted font-semibold"> / {session.length}</span></span>
      <div className="flex-1"><ProgressBar value={index / session.length * 100} label="Session progress"/></div>
      <span className="badge hidden capitalize sm:inline-flex">{item.type.replaceAll("-", " ")}</span>
    </div>
    <section className="card panel-raised overflow-hidden" aria-labelledby="exercise-prompt">
      <header className="border-b border-[var(--line)] bg-[var(--surface-muted)] p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-2"><span className="eyebrow">{sourceLabel[item.source]}</span><span aria-hidden="true" className="muted">·</span><span className="muted text-xs font-bold capitalize">{item.knowledgeType}</span></div>
        <h1 id="exercise-prompt" className="mt-3 text-2xl font-[850] leading-snug tracking-[-.025em] text-[var(--ink-strong)] sm:text-3xl">{item.prompt}</h1>
      </header>
      <div className="p-5 sm:p-8">
        <div className="grid gap-3" role="radiogroup" aria-label="Answer choices">
          {item.options?.map((option, optionIndex) => {
            const revealCorrect = checked && option === item.answer;
            const revealWrong = checked && option === selected && !isCorrect;
            return <button key={`${option}-${optionIndex}`} role="radio" aria-checked={selected === option} disabled={checked} onClick={() => setSelected(option)} className={`answer-option ${revealCorrect ? "answer-correct" : revealWrong ? "answer-wrong" : selected === option ? "answer-selected" : ""}`}>
              <span className="answer-key">{String.fromCharCode(65 + optionIndex)}</span>
              <span className="flex-1">{option}</span>
              {revealCorrect && <CheckCircle2 size={20}/>} {revealWrong && <XCircle size={20}/>}
            </button>;
          })}
        </div>
        <div aria-live="polite">{checked && <div className={`feedback mt-5 ${isCorrect ? "feedback-success" : "feedback-error"}`}><b>{isCorrect ? "Correct — well done." : `Not quite. The answer is “${item.answer}”.`}</b>{item.explanation && <p className="mt-1 text-sm opacity-85">{item.explanation}</p>}</div>}</div>
        {checked && vocabularyItem && <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-4"><p className="text-sm font-bold">Pronunciation: {vocabularyItem.word}</p><VocabularyPronunciation key={item.id} word={vocabularyItem.lemma ?? vocabularyItem.word}/></div>}
        {!checked ? <div className="mt-6 flex items-center justify-between"><button className="btn-quiet min-h-10 gap-1 px-2 text-xs disabled:opacity-30" disabled={!selected} onClick={() => setSelected("")}><RotateCcw size={13}/>Clear</button><button className="btn-primary disabled:cursor-not-allowed disabled:opacity-40" disabled={!selected} onClick={submit}>Check answer <ChevronRight size={18}/></button></div> : <div className="mt-6"><p className="muted mb-2 text-center text-xs font-bold">How difficult was this to recall?</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{(["again", "hard", "good", "easy"] as Rating[]).map((rating) => <button key={rating} disabled={saving || Boolean(completionPayload)} onClick={() => void rate(rating)} className={`min-h-14 rounded-xl border px-3 py-2 text-xs font-extrabold capitalize transition disabled:cursor-wait disabled:opacity-50 ${ratingStyle[rating]}`}>{rating}<span className="mt-0.5 block text-[9px] font-medium opacity-70">{{ again: "< 10 min", hard: "~ 1 day", good: "~ 3 days", easy: "~ 1 week" }[rating]}</span></button>)}</div>{saving && <p className="muted mt-3 text-center text-sm" role="status">Recording your session…</p>}{saveError && completionPayload && <div className="feedback feedback-error mt-3 text-center text-sm" role="alert">{saveError}<button className="btn-secondary mt-3" onClick={() => void saveCompletion(completionPayload)}>Retry save</button></div>}</div>}
      </div>
    </section>
    <p className="muted mt-4 flex items-center justify-center gap-1 text-xs"><Clock3 size={13}/>Session order follows your live adaptive plan.</p>
  </div>;
}

function SummaryMetric({ value, label }: { value: string | number; label: string }) {
  return <div className="rounded-xl bg-[var(--surface-muted)] p-3"><b className="text-xl">{value}</b><div className="muted text-xs">{label}</div></div>;
}

function SummaryLine({ value, label }: { value: number; label: string }) { return <div className="flex items-center justify-between rounded-xl bg-[var(--surface-muted)] px-4 py-3 text-sm"><span className="muted">{label}</span><b>{value}</b></div>; }
