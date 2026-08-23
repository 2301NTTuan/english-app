import { compare, hash } from "bcryptjs";
import { z } from "zod";

export const passwordSchema = z.string().min(12, "Use at least 12 characters.").max(128).refine(
  (value) => /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value),
  "Include an uppercase letter, a lowercase letter, and a number.",
);
export const credentialsSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().max(128) });
export const registrationSchema = credentialsSchema.extend({ name: z.string().trim().min(2).max(80), password: passwordSchema, confirmation: z.string() }).refine((value) => value.password === value.confirmation, { path: ["confirmation"], message: "Passwords do not match." });
export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const hashPassword = (password: string) => hash(password, 12);
export const verifyPassword = (password: string, passwordHash: string) => compare(password, passwordHash);
