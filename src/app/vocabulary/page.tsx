"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Layers3, SlidersHorizontal } from "lucide-react";
import { useAppState } from "@/components/app-provider";
import { Badge, CefrBadge, EmptyState, ErrorState, PageHeader, ProgressBar, SearchInput, Skeleton } from "@/components/ui";
import { VocabularyPronunciation } from "@/components/vocabulary-pronunciation";
import type { CEFRLevel, ContentStatus, FrequencyBand } from "@/types/domain";

const PAGE_SIZE = 24;
const PARTS_OF_SPEECH = ["adjective", "adverb", "conjunction", "determiner", "interjection", "modal", "noun", "numeral", "particle", "preposition", "pronoun", "verb"];

interface VocabularySummary {
  id: string; word: string; lemma: string | null; partOfSpeech: string; level: CEFRLevel;
  frequencyRank: number | null; frequencyBand: FrequencyBand | null; status: ContentStatus;
  cefrBasis: string; frequencyBasis: string; provenanceId: string; topics: string[]; tags: string[];
  definition: string | null; vietnamese: string | null; example: string | null;
}

interface VocabularyResponse { items: VocabularySummary[]; page: number; pageSize: number; total: number; pageCount: number }

export default function VocabularyPage() {
  const { state } = useAppState();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");
  const [part, setPart] = useState("");
  const [topic, setTopic] = useState("");
  const [frequencyBand, setFrequencyBand] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string>();
  const [result, setResult] = useState<VocabularyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const progressById = useMemo(() => new Map(state.vocabularyProgress.map((item) => [item.itemId, item])), [state.vocabularyProgress]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      const parameters = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
      if (query.trim()) parameters.set("search", query.trim());
      if (level) parameters.set("level", level);
      if (part) parameters.set("partOfSpeech", part);
      if (topic.trim()) parameters.set("topic", topic.trim());
      if (frequencyBand) parameters.set("frequencyBand", frequencyBand);
      try {
        const response = await fetch(`/api/content/vocabulary?${parameters}`, { credentials: "same-origin", cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error(response.status === 401 ? "Sign in again to browse vocabulary." : "Vocabulary is temporarily unavailable.");
        setResult(await response.json() as VocabularyResponse);
      } catch (caught) {
        if (!controller.signal.aborted) setError(caught instanceof Error ? caught.message : "Vocabulary is temporarily unavailable.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, query ? 250 : 0);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [frequencyBand, level, page, part, query, retry, topic]);

  const updateFilter = (setter: (value: string) => void) => (value: string) => { setter(value); setPage(1); };
  const items = result?.items ?? [];
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const selectedProgress = selected ? progressById.get(selected.id) : undefined;
  const hasFilters = Boolean(query || level || part || topic || frequencyBand);
  const clearFilters = () => { setQuery(""); setLevel(""); setPart(""); setTopic(""); setFrequencyBand(""); setPage(1); };

  return <>
    <PageHeader eyebrow={result ? `${result.total} curated words` : "Curated vocabulary"} title="Vocabulary library" description="Scan words quickly, hear British and American pronunciation, then open a focused detail view for meaning, context, and mastery."/>

    <section aria-label="Vocabulary filters" className="card mb-5 p-3 sm:p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_repeat(3,minmax(140px,auto))]">
        <SearchInput value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} label="Search vocabulary" placeholder="Search word or meaning…"/>
        <Filter value={level} onChange={updateFilter(setLevel)} label="CEFR level" options={[{ value: "", label: "All levels" }, ...["A1", "A2", "B1", "B2", "C1", "C2"].map((value) => ({ value, label: value }))]}/>
        <Filter value={part} onChange={updateFilter(setPart)} label="Part of speech" options={[{ value: "", label: "All word classes" }, ...PARTS_OF_SPEECH.map((value) => ({ value, label: value }))]}/>
        <Filter value={frequencyBand} onChange={updateFilter(setFrequencyBand)} label="Frequency" options={[{ value: "", label: "All frequencies" }, { value: "very-common", label: "Very common" }, { value: "common", label: "Common" }, { value: "less-common", label: "Less common" }, { value: "advanced", label: "Advanced" }]}/>
      </div>
      <div className="mt-3 flex flex-col gap-2 border-t border-[var(--line)] pt-3 sm:flex-row sm:items-center">
        <label className="relative flex max-w-sm flex-1 items-center"><SlidersHorizontal size={16} className="pointer-events-none absolute left-3 text-[var(--muted)]"/><span className="sr-only">Exact topic</span><input value={topic} onChange={(event) => updateFilter(setTopic)(event.target.value)} className="field pl-10 text-sm" placeholder="Filter by exact topic"/></label>
        {hasFilters && <button type="button" className="btn-quiet self-start text-sm sm:ml-auto" onClick={clearFilters}>Clear filters</button>}
      </div>
    </section>

    <div aria-live="polite" aria-busy={loading}>
      {loading && <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,.85fr)]"><div className="space-y-2">{Array.from({ length: 7 }, (_, index) => <Skeleton key={index} className="h-24"/>)}</div><Skeleton className="h-[520px]"/></div>}
      {error && <ErrorState description={error} action={<button className="btn-secondary" onClick={() => setRetry((value) => value + 1)}>Try again</button>}/>}
      {!loading && !error && items.length === 0 && <EmptyState title="No matching words" description="Try another search term or remove one of the filters." action={hasFilters ? <button type="button" className="btn-secondary" onClick={clearFilters}>Clear filters</button> : undefined}/>}
    </div>

    {!loading && !error && selected && <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,.85fr)]">
      <section aria-label="Vocabulary results" className="space-y-2">
        {items.map((item) => {
          const progress = progressById.get(item.id);
          const mastery = progress?.mastery.overall ?? 0;
          const active = selected.id === item.id;
          return <article key={item.id} className={`relative rounded-[var(--radius-md)] border bg-[var(--surface)] p-4 transition-colors ${active ? "border-[var(--brand)] shadow-[0_0_0_1px_var(--brand)]" : "border-[var(--line)] hover:border-[var(--line-strong)] hover:bg-[var(--surface-hover)]"}`}>
            <button type="button" className="absolute inset-0 rounded-[inherit]" aria-label={`View details for ${item.word}`} aria-pressed={active} onClick={() => setSelectedId(item.id)}/>
            <div className="pointer-events-none relative flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-soft)] font-[850] uppercase text-[var(--brand)]">{item.word.slice(0, 1)}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1"><h2 className="text-lg font-[820] tracking-[-.015em] text-[var(--ink-strong)]">{item.word}</h2><CefrBadge level={item.level}/><span className="muted text-xs">{item.partOfSpeech}</span></div>
                <p className="muted mt-1 line-clamp-1 text-sm">{item.definition ?? "Definition unavailable"}</p>
                <div className="mt-2 flex items-center gap-2"><div className="progress-track w-24"><div className="progress-fill" style={{ width: `${mastery}%` }}/></div><span className="muted text-[11px] font-bold">{mastery}% mastery</span></div>
              </div>
              <ChevronRight size={18} className={active ? "text-[var(--brand)]" : "text-[var(--muted)]"} aria-hidden="true"/>
            </div>
            <div className="relative z-10 mt-3 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-3" onClick={(event) => event.stopPropagation()}>
              <VocabularyPronunciation word={item.lemma ?? item.word} compact/>
              <span className="muted hidden text-xs sm:block">{progress ? `Review ${new Date(progress.review.nextReview).toLocaleDateString()}` : "New · ready to learn"}</span>
            </div>
          </article>;
        })}
      </section>

      <aside className="order-first card overflow-hidden xl:sticky xl:top-8 xl:order-last" aria-label={`Details for ${selected.word}`}>
        <div className="border-b border-[var(--line)] bg-[var(--surface-muted)] p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3"><div><div className="mb-2 flex flex-wrap items-center gap-2"><CefrBadge level={selected.level}/><Badge tone="neutral">{selected.partOfSpeech}</Badge>{selected.frequencyBand && <Badge tone="warning">{selected.frequencyBand.replace("-", " ")}</Badge>}</div><h2 className="text-3xl font-[880] tracking-[-.035em] text-[var(--ink-strong)]">{selected.word}</h2>{selected.lemma && selected.lemma !== selected.word && <p className="muted mt-1 text-sm">Lemma: {selected.lemma}</p>}</div><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--surface)] text-[var(--brand)] shadow-sm"><BookOpen size={21} aria-hidden="true"/></span></div>
          <VocabularyPronunciation word={selected.lemma ?? selected.word}/>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div><div className="eyebrow mb-2">Meaning</div><p className="leading-relaxed">{selected.definition ?? "Definition unavailable"}</p>{state.settings.showVietnamese && selected.vietnamese && <p className="mt-2 font-semibold text-[var(--brand)]">{selected.vietnamese}</p>}</div>
          {selected.example && <div><div className="eyebrow mb-2">In context</div><blockquote className="rounded-r-xl border-l-2 border-[var(--brand)] bg-[var(--brand-soft)] px-4 py-3 text-sm italic leading-relaxed">“{selected.example}”</blockquote></div>}
          {selected.topics.length > 0 && <div><div className="eyebrow mb-2">Topics</div><div className="flex flex-wrap gap-1.5">{selected.topics.map((text) => <Badge tone="neutral" key={text}>{text}</Badge>)}</div></div>}
          <div>
            <div className="mb-3 flex items-center justify-between"><div className="eyebrow">Skill mastery</div><b className="text-sm">{selectedProgress?.mastery.overall ?? 0}% overall</b></div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">{(["recognition", "recall", "context", "spelling"] as const).map((dimension) => <div key={dimension}><div className="mb-1 flex justify-between text-[11px] font-bold capitalize"><span>{dimension}</span><span className="muted">{selectedProgress?.mastery[dimension] ?? 0}%</span></div><ProgressBar value={selectedProgress?.mastery[dimension] ?? 0} label={`${selected.word} ${dimension} mastery`}/></div>)}</div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-muted)] p-3 text-xs"><Layers3 size={16} className="text-[var(--muted)]" aria-hidden="true"/><span className="muted">{selectedProgress ? `Next review ${new Date(selectedProgress.review.nextReview).toLocaleDateString()}` : "This word is new and ready to learn."}</span></div>
        </div>
      </aside>
    </div>}

    {!loading && !error && result && result.pageCount > 1 && <nav aria-label="Vocabulary pages" className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft size={17} aria-hidden="true"/>Previous</button>
      <span className="muted text-sm">Page {result.page} of {result.pageCount} · {result.total} words</span>
      <button className="btn-secondary" disabled={page >= result.pageCount} onClick={() => setPage((value) => Math.min(result.pageCount, value + 1))}>Next<ChevronRight size={17} aria-hidden="true"/></button>
    </nav>}
  </>;
}

function Filter({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: { value: string; label: string }[] }) {
  return <label className="relative flex items-center"><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="select-field appearance-none pr-9 text-sm font-bold">{options.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select><ChevronRight size={15} className="pointer-events-none absolute right-3 rotate-90 text-[var(--muted)]"/></label>;
}
