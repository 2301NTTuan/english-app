import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { passwordSchema } from "./password-policy";

export { passwordSchema } from "./password-policy";
export const credentialsSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().max(128) });
export const registrationSchema = credentialsSchema.extend({ name: z.string().trim().min(2).max(80), password: passwordSchema });
export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const hashPassword = (password: string) => hash(password, 12);
export const verifyPassword = (password: string, passwordHash: string) => compare(password, passwordHash);
