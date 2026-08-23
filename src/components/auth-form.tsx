"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { LibraryBig } from "lucide-react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const registering = mode === "register"; const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setPending(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) { setError(payload.error ?? "Please try again."); return; }
      const requested = new URLSearchParams(window.location.search).get("next");
      window.location.assign(requested?.startsWith("/") && !requested.startsWith("//") ? requested : registering ? "/placement" : "/");
    } catch { setError("The service is unavailable. Please try again."); }
    finally { setPending(false); }
  }
  return <div className="grid min-h-screen place-items-center bg-[#f3f7f5] p-4"><div className="card w-full max-w-md p-6 sm:p-8">
    <Link href="/login" className="mb-7 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#17795b] text-white"><LibraryBig size={21}/></span><span><b className="block">English Mastery</b><small className="muted">Learn with purpose</small></span></Link>
    <h1 className="text-2xl font-extrabold">{registering ? "Create your account" : "Welcome back"}</h1><p className="muted mt-2 text-sm">{registering ? "Keep your learning progress safely synced across devices." : "Sign in to continue your learning path."}</p>
    <form className="mt-6 space-y-4" onSubmit={submit}>
      {registering && <Field label="Name" name="name" type="text" autoComplete="name"/>}<Field label="Email" name="email" type="email" autoComplete="email"/><Field label="Password" name="password" type="password" autoComplete={registering ? "new-password" : "current-password"}/>{registering && <><Field label="Confirm password" name="confirmation" type="password" autoComplete="new-password"/><p className="muted text-xs">Use at least 12 characters with uppercase, lowercase, and a number.</p></>}
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
      <button disabled={pending} className="btn-primary w-full justify-center disabled:opacity-60">{pending ? "Please wait…" : registering ? "Create account" : "Sign in"}</button>
    </form>
    <p className="muted mt-5 text-center text-sm">{registering ? "Already have an account?" : "New to English Mastery?"} <Link className="font-bold text-[#17795b]" href={registering ? "/login" : "/register"}>{registering ? "Sign in" : "Create one"}</Link></p>
    <p className="muted mt-5 text-center text-xs"><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link></p>
  </div></div>;
}

function Field({ label, ...props }: { label: string; name: string; type: string; autoComplete: string }) { return <label className="block"><span className="mb-1.5 block text-sm font-bold">{label}</span><input {...props} required className="h-12 w-full rounded-xl border border-[#ccd9d3] bg-white px-3 outline-none focus:border-[#17795b] focus:ring-2 focus:ring-[#17795b]/15"/></label>; }
