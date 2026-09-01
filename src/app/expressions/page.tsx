"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";
import { Badge, CefrBadge, EmptyState, ErrorState, FilterChip, PageHeader, SearchInput, Skeleton } from "@/components/ui";
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
  const [retry, setRetry] = useState(0);
  const [data, setData] = useState<ExpressionResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ page: String(page), pageSize: "24" });
    if (kind !== "all") query.set("kind", kind);
    if (level !== "All") query.set("level", level);
    if (topic !== "All") query.set("topic", topic);
    if (search.trim()) query.set("search", search.trim());
    const timeout = window.setTimeout(() => {
      void fetch(`/api/content/expressions?${query}`, { signal: controller.signal })
        .then(async (response) => { if (!response.ok) throw new Error("Expressions could not be loaded."); return response.json() as Promise<ExpressionResponse>; })
        .then((response) => { setError(""); setData(response); })
        .catch((reason: unknown) => { if (!(reason instanceof DOMException && reason.name === "AbortError")) setError("Expressions could not be loaded. Please try again."); });
    }, search ? 250 : 0);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [kind, level, page, retry, search, topic]);

  const updateFilter = (update: () => void) => { setPage(1); update(); };
  const start = data?.total ? (data.page - 1) * data.pageSize + 1 : 0;
  const end = data ? Math.min(data.page * data.pageSize, data.total) : 0;
  const hasFilters = kind !== "all" || level !== "All" || topic !== "All" || Boolean(search);
  const clearFilters = () => { setKind("all"); setLevel("All"); setTopic("All"); setSearch(""); setPage(1); };

  return <>
    <PageHeader eyebrow={`${data?.corpus.total ?? "…"} natural expressions`} title="Expressions" description="Study idioms, phrasal verbs, collocations, and everyday expressions with real context and clear usage notes."/>

    <div className="mb-3 flex gap-2 overflow-x-auto pb-1" aria-label="Expression type filters">{kinds.map((value) => <FilterChip key={value} active={kind === value} onClick={() => updateFilter(() => setKind(value))} className="shrink-0 capitalize">{value.replaceAll("-", " ")}{value !== "all" && data?.corpus.byKind[value] !== undefined ? ` (${data.corpus.byKind[value]})` : ""}</FilterChip>)}</div>

    <section className="card mb-5 p-3 sm:p-4" aria-label="Expression filters">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(240px,1fr)_180px_minmax(180px,1fr)_auto]">
        <SearchInput type="text" value={search} onChange={(event) => updateFilter(() => setSearch(event.target.value))} label="Search" placeholder="Expression or meaning…"/>
        <label><span className="sr-only">CEFR level</span><select value={level} onChange={(event) => updateFilter(() => setLevel(event.target.value as CEFRLevel | "All"))} className="select-field text-sm font-bold"><option>All</option>{(["A1", "A2", "B1", "B2", "C1", "C2"] as CEFRLevel[]).map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span className="sr-only">Topic</span><select value={topic} onChange={(event) => updateFilter(() => setTopic(event.target.value))} className="select-field text-sm font-bold"><option>All</option>{data?.corpus.topics.map((value) => <option key={value}>{value}</option>)}</select></label>
        <div className="flex items-center justify-between gap-3 px-1 text-xs lg:block lg:min-w-32"><b>{data ? `${start}–${end} of ${data.total}` : "Loading…"}</b>{hasFilters && <button type="button" className="text-[var(--brand)] hover:underline lg:mt-1 lg:block" onClick={clearFilters}>Clear filters</button>}</div>
      </div>
    </section>

    {error && <ErrorState description={error} action={<button type="button" className="btn-secondary" onClick={() => setRetry((value) => value + 1)}>Try again</button>}/>}
    {!data && !error && <div className="grid gap-3 lg:grid-cols-2" role="status"><span className="sr-only">Loading expressions…</span>{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-64"/>)}</div>}
    {data && !error && data.items.length === 0 && <EmptyState title="No matching expressions" description="Try a broader search or remove one of the filters." action={<button type="button" className="btn-secondary" onClick={clearFilters}>Clear filters</button>}/>}

    <div className="grid items-start gap-3 lg:grid-cols-2">{data?.items.map((item) => <article className="card overflow-hidden" key={item.id}>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2"><Badge>{item.kind.replaceAll("-", " ")}</Badge><CefrBadge level={item.cefrLevel}/>{item.separability && <Badge tone="neutral">{item.separability}</Badge>}</div>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]"><MessageSquareQuote size={19} aria-hidden="true"/></span>
        </div>
        <h2 className="mt-4 text-xl font-[840] tracking-[-.02em] text-[var(--ink-strong)]">{item.expression}</h2>
        <p className="mt-2 text-sm leading-relaxed">{item.meaning}</p>
        {state.settings.showVietnamese && <p className="mt-1 text-sm font-semibold text-[var(--brand)]">{item.vietnameseMeaning}</p>}
        <blockquote className="muted mt-4 rounded-r-xl border-l-2 border-[var(--brand)] bg-[var(--brand-soft)] px-4 py-3 text-sm italic leading-relaxed">“{item.examples[0]}”</blockquote>
      </div>
      <div className="border-t border-[var(--line)] bg-[var(--surface-muted)] px-5 py-4 text-xs sm:px-6"><b className="text-[var(--ink-strong)]">Usage note</b><p className="muted mt-1 leading-relaxed">{item.usageNotes}</p></div>
    </article>)}</div>

    {data && data.pageCount > 1 && <nav aria-label="Expressions pages" className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <button className="btn-secondary disabled:opacity-40" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft size={17} aria-hidden="true"/>Previous</button>
      <span className="muted text-sm font-bold">Page {data.page} of {data.pageCount}</span>
      <button className="btn-secondary disabled:opacity-40" disabled={page >= data.pageCount} onClick={() => setPage((value) => value + 1)}>Next<ChevronRight size={17} aria-hidden="true"/></button>
    </nav>}
  </>;
}
