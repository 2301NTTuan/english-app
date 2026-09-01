"use client";

import { useState, type InputHTMLAttributes, type Ref } from "react";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { assessPassword, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/auth/password-policy";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name" | "type"> {
  id: string;
  inputRef?: Ref<HTMLInputElement>;
  label: string;
  name: string;
}

export function PasswordInput({ id, inputRef, label, name, className = "", ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const visibilityLabel = visible ? "Hide password" : "Show password";

  return <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-bold">{label}</label>
    <div className="relative">
      <input {...props} id={id} ref={inputRef} name={name} type={visible ? "text" : "password"} className={`field h-12 pr-12 ${className}`}/>
      <button
        type="button"
        className="absolute inset-y-0 right-0.5 my-auto grid size-11 place-items-center rounded-lg text-[var(--muted-strong)] transition hover:text-[var(--ink-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
        aria-label={visibilityLabel}
        aria-controls={id}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <EyeOff size={19} aria-hidden="true"/> : <Eye size={19} aria-hidden="true"/>}
      </button>
    </div>
  </div>;
}

export function PasswordFeedback({ password, touched, id }: { password: string; touched: boolean; id?: string }) {
  if (!touched && !password) {
    return <p id={id} className="muted text-xs">Use {PASSWORD_MIN_LENGTH}–{PASSWORD_MAX_LENGTH} characters. Requirements and strength will update as you type.</p>;
  }

  const assessment = assessPassword(password);
  return <div id={id} className="space-y-3" role="status" aria-live="polite" aria-atomic="true">
    <div>
      <div className="flex items-center justify-between gap-3 text-xs"><span className="font-bold text-[var(--ink)]">Strength</span><span className="font-extrabold">{assessment.strength}</span></div>
      <div className="mt-2 grid grid-cols-4 gap-1" role="progressbar" aria-label="Password strength" aria-valuetext={assessment.strength} aria-valuemin={1} aria-valuemax={4} aria-valuenow={assessment.strengthScore}>
        {[1, 2, 3, 4].map((step) => <span key={step} aria-hidden="true" className={`h-1.5 rounded-full ${step <= assessment.strengthScore ? "bg-[var(--brand)]" : "bg-[var(--line)]"}`}/>) }
      </div>
    </div>
    <p className={`text-xs font-bold ${assessment.valid ? "text-[var(--success)]" : "text-[var(--muted-strong)]"}`}>
      {assessment.valid ? "Password meets the registration requirements." : password.length < PASSWORD_MIN_LENGTH ? `${password.length} / ${PASSWORD_MIN_LENGTH} characters minimum` : "Password does not yet meet every requirement."}
    </p>
    <ul className="grid gap-1.5 text-xs">
      {assessment.requirements.map((requirement) => <li key={requirement.id} className={`flex items-center gap-2 ${requirement.met ? "text-[var(--success)]" : "text-[var(--muted-strong)]"}`}>
        {requirement.met ? <Check size={14} aria-hidden="true"/> : <X size={14} aria-hidden="true"/>}
        <span className="sr-only">{requirement.met ? "Met: " : "Not met: "}</span>{requirement.label}
      </li>)}
    </ul>
  </div>;
}

export function PasswordMatchFeedback({ password, confirmation, touched, id }: { password: string; confirmation: string; touched: boolean; id?: string }) {
  if (!touched && !confirmation) return null;
  const matches = password === confirmation;
  return <p id={id} role="status" aria-live="polite" className={`flex items-center gap-2 text-xs font-bold ${matches ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
    {matches ? <Check size={14} aria-hidden="true"/> : <X size={14} aria-hidden="true"/>}
    {matches ? "Passwords match" : "Passwords do not match"}
  </p>;
}
