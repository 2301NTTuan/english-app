import "server-only";

type LogValue = string | number | boolean | null | undefined;
const blockedKey = /password|token|secret|answer|email|name/i;

export function logEvent(level: "info" | "warn" | "error", event: string, metadata: Record<string, LogValue> = {}) {
  const safeMetadata = Object.fromEntries(Object.entries(metadata).filter(([key]) => !blockedKey.test(key)));
  const record = JSON.stringify({ timestamp: new Date().toISOString(), level, event, ...safeMetadata });
  if (level === "error") console.error(record); else if (level === "warn") console.warn(record); else console.info(record);
}
