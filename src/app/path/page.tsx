"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, Route, Sparkles } from "lucide-react";
import { useAppState } from "@/components/app-provider";
import { PageHeader } from "@/components/ui";
import { buildLearningPath } from "@/lib/learning/path";
import type { LearningPathItem } from "@/types/domain";

const stateLabel: Record<LearningPathItem["state"], string> = { "needs-foundation": "Needs foundation", recommended: "Recommended", "in-progress": "In progress", reviewing: "Reviewing", strong: "Strong", mastered: "Mastered", locked: "Locked" };

export default function LearningPathPage() {
  const { state } = useAppState(); const path = buildLearningPath(state);
  const foundation = path.filter((item) => item.state === "needs-foundation" || item.state === "reviewing");
  const current = path.filter((item) => item.state === "recommended" || item.state === "in-progress");
  const achieved = path.filter((item) => item.state === "strong" || item.state === "mastered");
  return <><PageHeader eyebrow="Personalized learning path" title={`${state.placement?.estimatedLevel ?? state.settings.currentLevel} learning path`} description="This path recalculates from placement diagnostics, mastery, prerequisites, due reviews, and recurring mistakes." action={<Link href="/learn" className="btn-primary">Study this path <ArrowRight size={17}/></Link>}/>
    {!state.placement && <div className="card mb-5 flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div><b>Start with better diagnostics</b><p className="muted mt-1 text-sm">Take the placement test to personalize vocabulary and grammar priorities.</p></div><Link className="btn-secondary shrink-0" href="/placement">Take placement test</Link></div>}
    <div className="grid gap-5 lg:grid-cols-3"><PathColumn title="Foundation repair" icon={<Route size={18}/>} items={foundation} empty="No urgent foundation gaps."/><PathColumn title="Current focus" icon={<Sparkles size={18}/>} items={current} empty="Complete reviews to unlock recommendations."/><PathColumn title="Strong knowledge" icon={<CheckCircle2 size={18}/>} items={achieved} empty="Strong topics will appear here."/></div>
  </>;
}

function PathColumn({ title, icon, items, empty }: { title: string; icon: React.ReactNode; items: LearningPathItem[]; empty: string }) {
  return <section className="card h-fit p-5"><div className="mb-4 flex items-center gap-2 text-[#17795b]">{icon}<h2 className="font-extrabold text-[#15241f]">{title}</h2></div><div className="space-y-3">{items.map((item) => <article key={item.id} className="rounded-xl border border-[#e2eae6] p-3"><div className="flex items-start justify-between gap-2"><div><b className="text-sm">{item.title}</b><p className="muted mt-1 text-xs">{item.reason}</p></div>{item.state === "locked" ? <LockKeyhole size={15}/> : <span className="badge">{item.level}</span>}</div><div className="mt-2 text-[10px] font-extrabold uppercase tracking-wide text-[#17795b]">{stateLabel[item.state]}</div></article>)}{items.length === 0 && <p className="muted text-sm">{empty}</p>}</div></section>;
}
