"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type VerificationState = "working" | "verified" | "invalid" | "waiting";

export default function VerifyEmailPage() {
  const token = useSearchParams().get("token") ?? ""; const attempted = useRef(false);
  const [state, setState] = useState<VerificationState>(token ? "working" : "waiting"); const [message, setMessage] = useState(""); const [pending, setPending] = useState(false);
  useEffect(() => {
    if (!token || attempted.current) return; attempted.current = true;
    void fetch("/api/auth/email-verification/consume", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) })
      .then(async (response) => { if (!response.ok) throw new Error(); setState("verified"); })
      .catch(() => setState("invalid"));
  }, [token]);
  async function resend() {
    setPending(true); setMessage("");
    try {
      const response = await fetch("/api/auth/email-verification/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const payload = await response.json() as { error?: string; message?: string; developmentVerificationUrl?: string };
      if (!response.ok) { setMessage(payload.error ?? "Verification email could not be sent."); return; }
      if (payload.developmentVerificationUrl) { window.location.assign(payload.developmentVerificationUrl); return; }
      setMessage(payload.message ?? "Verification instructions were sent.");
    } catch { setMessage("Verification email could not be sent."); } finally { setPending(false); }
  }
  return <main className="grid min-h-screen place-items-center bg-[#f3f7f5] p-4"><section className="card w-full max-w-md p-6 text-center sm:p-8"><div className="eyebrow">Account security</div><h1 className="mt-2 text-2xl font-extrabold">Verify your email</h1>
    {state === "working" && <p role="status" className="muted mt-5">Verifying your link…</p>}
    {state === "verified" && <><p role="status" className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">Your email is verified.</p><Link className="btn-primary mt-5 w-full" href="/placement">Continue to placement</Link></>}
    {state === "invalid" && <><p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-900">This verification link is invalid, expired, or already used.</p><button disabled={pending} className="btn-secondary mt-5 w-full" onClick={resend}>{pending ? "Sending…" : "Send a new link"}</button></>}
    {state === "waiting" && <><p className="muted mt-5 text-sm">Open the link in your verification email. Links expire after 24 hours and can be used only once.</p><button disabled={pending} className="btn-secondary mt-5 w-full" onClick={resend}>{pending ? "Sending…" : "Send verification email"}</button></>}
    {message && <p role="status" className="muted mt-4 text-sm">{message}</p>}
  </section></main>;
}
