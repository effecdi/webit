import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupleInvites, couples, users, profiles } from "@/db/schema";
import { eq, or, and } from "drizzle-orm";
import { requireAuth, isUnauthorized } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;

  try {
    const body = await request.json();
    const inviteCode = body.inviteCode || body.code;

    if (!inviteCode) {
      console.log("Accept invite body received:", JSON.stringify(body));
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

    const existingCoupleAcceptor = await db
      .select()
      .from(couples)
      .where(or(eq(couples.user1Id, userId), eq(couples.user2Id, userId)));

    if (existingCoupleAcceptor.length > 0) {
      return NextResponse.json({ error: "이미 커플로 연결되어 있습니다" }, { status: 400 });
    }

    const existingCoupleInviter = await db
      .select()
      .from(couples)
      .where(or(eq(couples.user1Id, invite.userId), eq(couples.user2Id, invite.userId)));

    if (existingCoupleInviter.length > 0) {
      return NextResponse.json({ error: "초대한 사람이 이미 다른 커플과 연결되어 있습니다" }, { status: 400 });
    }

    await db
      .update(coupleInvites)
      .set({ status: "accepted" })
      .where(eq(coupleInvites.id, invite.id));

    await db.insert(couples).values({
      user1Id: invite.userId,
      user2Id: userId,
    });

    const [inviterProfile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, invite.userId));

    const [acceptorUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    const acceptorName = acceptorUser?.firstName || "상대방";

    if (inviterProfile) {
      await db
        .update(profiles)
        .set({ partnerName: acceptorName })
        .where(eq(profiles.userId, invite.userId));
    }

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
