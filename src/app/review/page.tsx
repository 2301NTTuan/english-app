"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, BookOpen, Brain, Clock3 } from "lucide-react";
import { useAppState } from "@/components/app-provider";
import { PageHeader, ProgressBar, StatCard } from "@/components/ui";
import { grammarTopics } from "@/data/grammar";
import { vocabulary } from "@/data/vocabulary";
import { selectDailyPlan, selectInventory } from "@/lib/learning/selectors";

export default function ReviewPage() {
  const { state } = useAppState(); const inventory = selectInventory(state); const plan = selectDailyPlan(state); const now = new Date();
  const queue = [
    ...state.vocabularyProgress.filter((item) => new Date(item.review.nextReview) <= now).map((item) => ({ id: `v-${item.itemId}`, label: vocabulary.find((word) => word.id === item.itemId)?.word ?? item.itemId, kind: "Vocabulary", mastery: item.mastery.overall, due: item.review.nextReview })),
    ...state.grammarProgress.filter((item) => item.nextReview && new Date(item.nextReview) <= now).map((item) => ({ id: `g-${item.topicId}`, label: grammarTopics.find((topic) => topic.id === item.topicId)?.title ?? item.topicId, kind: "Grammar", mastery: item.mastery, due: item.nextReview! })),
  ].sort((a, b) => a.due.localeCompare(b.due));

  return <>
    <PageHeader eyebrow="Spaced repetition" title="Review queue" description="Clear overdue knowledge first. Your confidence rating adjusts stability, difficulty, and the next review date." action={<Link href="/learn" className="btn-primary">Begin review <ArrowRight size={17}/></Link>}/>
    <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4"><StatCard icon={<AlertCircle size={19}/>} label="Overdue" value={inventory.overdueVocabulary + inventory.overdueGrammar}/><StatCard icon={<BookOpen size={19}/>} label="Vocabulary" value={inventory.dueVocabulary + inventory.overdueVocabulary}/><StatCard icon={<Brain size={19}/>} label="Grammar" value={inventory.dueGrammar + inventory.overdueGrammar}/><StatCard icon={<Clock3 size={19}/>} label="Estimated" value={`${plan.estimatedMinutes}m`}/></div>
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section className="card overflow-hidden"><div className="border-b border-[#e2eae6] p-5"><div className="flex items-center justify-between"><div><h2 className="font-extrabold">Up next</h2><p className="muted mt-1 text-xs">Ordered by most overdue</p></div><span className="badge">{queue.length} due</span></div></div><div className="divide-y divide-[#e2eae6]">{queue.slice(0, 12).map((item) => { const overdueDays = Math.max(0, Math.floor((now.getTime() - new Date(item.due).getTime()) / 86_400_000)); return <div key={item.id} className="p-4"><div className="flex items-center justify-between gap-3"><div><b className="text-sm">{item.label}</b><div className="muted mt-0.5 text-xs">{item.kind} · {overdueDays ? `${overdueDays}d overdue` : "due today"}</div></div><b className={item.mastery < 60 ? "text-amber-700" : "text-[#17795b]"}>{item.mastery}%</b></div><div className="mt-2"><ProgressBar value={item.mastery} color={item.mastery < 60 ? "#d7922c" : "#17795b"}/></div></div>; })}{queue.length === 0 && <div className="p-8 text-center"><CheckMessage/></div>}</div></section>
      <section className="card h-fit p-5"><h2 className="text-lg font-extrabold">Rate your recall</h2><p className="muted mt-1 text-sm">Choose based on effort, not just correctness.</p><div className="mt-5 grid grid-cols-2 gap-3">{[["Again", "Forgot", "bg-red-50 text-red-800"], ["Hard", "High effort", "bg-amber-50 text-amber-800"], ["Good", "Normal recall", "bg-emerald-50 text-emerald-800"], ["Easy", "Instant recall", "bg-blue-50 text-blue-800"]].map(([title, detail, color]) => <div key={title} className={`rounded-xl p-4 ${color}`}><b>{title}</b><p className="mt-1 text-xs opacity-75">{detail}</p></div>)}</div><p className="muted mt-4 text-xs">Your desired retention setting is {Math.round(state.settings.desiredRetention * 100)}%. Higher retention creates shorter intervals.</p></section>
    </div>
  </>;
}

function CheckMessage() { return <><b>You&apos;re caught up</b><p className="muted mt-1 text-sm">A light practice session is still available.</p></>; }
