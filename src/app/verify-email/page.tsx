"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

type VerificationState = "working" | "verified" | "already-verified" | "invalid" | "expired" | "waiting";

export default function VerifyEmailPage() {
  const token = useSearchParams().get("token") ?? "";
  const attempted = useRef(false);
  const [state, setState] = useState<VerificationState>(token ? "working" : "waiting");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [developmentUrl, setDevelopmentUrl] = useState("");

  useEffect(() => {
    if (!token || attempted.current) return;
    attempted.current = true;
    void fetch("/api/auth/email-verification/consume", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) })
      .then(async (response) => {
        const payload = await response.json() as { code?: string; status?: string };
        if (response.ok) { setState(payload.status === "already-verified" ? "already-verified" : "verified"); return; }
        setState(payload.code === "EXPIRED_TOKEN" ? "expired" : "invalid");
      })
      .catch(() => { setState("invalid"); setMessage("Email verification is temporarily unavailable."); });
  }, [token]);

  async function resend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setMessage(""); setDevelopmentUrl("");
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    try {
      const response = await fetch("/api/auth/email-verification/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const payload = await response.json() as { error?: string; message?: string; developmentVerificationUrl?: string };
      if (!response.ok) { setMessage(payload.error ?? "Verification email could not be requested."); return; }
      setMessage(payload.message ?? "If the account is eligible, a new verification link will be sent.");
      setDevelopmentUrl(payload.developmentVerificationUrl ?? "");
    } catch { setMessage("Verification email could not be requested."); }
    finally { setPending(false); }
  }

  const needsResend = state === "waiting" || state === "invalid" || state === "expired";
  return <main className="grid min-h-screen place-items-center p-4"><section className="card panel-raised w-full max-w-md p-6 text-center sm:p-8"><div className="eyebrow">Account security</div><h1 className="mt-2 text-3xl font-[860] tracking-[-.035em] text-[var(--ink-strong)]">Verify your email</h1>
    {state === "working" && <p role="status" className="muted mt-5">Verifying your link…</p>}
    {state === "verified" && <><p role="status" className="feedback feedback-success mt-5 text-sm">Your email is verified.</p><Link className="btn-primary mt-5 w-full" href="/login?next=/placement">Continue to sign in</Link></>}
    {state === "already-verified" && <><p role="status" className="feedback feedback-info mt-5 text-sm">This email address is already verified.</p><Link className="btn-primary mt-5 w-full" href="/login">Continue to sign in</Link></>}
    {state === "invalid" && <p role="alert" className="feedback feedback-error mt-5 text-sm">This verification link is invalid or has already been replaced.</p>}
    {state === "expired" && <p role="alert" className="feedback feedback-warning mt-5 text-sm">This verification link has expired. Request a new one below.</p>}
    {state === "waiting" && <p className="muted mt-5 text-sm">Open the link in your verification email. Links expire after 24 hours and can be used only once.</p>}
    {needsResend && <form className="mt-5 space-y-3 text-left" onSubmit={resend}><label className="block"><span className="mb-1.5 block text-sm font-bold">Email</span><input name="email" type="email" autoComplete="email" required className="field h-12"/></label><button type="submit" disabled={pending} className="btn-secondary w-full disabled:opacity-60">{pending ? "Requesting…" : "Send a new verification link"}</button></form>}
    {developmentUrl && <Link className="btn-primary mt-3 w-full" href={developmentUrl}>Open local verification link</Link>}
    {message && <p role="status" className="muted mt-4 text-sm">{message}</p>}
    {needsResend && <Link className="muted mt-5 block text-sm font-bold hover:text-[var(--brand)]" href="/login">Back to sign in</Link>}
  </section></main>;
}
