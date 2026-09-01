"use client";

import { useState } from "react";
import { Check, ChevronDown, Circle, LockKeyhole, Route } from "lucide-react";
import { curriculumOutline } from "@/data/grammar";
import { useAppState } from "@/components/app-provider";
import { prerequisitesMet } from "@/lib/learning/prerequisites";
import { Badge, PageHeader, ProgressBar } from "@/components/ui";
import type { GrammarProgress, GrammarTopic } from "@/types/domain";

const stageLabel = ["FOUNDATION", "FOUNDATION", "INDEPENDENT", "INDEPENDENT", "PROFICIENT", "PROFICIENT"];

export function GrammarBrowser({ topics }: { topics: GrammarTopic[] }) {
  const { state } = useAppState();
  const [level, setLevel] = useState(state.settings.currentLevel);
  const visibleTopics = topics.filter((item) => item.level === level);
  const levelProgress = state.grammarProgress.filter((progress) => visibleTopics.some((topic) => topic.id === progress.topicId));
  const averageMastery = levelProgress.length ? Math.round(levelProgress.reduce((sum, progress) => sum + progress.mastery, 0) / levelProgress.length) : 0;

  return <>
    <PageHeader eyebrow="A1 → C2 curriculum" title="Grammar path" description="Move through a prerequisite-aware curriculum while tracking specific weak subtopics, not just whole lessons."/>

    <section className="card mb-6 overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[var(--line)] bg-[var(--surface-muted)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]"><Route size={19} aria-hidden="true"/></span><div><h2 className="font-[820] text-[var(--ink-strong)]">Curriculum map</h2><p className="muted mt-0.5 text-xs">Choose a CEFR stage to explore its concepts.</p></div></div>
        <Badge tone="neutral">{topics.length} topics · A1–C2</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 sm:p-5 xl:grid-cols-6">
        {Object.keys(curriculumOutline).map((itemLevel, index) => {
          const active = level === itemLevel;
          const count = topics.filter((topic) => topic.level === itemLevel).length;
          const progressItems = state.grammarProgress.filter((progress) => topics.some((topic) => topic.id === progress.topicId && topic.level === itemLevel));
          const mastered = progressItems.filter((progress) => progress.mastery >= 85).length;
          return <button type="button" onClick={() => setLevel(itemLevel as typeof level)} key={itemLevel} aria-pressed={active} className={`rounded-xl border p-3 text-left transition-colors ${active ? "border-[var(--brand)] bg-[var(--brand-soft)]" : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--line-strong)] hover:bg-[var(--surface-hover)]"}`}>
            <div className="flex items-center justify-between"><b className="text-lg text-[var(--ink-strong)]">{itemLevel}</b><span className={`size-2 rounded-full ${active ? "bg-[var(--brand)]" : mastered === count && count ? "bg-[var(--success)]" : "bg-[var(--line-strong)]"}`}/></div>
            <div className="muted mt-1 text-xs">{mastered}/{count} mastered</div>
            <div className="mt-2 text-[.6rem] font-extrabold tracking-[.08em] text-[var(--brand)]">{stageLabel[index]}</div>
          </button>;
        })}
      </div>
    </section>

    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><div className="eyebrow">Selected stage</div><h2 className="mt-1 text-2xl font-[850] tracking-[-.025em] text-[var(--ink-strong)]">{level} grammar</h2><p className="muted mt-1 text-sm">{levelProgress.length} started · {averageMastery}% average mastery</p></div>
      <Badge tone="neutral">{visibleTopics.length} topics</Badge>
    </div>

    <div className="grid items-start gap-3 lg:grid-cols-2">
      {visibleTopics.map((item) => {
        const progress = state.grammarProgress.find((entry) => entry.topicId === item.id);
        const unlocked = prerequisitesMet(item, state.grammarProgress);
        return <GrammarTopicCard key={item.id} item={item} progress={progress} unlocked={unlocked} topics={topics}/>;
      })}
    </div>
  </>;
}

function GrammarTopicCard({ item, progress, unlocked, topics }: { item: GrammarTopic; progress?: GrammarProgress; unlocked: boolean; topics: GrammarTopic[] }) {
  const status = !unlocked ? "Locked" : !progress ? "Ready" : progress.mastery >= 85 ? "Mastered" : progress.mastery >= 70 ? "Strong" : progress.mastery < 50 ? "Needs focus" : "Learning";
  const tone = !unlocked ? "neutral" : status === "Mastered" || status === "Strong" ? "success" : status === "Needs focus" ? "warning" : "brand";
  const prerequisiteNames = item.prerequisites.map((id) => topics.find((topic) => topic.id === id)?.title ?? id).join(", ");

  return <article className={`card overflow-hidden ${!unlocked ? "opacity-70" : ""}`}>
    <div className="p-5">
      <div className="flex items-start gap-3">
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${unlocked ? "bg-[var(--brand-soft)] text-[var(--brand)]" : "bg-[var(--surface-muted)] text-[var(--muted)]"}`}>{!unlocked ? <LockKeyhole size={17} aria-hidden="true"/> : status === "Mastered" ? <Check size={19} aria-hidden="true"/> : <Circle size={17} aria-hidden="true"/>}</span>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2"><Badge tone={tone}>{status}</Badge><span className="muted text-xs font-bold">{item.category}</span></div>
          <h3 className="text-lg font-[820] tracking-[-.015em] text-[var(--ink-strong)]">{item.title}</h3>
          <p className="muted mt-1 text-sm leading-relaxed">{item.description}</p>
        </div>
      </div>

      {progress ? <>
        <div className="mt-5 flex items-center gap-3"><div className="flex-1"><ProgressBar value={progress.mastery} label={`${item.title} mastery`}/></div><b className="text-sm">{progress.mastery}%</b></div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">{item.subtopics.map((subtopic) => <div key={subtopic.id} className="flex items-center justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs"><span className="min-w-0 truncate pr-2">{subtopic.title}</span><b>{progress.subtopicMastery[subtopic.id] ?? 0}%</b></div>)}</div>
      </> : <div className="muted mt-4 rounded-xl bg-[var(--surface-muted)] px-3 py-2.5 text-xs">{unlocked ? "Ready to begin" : `Requires ${prerequisiteNames}`}</div>}
    </div>

    {unlocked && <details className="group border-t border-[var(--line)]">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3.5 text-sm font-bold text-[var(--brand)] hover:bg-[var(--surface-hover)]">Lesson preview <ChevronDown size={17} className="transition-transform group-open:rotate-180" aria-hidden="true"/></summary>
      <div className="space-y-3 border-t border-[var(--line)] p-5">
        <p className="muted text-sm leading-relaxed">{item.explanation}</p>
        <div className="rounded-xl bg-[var(--surface-muted)] p-3"><b className="text-xs uppercase tracking-wide">Structure</b><p className="mt-1 text-sm">{item.structures.join(" · ")}</p></div>
        <div className="feedback feedback-error text-sm"><b>Common mistake</b><p className="mt-1"><span className="line-through">{item.commonMistakes[0].incorrect}</span><span className="mx-2">→</span><span className="font-bold text-[var(--success)]">{item.commonMistakes[0].correct}</span></p><p className="mt-1 text-xs opacity-80">{item.commonMistakes[0].explanation}</p></div>
      </div>
    </details>}
  </article>;
}
