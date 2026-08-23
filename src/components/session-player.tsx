"use client";

import Link from "next/link";
import { CheckCircle2, ChevronRight, Clock3, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";
import { useAppState } from "@/components/app-provider";
import { ProgressBar } from "@/components/ui";
import { scheduleReview } from "@/lib/fsrs/scheduler";
import { buildStudySession } from "@/lib/learning/session";
import { updateMastery } from "@/lib/learning/mastery";
import { evaluateAnswer, ratingForAnswer } from "@/lib/learning/evaluation";
import { upsertMistake } from "@/lib/storage/app-repository";
import { grammarTopics } from "@/data/grammar";
import type { GrammarProgress, MasteryDimensions, Rating, ReviewState, SessionExercise } from "@/types/domain";

const ratingStyle: Record<Rating, string> = {
  again: "border-red-200 bg-red-50 text-red-800 hover:bg-red-100",
  hard: "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100",
  good: "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
  easy: "border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100",
};
const sourceLabel: Record<SessionExercise["source"], string> = {
  overdueVocabulary: "Overdue vocabulary", overdueGrammar: "Overdue grammar", dueVocabulary: "Due vocabulary", dueGrammar: "Due grammar",
  weakVocabulary: "Weak vocabulary", weakGrammar: "Weak grammar", mistakes: "Mistake review", newVocabulary: "New vocabulary", newGrammar: "New grammar",
  mixedPractice: "Mixed practice",
};

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
  if (!hydrated) return <div className="card mx-auto max-w-3xl p-8"><div className="h-2 animate-pulse rounded-full bg-[#dce6e1]"/><div className="mt-8 h-8 w-3/4 animate-pulse rounded-lg bg-[#e8eeeb]"/><div className="mt-8 grid gap-3">{[1, 2, 3, 4].map((value) => <div key={value} className="h-14 animate-pulse rounded-xl bg-[#eef2f0]"/>)}</div><span className="sr-only">Loading your study session</span></div>;
  return <HydratedSession initialState={state} setState={setState}/>;
}

