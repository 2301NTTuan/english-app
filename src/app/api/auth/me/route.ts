import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth/server";
import { jsonError } from "@/lib/auth/request";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return jsonError("Authentication required.", 401);
    return NextResponse.json({ user });
  } catch { return jsonError("Account service is temporarily unavailable.", 503); }
}
