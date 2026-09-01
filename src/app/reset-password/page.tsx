"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PasswordFeedback, PasswordMatchFeedback } from "@/components/password-feedback";
import { assessPassword, PASSWORD_MAX_LENGTH } from "@/lib/auth/password-policy";

export default function ResetPasswordPage() {
  const token = useSearchParams().get("token") ?? "";
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [confirmationTouched, setConfirmationTouched] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLInputElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setPasswordTouched(true); setConfirmationTouched(true);
    const assessment = assessPassword(password);
    if (!assessment.valid) {
      const unmet = assessment.requirements.find((requirement) => !requirement.met);
      setError(unmet ? `Password requirement not met: ${unmet.label}.` : `Use no more than ${PASSWORD_MAX_LENGTH} characters.`);
      passwordRef.current?.focus();
      return;
    }
    if (password !== confirmation) { setError("Passwords do not match."); confirmationRef.current?.focus(); return; }
    setPending(true);
    try {
      const response = await fetch("/api/auth/password-reset/consume", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password, confirmation }) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) { setError(payload.error ?? "This reset link could not be used."); return; }
      setPassword(""); setConfirmation(""); setComplete(true);
    } catch { setError("The service is unavailable. Please try again."); }
    finally { setPending(false); }
  }

  return <main className="grid min-h-screen place-items-center p-4"><section className="card panel-raised w-full max-w-md p-6 sm:p-8"><div className="eyebrow">Account recovery</div><h1 className="mt-2 text-3xl font-[860] tracking-[-.035em] text-[var(--ink-strong)]">Choose a new password</h1>{complete ? <><p role="status" className="feedback feedback-success mt-5 text-sm">Your password has been updated and existing sessions were signed out.</p><Link href="/login" className="btn-primary mt-5 w-full">Sign in with new password</Link></> : <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
    <label className="block"><span className="mb-1.5 block text-sm font-bold">New password</span><input ref={passwordRef} name="password" type="password" autoComplete="new-password" required className="field h-12" value={password} onChange={(event) => { setPassword(event.target.value); setPasswordTouched(true); }}/></label>
    <PasswordFeedback password={password} touched={passwordTouched}/>
    <label className="block"><span className="mb-1.5 block text-sm font-bold">Confirm password</span><input ref={confirmationRef} name="confirmation" type="password" autoComplete="new-password" required className="field h-12" value={confirmation} onChange={(event) => { setConfirmation(event.target.value); setConfirmationTouched(true); }}/></label>
    <PasswordMatchFeedback password={password} confirmation={confirmation} touched={confirmationTouched}/>
    {!token && <p role="alert" className="feedback feedback-error text-sm">This reset link is missing its token.</p>}
    {error && <p role="alert" className="feedback feedback-error text-sm">{error}</p>}
    <button type="submit" disabled={pending || !token} className="btn-primary w-full justify-center disabled:opacity-60">{pending ? "Updating…" : "Update password"}</button>
  </form>}</section></main>;
}
