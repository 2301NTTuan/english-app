"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, BookOpen, Brain, CheckCircle2, Clock3 } from "lucide-react";
import { useAppState } from "@/components/app-provider";
import { Badge, EmptyState, PageHeader, ProgressBar, StatCard } from "@/components/ui";
import { grammarTopics } from "@/data/grammar";
import { vocabulary } from "@/data/vocabulary";
import { selectDailyPlan, selectInventory } from "@/lib/learning/selectors";

export default function ReviewPage() {
  const { state } = useAppState();
  const inventory = selectInventory(state);
  const plan = selectDailyPlan(state);
  const now = new Date();
  const queue = [
    ...state.vocabularyProgress.filter((item) => new Date(item.review.nextReview) <= now).map((item) => ({ id: `v-${item.itemId}`, label: vocabulary.find((word) => word.id === item.itemId)?.word ?? item.itemId, kind: "Vocabulary", mastery: item.mastery.overall, due: item.review.nextReview })),
    ...state.grammarProgress.filter((item) => new Date(item.review.nextReview) <= now).map((item) => ({ id: `g-${item.topicId}`, label: grammarTopics.find((topic) => topic.id === item.topicId)?.title ?? item.topicId, kind: "Grammar", mastery: item.mastery, due: item.review.nextReview })),
  ].sort((a, b) => a.due.localeCompare(b.due));

  return <>
    <PageHeader eyebrow="Spaced repetition" title="Review queue" description="Clear overdue knowledge first. Your confidence rating adjusts stability, difficulty, and the next review date." action={<Link href="/learn" className="btn-primary">Begin review <ArrowRight size={17} aria-hidden="true"/></Link>}/>

    <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard icon={<AlertCircle size={19}/>} label="Overdue" value={inventory.overdueVocabulary + inventory.overdueGrammar} accent="warning"/>
      <StatCard icon={<BookOpen size={19}/>} label="Vocabulary" value={inventory.dueVocabulary + inventory.overdueVocabulary}/>
      <StatCard icon={<Brain size={19}/>} label="Grammar" value={inventory.dueGrammar + inventory.overdueGrammar} accent="info"/>
      <StatCard icon={<Clock3 size={19}/>} label="Estimated" value={`${plan.estimatedMinutes}m`} accent="success"/>
    </div>

    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-muted)] p-5">
          <div><h2 className="font-[820] text-[var(--ink-strong)]">Up next</h2><p className="muted mt-1 text-xs">Ordered by most overdue</p></div>
          <Badge tone={queue.length ? "warning" : "success"}>{queue.length} due</Badge>
        </div>
        <div className="divide-y divide-[var(--line)]">{queue.slice(0, 12).map((item, index) => {
          const overdueDays = Math.max(0, Math.floor((now.getTime() - new Date(item.due).getTime()) / 86_400_000));
          return <div key={item.id} className="p-4 transition-colors hover:bg-[var(--surface-hover)] sm:px-5">
            <div className="flex items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--surface-muted)] text-xs font-extrabold text-[var(--muted-strong)]">{index + 1}</span>
              <div className="min-w-0 flex-1"><b className="block truncate text-sm text-[var(--ink-strong)]">{item.label}</b><div className="muted mt-0.5 text-xs">{item.kind} · {overdueDays ? `${overdueDays}d overdue` : "due today"}</div></div>
              <b className={item.mastery < 60 ? "text-[var(--warning)]" : "text-[var(--success)]"}>{item.mastery}%</b>
            </div>
            <div className="mt-2 pl-11"><ProgressBar value={item.mastery} label={`${item.label} mastery`} color={item.mastery < 60 ? "var(--warning)" : "var(--success)"}/></div>
          </div>;
        })}</div>
        {queue.length === 0 && <div className="p-4"><EmptyState title="You're caught up" description="A light mixed-practice session is still available." action={<Link href="/learn" className="btn-secondary">Practice anyway</Link>}/></div>}
      </section>

      <section className="card h-fit p-5 lg:sticky lg:top-8">
        <span className="mb-4 grid size-11 place-items-center rounded-xl bg-[var(--success-soft)] text-[var(--success)]"><CheckCircle2 size={21} aria-hidden="true"/></span>
        <h2 className="text-lg font-[820] text-[var(--ink-strong)]">Rate your recall</h2>
        <p className="muted mt-1 text-sm leading-relaxed">Choose based on effort, not just correctness.</p>
        <div className="mt-5 grid grid-cols-2 gap-2">{[
          ["Again", "Forgot", "feedback-error"],
          ["Hard", "High effort", "feedback-warning"],
          ["Good", "Normal recall", "feedback-success"],
          ["Easy", "Instant recall", "feedback-info"],
        ].map(([title, detail, color]) => <div key={title} className={`feedback ${color} p-3`}><b className="text-sm">{title}</b><p className="mt-1 text-xs opacity-80">{detail}</p></div>)}</div>
        <p className="muted mt-4 border-t border-[var(--line)] pt-4 text-xs leading-relaxed">Your desired retention setting is {Math.round(state.settings.desiredRetention * 100)}%. Higher retention creates shorter intervals.</p>
      </section>
    </div>
  </>;
}
