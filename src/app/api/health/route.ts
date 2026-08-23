import { NextResponse } from "next/server";
import { checkDatabase } from "@/db/client";
import { logEvent } from "@/lib/observability/logger";

export const dynamic = "force-dynamic";
export async function GET() {
  try { await checkDatabase(); return NextResponse.json({ status: "ok" }); }
  catch { logEvent("error", "health.database_unavailable"); return NextResponse.json({ status: "degraded" }, { status: 503 }); }
}
