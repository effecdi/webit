import { NextResponse } from "next/server";
import { db } from "@/db";
import { coupleInvites } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, isUnauthorized } from "@/lib/api-auth";
import crypto from "crypto";

export async function GET() {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;

  try {
    const invites = await db
      .select()
      .from(coupleInvites)
      .where(eq(coupleInvites.userId, userId));

    return NextResponse.json({ invites });
  } catch (error) {
    console.error("Error fetching invites:", error);
    return NextResponse.json({ error: "Failed to fetch invites" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;

  try {
    const body = await request.json();
    const { inviterName, mode } = body;

    if (!mode) {
      return NextResponse.json({ error: "Mode is required" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(coupleInvites)
      .where(and(eq(coupleInvites.userId, userId), eq(coupleInvites.mode, mode), eq(coupleInvites.status, "pending")));

    if (existing.length > 0) {
      return NextResponse.json({ invite: existing[0] });
    }

    const inviteCode = crypto.randomBytes(6).toString("hex");

    const [invite] = await db
      .insert(coupleInvites)
      .values({
        userId,
        inviteCode,
        inviterName: inviterName || null,
        mode,
        status: "pending",
      })
      .returning();

    return NextResponse.json({ invite });
  } catch (error) {
    console.error("Error creating invite:", error);
    return NextResponse.json({ error: "Failed to create invite" }, { status: 500 });
  }
}
