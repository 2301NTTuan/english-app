"use client";

import Link from "next/link";
import { FormEvent, useRef, useState, type InputHTMLAttributes, type Ref } from "react";
import { BookOpenCheck, LibraryBig, Sparkles } from "lucide-react";
import { PasswordFeedback, PasswordInput, PasswordMatchFeedback } from "@/components/password-feedback";
import { assessPassword, PASSWORD_MAX_LENGTH } from "@/lib/auth/password-policy";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const registering = mode === "register";
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [confirmationTouched, setConfirmationTouched] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLInputElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);

    if (registering) {
      setPasswordTouched(true);
      const assessment = assessPassword(password);
      if (!assessment.valid) {
        const unmet = assessment.requirements.find((requirement) => !requirement.met);
        setError(unmet ? `Password requirement not met: ${unmet.label}.` : `Use no more than ${PASSWORD_MAX_LENGTH} characters.`);
        passwordRef.current?.focus();
        return;
      }
      setConfirmationTouched(true);
      if (password !== confirmation) {
        setError("Passwords do not match.");
        confirmationRef.current?.focus();
        return;
      }
    }

    setPending(true);
    try {
      const data = Object.fromEntries(form);
      const requestData = registering
        ? { name: data.name, email: data.email, password: data.password }
        : data;
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(requestData) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) { setError(payload.error ?? "Please try again."); return; }
      const requested = new URLSearchParams(window.location.search).get("next");
      window.location.assign(requested?.startsWith("/") && !requested.startsWith("//") ? requested : registering ? "/placement" : "/");
    } catch { setError("The service is unavailable. Please try again."); }
    finally { setPending(false); }
  }

  return <main className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
    <section className="relative hidden overflow-hidden bg-[var(--sidebar)] p-12 text-white lg:flex lg:flex-col lg:justify-between"><div className="absolute -right-32 -top-32 size-[30rem] rounded-full bg-[var(--brand)] opacity-20 blur-3xl"/><Link href="/login" className="relative flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-[var(--brand)] text-white"><LibraryBig size={22}/></span><span><b className="block">English Mastery</b><small className="text-[var(--sidebar-muted)]">Learn with purpose</small></span></Link><div className="relative max-w-lg"><span className="mb-6 grid size-12 place-items-center rounded-2xl bg-white/10 text-[var(--brand)]"><Sparkles/></span><h2 className="text-4xl font-[880] leading-tight tracking-[-.04em]">Build English that stays with you.</h2><p className="mt-4 max-w-md leading-relaxed text-[var(--sidebar-muted)]">Adaptive review, clear learning paths, and meaningful progress from A1 to C2.</p></div><div className="relative flex items-center gap-2 text-sm text-[var(--sidebar-muted)]"><BookOpenCheck size={18}/>Thoughtful practice, every day.</div></section>
    <section className="grid place-items-center p-4 sm:p-8"><div className="card panel-raised w-full max-w-md p-6 sm:p-8">
    <Link href="/login" className="mb-7 flex items-center gap-3 lg:hidden"><span className="grid size-10 place-items-center rounded-xl bg-[var(--brand)] text-white"><LibraryBig size={21}/></span><span><b className="block">English Mastery</b><small className="muted">Learn with purpose</small></span></Link>
    <div className="eyebrow">{registering ? "Start your path" : "Continue learning"}</div><h1 className="mt-2 text-3xl font-[860] tracking-[-.035em] text-[var(--ink-strong)]">{registering ? "Create your account" : "Welcome back"}</h1><p className="muted mt-2 text-sm leading-relaxed">{registering ? "Keep your learning progress safely synced across devices." : "Sign in to continue your learning path."}</p>
    <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
      {registering && <Field label="Name" name="name" type="text" autoComplete="name" required/>}
      <Field label="Email" name="email" type="email" autoComplete="email" required/>
      <PasswordInput id="password" label="Password" name="password" autoComplete={registering ? "new-password" : "current-password"} required value={password} inputRef={passwordRef} aria-describedby={registering ? "password-feedback" : undefined} aria-invalid={registering && passwordTouched ? !assessPassword(password).valid : undefined} onChange={(event) => { setPassword(event.target.value); if (registering) setPasswordTouched(true); }}/>
      {registering && <PasswordFeedback id="password-feedback" password={password} touched={passwordTouched}/>}
      {!registering && <div className="text-right"><Link className="text-xs font-bold text-[var(--brand)] hover:underline" href="/forgot-password">Forgot password?</Link></div>}
      {registering && <>
        <PasswordInput id="confirmation" label="Confirm password" name="confirmation" autoComplete="new-password" required value={confirmation} inputRef={confirmationRef} aria-describedby="password-match-feedback" aria-invalid={confirmationTouched ? password !== confirmation : undefined} onChange={(event) => { setConfirmation(event.target.value); setConfirmationTouched(true); }}/>
        <PasswordMatchFeedback id="password-match-feedback" password={password} confirmation={confirmation} touched={confirmationTouched}/>
      </>}
      {error && <p role="alert" className="feedback feedback-error text-sm font-semibold">{error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full justify-center disabled:opacity-60">{pending ? "Please wait…" : registering ? "Create account" : "Sign in"}</button>
    </form>
    <p className="muted mt-5 text-center text-sm">{registering ? "Already have an account?" : "New to English Mastery?"} <Link className="font-bold text-[var(--brand)] hover:underline" href={registering ? "/login" : "/register"}>{registering ? "Sign in" : "Create one"}</Link></p>
    <p className="muted mt-5 text-center text-xs"><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link> · <Link href="/attribution">Attribution</Link></p>
  </div></section></main>;
}

function Field({ label, inputRef, ...props }: { label: string; inputRef?: Ref<HTMLInputElement> } & InputHTMLAttributes<HTMLInputElement>) {
  return <label className="block"><span className="mb-1.5 block text-sm font-bold">{label}</span><input {...props} ref={inputRef} className="field h-12"/></label>;
}
