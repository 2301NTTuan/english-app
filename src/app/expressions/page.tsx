"use client";

import { useState } from "react";
import { expressions } from "@/data/expressions";
import { PageHeader } from "@/components/ui";

const kinds = ["all", "idiom", "phrasal-verb", "collocation", "common-expression"] as const;
export default function ExpressionsPage() {
  const [filter, setFilter] = useState<(typeof kinds)[number]>("all"); const items = expressions.filter((item) => filter === "all" || item.kind === filter);
  return <><PageHeader eyebrow="Natural English" title="Expressions" description="Study idioms, phrasal verbs, collocations, and everyday expressions with context and usage notes."/><div className="mb-5 flex gap-2 overflow-x-auto pb-1">{kinds.map((kind) => <button key={kind} onClick={() => setFilter(kind)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-extrabold capitalize ${filter === kind ? "bg-[#17795b] text-white" : "bg-white ring-1 ring-[#dce6e1]"}`}>{kind.replace("-", " ")}</button>)}</div><div className="grid gap-3 lg:grid-cols-2">{items.map((item) => <article className="card p-5" key={item.id}><div className="flex items-center gap-2"><span className="badge capitalize">{item.kind.replace("-", " ")}</span><span className="muted text-xs font-bold">{item.cefrLevel}</span>{item.separability && <span className="muted text-xs">· {item.separability}</span>}</div><h2 className="mt-3 text-xl font-extrabold">{item.expression}</h2><p className="mt-2 text-sm">{item.meaning}</p><p className="mt-1 text-sm font-semibold text-[#17795b]">{item.vietnameseMeaning}</p><p className="muted mt-4 border-l-2 border-[#badbce] pl-3 text-sm italic">“{item.examples[0]}”</p><div className="mt-4 rounded-xl bg-[#f5f8f6] p-3 text-xs"><b>Usage note</b><p className="muted mt-1">{item.usageNotes}</p></div></article>)}</div></>;
}
