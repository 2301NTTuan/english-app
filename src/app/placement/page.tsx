"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, RotateCcw, TestTube2 } from "lucide-react";
import { useState } from "react";
import { useAppState } from "@/components/app-provider";
import { PageHeader, ProgressBar } from "@/components/ui";
import { placementQuestions } from "@/data/placement";
import { answerPlacementQuestion, PLACEMENT_LENGTH, scorePlacement, selectPlacementQuestion } from "@/lib/learning/placement";
import type { CEFRLevel, PlacementAnswer, PlacementResult } from "@/types/domain";

export default function PlacementPage() {
  const { state, setState, hydrated } = useAppState();
  const [started, setStarted] = useState(false); const [answers, setAnswers] = useState<PlacementAnswer[]>([]); const [result, setResult] = useState<PlacementResult | null>(null); const [manual, setManual] = useState<CEFRLevel | null>(null);
  const question = selectPlacementQuestion(placementQuestions, answers);
  const choose = (answer: string) => {
    if (!question) return;
    const next = [...answers, answerPlacementQuestion(question, answer)]; setAnswers(next);
    if (next.length >= PLACEMENT_LENGTH) {
      const scored = scorePlacement(next); setResult(scored); setStarted(false);
      setState((current) => ({ ...current, placement: scored, settings: { ...current.settings, currentLevel: scored.estimatedLevel } }));
    }
  };
  const chooseLevel = (level: CEFRLevel) => { setManual(level); setState((current) => ({ ...current, settings: { ...current.settings, currentLevel: level } })); };

  if (!hydrated) return <div className="card p-8"><div className="h-2 animate-pulse rounded bg-[#e2eae6]"/></div>;
  if (started && question) return <div className="mx-auto max-w-3xl"><div className="mb-5 flex items-center gap-3"><b className="muted shrink-0 text-sm">{answers.length + 1} / {PLACEMENT_LENGTH}</b><div className="flex-1"><ProgressBar value={answers.length / PLACEMENT_LENGTH * 100}/></div><span className="badge capitalize">{question.dimension}</span></div><section className="card overflow-hidden"><header className="border-b border-[#e2eae6] p-6 sm:p-8"><div className="eyebrow">Adaptive placement · {question.level} challenge</div><h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">{question.prompt}</h1></header><div className="grid gap-3 p-6 sm:p-8">{question.options?.map((option, index) => <button key={option} onClick={() => choose(option)} className="answer-option text-left"><span className="answer-key">{String.fromCharCode(65 + index)}</span><span>{option}</span></button>)}</div></section><p className="muted mt-4 text-center text-xs">Questions adapt without showing correctness during the test.</p></div>;

  const shownResult = result ?? state.placement;
  if (shownResult) return <><PageHeader eyebrow="Placement diagnostic" title={`Estimated learning level: ${shownResult.estimatedLevel}`} description="This is an application learning estimate, not an official CEFR certification."/><div className="grid gap-5 lg:grid-cols-[1fr_360px]"><section className="card p-5 sm:p-6"><h2 className="text-lg font-extrabold">Skill profile</h2><div className="mt-5 space-y-5">{Object.entries(shownResult.dimensionScores).map(([dimension, score]) => <div key={dimension}><div className="mb-2 flex justify-between text-sm capitalize"><b>{dimension}</b><b>{score}%</b></div><ProgressBar value={score}/></div>)}</div><div className="mt-7 grid gap-4 sm:grid-cols-2"><AreaList title="Strong areas" items={shownResult.strongAreas} empty="More evidence needed"/><AreaList title="Priority areas" items={shownResult.weakAreas} empty="No major gaps detected"/></div></section><aside className="space-y-4"><div className="card p-5"><CheckCircle2 className="text-[#17795b]"/><h2 className="mt-3 font-extrabold">Your path is ready</h2><p className="muted mt-1 text-sm">The result now influences your level, new vocabulary order, and learning-path recommendations.</p><Link href="/path" className="btn-primary mt-4 w-full">View learning path <ArrowRight size={17}/></Link></div><button className="btn-secondary w-full" onClick={() => { setAnswers([]); setResult(null); setStarted(true); }}><RotateCcw size={15}/>Retake placement test</button></aside></div></>;

  return <><PageHeader eyebrow="Welcome to English Mastery" title="Find your best starting point" description="Answer 30 adaptive vocabulary, grammar, and context questions. Difficulty moves with your responses."/><div className="grid gap-5 lg:grid-cols-[1fr_360px]"><section className="card p-6 sm:p-8"><span className="grid size-14 place-items-center rounded-2xl bg-[#e8f6f0] text-[#17795b]"><TestTube2 size={27}/></span><h2 className="mt-5 text-2xl font-extrabold">Take the placement test</h2><p className="muted mt-2 max-w-2xl">The bounded test begins around A2/B1, adapts from A1 to C2, and records skill and topic diagnostics. It does not test speaking or listening.</p><div className="mt-5 grid gap-2 sm:grid-cols-3">{["Vocabulary meaning", "Grammar control", "Natural context"].map((item) => <div className="rounded-xl bg-[#f5f8f6] p-3 text-sm font-bold" key={item}>{item}</div>)}</div><button className="btn-primary mt-6" onClick={() => setStarted(true)}>Begin test <ArrowRight size={17}/></button></section><aside className="card p-5"><BarChart3 size={20} className="text-[#17795b]"/><h2 className="mt-3 font-extrabold">Prefer to choose?</h2><p className="muted mt-1 text-sm">You can start manually and take the diagnostic later.</p><div className="mt-4 grid grid-cols-3 gap-2">{(["A1", "A2", "B1", "B2", "C1", "C2"] as CEFRLevel[]).map((level) => <button key={level} aria-pressed={manual === level} onClick={() => chooseLevel(level)} className={`rounded-xl border p-2 text-sm font-extrabold ${manual === level ? "border-[#17795b] bg-[#e8f6f0] text-[#17795b]" : "border-[#dce6e1]"}`}>{level}</button>)}</div>{manual && <Link href="/path" className="btn-secondary mt-4 w-full">Continue with {manual}</Link>}</aside></div></>;
}

function AreaList({ title, items, empty }: { title: string; items: string[]; empty: string }) { return <div className="rounded-xl bg-[#f5f8f6] p-4"><b className="text-sm">{title}</b><ul className="muted mt-2 space-y-1 text-xs">{items.length ? items.map((item) => <li key={item}>· {item.replaceAll("-", " ")}</li>) : <li>{empty}</li>}</ul></div>; }
