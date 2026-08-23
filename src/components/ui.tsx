import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div>{eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}<h1 className="text-3xl font-extrabold tracking-[-.03em] sm:text-4xl">{title}</h1><p className="muted mt-2 max-w-2xl leading-relaxed">{description}</p></div>{action}</header>;
}
export function StatCard({ icon, label, value, detail }: { icon: ReactNode; label: string; value: string | number; detail?: string }) {
  return <div className="card p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e8f6f0] text-[#17795b]">{icon}</span><div><div className="muted text-xs font-bold uppercase tracking-wide">{label}</div><div className="mt-0.5 text-2xl font-extrabold">{value}</div></div></div>{detail && <div className="muted mt-3 text-xs">{detail}</div>}</div>;
}
export function ProgressBar({ value, label, color = "#17795b" }: { value: number; label: string; color?: string }) { const boundedValue = Math.max(0, Math.min(100, value)); return <div className="progress-track" role="progressbar" aria-label={label} aria-valuenow={boundedValue} aria-valuemin={0} aria-valuemax={100}><div className="progress-fill" style={{ width: `${boundedValue}%`, background: color }}/></div>; }
export function SectionTitle({ title, subtitle, href }: { title: string; subtitle?: string; href?: string }) { return <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="text-lg font-extrabold">{title}</h2>{subtitle && <p className="muted mt-1 text-sm">{subtitle}</p>}</div>{href && <Link href={href} className="flex items-center gap-1 text-sm font-bold text-[#17795b]">View all <ArrowRight size={15}/></Link>}</div>; }
