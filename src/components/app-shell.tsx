"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookMarked, BookOpen, Brain, ClipboardCheck, Gauge, GraduationCap, LibraryBig, Menu, Settings, Sparkles, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAppState } from "@/components/app-provider";
import { calculateStreak } from "@/lib/learning/streak";

const navigation = [
  ["Dashboard", "/", Gauge], ["Learn", "/learn", GraduationCap], ["Vocabulary", "/vocabulary", BookOpen],
  ["Grammar", "/grammar", BookMarked], ["Expressions", "/expressions", Sparkles], ["Review", "/review", Brain],
  ["Mistakes", "/mistakes", ClipboardCheck], ["Progress", "/progress", BarChart3], ["Settings", "/settings", Settings],
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname(); const [open, setOpen] = useState(false); const { state } = useAppState();
  const levelProgress = ({ A1: 82, A2: 67, B1: 42, B2: 18, C1: 8, C2: 2 } as const)[state.settings.currentLevel];
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, []);
  return <div className="min-h-screen lg:grid lg:grid-cols-[238px_1fr]">
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <aside aria-label="Application navigation" className={`${open ? "fixed inset-0 z-50 flex" : "hidden"} bg-black/25 lg:sticky lg:top-0 lg:flex lg:h-screen lg:bg-transparent`} onClick={() => setOpen(false)}>
      <div className="flex h-full w-[265px] flex-col border-r border-[#dce6e1] bg-white p-4" onClick={(event) => event.stopPropagation()}>
        <div className="mb-7 flex items-center justify-between px-2 pt-2">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}><span className="grid size-9 place-items-center rounded-xl bg-[#17795b] text-white"><LibraryBig size={19}/></span><span><b className="block leading-tight">English Mastery</b><small className="muted">Learn with purpose</small></span></Link>
          <button className="icon-button lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)}><X/></button>
        </div>
        <nav className="space-y-1">{navigation.map(([label, href, Icon]) => { const active = href === "/" ? pathname === "/" : pathname.startsWith(href); return <Link key={href} href={href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${active ? "bg-[#e8f6f0] text-[#11664b]" : "text-[#586760] hover:bg-[#f3f6f4]"}`}><Icon size={18}/>{label}</Link>; })}</nav>
        <div className="mt-auto rounded-2xl bg-[#f1f7f4] p-3.5"><div className="eyebrow">Current path</div><div className="mt-2 flex items-center justify-between"><b>{state.settings.currentLevel} · CEFR</b><span className="badge">{levelProgress}%</span></div><div className="progress-track mt-3"><div className="progress-fill" style={{ width: `${levelProgress}%` }}/></div><div className="muted mt-2 text-xs">{calculateStreak(state.activities)} day study streak</div></div>
      </div>
    </aside>
    <div className="min-w-0">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#dce6e1] bg-white/95 px-4 backdrop-blur lg:hidden"><button className="icon-button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Menu/></button><b>English Mastery</b><span className="badge">{state.settings.currentLevel}</span></header>
      <main id="main-content" className="mx-auto max-w-[1240px] p-4 pb-24 sm:p-6 lg:p-8">{children}</main>
      <nav aria-label="Primary mobile navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[#dce6e1] bg-white px-1 py-1.5 lg:hidden">{navigation.slice(0, 5).map(([label, href, Icon]) => { const active = href === "/" ? pathname === "/" : pathname.startsWith(href); return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-bold ${active ? "text-[#17795b]" : "text-[#718078]"}`}><Icon size={19}/>{label}</Link>; })}</nav>
    </div>
  </div>;
}
