import { AlertCircle, ArrowRight, Inbox, Search } from "lucide-react";
import Link from "next/link";
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div>{eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}<h1 className="max-w-3xl text-3xl font-[850] tracking-[-.035em] text-[var(--ink-strong)] sm:text-4xl">{title}</h1><p className="muted mt-2 max-w-2xl text-[.95rem] leading-relaxed">{description}</p></div>{action}</header>;
}

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("card", className)} {...props}>{children}</div>;
}

export function StatCard({ icon, label, value, detail, accent = "brand" }: { icon: ReactNode; label: string; value: string | number; detail?: string; accent?: "brand" | "success" | "warning" | "info" }) {
  const tone = { brand: ["var(--brand-soft)", "var(--brand)"], success: ["var(--success-soft)", "var(--success)"], warning: ["var(--warning-soft)", "var(--warning)"], info: ["var(--info-soft)", "var(--info)"] }[accent];
  return <div className="card p-4 sm:p-5"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-[.9rem]" style={{ background: tone[0], color: tone[1] }}>{icon}</span><div><div className="muted text-[.68rem] font-extrabold uppercase tracking-[.1em]">{label}</div><div className="mt-0.5 text-2xl font-[850] tracking-[-.025em] text-[var(--ink-strong)]">{value}</div></div></div>{detail && <div className="muted mt-3 text-xs leading-relaxed">{detail}</div>}</div>;
}

export function ProgressBar({ value, label, color }: { value: number; label: string; color?: string }) {
  const boundedValue = Math.max(0, Math.min(100, value));
  return <div className="progress-track" role="progressbar" aria-label={label} aria-valuenow={boundedValue} aria-valuemin={0} aria-valuemax={100}><div className="progress-fill" style={{ width: `${boundedValue}%`, ...(color ? { background: color } : {}) }}/></div>;
}

export function ProgressRing({ value, label, size = 92, children }: { value: number; label: string; size?: number; children?: ReactNode }) {
  const boundedValue = Math.max(0, Math.min(100, value));
  return <div className="relative grid shrink-0 place-items-center rounded-full" role="progressbar" aria-label={label} aria-valuenow={boundedValue} aria-valuemin={0} aria-valuemax={100} style={{ width: size, height: size, background: `conic-gradient(var(--brand) ${boundedValue * 3.6}deg, var(--surface-muted) 0)` }}><div className="grid place-items-center rounded-full bg-[var(--surface)] text-center" style={{ width: size - 12, height: size - 12 }}>{children ?? <span className="text-xl font-[850]">{boundedValue}%</span>}</div></div>;
}

export function Badge({ children, tone = "brand", className }: { children: ReactNode; tone?: "brand" | "neutral" | "success" | "warning" | "danger"; className?: string }) {
  return <span className={cx("badge", tone !== "brand" && `badge-${tone}`, className)}>{children}</span>;
}

export function CefrBadge({ level }: { level: string }) {
  return <Badge>{level} · CEFR</Badge>;
}

export function SectionTitle({ title, subtitle, href, action }: { title: string; subtitle?: string; href?: string; action?: ReactNode }) {
  return <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="text-lg font-[820] tracking-[-.015em] text-[var(--ink-strong)]">{title}</h2>{subtitle && <p className="muted mt-1 text-sm leading-relaxed">{subtitle}</p>}</div>{action ?? (href && <Link href={href} className="flex items-center gap-1 text-sm font-bold text-[var(--brand)] hover:text-[var(--brand-hover)]">View all <ArrowRight size={15}/></Link>)}</div>;
}

export const SectionHeader = SectionTitle;

export function PrimaryButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cx("btn-primary", className)} {...props}/>;
}

export function SecondaryButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cx("btn-secondary", className)} {...props}/>;
}

export function IconButton({ label, className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return <button aria-label={label} title={label} className={cx("icon-button", className)} {...props}>{children}</button>;
}

export function FilterChip({ active = false, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return <button type="button" aria-pressed={active} className={cx("filter-chip", active && "filter-chip-active", className)} {...props}/>;
}

export function SearchInput({ className, label = "Search", ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return <label className="relative block"><span className="sr-only">{label}</span><Search aria-hidden="true" size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"/><input type="search" className={cx("search-field pl-10", className)} {...props}/></label>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="card flex min-h-56 flex-col items-center justify-center p-7 text-center"><span className="mb-4 grid size-12 place-items-center rounded-2xl bg-[var(--surface-muted)] text-[var(--muted)]"><Inbox aria-hidden="true"/></span><h3 className="font-extrabold text-[var(--ink-strong)]">{title}</h3><p className="muted mt-1 max-w-md text-sm leading-relaxed">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}

export function ErrorState({ title = "Something went wrong", description, action }: { title?: string; description: string; action?: ReactNode }) {
  return <div className="feedback feedback-error flex gap-3"><AlertCircle className="mt-0.5 shrink-0" size={19} aria-hidden="true"/><div><h3 className="font-extrabold">{title}</h3><p className="mt-1 text-sm leading-relaxed">{description}</p>{action && <div className="mt-3">{action}</div>}</div></div>;
}

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("skeleton", className)} aria-hidden="true" {...props}/>;
}

export function Tabs({ items, active, onChange, label }: { items: Array<{ id: string; label: string }>; active: string; onChange: (id: string) => void; label: string }) {
  return <div role="tablist" aria-label={label} className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-1">{items.map((item) => <button key={item.id} type="button" role="tab" aria-selected={active === item.id} onClick={() => onChange(item.id)} className={cx("min-h-9 whitespace-nowrap rounded-lg px-3 text-sm font-bold", active === item.id ? "bg-[var(--surface)] text-[var(--ink)] shadow-sm" : "text-[var(--muted)] hover:text-[var(--ink)]")}>{item.label}</button>)}</div>;
}

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return <span className="tooltip inline-flex">{children}<span role="tooltip" className="tooltip-content">{label}</span></span>;
}

export function FeedbackState({ tone, title, children }: { tone: "success" | "warning" | "error" | "info"; title: string; children?: ReactNode }) {
  return <div className={cx("feedback", `feedback-${tone}`)} role={tone === "error" ? "alert" : "status"}><div className="font-extrabold">{title}</div>{children && <div className="mt-1 text-sm leading-relaxed">{children}</div>}</div>;
}
