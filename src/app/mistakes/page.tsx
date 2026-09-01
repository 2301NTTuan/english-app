"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, History } from "lucide-react";
import { useAppState } from "@/components/app-provider";
import { Badge, EmptyState, ErrorState, PageHeader } from "@/components/ui";

export default function MistakesPage() {
  const { state, setState } = useAppState();
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");
  const sorted = state.mistakes.filter((item) => !item.resolved).sort((a, b) => b.repeatedCount - a.repeatedCount);

  async function resolve(mistakeId: string) {
    setPending(mistakeId);
    setError("");
    try {
      const response = await fetch("/api/mistakes/resolve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mistakeId }) });
      if (!response.ok) throw new Error();
      setState((current) => ({ ...current, mistakes: current.mistakes.map((mistake) => mistake.id === mistakeId ? { ...mistake, resolved: true } : mistake) }));
    } catch {
      setError("The mistake could not be resolved. Your progress was not changed.");
    } finally {
      setPending("");
    }
  }

  return <>
    <PageHeader eyebrow="Turn errors into memory" title="Mistake bank" description="Wrong answers are grouped and returned to future sessions until the underlying knowledge becomes reliable." action={<Link href="/learn" className="btn-primary">Practice mistakes <ArrowRight size={17} aria-hidden="true"/></Link>}/>
    {error && <div className="mb-4"><ErrorState description={error}/></div>}
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-muted)] p-5"><div><h2 className="font-[820] text-[var(--ink-strong)]">Frequent mistakes</h2><p className="muted mt-1 text-xs">Most repeated patterns appear first.</p></div><Badge tone={sorted.length ? "danger" : "success"}>{sorted.length} patterns</Badge></div>
      <div className="divide-y divide-[var(--line)]">{sorted.map((item) => <div key={item.id} className="grid gap-3 p-4 transition-colors hover:bg-[var(--surface-hover)] sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center sm:px-5">
        <div><b className="text-sm text-[var(--ink-strong)]">{item.label}</b><div className="muted mt-1 text-xs"><span className="capitalize">{item.knowledgeType}</span> · {item.exerciseType.replaceAll("-", " ")} · last seen {new Date(item.timestamp).toLocaleDateString()}</div></div>
        <div className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-sm"><span className="text-[var(--danger)] line-through">{item.wrongAnswer}</span><span className="mx-2">→</span><b className="text-[var(--success)]">{item.correctAnswer}</b></div>
        <Badge tone="danger" className="w-fit"><History size={13} aria-hidden="true"/>{item.repeatedCount}×</Badge>
        <button disabled={pending === item.id} className="btn-secondary text-xs disabled:opacity-60" onClick={() => void resolve(item.id)} aria-label={`Mark ${item.label} resolved`}>{pending === item.id ? "Saving…" : "Resolve"}</button>
      </div>)}</div>
      {sorted.length === 0 && <div className="p-4"><EmptyState title="No active mistakes" description="Incorrect answers will appear here automatically and return to future study sessions."/></div>}
    </section>
  </>;
}
