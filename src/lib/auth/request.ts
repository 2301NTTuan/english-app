import { NextResponse } from "next/server";
import { MAX_STATE_BYTES } from "@/lib/validation/app-state";

export function assertSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  try { return new URL(origin).host === new URL(request.url).host; } catch { return false; }
}

export async function readJson(request: Request, maxBytes = MAX_STATE_BYTES): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) throw new Error("CONTENT_TYPE");
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > maxBytes) throw new Error("TOO_LARGE");
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > maxBytes) throw new Error("TOO_LARGE");
  try { return JSON.parse(raw) as unknown; } catch { throw new Error("INVALID_JSON"); }
}

export const jsonError = (message: string, status: number, headers?: HeadersInit) => NextResponse.json({ error: message }, { status, headers });
export function bodyErrorResponse(error: unknown) {
  if (!(error instanceof Error)) return null;
  if (error.message === "TOO_LARGE") return jsonError("Request body is too large.", 413);
  if (error.message === "CONTENT_TYPE") return jsonError("Content-Type must be application/json.", 415);
  if (error.message === "INVALID_JSON") return jsonError("Request body is not valid JSON.", 400);
  return null;
}
