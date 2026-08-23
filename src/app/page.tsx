"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Clock3, Flame, GraduationCap, Sparkles, Target, TestTube2 } from "lucide-react";
import { useAppState } from "@/components/app-provider";
import { PageHeader, ProgressBar, SectionTitle, StatCard } from "@/components/ui";
import { selectDailyPlan, selectInventory } from "@/lib/learning/selectors";
import { calculateStreak } from "@/lib/learning/streak";
import { grammarTopics } from "@/data/grammar";
import { buildLearningPath } from "@/lib/learning/path";

const labels: Record<string, string> = { overdueVocabulary: "overdue vocabulary", overdueGrammar: "overdue grammar", dueVocabulary: "vocabulary reviews", dueGrammar: "grammar reviews", weakVocabulary: "weak word exercises", weakGrammar: "weak grammar exercises", mistakes: "mistake reviews", newVocabulary: "new words", newGrammar: "grammar topic" };
const average = (values: number[]) => values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;

export default function Dashboard() {
  const { state } = useAppState(); const inventory = selectInventory(state); const plan = selectDailyPlan(state);
  const completed = state.activities[0] ? Math.round(state.activities[0].correct / state.activities[0].total * 100) : 0;
  const dimensions = { recognition: average(state.vocabularyProgress.map((item) => item.mastery.recognition)), recall: average(state.vocabularyProgress.map((item) => item.mastery.recall)), context: average(state.vocabularyProgress.map((item) => item.mastery.context)), grammar: average(state.grammarProgress.map((item) => item.mastery)) };
  const grammarForLevel = new Set(grammarTopics.filter((item) => item.level === state.settings.currentLevel).map((item) => item.id));
  const currentLevelTopics = state.grammarProgress.filter((progress) => grammarForLevel.has(progress.topicId));
  const levelProgress = average([...state.vocabularyProgress.map((item) => item.mastery.overall), ...currentLevelTopics.map((item) => item.mastery)]);
  const recommendations = buildLearningPath(state).filter((item) => item.state !== "locked").slice(0, 2);
  return <>
    <PageHeader eyebrow="Your adaptive learning plan" title="Ready to make progress?" description="Review what is fading, strengthen weak areas, and add new knowledge only when your workload allows." action={<div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-[#dce6e1]"><Flame className="text-orange-500" size={20}/><div><b>{calculateStreak(state.activities)} day streak</b><div className="muted text-xs">Keep the chain alive</div></div></div>}/>
    {!state.placement && <section className="card mb-5 flex flex-col gap-4 border-[#badbce] bg-[#f3faf7] p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-[#17795b]"><TestTube2 size={21}/></span><div><b>Personalize your starting point</b><p className="muted mt-1 text-sm">Take the adaptive placement test, start from A1, or keep your manually selected {state.settings.currentLevel} level.</p></div></div><Link href="/placement" className="btn-primary shrink-0">Placement options <ArrowRight size={17}/></Link></section>}
    <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatCard icon={<GraduationCap size={20}/>} label="Current level" value={state.settings.currentLevel} detail={`${levelProgress}% app mastery progress`}/>
      <StatCard icon={<Brain size={20}/>} label="Due today" value={inventory.dueVocabulary + inventory.overdueVocabulary} detail={`${inventory.dueGrammar + inventory.overdueGrammar} grammar reviews`}/>
      <StatCard icon={<Target size={20}/>} label="Weak knowledge" value={inventory.weakVocabulary + inventory.weakGrammar} detail="Prioritized in today's plan"/>
      <StatCard icon={<Clock3 size={20}/>} label="Study time" value={`${plan.estimatedMinutes} min`} detail={`${plan.totalItems} activities planned`}/>
    </div>
    <div className="page-grid">
      <section className="card p-5 sm:p-6 lg:col-span-8">
        <div className="flex items-start justify-between gap-3"><div><div className="eyebrow">Today&apos;s study</div><h2 className="mt-1 text-2xl font-extrabold">Your adaptive session</h2></div><span className="badge">{plan.totalItems} items</span></div>
        <div className="my-6 grid gap-2 sm:grid-cols-2">{plan.allocations.map((item) => <div key={item.category} className="flex items-center gap-3 rounded-xl bg-[#f5f8f6] px-3.5 py-3"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white font-extrabold text-[#17795b] shadow-sm">{item.count}</span><span className="text-sm font-semibold capitalize">{labels[item.category]}</span></div>)}</div>
        {plan.allocations.length === 0 && <p className="muted my-6">You are caught up. A light mixed-practice session is ready.</p>}
        <div className="flex flex-col gap-3 border-t border-[#e2eae6] pt-5 sm:flex-row sm:items-center sm:justify-between"><div className="muted flex items-center gap-2 text-sm"><Clock3 size={17}/>Estimated time: <b className="text-[#15241f]">{plan.estimatedMinutes} minutes</b></div><Link href="/learn" className="btn-primary">Start Today&apos;s Session <ArrowRight size={18}/></Link></div>
      </section>
      <section className="card p-5 sm:p-6 lg:col-span-4"><SectionTitle title="Study progress" subtitle="Latest completed session"/><div className="grid place-items-center py-3"><div className="grid size-32 place-items-center rounded-full" style={{ background: `conic-gradient(#17795b ${completed}%, #e5ece8 0)` }}><div className="grid size-24 place-items-center rounded-full bg-white text-center"><div><b className="text-2xl">{completed}%</b><div className="muted text-xs">accuracy</div></div></div></div></div><div className="mt-4 grid grid-cols-2 gap-2 text-center"><div className="rounded-xl bg-[#f5f8f6] p-3"><b>{state.activities[0]?.correct ?? 0}</b><div className="muted text-xs">Correct</div></div><div className="rounded-xl bg-[#f5f8f6] p-3"><b>{(state.activities[0]?.total ?? 0) - (state.activities[0]?.correct ?? 0)}</b><div className="muted text-xs">To revisit</div></div></div></section>
      <section className="card p-5 sm:p-6 lg:col-span-7"><SectionTitle title="Knowledge health" subtitle="Mastery across active skills" href="/progress"/><div className="space-y-4">{[["Vocabulary recognition", dimensions.recognition, "#17795b"], ["Vocabulary recall", dimensions.recall, "#d7922c"], ["Grammar", dimensions.grammar, "#5278bb"], ["Context use", dimensions.context, "#b15c7e"]].map(([label, value, color]) => <div key={String(label)}><div className="mb-1.5 flex justify-between text-sm"><b>{label}</b><span className="muted">{value}%</span></div><ProgressBar value={Number(value)} label={String(label)} color={String(color)}/></div>)}</div></section>
      <section className="card p-5 sm:p-6 lg:col-span-5"><SectionTitle title="Recommended next" subtitle="From your live learning path" href="/path"/><div className="space-y-2">{recommendations.map((item) => <Link key={item.id} href={item.knowledgeType === "vocabulary" ? "/vocabulary" : "/grammar"} className="flex items-center gap-3 rounded-xl border border-[#e2eae6] p-3 hover:bg-[#f7faf8]"><span className={`grid size-10 place-items-center rounded-xl ${item.knowledgeType === "vocabulary" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>{item.knowledgeType === "vocabulary" ? <BookOpen size={19}/> : <Sparkles size={19}/>}</span><div className="min-w-0 flex-1"><b className="text-sm">{item.title}</b><p className="muted truncate text-xs">{item.reason}</p></div><ArrowRight size={17}/></Link>)}</div></section>
    </div>
  </>;
}
