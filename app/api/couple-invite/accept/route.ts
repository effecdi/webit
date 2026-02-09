import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupleInvites, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, isUnauthorized } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;

  try {
    const body = await request.json();
    const { inviteCode } = body;

    if (!inviteCode) {
      return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
    }

    const [invite] = await db
      .select()
      .from(coupleInvites)
      .where(eq(coupleInvites.inviteCode, inviteCode));

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    if (invite.status === "accepted") {
      return NextResponse.json({ error: "Invite already accepted" }, { status: 400 });
    }

    if (invite.userId === userId) {
      return NextResponse.json({ error: "Cannot accept your own invite" }, { status: 400 });
    }

    await db
      .update(coupleInvites)
      .set({ status: "accepted" })
      .where(eq(coupleInvites.id, invite.id));

    const [inviterUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, invite.userId));

    const inviterName = invite.inviterName || inviterUser?.firstName || "상대방";

    return NextResponse.json({
      success: true,
      invite: {
        mode: invite.mode,
        inviterName,
        inviterId: invite.userId,
      },
    });
  } catch (error) {
    console.error("Error accepting invite:", error);
    return NextResponse.json({ error: "Failed to accept invite" }, { status: 500 });
  }
}
