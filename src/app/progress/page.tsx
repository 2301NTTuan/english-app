"use client";

import Link from "next/link";
import { Award, BookCheck, Flame, TestTube2, TrendingUp } from "lucide-react";
import { useAppState } from "@/components/app-provider";
import { Badge, EmptyState, PageHeader, ProgressBar, SectionTitle, StatCard } from "@/components/ui";
import { grammarTopics } from "@/data/grammar";
import { vocabulary } from "@/data/vocabulary";
import { calculateStreak } from "@/lib/learning/streak";

const average = (values: number[]) => values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;

export default function ProgressPage() {
  const { state } = useAppState();
  const vocabularyMastery = average(state.vocabularyProgress.map((item) => item.mastery.overall));
  const grammarMastery = average(state.grammarProgress.map((item) => item.mastery));
  const levelVocabularyIds = new Set(vocabulary.filter((item) => item.cefrLevel === state.settings.currentLevel).map((item) => item.id));
  const levelGrammarIds = new Set(grammarTopics.filter((item) => item.level === state.settings.currentLevel).map((item) => item.id));
  const cefrProgress = average([
    ...state.vocabularyProgress.filter((item) => levelVocabularyIds.has(item.itemId)).map((item) => item.mastery.overall),
    ...state.grammarProgress.filter((item) => levelGrammarIds.has(item.topicId)).map((item) => item.mastery),
  ]);
  const reviewTotals = state.vocabularyProgress.reduce((sum, item) => ({ correct: sum.correct + item.review.correctCount, total: sum.total + item.review.reviewCount }), { correct: 0, total: 0 });
  const retention = reviewTotals.total ? Math.round(reviewTotals.correct / reviewTotals.total * 100) : 0;
  const weak = state.grammarProgress.flatMap((progress) => {
    const topic = grammarTopics.find((item) => item.id === progress.topicId);
    return topic?.subtopics.map((item) => ({ title: item.title, parent: topic.title, score: progress.subtopicMastery[item.id] ?? 0 })) ?? [];
  }).sort((a, b) => a.score - b.score).slice(0, 5);

  return <>
    <PageHeader eyebrow="Learning analytics" title="Progress" description="See what is durable, what is improving, and where focused practice will have the greatest effect. CEFR figures are app mastery, not certification."/>

    <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
      <StatCard icon={<BookCheck size={19}/>} label="Words encountered" value={state.vocabularyProgress.length} detail={`of ${vocabulary.length} available`}/>
      <StatCard icon={<BookCheck size={19}/>} label="Words learning" value={state.vocabularyProgress.filter((item) => item.mastery.overall < 85).length} accent="info"/>
      <StatCard icon={<Award size={19}/>} label="Words mastered" value={state.vocabularyProgress.filter((item) => item.mastery.overall >= 85).length} accent="success"/>
      <StatCard icon={<TrendingUp size={19}/>} label="Topics started" value={state.grammarProgress.length} detail={`${state.grammarProgress.filter((item) => item.mastery >= 85).length} mastered`} accent="warning"/>
      <StatCard icon={<Flame size={19}/>} label="Study streak" value={`${calculateStreak(state.activities)} days`} accent="warning"/>
    </div>

    {state.placement ? <section className="card mb-5 flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]"><TestTube2 size={22} aria-hidden="true"/></span>
      <div className="flex-1"><div className="eyebrow">Estimated learning level</div><div className="mt-1 flex flex-wrap items-baseline gap-3"><b className="text-2xl text-[var(--ink-strong)]">{state.placement.estimatedLevel}</b><span className="muted text-xs">Placement completed {new Date(state.placement.completedAt).toLocaleDateString()}</span></div></div>
      <div className="grid grid-cols-3 gap-2 text-center">{Object.entries(state.placement.dimensionScores).map(([label, value]) => <div key={label} className="rounded-xl bg-[var(--surface-muted)] p-2"><b>{value}%</b><div className="muted text-[10px] capitalize">{label}</div></div>)}</div>
      <Link href="/path" className="btn-secondary shrink-0">View path</Link>
    </section> : <section className="card mb-5 flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"><div><b>Placement diagnostics not available</b><p className="muted mt-1 text-sm">Take the adaptive test to add skill-level evidence to these analytics.</p></div><Link href="/placement" className="btn-secondary shrink-0">Take test</Link></section>}

    <div className="page-grid">
      <section className="card p-5 sm:p-6 lg:col-span-7">
        <SectionTitle title="Mastery overview" subtitle="Weighted by active knowledge"/>
        <div className="space-y-5">{[
          ["Vocabulary", vocabularyMastery, "var(--brand)"],
          ["Grammar", grammarMastery, "var(--info)"],
          [`${state.settings.currentLevel} app progress`, cefrProgress, "var(--warning)"],
          ["Review retention", retention, "var(--accent)"],
        ].map(([label, score, color]) => <div key={String(label)}><div className="mb-2 flex justify-between text-sm"><b>{label}</b><b>{score}%</b></div><ProgressBar value={Number(score)} label={String(label)} color={String(color)}/></div>)}</div>
        {state.activities.length > 0 && <div className="mt-7 grid h-28 grid-cols-7 items-end gap-2 border-b border-[var(--line)] pt-4" aria-label="Recent session accuracy chart">{state.activities.slice(0, 7).reverse().map((activity) => {
          const height = Math.max(12, Math.round(activity.correct / activity.total * 80));
          return <div key={activity.id} className="text-center"><div className="mx-auto w-full max-w-10 rounded-t-md bg-[var(--brand)] opacity-65" style={{ height }}/><span className="muted mt-1 block text-[9px]">{new Date(activity.date).toLocaleDateString(undefined, { weekday: "narrow" })}</span></div>;
        })}</div>}
      </section>

      <section className="card p-5 sm:p-6 lg:col-span-5">
        <SectionTitle title="Weak subtopics" subtitle="Specific skills below your target"/>
        <div className="space-y-4">{weak.map((item) => <div key={`${item.parent}-${item.title}`}><div className="flex justify-between gap-3 text-sm"><div><b>{item.title}</b><div className="muted text-xs">{item.parent}</div></div><b className="text-[var(--warning)]">{item.score}%</b></div><div className="mt-1.5"><ProgressBar value={item.score} label={`${item.title} mastery`} color="var(--warning)"/></div></div>)}</div>
        {weak.length === 0 && <p className="muted rounded-xl bg-[var(--surface-muted)] p-4 text-sm">Start grammar topics to reveal specific areas for practice.</p>}
      </section>

      <section className="card p-5 sm:p-6 lg:col-span-12">
        <SectionTitle title="Recent activity" subtitle="Your latest completed sessions"/>
        {state.activities.length > 0 ? <div className="grid gap-2 md:grid-cols-3">{state.activities.slice(0, 6).map((item) => <div key={item.id} className="rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-3"><div className="flex justify-between gap-2"><b className="text-sm">{item.label}</b><Badge tone="success">{Math.round(item.correct / item.total * 100)}%</Badge></div><div className="muted mt-2 text-xs">{new Date(item.date).toLocaleDateString()} · {item.correct}/{item.total} correct{item.minutes ? ` · ${item.minutes} min` : ""}</div></div>)}</div> : <EmptyState title="No activity yet" description="Complete your first study session to begin your learning history." action={<Link href="/learn" className="btn-primary">Start a session</Link>}/>}
      </section>
    </div>
  </>;
}
