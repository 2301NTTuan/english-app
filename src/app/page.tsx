"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Clock3, Flame, GraduationCap, Sparkles, Target, TestTube2 } from "lucide-react";
import { useAppState } from "@/components/app-provider";
import { Badge, PageHeader, ProgressBar, ProgressRing, SectionTitle, StatCard } from "@/components/ui";
import { selectDailyPlan, selectInventory } from "@/lib/learning/selectors";
import { calculateStreak } from "@/lib/learning/streak";
import { grammarTopics } from "@/data/grammar";
import { buildLearningPath } from "@/lib/learning/path";

const labels: Record<string, string> = {
  overdueVocabulary: "Overdue vocabulary",
  overdueGrammar: "Overdue grammar",
  dueVocabulary: "Vocabulary reviews",
  dueGrammar: "Grammar reviews",
  weakVocabulary: "Weak word exercises",
  weakGrammar: "Weak grammar exercises",
  mistakes: "Mistake reviews",
  newVocabulary: "New words",
  newGrammar: "New grammar topic",
};

const average = (values: number[]) => values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;

export default function Dashboard() {
  const { state } = useAppState();
  const inventory = selectInventory(state);
  const plan = selectDailyPlan(state);
  const latestAccuracy = state.activities[0] ? Math.round(state.activities[0].correct / state.activities[0].total * 100) : 0;
  const dimensions = {
    recognition: average(state.vocabularyProgress.map((item) => item.mastery.recognition)),
    recall: average(state.vocabularyProgress.map((item) => item.mastery.recall)),
    context: average(state.vocabularyProgress.map((item) => item.mastery.context)),
    grammar: average(state.grammarProgress.map((item) => item.mastery)),
  };
  const grammarForLevel = new Set(grammarTopics.filter((item) => item.level === state.settings.currentLevel).map((item) => item.id));
  const currentLevelTopics = state.grammarProgress.filter((progress) => grammarForLevel.has(progress.topicId));
  const levelProgress = average([...state.vocabularyProgress.map((item) => item.mastery.overall), ...currentLevelTopics.map((item) => item.mastery)]);
  const recommendations = buildLearningPath(state).filter((item) => item.state !== "locked").slice(0, 2);
  const streak = calculateStreak(state.activities);

  return <>
    <PageHeader
      eyebrow="Today"
      title="Your next step is ready."
      description="A focused plan that reviews fading knowledge first, strengthens weak areas, and introduces new material at the right pace."
      action={<div className="card flex items-center gap-3 px-4 py-3"><span className="grid size-10 place-items-center rounded-xl bg-[var(--warning-soft)] text-[var(--warning)]"><Flame size={20} aria-hidden="true"/></span><div><b className="block text-sm">{streak} day streak</b><span className="muted text-xs">Keep your momentum</span></div></div>}
    />

    {!state.placement && <section className="mb-5 flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--brand)_24%,var(--line))] bg-[var(--brand-soft)] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--surface)] text-[var(--brand)] shadow-sm"><TestTube2 size={21} aria-hidden="true"/></span>
        <div><b className="text-[var(--ink-strong)]">Personalize your starting point</b><p className="muted mt-1 text-sm leading-relaxed">Take the adaptive placement test, start from A1, or keep your manually selected {state.settings.currentLevel} level.</p></div>
      </div>
      <Link href="/placement" className="btn-secondary shrink-0">Placement options <ArrowRight size={17} aria-hidden="true"/></Link>
    </section>}

    <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
      <StatCard icon={<GraduationCap size={20}/>} label="Current level" value={state.settings.currentLevel} detail={`${levelProgress}% app mastery progress`}/>
      <StatCard icon={<Brain size={20}/>} label="Due today" value={inventory.dueVocabulary + inventory.overdueVocabulary} detail={`${inventory.dueGrammar + inventory.overdueGrammar} grammar reviews`} accent="info"/>
      <StatCard icon={<Target size={20}/>} label="Needs focus" value={inventory.weakVocabulary + inventory.weakGrammar} detail="Prioritized in today's plan" accent="warning"/>
      <StatCard icon={<Clock3 size={20}/>} label="Daily plan" value={`${plan.estimatedMinutes} min`} detail={`${plan.totalItems} activities prepared`} accent="success"/>
    </div>

    <div className="page-grid">
      <section className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[color-mix(in_srgb,var(--brand)_28%,var(--line))] bg-[var(--surface-raised)] p-5 shadow-[var(--shadow-md)] sm:p-7 lg:col-span-8">
        <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-[var(--brand-soft)] blur-3xl"/>
        <div className="relative">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div><div className="eyebrow">Daily goal</div><h2 className="mt-1 text-2xl font-[850] tracking-[-.025em] text-[var(--ink-strong)] sm:text-3xl">Your adaptive session</h2><p className="muted mt-2 max-w-xl text-sm leading-relaxed">Complete one focused session to move your learning path forward.</p></div>
            <Badge tone="neutral">{plan.totalItems} activities</Badge>
          </div>

          <div className="my-6 grid gap-2 sm:grid-cols-2">
            {plan.allocations.map((item) => <div key={item.category} className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-3.5 py-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--surface)] font-extrabold text-[var(--brand)] shadow-sm">{item.count}</span>
              <span className="text-sm font-semibold">{labels[item.category]}</span>
            </div>)}
          </div>
          {plan.allocations.length === 0 && <div className="my-6 rounded-xl bg-[var(--success-soft)] p-4 text-sm text-[var(--success)]">You are caught up. A light mixed-practice session is ready.</div>}

          <div className="flex flex-col gap-4 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="muted flex items-center gap-2 text-sm"><Clock3 size={17} aria-hidden="true"/>About <b className="text-[var(--ink)]">{plan.estimatedMinutes} minutes</b></div>
            <Link href="/learn" className="btn-primary min-w-48">Start today&apos;s session <ArrowRight size={18} aria-hidden="true"/></Link>
          </div>
        </div>
      </section>

      <section className="card p-5 sm:p-6 lg:col-span-4">
        <SectionTitle title="Latest session" subtitle={state.activities[0] ? "Your most recent accuracy" : "Complete a session to begin"}/>
        <div className="grid place-items-center py-3">
          <ProgressRing value={latestAccuracy} label="Latest session accuracy" size={132}>
            <div><b className="text-2xl tracking-tight">{latestAccuracy}%</b><div className="muted text-xs">accuracy</div></div>
          </ProgressRing>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl bg-[var(--surface-muted)] p-3"><b>{state.activities[0]?.correct ?? 0}</b><div className="muted mt-0.5 text-xs">Correct</div></div>
          <div className="rounded-xl bg-[var(--surface-muted)] p-3"><b>{(state.activities[0]?.total ?? 0) - (state.activities[0]?.correct ?? 0)}</b><div className="muted mt-0.5 text-xs">To revisit</div></div>
        </div>
      </section>

      <section className="card p-5 sm:p-6 lg:col-span-7">
        <SectionTitle title="Knowledge health" subtitle="Mastery across your active skills" href="/progress"/>
        <div className="space-y-4">{[
          ["Vocabulary recognition", dimensions.recognition, "var(--brand)"],
          ["Vocabulary recall", dimensions.recall, "var(--warning)"],
          ["Grammar", dimensions.grammar, "var(--info)"],
          ["Context use", dimensions.context, "#a566d1"],
        ].map(([label, value, color]) => <div key={String(label)}>
          <div className="mb-1.5 flex justify-between text-sm"><b>{label}</b><span className="muted">{value}%</span></div>
          <ProgressBar value={Number(value)} label={String(label)} color={String(color)}/>
        </div>)}</div>
      </section>

      <section className="card p-5 sm:p-6 lg:col-span-5">
        <SectionTitle title="Recommended next" subtitle="From your live learning path" href="/path"/>
        <div className="space-y-2">{recommendations.map((item) => <Link key={item.id} href={item.knowledgeType === "vocabulary" ? "/vocabulary" : "/grammar"} className="group flex items-center gap-3 rounded-xl border border-[var(--line)] p-3 transition-colors hover:border-[var(--line-strong)] hover:bg-[var(--surface-hover)]">
          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${item.knowledgeType === "vocabulary" ? "bg-[var(--warning-soft)] text-[var(--warning)]" : "bg-[var(--info-soft)] text-[var(--info)]"}`}>{item.knowledgeType === "vocabulary" ? <BookOpen size={19} aria-hidden="true"/> : <Sparkles size={19} aria-hidden="true"/>}</span>
          <div className="min-w-0 flex-1"><b className="text-sm text-[var(--ink-strong)]">{item.title}</b><p className="muted truncate text-xs">{item.reason}</p></div>
          <ArrowRight size={17} className="text-[var(--muted)] transition-transform group-hover:translate-x-0.5" aria-hidden="true"/>
        </Link>)}</div>
      </section>
    </div>
  </>;
}