function HydratedSession({ initialState, setState }: { initialState: ReturnType<typeof useAppState>["state"]; setState: ReturnType<typeof useAppState>["setState"] }) {
  const [session] = useState(() => buildStudySession(initialState));
  const [startedAt] = useState(() => Date.now());
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [mistakesCorrected, setMistakesCorrected] = useState(0);
  const [missedPrompts, setMissedPrompts] = useState<string[]>([]);
  const item = session[index];

  if (!item) {
    const accuracy = session.length ? Math.round(correct / session.length * 100) : 0;
    return <section className="card mx-auto max-w-2xl p-6 text-center sm:p-10" aria-labelledby="session-complete-title">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#e8f6f0] text-[#17795b]"><CheckCircle2 size={32}/></span>
      <div className="eyebrow mt-5">Session complete</div>
      <h1 id="session-complete-title" className="mt-2 text-3xl font-extrabold">Strong work today</h1>
      <p className="muted mt-2">Today&apos;s reviews are recorded and your next intervals have been updated.</p>
      <div className="my-7 grid grid-cols-3 gap-2">
        <SummaryMetric value={`${accuracy}%`} label="Accuracy"/><SummaryMetric value={correct} label="Correct"/><SummaryMetric value={mistakes} label="To revisit"/>
      </div>
      <div className="mb-7 grid gap-2 text-left sm:grid-cols-2"><SummaryLine label="Vocabulary reviewed" value={session.filter((entry) => entry.knowledgeType === "vocabulary" && entry.source !== "newVocabulary").length}/><SummaryLine label="New vocabulary" value={session.filter((entry) => entry.source === "newVocabulary").length}/><SummaryLine label="Grammar exercises" value={session.filter((entry) => entry.knowledgeType === "grammar").length}/><SummaryLine label="Mistakes corrected" value={mistakesCorrected}/></div>
      {missedPrompts.length > 0 ? <div className="mb-7 rounded-xl bg-amber-50 p-4 text-left"><b className="text-sm text-amber-900">Needs more practice</b><p className="mt-1 text-sm text-amber-800">{missedPrompts.slice(0, 2).join(" · ")}</p></div> : <div className="mb-7 rounded-xl bg-emerald-50 p-4 text-left"><b className="text-sm text-emerald-900">Strong improvement</b><p className="mt-1 text-sm text-emerald-800">You completed the session without an incorrect answer.</p></div>}
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
    if (!isCorrect) setState((current) => ({ ...current, mistakes: upsertMistake(current.mistakes, { itemId: item.itemId, label: item.prompt, knowledgeType: item.knowledgeType, exerciseType: item.type, wrongAnswer: selected, correctAnswer: item.answer }) }));
  };

  const rate = (rating: Rating) => {
    setState((current) => {
      const effectiveRating = ratingForAnswer(isCorrect, rating);
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
      const finished = index === session.length - 1;
      const minutes = Math.max(1, Math.round((Date.now() - startedAt) / 60_000));
      const finalCorrect = correct + (isCorrect ? 1 : 0);
      const activities = finished ? [{ id: `a-${Date.now()}`, date: new Date().toISOString(), label: "Adaptive daily session", correct: finalCorrect, total: session.length, minutes, masteryDelta: finalCorrect > mistakes ? 3 : 1, vocabularyReviewed: session.filter((entry) => entry.knowledgeType === "vocabulary" && entry.source !== "newVocabulary").length, newVocabulary: session.filter((entry) => entry.source === "newVocabulary").length, grammarExercises: session.filter((entry) => entry.knowledgeType === "grammar").length, mistakesCorrected }, ...current.activities].slice(0, 30) : current.activities;
      const mistakeRecords = item.source === "mistakes" && masteryCorrect ? current.mistakes.map((mistake) => mistake.itemId === item.itemId ? { ...mistake, resolved: true } : mistake) : current.mistakes;
      return { ...current, vocabularyProgress, grammarProgress, mistakes: mistakeRecords, activities };
    });
    setIndex((value) => value + 1);
    setSelected("");
    setChecked(false);
  };

  return <div className="mx-auto max-w-3xl">
    <div className="mb-5 flex items-center gap-3 sm:gap-4" aria-label={`Question ${index + 1} of ${session.length}`}>
      <span className="muted shrink-0 text-sm font-bold">{index + 1} / {session.length}</span>
      <div className="flex-1"><ProgressBar value={index / session.length * 100}/></div>
      <span className="badge hidden capitalize sm:inline-flex">{item.type.replaceAll("-", " ")}</span>
    </div>
    <section className="card overflow-hidden" aria-labelledby="exercise-prompt">
      <header className="border-b border-[#e2eae6] p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-2"><span className="eyebrow">{sourceLabel[item.source]}</span><span aria-hidden="true" className="muted">·</span><span className="muted text-xs font-bold capitalize">{item.knowledgeType}</span></div>
        <h1 id="exercise-prompt" className="mt-3 text-2xl font-extrabold leading-snug sm:text-3xl">{item.prompt}</h1>
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
        <div aria-live="polite">{checked && <div className={`mt-5 rounded-xl p-4 ${isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}><b>{isCorrect ? "Correct — well done." : `Not quite. The answer is “${item.answer}”.`}</b>{item.explanation && <p className="mt-1 text-sm opacity-80">{item.explanation}</p>}</div>}</div>
        {!checked ? <div className="mt-6 flex items-center justify-between"><button className="muted flex items-center gap-1 text-xs disabled:opacity-30" disabled={!selected} onClick={() => setSelected("")}><RotateCcw size={13}/>Clear</button><button className="btn-primary disabled:cursor-not-allowed disabled:opacity-40" disabled={!selected} onClick={submit}>Check answer <ChevronRight size={18}/></button></div> : <div className="mt-6"><p className="muted mb-2 text-center text-xs font-bold">How difficult was this to recall?</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{(["again", "hard", "good", "easy"] as Rating[]).map((rating) => <button key={rating} onClick={() => rate(rating)} className={`min-h-12 rounded-xl border px-3 py-2 text-xs font-extrabold capitalize transition ${ratingStyle[rating]}`}>{rating}<span className="mt-0.5 block text-[9px] font-medium opacity-70">{{ again: "< 10 min", hard: "~ 1 day", good: "~ 3 days", easy: "~ 1 week" }[rating]}</span></button>)}</div></div>}
      </div>
    </section>
    <p className="muted mt-4 flex items-center justify-center gap-1 text-xs"><Clock3 size={13}/>Session order follows your live adaptive plan.</p>
  </div>;
}

function SummaryMetric({ value, label }: { value: string | number; label: string }) {
  return <div className="rounded-xl bg-[#f5f8f6] p-3"><b className="text-xl">{value}</b><div className="muted text-xs">{label}</div></div>;
}

function SummaryLine({ value, label }: { value: number; label: string }) { return <div className="flex items-center justify-between rounded-xl bg-[#f5f8f6] px-4 py-3 text-sm"><span className="muted">{label}</span><b>{value}</b></div>; }
