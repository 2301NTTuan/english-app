import type { AppState } from "@/types/domain";
import { appStateSchema } from "@/lib/validation/app-state";

export type RemoteLoadResult = { authenticated: true; state: AppState } | { authenticated: false };

export async function loadRemoteState(signal?: AbortSignal): Promise<RemoteLoadResult> {
  const response = await fetch("/api/state", { credentials: "same-origin", cache: "no-store", signal });
  if (response.status === 401) return { authenticated: false };
  if (!response.ok) throw new Error("REMOTE_LOAD_FAILED");
  const payload = await response.json() as { state?: unknown };
  const parsed = appStateSchema.safeParse(payload.state);
  if (!parsed.success) throw new Error("REMOTE_STATE_INVALID");
  return { authenticated: true, state: parsed.data };
}

export async function saveRemoteState(state: AppState): Promise<boolean> {
  const parsed = appStateSchema.safeParse(state);
  if (!parsed.success) return false;
  const response = await fetch("/api/state", { method: "PUT", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state: parsed.data }) });
  return response.ok;
}

export async function importRemoteState(state: AppState): Promise<boolean> {
  const parsed = appStateSchema.safeParse(state);
  if (!parsed.success) return false;
  const response = await fetch("/api/state/import", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state: parsed.data, confirmLegacyImport: true }) });
  return response.ok;
}
