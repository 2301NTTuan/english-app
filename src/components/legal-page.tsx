import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return <div className="min-h-screen bg-[#f3f7f5] px-4 py-10"><article className="card mx-auto max-w-3xl p-6 sm:p-10"><Link href="/login" className="font-bold text-[#17795b]">← English Mastery</Link><h1 className="mt-8 text-3xl font-extrabold">{title}</h1><p className="muted mt-2 text-sm">Last updated: {updated}</p><div className="mt-8 space-y-6 text-sm leading-7">{children}</div></article></div>;
}
