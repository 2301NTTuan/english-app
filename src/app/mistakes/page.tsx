"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, History } from "lucide-react";
import { useAppState } from "@/components/app-provider";
import { PageHeader } from "@/components/ui";

export default function MistakesPage() {
  const { state, setState } = useAppState(); const [pending, setPending] = useState(""); const [error, setError] = useState("");
  const sorted = state.mistakes.filter((item) => !item.resolved).sort((a, b) => b.repeatedCount - a.repeatedCount);
  async function resolve(mistakeId: string) {
    setPending(mistakeId); setError("");
    try {
      const response = await fetch("/api/mistakes/resolve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mistakeId }) });
      if (!response.ok) throw new Error();
      setState((current) => ({ ...current, mistakes: current.mistakes.map((mistake) => mistake.id === mistakeId ? { ...mistake, resolved: true } : mistake) }));
    } catch { setError("The mistake could not be resolved. Your progress was not changed."); } finally { setPending(""); }
  }
  return <><PageHeader eyebrow="Turn errors into memory" title="Mistake bank" description="Wrong answers are grouped and returned to future sessions until the underlying knowledge becomes reliable." action={<Link href="/learn" className="btn-primary">Practice mistakes <ArrowRight size={17}/></Link>}/>{error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-900">{error}</p>}<section className="card overflow-hidden"><div className="border-b border-[#e2eae6] p-5"><div className="flex items-center justify-between"><h2 className="font-extrabold">Frequent mistakes</h2><span className="badge">{sorted.length} patterns</span></div></div><div className="divide-y divide-[#e2eae6]">{sorted.map((item) => <div key={item.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"><div><b className="text-sm">{item.label}</b><div className="muted mt-1 text-xs"><span className="capitalize">{item.knowledgeType}</span> · {item.exerciseType.replaceAll("-", " ")} · last seen {new Date(item.timestamp).toLocaleDateString()}</div></div><div className="text-sm"><span className="text-red-700 line-through">{item.wrongAnswer}</span><span className="mx-2">→</span><b className="text-emerald-700">{item.correctAnswer}</b></div><div className="flex w-fit items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-extrabold text-red-700"><History size={13}/>{item.repeatedCount}×</div><button disabled={pending === item.id} className="btn-secondary text-xs disabled:opacity-60" onClick={() => void resolve(item.id)} aria-label={`Mark ${item.label} resolved`}>{pending === item.id ? "Saving…" : "Resolve"}</button></div>)}{sorted.length === 0 && <div className="p-10 text-center"><b>No active mistakes</b><p className="muted mt-1 text-sm">Incorrect answers will appear here automatically.</p></div>}</div></section></>;
}
