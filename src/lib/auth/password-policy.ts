import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;

const COMPLEXITY_REQUIREMENTS = [
  { id: "lowercase", label: "At least one lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { id: "uppercase", label: "At least one uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { id: "number", label: "At least one number", test: (value: string) => /\d/.test(value) },
] as const;

export const PASSWORD_REQUIREMENTS = [
  { id: "minimum-length", label: `At least ${PASSWORD_MIN_LENGTH} characters`, test: (value: string) => value.length >= PASSWORD_MIN_LENGTH },
  { id: "maximum-length", label: `No more than ${PASSWORD_MAX_LENGTH} characters`, test: (value: string) => value.length <= PASSWORD_MAX_LENGTH },
  ...COMPLEXITY_REQUIREMENTS,
] as const;

export const passwordSchema = z.string()
  .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters.`)
  .max(PASSWORD_MAX_LENGTH, `Use no more than ${PASSWORD_MAX_LENGTH} characters.`)
  .refine(
    (value) => COMPLEXITY_REQUIREMENTS.every((requirement) => requirement.test(value)),
    "Include an uppercase letter, a lowercase letter, and a number.",
  );

export type PasswordStrength = "Very weak" | "Weak" | "Fair" | "Strong";

export interface PasswordAssessment {
  valid: boolean;
  strength: PasswordStrength;
  strengthScore: 1 | 2 | 3 | 4;
  requirements: Array<{ id: string; label: string; met: boolean }>;
}

const commonPatterns = ["password", "qwerty", "letmein", "welcome", "admin", "englishmastery"];
const sequences = ["abcdefghijklmnopqrstuvwxyz", "0123456789", "qwertyuiop"];

function hasSequence(value: string) {
  const normalized = value.toLowerCase();
  return sequences.some((sequence) => {
    for (let index = 0; index <= sequence.length - 4; index += 1) {
      const part = sequence.slice(index, index + 4);
      if (normalized.includes(part) || normalized.includes([...part].reverse().join(""))) return true;
    }
    return false;
  });
}

export function assessPassword(value: string): PasswordAssessment {
  const requirements = PASSWORD_REQUIREMENTS.map((requirement) => ({ id: requirement.id, label: requirement.label, met: requirement.test(value) }));
  let score = 0;
  if (value.length >= PASSWORD_MIN_LENGTH) score += 2;
  if (value.length >= 16) score += 1;
  if (value.length >= 20) score += 1;
  if (value.length >= 24) score += 1;

  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((pattern) => pattern.test(value)).length;
  if (classes >= 2) score += 1;
  if (classes >= 3) score += 1;
  if (classes >= 4) score += 1;

  const uniqueRatio = value.length ? new Set(value).size / value.length : 0;
  if (value.length >= PASSWORD_MIN_LENGTH && uniqueRatio >= 0.65) score += 1;
  if (/(.)\1{2,}/.test(value) || uniqueRatio < 0.4) score -= 2;
  if (hasSequence(value)) score -= 1;
  if (commonPatterns.some((pattern) => value.toLowerCase().includes(pattern))) score -= 2;

  const strengthScore: 1 | 2 | 3 | 4 = score <= 1 ? 1 : score <= 3 ? 2 : score <= 5 ? 3 : 4;
  const strength = (["Very weak", "Weak", "Fair", "Strong"] as const)[strengthScore - 1];
  return { valid: passwordSchema.safeParse(value).success, strength, strengthScore, requirements };
}
