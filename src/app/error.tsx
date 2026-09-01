"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="card mx-auto max-w-xl p-8 text-center"><span className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--warning-soft)] text-[var(--warning)]"><AlertTriangle size={26}/></span><h1 className="mt-4 text-2xl font-extrabold">Something interrupted this page</h1><p className="muted mt-2 text-sm">Your learning data is still stored locally. Try loading this view again.</p><button onClick={reset} className="btn-primary mt-6"><RotateCcw size={16}/>Try again</button></section>;
}
