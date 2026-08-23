import { createHash, randomBytes } from "node:crypto";

export const SESSION_COOKIE = "english_mastery_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
export const createSessionToken = () => randomBytes(32).toString("base64url");
export const hashSessionToken = (token: string) => createHash("sha256").update(token).digest("hex");
export const sessionExpiresAt = () => new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
export const sessionCookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_TTL_SECONDS };
