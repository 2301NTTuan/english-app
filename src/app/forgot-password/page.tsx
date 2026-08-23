"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [pending, setPending] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState(""); const [developmentUrl, setDevelopmentUrl] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(""); setDevelopmentUrl("");
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    try {
      const response = await fetch("/api/auth/password-reset/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const payload = await response.json() as { error?: string; message?: string; developmentResetUrl?: string };
      if (!response.ok) { setError(payload.error ?? "Please try again."); return; }
      setMessage(payload.message ?? "If the account exists, reset instructions will be sent."); setDevelopmentUrl(payload.developmentResetUrl ?? "");
    } catch { setError("The service is unavailable. Please try again."); }
    finally { setPending(false); }
  }
  return <main className="grid min-h-screen place-items-center bg-[#f3f7f5] p-4"><section className="card w-full max-w-md p-6 sm:p-8"><div className="eyebrow">Account recovery</div><h1 className="mt-2 text-2xl font-extrabold">Reset your password</h1><p className="muted mt-2 text-sm">Enter your account email. The response is the same whether or not an account exists.</p><form className="mt-6 space-y-4" onSubmit={submit}><label className="block"><span className="mb-1.5 block text-sm font-bold">Email</span><input name="email" type="email" autoComplete="email" required className="h-12 w-full rounded-xl border border-[#ccd9d3] bg-white px-3 outline-none focus:border-[#17795b] focus:ring-2 focus:ring-[#17795b]/15"/></label>{message && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">{message}</p>}{developmentUrl && <Link className="btn-secondary w-full" href={developmentUrl}>Open local reset link</Link>}{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-900">{error}</p>}<button disabled={pending} className="btn-primary w-full justify-center disabled:opacity-60">{pending ? "Requesting…" : "Request reset"}</button></form><Link href="/login" className="muted mt-5 block text-center text-sm font-bold">Back to sign in</Link></section></main>;
}
