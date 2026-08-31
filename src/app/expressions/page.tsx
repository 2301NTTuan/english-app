"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui";
import { useAppState } from "@/components/app-provider";
import type { CEFRLevel, ExpressionItem } from "@/types/domain";

const kinds = ["all", "idiom", "phrasal-verb", "collocation", "common-expression"] as const;
type KindFilter = (typeof kinds)[number];
type ExpressionResponse = {
  items: ExpressionItem[]; page: number; pageSize: number; total: number; pageCount: number;
  corpus: { total: number; byKind: Record<string, number>; byLevel: Record<string, number>; topics: string[] };
};

export default function ExpressionsPage() {
  const { state } = useAppState();
  const [kind, setKind] = useState<KindFilter>("all");
  const [level, setLevel] = useState<CEFRLevel | "All">("All");
  const [topic, setTopic] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ExpressionResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ page: String(page), pageSize: "24" });
    if (kind !== "all") query.set("kind", kind);
    if (level !== "All") query.set("level", level);
    if (topic !== "All") query.set("topic", topic);
    if (search.trim()) query.set("search", search.trim());
    void fetch(`/api/content/expressions?${query}`, { signal: controller.signal })
      .then(async (response) => { if (!response.ok) throw new Error("Expressions could not be loaded."); return response.json() as Promise<ExpressionResponse>; })
      .then((response) => { setError(""); setData(response); })
      .catch((reason: unknown) => { if (!(reason instanceof DOMException && reason.name === "AbortError")) setError("Expressions could not be loaded. Please try again."); });
    return () => controller.abort();
  }, [kind, level, page, search, topic]);

  const updateFilter = (update: () => void) => { setPage(1); update(); };
  const start = data?.total ? (data.page - 1) * data.pageSize + 1 : 0;
  const end = data ? Math.min(data.page * data.pageSize, data.total) : 0;
  return <>
    <PageHeader eyebrow={`${data?.corpus.total ?? "…"} natural expressions`} title="Expressions" description="Study idioms, phrasal verbs, collocations, and everyday expressions with context and usage notes."/>
    <div className="mb-3 flex gap-2 overflow-x-auto pb-1">{kinds.map((value) => <button key={value} onClick={() => updateFilter(() => setKind(value))} className={`shrink-0 rounded-full px-3 py-2 text-xs font-extrabold capitalize ${kind === value ? "bg-[#17795b] text-white" : "bg-white ring-1 ring-[#dce6e1]"}`}>{value.replaceAll("-", " ")}{value !== "all" && data?.corpus.byKind[value] !== undefined ? ` (${data.corpus.byKind[value]})` : ""}</button>)}</div>
    <div className="card mb-5 grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="text-xs font-bold">Search<input value={search} onChange={(event) => updateFilter(() => setSearch(event.target.value))} placeholder="Expression or meaning" className="mt-1 w-full rounded-lg border border-[#dce6e1] bg-white p-2"/></label>
      <label className="text-xs font-bold">CEFR<select value={level} onChange={(event) => updateFilter(() => setLevel(event.target.value as CEFRLevel | "All"))} className="mt-1 w-full rounded-lg border border-[#dce6e1] bg-white p-2"><option>All</option>{(["A1", "A2", "B1", "B2", "C1", "C2"] as CEFRLevel[]).map((value) => <option key={value}>{value}</option>)}</select></label>
      <label className="text-xs font-bold">Topic<select value={topic} onChange={(event) => updateFilter(() => setTopic(event.target.value))} className="mt-1 w-full rounded-lg border border-[#dce6e1] bg-white p-2"><option>All</option>{data?.corpus.topics.map((value) => <option key={value}>{value}</option>)}</select></label>
      <div className="self-end text-xs"><b>{data ? `${start}–${end} of ${data.total}` : "Loading…"}</b><p className="muted mt-1">Database-backed results</p></div>
    </div>
    {error && <div role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-900">{error}</div>}
    {!data && !error && <div className="card p-8 text-center text-sm" role="status">Loading expressions…</div>}
    <div className="grid gap-3 lg:grid-cols-2">{data?.items.map((item) => <article className="card p-5" key={item.id}><div className="flex items-center gap-2"><span className="badge capitalize">{item.kind.replaceAll("-", " ")}</span><span className="muted text-xs font-bold">{item.cefrLevel}</span>{item.separability && <span className="muted text-xs">· {item.separability}</span>}</div><h2 className="mt-3 text-xl font-extrabold">{item.expression}</h2><p className="mt-2 text-sm">{item.meaning}</p>{state.settings.showVietnamese && <p className="mt-1 text-sm font-semibold text-[#17795b]">{item.vietnameseMeaning}</p>}<p className="muted mt-4 border-l-2 border-[#badbce] pl-3 text-sm italic">“{item.examples[0]}”</p><div className="mt-4 rounded-xl bg-[#f5f8f6] p-3 text-xs"><b>Usage note</b><p className="muted mt-1">{item.usageNotes}</p></div></article>)}</div>
    {data && data.pageCount > 1 && <nav aria-label="Expressions pages" className="mt-6 flex items-center justify-center gap-3"><button className="btn-secondary disabled:opacity-40" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button><span className="text-sm font-bold">Page {data.page} of {data.pageCount}</span><button className="btn-secondary disabled:opacity-40" disabled={page >= data.pageCount} onClick={() => setPage((value) => value + 1)}>Next</button></nav>}
  </>;
}
