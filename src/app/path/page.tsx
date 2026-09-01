"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, Route, Sparkles } from "lucide-react";
import { useAppState } from "@/components/app-provider";
import { Badge, PageHeader } from "@/components/ui";
import { buildLearningPath } from "@/lib/learning/path";
import type { LearningPathItem } from "@/types/domain";

const stateLabel: Record<LearningPathItem["state"], string> = { "needs-foundation": "Needs foundation", recommended: "Recommended", "in-progress": "In progress", reviewing: "Reviewing", strong: "Strong", mastered: "Mastered", locked: "Locked" };

export default function LearningPathPage() {
  const { state } = useAppState();
  const path = buildLearningPath(state);
  const foundation = path.filter((item) => item.state === "needs-foundation" || item.state === "reviewing");
  const current = path.filter((item) => item.state === "recommended" || item.state === "in-progress");
  const achieved = path.filter((item) => item.state === "strong" || item.state === "mastered");

  return <>
    <PageHeader eyebrow="Personalized learning path" title={`${state.placement?.estimatedLevel ?? state.settings.currentLevel} learning path`} description="This path recalculates from placement diagnostics, mastery, prerequisites, due reviews, and recurring mistakes." action={<Link href="/learn" className="btn-primary">Study this path <ArrowRight size={17} aria-hidden="true"/></Link>}/>
    {!state.placement && <div className="card mb-5 flex flex-col gap-3 border-[color-mix(in_srgb,var(--brand)_24%,var(--line))] bg-[var(--brand-soft)] p-5 sm:flex-row sm:items-center sm:justify-between"><div><b className="text-[var(--ink-strong)]">Start with better diagnostics</b><p className="muted mt-1 text-sm">Take the placement test to personalize vocabulary and grammar priorities.</p></div><Link className="btn-secondary shrink-0" href="/placement">Take placement test</Link></div>}
    <div className="grid items-start gap-5 lg:grid-cols-3">
      <PathColumn title="Foundation repair" icon={<Route size={18}/>} items={foundation} empty="No urgent foundation gaps." tone="warning"/>
      <PathColumn title="Current focus" icon={<Sparkles size={18}/>} items={current} empty="Complete reviews to unlock recommendations." tone="brand"/>
      <PathColumn title="Strong knowledge" icon={<CheckCircle2 size={18}/>} items={achieved} empty="Strong topics will appear here." tone="success"/>
    </div>
  </>;
}

function PathColumn({ title, icon, items, empty, tone }: { title: string; icon: React.ReactNode; items: LearningPathItem[]; empty: string; tone: "warning" | "brand" | "success" }) {
  const colors = { warning: ["var(--warning-soft)", "var(--warning)"], brand: ["var(--brand-soft)", "var(--brand)"], success: ["var(--success-soft)", "var(--success)"] }[tone];
  return <section className="card h-fit overflow-hidden">
    <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-muted)] p-5"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl" style={{ background: colors[0], color: colors[1] }}>{icon}</span><h2 className="font-[820] text-[var(--ink-strong)]">{title}</h2></div><Badge tone="neutral">{items.length}</Badge></div>
    <div className="space-y-2 p-3">{items.map((item) => <article key={item.id} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 transition-colors hover:border-[var(--line-strong)] hover:bg-[var(--surface-hover)]">
      <div className="flex items-start justify-between gap-2"><div className="min-w-0"><b className="text-sm text-[var(--ink-strong)]">{item.title}</b><p className="muted mt-1 text-xs leading-relaxed">{item.reason}</p></div>{item.state === "locked" ? <LockKeyhole size={15} className="text-[var(--muted)]"/> : <Badge>{item.level}</Badge>}</div>
      <div className="mt-3 text-[.62rem] font-extrabold uppercase tracking-[.1em]" style={{ color: colors[1] }}>{stateLabel[item.state]}</div>
    </article>)}{items.length === 0 && <p className="muted p-3 text-sm leading-relaxed">{empty}</p>}</div>
  </section>;
}
