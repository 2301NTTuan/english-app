"use client";

import Link from "next/link";
import { FormEvent, useRef, useState, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { BookOpenCheck, LibraryBig, MailCheck, Sparkles } from "lucide-react";
import { PasswordFeedback, PasswordInput, PasswordMatchFeedback } from "@/components/password-feedback";
import { assessPassword, PASSWORD_MAX_LENGTH } from "@/lib/auth/password-policy";
import {
  isRegisterErrorCode,
  registerErrorMessage,
  registrationEmailSchema,
  registrationNameSchema,
  type RegisterApiPayload,
  type RegisterErrorCode,
  type RegisterFieldErrors,
} from "@/lib/auth/registration";

interface VerificationState {
  email: string;
  message: string;
  deliveryStatus: "sent" | "failed" | "development" | "unknown";
  developmentVerificationUrl?: string;
}

type AuthPayload = Omit<RegisterApiPayload, "code"> & {
  code?: RegisterErrorCode | "EMAIL_NOT_VERIFIED";
  message?: string;
};

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const registering = mode === "register";
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<RegisterErrorCode | "">("");
  const [pending, setPending] = useState(false);
  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [confirmationTouched, setConfirmationTouched] = useState(false);
  const [verification, setVerification] = useState<VerificationState | null>(null);
  const [resendPending, setResendPending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [serverFieldErrors, setServerFieldErrors] = useState<RegisterFieldErrors>({});
  const pendingRef = useRef(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLInputElement>(null);

  function clearFormError() {
    setError("");
    setErrorCode("");
    setResendMessage("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingRef.current) return;
    setError("");
    setErrorCode("");
    setResendMessage("");
    setServerFieldErrors({});
    const form = new FormData(event.currentTarget);

    if (registering) {
      setNameTouched(true);
      const nameResult = registrationNameSchema.safeParse(name);
      if (!nameResult.success) {
        setError(registerErrorMessage("VALIDATION_ERROR"));
        nameRef.current?.focus();
        return;
      }
      setEmailTouched(true);
      const emailResult = registrationEmailSchema.safeParse(email);
      if (!emailResult.success) {
        setError(registerErrorMessage("VALIDATION_ERROR"));
        emailRef.current?.focus();
        return;
      }
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

    pendingRef.current = true;
    setPending(true);
    try {
      const data = Object.fromEntries(form);
      const requestData = registering
        ? { name: data.name, email: data.email, password: data.password }
        : data;
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(requestData) });
      const payload = await response.json().catch(() => ({})) as AuthPayload;
      if (!response.ok) {
        if (registering) {
          const code = isRegisterErrorCode(payload.code) ? payload.code : "SERVICE_UNAVAILABLE";
          setServerFieldErrors(payload.fieldErrors ?? {});
          setErrorCode(code);
          const retryAfter = Number(response.headers.get("retry-after") ?? 0);
          setError(registerErrorMessage(code, Number.isFinite(retryAfter) ? retryAfter : undefined));
          return;
        }
        if (!registering && payload.code === "EMAIL_NOT_VERIFIED") {
          setVerification({ email: String(data.email).trim().toLowerCase(), message: "Your email address hasn't been verified yet.", deliveryStatus: "unknown" });
          setPassword("");
          return;
        }
        setError(payload.error ?? "Please try again.");
        return;
      }
      if (registering) {
        const normalizedEmail = payload.email ?? email.trim().toLowerCase();
        const developmentDelivery = payload.deliveryStatus === "development";
        const deliverySent = payload.verificationEmailSent === true || payload.deliveryStatus === "sent";
        const deliveryFailed = !developmentDelivery && !deliverySent;
        setVerification({
          email: normalizedEmail,
          message: developmentDelivery
            ? "Email delivery is in development mode. Use the local verification link below."
            : deliveryFailed ? registerErrorMessage("VERIFICATION_DELIVERY_FAILED") : `We've sent a verification link to ${normalizedEmail}.`,
          deliveryStatus: developmentDelivery ? "development" : deliveryFailed ? "failed" : "sent",
          developmentVerificationUrl: payload.developmentVerificationUrl,
        });
        setPassword("");
        setConfirmation("");
        return;
      }
      const requested = new URLSearchParams(window.location.search).get("next");
      window.location.assign(requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/");
    } catch {
      setError(registering ? registerErrorMessage("SERVICE_UNAVAILABLE") : "The service is unavailable. Please try again.");
      if (registering) setErrorCode("SERVICE_UNAVAILABLE");
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }

  async function resendVerification(emailAddress: string) {
    setResendPending(true); setResendMessage("");
    try {
      const response = await fetch("/api/auth/email-verification/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emailAddress.trim().toLowerCase() }) });
      const payload = await response.json().catch(() => ({})) as AuthPayload;
      if (!response.ok) {
        const retryAfter = Number(response.headers.get("retry-after") ?? 0);
        setResendMessage(response.status === 429
          ? registerErrorMessage("RATE_LIMITED", Number.isFinite(retryAfter) ? retryAfter : undefined)
          : "Verification email could not be requested. Please try again later.");
        return;
      }
      setVerification((current) => current ? { ...current, developmentVerificationUrl: payload.developmentVerificationUrl ?? current.developmentVerificationUrl } : current);
      setResendMessage("If an unverified account exists for that email, we'll send a new verification link.");
    } catch { setResendMessage("Verification email could not be requested."); }
    finally { setResendPending(false); }
  }

  if (verification) {
    const deliveryFailed = verification.deliveryStatus === "failed";
    const developmentDelivery = verification.deliveryStatus === "development";
    return <AuthScaffold><div className="text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand-ink)]"><MailCheck aria-hidden="true"/></span>
      <div className="eyebrow mt-5">Email verification</div>
      <h1 className="mt-2 text-3xl font-[860] tracking-[-.035em] text-[var(--ink-strong)]">{deliveryFailed ? "Account created" : developmentDelivery ? "Verify locally" : "Check your email"}</h1>
      <p className="muted mt-3 text-sm leading-relaxed">{verification.message}</p>
      <p className="mt-2 break-all text-sm font-bold text-[var(--ink)]">{verification.email}</p>
      {deliveryFailed && <p role="status" className="feedback feedback-warning mt-5 text-left text-sm">No message was sent during registration. Use Resend verification after checking your email configuration.</p>}
      <div className="mt-6 space-y-3">
        {verification.developmentVerificationUrl && <Link className="btn-primary w-full" href={verification.developmentVerificationUrl}>Open local verification link</Link>}
        <button type="button" disabled={resendPending} className="btn-secondary w-full disabled:opacity-60" onClick={() => void resendVerification(verification.email)}>{resendPending ? "Requesting…" : "Resend verification email"}</button>
        <Link className="muted block text-sm font-bold hover:text-[var(--brand)]" href="/login">Back to sign in</Link>
      </div>
      {resendMessage && <p role="status" className="muted mt-4 text-sm">{resendMessage}</p>}
    </div></AuthScaffold>;
  }

  return <AuthScaffold>
    <div className="eyebrow">{registering ? "Start your path" : "Continue learning"}</div>
    <h1 className="mt-2 text-3xl font-[860] tracking-[-.035em] text-[var(--ink-strong)]">{registering ? "Create your account" : "Welcome back"}</h1>
    <p className="muted mt-2 text-sm leading-relaxed">{registering ? "Verify your email before entering the learning experience." : "Sign in to continue your learning path."}</p>
    <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
      {registering && (
        <Field label="Name" name="name" type="text" autoComplete="name" required value={name} inputRef={nameRef} feedback={nameTouched ? fieldError(registrationNameSchema.safeParse(name)) : serverFieldErrors.name?.[0]} onBlur={() => setNameTouched(true)} onChange={(event) => { clearFormError(); setName(event.target.value); setNameTouched(true); setServerFieldErrors((current) => ({ ...current, name: undefined })); }}/>
      )}
      <Field label="Email" name="email" type="email" autoComplete="email" required value={email} inputRef={emailRef} feedback={registering && emailTouched ? fieldError(registrationEmailSchema.safeParse(email)) : serverFieldErrors.email?.[0]} onBlur={() => { if (registering) setEmailTouched(true); }} onChange={(event) => { clearFormError(); setEmail(event.target.value); if (registering) setEmailTouched(true); setServerFieldErrors((current) => ({ ...current, email: undefined })); }}/>
      <PasswordInput id="password" label="Password" name="password" autoComplete={registering ? "new-password" : "current-password"} required value={password} inputRef={passwordRef} aria-describedby={registering ? "password-feedback" : undefined} aria-invalid={registering && passwordTouched ? !assessPassword(password).valid : undefined} onChange={(event) => { clearFormError(); setPassword(event.target.value); setServerFieldErrors((current) => ({ ...current, password: undefined })); if (registering) setPasswordTouched(true); }}/>
      {registering && <PasswordFeedback id="password-feedback" password={password} touched={passwordTouched}/>}
      {registering && serverFieldErrors.password?.[0] && <p role="alert" className="text-xs font-bold text-[var(--danger)]">{serverFieldErrors.password[0]}</p>}
      {!registering && <div className="text-right"><Link className="text-xs font-bold text-[var(--brand)] hover:underline" href="/forgot-password">Forgot password?</Link></div>}
      {registering && <>
        <PasswordInput id="confirmation" label="Confirm password" name="confirmation" autoComplete="new-password" required value={confirmation} inputRef={confirmationRef} aria-describedby="password-match-feedback" aria-invalid={confirmationTouched ? password !== confirmation : undefined} onChange={(event) => { clearFormError(); setConfirmation(event.target.value); setConfirmationTouched(true); }}/>
        <PasswordMatchFeedback id="password-match-feedback" password={password} confirmation={confirmation} touched={confirmationTouched}/>
      </>}
      {error && <p role="alert" className="feedback feedback-error text-sm font-semibold">{error}</p>}
      {registering && errorCode === "EMAIL_ALREADY_REGISTERED" && <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-bold">
        <Link className="text-[var(--brand)] hover:underline" href="/login">Sign in</Link>
        <Link className="text-[var(--brand)] hover:underline" href="/forgot-password">Forgot password?</Link>
        <button type="button" disabled={resendPending} className="text-[var(--brand)] hover:underline disabled:opacity-60" onClick={() => void resendVerification(email)}>{resendPending ? "Requesting…" : "Resend verification"}</button>
      </div>}
      {registering && errorCode === "EMAIL_ALREADY_REGISTERED" && resendMessage && <p role="status" className="muted text-sm">{resendMessage}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full justify-center disabled:opacity-60">{pending ? "Please wait…" : registering ? "Create account" : "Sign in"}</button>
    </form>
    <p className="muted mt-5 text-center text-sm">{registering ? "Already have an account?" : "New to English Mastery?"} <Link className="font-bold text-[var(--brand)] hover:underline" href={registering ? "/login" : "/register"}>{registering ? "Sign in" : "Create one"}</Link></p>
    <p className="muted mt-5 text-center text-xs"><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link> · <Link href="/attribution">Attribution</Link></p>
  </AuthScaffold>;
}

function AuthScaffold({ children }: { children: ReactNode }) {
  return <main className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
    <section className="relative hidden overflow-hidden bg-[var(--sidebar)] p-12 text-white lg:flex lg:flex-col lg:justify-between"><div className="absolute -right-32 -top-32 size-[30rem] rounded-full bg-[var(--brand)] opacity-20 blur-3xl"/><Link href="/login" className="relative flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-[var(--brand)] text-white"><LibraryBig size={22} aria-hidden="true"/></span><span><b className="block">English Mastery</b><small className="text-[var(--sidebar-muted)]">Learn with purpose</small></span></Link><div className="relative max-w-lg"><span className="mb-6 grid size-12 place-items-center rounded-2xl bg-white/10 text-[var(--brand)]"><Sparkles aria-hidden="true"/></span><h2 className="text-4xl font-[880] leading-tight tracking-[-.04em]">Build English that stays with you.</h2><p className="mt-4 max-w-md leading-relaxed text-[var(--sidebar-muted)]">Adaptive review, clear learning paths, and meaningful progress from A1 to C2.</p></div><div className="relative flex items-center gap-2 text-sm text-[var(--sidebar-muted)]"><BookOpenCheck size={18} aria-hidden="true"/>Thoughtful practice, every day.</div></section>
    <section className="grid place-items-center p-4 sm:p-8"><div className="card panel-raised w-full max-w-md p-6 sm:p-8">
      <Link href="/login" className="mb-7 flex items-center gap-3 lg:hidden"><span className="grid size-10 place-items-center rounded-xl bg-[var(--brand)] text-white"><LibraryBig size={21} aria-hidden="true"/></span><span><b className="block">English Mastery</b><small className="muted">Learn with purpose</small></span></Link>
      {children}
    </div></section>
  </main>;
}

function Field({ label, inputRef, feedback, ...props }: { label: string; inputRef?: Ref<HTMLInputElement>; feedback?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const feedbackId = `${String(props.name)}-feedback`;
  return <label className="block"><span className="mb-1.5 block text-sm font-bold">{label}</span><input {...props} ref={inputRef} aria-describedby={feedback ? feedbackId : props["aria-describedby"]} aria-invalid={feedback ? true : props["aria-invalid"]} className="field h-12"/>{feedback && <span id={feedbackId} role="alert" className="mt-1.5 block text-xs font-bold text-[var(--danger)]">{feedback}</span>}</label>;
}

function fieldError(result: { success: boolean; error?: { issues: Array<{ message: string }> } }): string | undefined {
  return result.success ? undefined : result.error?.issues[0]?.message;
}
