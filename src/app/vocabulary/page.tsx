"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Search, SlidersHorizontal } from "lucide-react";
import { useAppState } from "@/components/app-provider";
import { PageHeader, ProgressBar } from "@/components/ui";
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
  const [query, setQuery] = useState(""); const [level, setLevel] = useState(""); const [part, setPart] = useState("");
  const [topic, setTopic] = useState(""); const [frequencyBand, setFrequencyBand] = useState(""); const [page, setPage] = useState(1);
  const [result, setResult] = useState<VocabularyResponse | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [retry, setRetry] = useState(0);
  const progressById = useMemo(() => new Map(state.vocabularyProgress.map((item) => [item.itemId, item])), [state.vocabularyProgress]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true); setError("");
      const parameters = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
      if (query.trim()) parameters.set("search", query.trim()); if (level) parameters.set("level", level);
      if (part) parameters.set("partOfSpeech", part); if (topic.trim()) parameters.set("topic", topic.trim());
      if (frequencyBand) parameters.set("frequencyBand", frequencyBand);
      try {
        const response = await fetch(`/api/content/vocabulary?${parameters}`, { credentials: "same-origin", cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error(response.status === 401 ? "Sign in again to browse vocabulary." : "Vocabulary is temporarily unavailable.");
        setResult(await response.json() as VocabularyResponse);
      } catch (caught) {
        if (!controller.signal.aborted) setError(caught instanceof Error ? caught.message : "Vocabulary is temporarily unavailable.");
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, query ? 250 : 0);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [frequencyBand, level, page, part, query, retry, topic]);

  const updateFilter = (setter: (value: string) => void) => (value: string) => { setter(value); setPage(1); };
  const items = result?.items ?? [];
  return <>
    <PageHeader eyebrow={result ? `${result.total} matching curated words` : "Curated vocabulary"} title="Vocabulary" description="Search a bounded, server-delivered catalogue. Learn meaning, recall, context, and spelling separately."/>
    <div className="card mb-4 grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-[1fr_auto_auto_auto_auto]">
      <label className="flex items-center gap-2 rounded-xl bg-[#f5f8f6] px-3"><Search size={17} className="muted"/><span className="sr-only">Search vocabulary</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} className="h-11 w-full bg-transparent text-sm outline-none" placeholder="Word, English or Vietnamese meaning…"/></label>
      <Filter value={level} onChange={updateFilter(setLevel)} label="CEFR" options={[{ value: "", label: "All levels" }, ...["A1", "A2", "B1", "B2", "C1", "C2"].map((value) => ({ value, label: value }))]}/>
      <Filter value={part} onChange={updateFilter(setPart)} label="Part of speech" options={[{ value: "", label: "All word classes" }, ...PARTS_OF_SPEECH.map((value) => ({ value, label: value }))]}/>
      <Filter value={frequencyBand} onChange={updateFilter(setFrequencyBand)} label="Frequency" options={[{ value: "", label: "All frequencies" }, { value: "very-common", label: "Very common" }, { value: "common", label: "Common" }, { value: "less-common", label: "Less common" }, { value: "advanced", label: "Advanced" }]}/>
      <label className="flex items-center gap-2 rounded-xl border border-[#dce6e1] px-3"><SlidersHorizontal size={16}/><span className="sr-only">Exact topic</span><input value={topic} onChange={(event) => updateFilter(setTopic)(event.target.value)} className="h-11 w-28 bg-transparent text-sm outline-none" placeholder="Exact topic"/></label>
    </div>
    <div aria-live="polite" aria-busy={loading}>{loading && <div className="card p-10 text-center"><p className="font-bold">Loading vocabulary…</p></div>}{error && <div role="alert" className="card border border-red-200 bg-red-50 p-6 text-center text-red-900"><p className="font-bold">{error}</p><button className="btn-secondary mt-3" onClick={() => setRetry((value) => value + 1)}>Try again</button></div>}{!loading && !error && items.length === 0 && <div className="card p-10 text-center"><h2 className="font-extrabold">No matching words</h2><p className="muted mt-1 text-sm">Try another search or filter.</p></div>}</div>
    {!loading && !error && <div className="grid gap-3 xl:grid-cols-2">{items.map((item) => { const progress = progressById.get(item.id); const mastery = progress?.mastery; return <article key={item.id} className="card p-5"><div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-extrabold">{item.word}</h2><span className="badge">{item.level}</span><span className="muted text-xs">{item.partOfSpeech}</span>{item.frequencyBand && <span className="muted text-xs">{item.frequencyBand.replace("-", " ")}</span>}</div><p className="mt-1 text-sm">{item.definition}</p>{state.settings.showVietnamese && item.vietnamese && <p className="mt-1 text-sm font-semibold text-[#17795b]">{item.vietnamese}</p>}</div><BookOpen size={19} className="text-[#17795b]"/></div>{item.example && <p className="muted mt-4 border-l-2 border-[#badbce] pl-3 text-sm italic">“{item.example}”</p>}{item.topics.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{item.topics.map((text) => <span className="badge" key={text}>{text}</span>)}</div>}<div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">{(["recognition", "recall", "context", "spelling"] as const).map((dimension) => <div key={dimension}><div className="mb-1 flex justify-between text-[11px] font-bold capitalize"><span>{dimension}</span><span className="muted">{mastery?.[dimension] ?? 0}%</span></div><ProgressBar value={mastery?.[dimension] ?? 0} label={`${item.word} ${dimension} mastery`}/></div>)}</div><div className="mt-4 flex justify-between border-t border-[#e2eae6] pt-3 text-xs"><span className="muted">{progress ? `Next review ${new Date(progress.review.nextReview).toLocaleDateString()}` : "New · ready to learn"}</span><b>{mastery?.overall ?? 0}% overall</b></div></article>; })}</div>}
    {!loading && !error && result && result.pageCount > 1 && <nav aria-label="Vocabulary pages" className="mt-5 flex items-center justify-center gap-3"><button className="btn-secondary" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button><span className="muted text-sm">Page {result.page} of {result.pageCount} · {result.total} words</span><button className="btn-secondary" disabled={page >= result.pageCount} onClick={() => setPage((value) => Math.min(result.pageCount, value + 1))}>Next</button></nav>}
  </>;
}

function Filter({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: { value: string; label: string }[] }) { return <label className="flex items-center gap-2 rounded-xl border border-[#dce6e1] px-3"><SlidersHorizontal size={16}/><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 bg-transparent text-sm font-bold outline-none">{options.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label>; }
