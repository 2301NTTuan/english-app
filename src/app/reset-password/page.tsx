"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const token = useSearchParams().get("token") ?? "";
  const [pending, setPending] = useState(false); const [complete, setComplete] = useState(false); const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/password-reset/consume", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password: form.get("password"), confirmation: form.get("confirmation") }) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) { setError(payload.error ?? "This reset link could not be used."); return; }
      setComplete(true);
    } catch { setError("The service is unavailable. Please try again."); }
    finally { setPending(false); }
  }
  return <main className="grid min-h-screen place-items-center p-4"><section className="card panel-raised w-full max-w-md p-6 sm:p-8"><div className="eyebrow">Account recovery</div><h1 className="mt-2 text-3xl font-[860] tracking-[-.035em] text-[var(--ink-strong)]">Choose a new password</h1>{complete ? <><p role="status" className="feedback feedback-success mt-5 text-sm">Your password has been updated and existing sessions were signed out.</p><Link href="/login" className="btn-primary mt-5 w-full">Sign in with new password</Link></> : <form className="mt-6 space-y-4" onSubmit={submit}><PasswordField label="New password" name="password"/><PasswordField label="Confirm password" name="confirmation"/><p className="muted text-xs">Use at least 12 characters with uppercase, lowercase, and a number.</p>{!token && <p role="alert" className="feedback feedback-error text-sm">This reset link is missing its token.</p>}{error && <p role="alert" className="feedback feedback-error text-sm">{error}</p>}<button disabled={pending || !token} className="btn-primary w-full justify-center disabled:opacity-60">{pending ? "Updating…" : "Update password"}</button></form>}</section></main>;
}

function PasswordField({ label, name }: { label: string; name: string }) { return <label className="block"><span className="mb-1.5 block text-sm font-bold">{label}</span><input name={name} type="password" autoComplete="new-password" required className="field h-12"/></label>; }
