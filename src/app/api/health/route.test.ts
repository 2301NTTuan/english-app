import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { checkDatabase, logEvent } = vi.hoisted(() => ({ checkDatabase: vi.fn(), logEvent: vi.fn() }));
vi.mock("@/db/client", () => ({ checkDatabase }));
vi.mock("@/lib/observability/logger", () => ({ logEvent }));

import { GET } from "./route";

describe("health readiness", () => {
  beforeEach(() => { checkDatabase.mockReset(); logEvent.mockReset(); });

  it("returns only an ok status when PostgreSQL is reachable", async () => {
    checkDatabase.mockResolvedValue(undefined);
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });

  it("returns a topology-free 503 when PostgreSQL is unavailable", async () => {
    checkDatabase.mockRejectedValue(new Error("postgresql://private-host/database"));
    const response = await GET();
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: "degraded" });
    expect(logEvent).toHaveBeenCalledWith("error", "health.database_unavailable");
  });
});
