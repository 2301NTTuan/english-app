"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, RotateCcw, TestTube2 } from "lucide-react";
import { useState } from "react";
import { useAppState } from "@/components/app-provider";
import { PageHeader, ProgressBar } from "@/components/ui";
import type { CEFRLevel, PlacementDimension, PlacementResult } from "@/types/domain";

interface PublicQuestion { id: string; prompt: string; options: string[]; level: CEFRLevel; dimension: PlacementDimension; passage?: { title: string; text: string } }
interface QuestionResponse { token?: string; question?: PublicQuestion; answeredCount: number; result?: PlacementResult; error?: string }

export default function PlacementPage() {
  const { state, setState, hydrated } = useAppState();
  const [started, setStarted] = useState(false); const [question, setQuestion] = useState<PublicQuestion | null>(null); const [attemptToken, setAttemptToken] = useState("");
  const [answeredCount, setAnsweredCount] = useState(0); const [result, setResult] = useState<PlacementResult | null>(null); const [manual, setManual] = useState<CEFRLevel | null>(null);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString()); const [questionStartedAt, setQuestionStartedAt] = useState(() => Date.now()); const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());
  const [saving, setSaving] = useState(false); const [saveError, setSaveError] = useState("");
  const [pending, setPending] = useState<{ idempotencyKey: string; startedAt: string; state: typeof state } | null>(null);

  const persist = async (payload: NonNullable<typeof pending>, scored: PlacementResult) => {
    setSaving(true); setSaveError("");
    try {
      const response = await fetch("/api/placement", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("Placement could not be saved.");
      setPending(null); setResult(scored); setStarted(false);
    } catch { setSaveError("We could not record your placement result. Please retry."); }
    finally { setSaving(false); }
  };

  const requestQuestion = async (body: Record<string, unknown>) => {
    const response = await fetch("/api/placement/question", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await response.json() as QuestionResponse;
    if (!response.ok) throw new Error(data.error ?? "Placement questions are unavailable.");
    return data;
  };

  const begin = async () => {
    const nextStartedAt = new Date().toISOString();
    setStartedAt(nextStartedAt); setIdempotencyKey(crypto.randomUUID()); setStarted(true); setQuestion(null); setAnsweredCount(0); setSaveError("");
    try {
      const data = await requestQuestion({});
      setAttemptToken(data.token ?? ""); setQuestion(data.question ?? null); setQuestionStartedAt(Date.now());
    } catch (error) { setStarted(false); setSaveError(error instanceof Error ? error.message : "Placement questions are unavailable."); }
  };

  const choose = async (answer: string) => {
    if (!question || saving) return;
    setSaving(true); setSaveError("");
    try {
      const data = await requestQuestion({ token: attemptToken, answer, responseTimeMs: new Date().getTime() - questionStartedAt });
      setAnsweredCount(data.answeredCount);
      if (data.result) {
        const scored = data.result;
        const nextState = { ...state, placement: scored, settings: { ...state.settings, currentLevel: scored.estimatedLevel } };
        const payload = { idempotencyKey, startedAt, state: nextState };
        setState(nextState); setPending(payload); setQuestion(null);
        await persist(payload, scored);
      } else {
        setAttemptToken(data.token ?? ""); setQuestion(data.question ?? null); setQuestionStartedAt(new Date().getTime());
      }
    } catch (error) { setSaveError(error instanceof Error ? error.message : "The answer could not be recorded."); }
    finally { setSaving(false); }
  };
  const chooseLevel = (level: CEFRLevel) => { setManual(level); setState((current) => ({ ...current, settings: { ...current.settings, currentLevel: level } })); };

  if (!hydrated) return <div className="card p-8"><div className="h-2 animate-pulse rounded bg-[#e2eae6]"/></div>;
  if (started && question) return <div className="mx-auto max-w-3xl"><div className="mb-5 flex items-center gap-3"><b className="muted shrink-0 text-sm">Question {answeredCount + 1}</b><div className="flex-1"><ProgressBar value={answeredCount / 50 * 100} label="Placement test progress"/></div><span className="badge capitalize">{question.dimension}</span></div><section className="card overflow-hidden"><header className="border-b border-[#e2eae6] p-6 sm:p-8"><div className="eyebrow">Adaptive placement · {question.level} challenge</div>{question.passage && <article className="mt-4 rounded-xl bg-[#f5f8f6] p-4"><h2 className="font-extrabold">{question.passage.title}</h2><p className="muted mt-2 whitespace-pre-line text-sm leading-6">{question.passage.text}</p></article>}<h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">{question.prompt}</h1></header><div className="grid gap-3 p-6 sm:p-8">{question.options.map((option, index) => <button key={option} disabled={saving} onClick={() => void choose(option)} className="answer-option text-left disabled:cursor-wait disabled:opacity-50"><span className="answer-key">{String.fromCharCode(65 + index)}</span><span>{option}</span></button>)}</div></section><p className={`mt-4 text-center text-xs ${saveError ? "text-red-800" : "muted"}`} role={saveError ? "alert" : undefined}>{saveError || "The test ends after 25–50 questions when coverage and confidence are sufficient. Correctness is hidden until completion."}</p></div>;
  if (started) return <section className="card mx-auto max-w-xl p-8 text-center"><h1 className="text-2xl font-extrabold">Preparing your next question…</h1><p className="muted mt-2 text-sm" role="status">The item bank and answer key stay on the server.</p></section>;
  if (pending) return <section className="card mx-auto max-w-xl p-8 text-center"><h1 className="text-2xl font-extrabold">{saving ? "Recording your placement…" : "Your result is ready"}</h1><p className={`mt-2 text-sm ${saveError ? "text-red-800" : "muted"}`} role={saveError ? "alert" : "status"}>{saveError || "Saving the diagnostic and generating your learning path."}</p>{saveError && <button className="btn-primary mt-5" onClick={() => void persist(pending, pending.state.placement!)}>Retry save</button>}</section>;

  const shownResult = result ?? state.placement;
  if (shownResult) return <><PageHeader eyebrow="Placement diagnostic" title={`Estimated learning level: ${shownResult.estimatedLevel}`} description={`This is an application learning estimate, not an official CEFR certification. Confidence: ${shownResult.confidence.label} (${shownResult.confidence.score}%).`}/><div className="grid gap-5 lg:grid-cols-[1fr_360px]"><section className="card p-5 sm:p-6"><h2 className="text-lg font-extrabold">Skill profile</h2><div className="mt-5 space-y-5">{Object.entries(shownResult.dimensionScores).map(([dimension, score]) => <div key={dimension}><div className="mb-2 flex justify-between text-sm capitalize"><b>{dimension}</b><b>{score}%</b></div><ProgressBar value={score} label={`${dimension} placement score`}/></div>)}</div><div className="mt-7 grid gap-4 sm:grid-cols-2"><AreaList title="Strong areas" items={shownResult.strongAreas} empty="More evidence needed"/><AreaList title="Priority areas" items={shownResult.weakAreas} empty="No major gaps detected"/></div></section><aside className="space-y-4"><div className="card p-5"><CheckCircle2 className="text-[#17795b]"/><h2 className="mt-3 font-extrabold">Your path is ready</h2><p className="muted mt-1 text-sm">The result now influences your level, new vocabulary order, and learning-path recommendations.</p><Link href="/path" className="btn-primary mt-4 w-full">View learning path <ArrowRight size={17}/></Link></div><button className="btn-secondary w-full" onClick={() => void begin()}><RotateCcw size={15}/>Retake placement test</button></aside></div></>;

  return <><PageHeader eyebrow="Welcome to English Mastery" title="Find your best starting point" description="Answer 25–50 adaptive vocabulary, grammar, context, and reading questions. Difficulty moves with your responses."/>{saveError && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800" role="alert">{saveError}</p>}<div className="grid gap-5 lg:grid-cols-[1fr_360px]"><section className="card p-6 sm:p-8"><span className="grid size-14 place-items-center rounded-2xl bg-[#e8f6f0] text-[#17795b]"><TestTube2 size={27}/></span><h2 className="mt-5 text-2xl font-extrabold">Take the placement test</h2><p className="muted mt-2 max-w-2xl">The bounded test begins around A2/B1, adapts from A1 to C2, and records skill, topic, and confidence diagnostics. It does not test speaking or listening.</p><div className="mt-5 grid gap-2 sm:grid-cols-4">{["Vocabulary meaning", "Grammar control", "Natural context", "Reading comprehension"].map((item) => <div className="rounded-xl bg-[#f5f8f6] p-3 text-sm font-bold" key={item}>{item}</div>)}</div><button className="btn-primary mt-6" onClick={() => void begin()}>Begin test <ArrowRight size={17}/></button></section><aside className="card p-5"><BarChart3 size={20} className="text-[#17795b]"/><h2 className="mt-3 font-extrabold">Prefer to choose?</h2><p className="muted mt-1 text-sm">You can start manually and take the diagnostic later.</p><div className="mt-4 grid grid-cols-3 gap-2">{(["A1", "A2", "B1", "B2", "C1", "C2"] as CEFRLevel[]).map((level) => <button key={level} aria-pressed={manual === level} onClick={() => chooseLevel(level)} className={`rounded-xl border p-2 text-sm font-extrabold ${manual === level ? "border-[#17795b] bg-[#e8f6f0] text-[#17795b]" : "border-[#dce6e1]"}`}>{level}</button>)}</div>{manual && <Link href="/path" className="btn-secondary mt-4 w-full">Continue with {manual}</Link>}</aside></div></>;
}

function AreaList({ title, items, empty }: { title: string; items: string[]; empty: string }) { return <div className="rounded-xl bg-[#f5f8f6] p-4"><b className="text-sm">{title}</b><ul className="muted mt-2 space-y-1 text-xs">{items.length ? items.map((item) => <li key={item}>· {item.replaceAll("-", " ")}</li>) : <li>{empty}</li>}</ul></div>; }
