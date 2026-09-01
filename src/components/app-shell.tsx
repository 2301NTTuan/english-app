"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, BookMarked, BookOpen, Brain, ClipboardCheck, Gauge, GraduationCap, LibraryBig, LogOut, Map, Menu, Settings, Sparkles, TestTube2, X } from "lucide-react";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { useAppState } from "@/components/app-provider";
import { ThemeToggle } from "@/components/theme-provider";
import { calculateStreak } from "@/lib/learning/streak";
import { grammarTopics } from "@/data/grammar";
import { vocabulary } from "@/data/vocabulary";

type NavItem = readonly [label: string, href: string, icon: ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>];

const navigationGroups: Array<{ label: string; items: NavItem[] }> = [
  { label: "Learn", items: [["Dashboard", "/", Gauge], ["Vocabulary", "/vocabulary", BookOpen], ["Grammar", "/grammar", BookMarked], ["Expressions", "/expressions", Sparkles], ["Placement", "/placement", TestTube2]] },
  { label: "Practice", items: [["Study session", "/learn", GraduationCap], ["Review", "/review", Brain]] },
  { label: "Progress", items: [["Analytics", "/progress", BarChart3], ["Mistakes", "/mistakes", ClipboardCheck], ["Learning path", "/path", Map]] },
  { label: "Other", items: [["Settings", "/settings", Settings]] },
];

const mobileNavigation: NavItem[] = [["Home", "/", Gauge], ["Learn", "/learn", GraduationCap], ["Vocabulary", "/vocabulary", BookOpen], ["Review", "/review", Brain]];
const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/privacy", "/terms", "/attribution"];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { state, syncStatus } = useAppState();

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);

  if (publicPaths.includes(pathname)) return <main id="main-content">{children}</main>;

  const levelVocabularyIds = new Set(vocabulary.filter((item) => item.cefrLevel === state.settings.currentLevel).map((item) => item.id));
  const levelGrammarIds = new Set(grammarTopics.filter((item) => item.level === state.settings.currentLevel).map((item) => item.id));
  const levelScores = [
    ...state.vocabularyProgress.filter((item) => levelVocabularyIds.has(item.itemId)).map((item) => item.mastery.overall),
    ...state.grammarProgress.filter((item) => levelGrammarIds.has(item.topicId)).map((item) => item.mastery),
  ];
  const levelProgress = levelScores.length ? Math.round(levelScores.reduce((sum, value) => sum + value, 0) / levelScores.length) : 0;

  const signOut = () => void fetch("/api/auth/logout", { method: "POST" }).finally(() => { router.replace("/login"); router.refresh(); });

  return <div className="min-h-screen lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
    <a href="#main-content" className="skip-link">Skip to main content</a>

    <aside aria-label="Application navigation" className={`${open ? "fixed inset-0 z-50 flex" : "hidden"} bg-black/45 backdrop-blur-[2px] lg:sticky lg:top-0 lg:flex lg:h-screen lg:bg-transparent lg:backdrop-blur-none`} onClick={() => setOpen(false)}>
      <div className="flex h-full w-[280px] flex-col overflow-y-auto border-r border-[var(--sidebar-line)] bg-[var(--sidebar)] p-4 text-white lg:w-full" onClick={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between px-2 pt-1">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="grid size-10 place-items-center rounded-[.9rem] bg-[var(--brand)] text-white shadow-lg shadow-indigo-950/20"><LibraryBig size={20} aria-hidden="true"/></span>
            <span><b className="block tracking-[-.015em]">English Mastery</b><small className="text-[var(--sidebar-muted)]">Learn with purpose</small></span>
          </Link>
          <button type="button" className="icon-button text-white hover:border-white/10 hover:bg-white/10 lg:!hidden" aria-label="Close menu" onClick={() => setOpen(false)}><X aria-hidden="true"/></button>
        </div>

        <nav className="space-y-5">
          {navigationGroups.map((group) => <div key={group.label}>
            <div className="mb-1.5 px-3 text-[.63rem] font-extrabold uppercase tracking-[.16em] text-[var(--sidebar-muted)]">{group.label}</div>
            <div className="space-y-0.5">{group.items.map(([label, href, Icon]) => {
              const active = isActive(pathname, href);
              return <Link key={href} href={href} prefetch={href === "/grammar" ? false : undefined} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)} className={`group flex min-h-10 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${active ? "bg-[var(--sidebar-active)] text-white" : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-white"}`}><Icon size={17} aria-hidden={true}/><span>{label}</span>{active && <span className="ml-auto size-1.5 rounded-full bg-[var(--brand)]"/>}</Link>;
            })}</div>
          </div>)}
        </nav>

        <div className="mt-auto space-y-2 pt-6">
          <div className="rounded-2xl border border-[var(--sidebar-line)] bg-white/[.035] p-3.5">
            <div className="text-[.63rem] font-extrabold uppercase tracking-[.14em] text-[var(--sidebar-muted)]">Current path</div>
            <div className="mt-2.5 flex items-center justify-between"><b>{state.settings.currentLevel} · CEFR</b><span className="rounded-full bg-[var(--sidebar-active)] px-2 py-1 text-xs font-extrabold text-white">{levelProgress}%</span></div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[var(--brand)]" style={{ width: `${levelProgress}%` }}/></div>
            <div className="mt-2.5 text-xs leading-relaxed text-[var(--sidebar-muted)]">{calculateStreak(state.activities)} day study streak · {syncStatus}</div>
          </div>
          <ThemeToggle/>
          <button type="button" className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-[var(--sidebar-muted)] transition-colors hover:bg-[var(--sidebar-hover)] hover:text-white" onClick={signOut}><LogOut size={15} aria-hidden="true"/>Sign out</button>
        </div>
      </div>
    </aside>

    <div className="min-w-0">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-4 backdrop-blur-xl lg:hidden">
        <button type="button" className="icon-button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Menu aria-hidden="true"/></button>
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-[-.015em]"><span className="grid size-7 place-items-center rounded-lg bg-[var(--brand)] text-white"><LibraryBig size={15}/></span>English Mastery</Link>
        <ThemeToggle compact/>
      </header>

      <main id="main-content" className="app-content">{children}</main>

      <nav aria-label="Primary mobile navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] px-1.5 pb-[max(.4rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl lg:hidden">
        {mobileNavigation.map(([label, href, Icon]) => {
          const active = isActive(pathname, href);
          return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-bold ${active ? "text-[var(--brand)]" : "text-[var(--muted)]"}`}><Icon size={19} aria-hidden={true}/>{label}</Link>;
        })}
        <button type="button" className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-bold ${open ? "text-[var(--brand)]" : "text-[var(--muted)]"}`} aria-label="Open all navigation" aria-expanded={open} onClick={() => setOpen(true)}><Menu size={19} aria-hidden="true"/>More</button>
      </nav>
    </div>
  </div>;
}
