import { compare, hash } from "bcryptjs";
import { z } from "zod";

export { passwordSchema } from "./password-policy";
export { registrationSchema } from "./registration";
export const credentialsSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().max(128) });
export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const hashPassword = (password: string) => hash(password, 12);
export const verifyPassword = (password: string, passwordHash: string) => compare(password, passwordHash);
