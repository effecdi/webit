import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupleInvites } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const [invite] = await db
      .select()
      .from(coupleInvites)
      .where(eq(coupleInvites.inviteCode, code));

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    return NextResponse.json({ invite });
  } catch (error) {
    console.error("Error looking up invite:", error);
    return NextResponse.json({ error: "Failed to look up invite" }, { status: 500 });
  }
}
