import { NextResponse } from "next/server";
import { db } from "@/db";
import { couples, users, profiles } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { requireAuth, isUnauthorized } from "@/lib/api-auth";

export async function GET() {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;

  try {
    const [couple] = await db
      .select()
      .from(couples)
      .where(or(eq(couples.user1Id, userId), eq(couples.user2Id, userId)));

    if (!couple) {
      return NextResponse.json({ coupled: false, partner: null });
    }

    const partnerId =
      couple.user1Id === userId ? couple.user2Id : couple.user1Id;

    const [partnerUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, partnerId));

    const [partnerProfile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, partnerId));

    return NextResponse.json({
      coupled: true,
      coupleId: couple.id,
      partnerId,
      partner: {
        id: partnerUser?.id,
        firstName: partnerUser?.firstName,
        lastName: partnerUser?.lastName,
        profileImageUrl: partnerUser?.profileImageUrl,
        mood: partnerProfile?.myMood || "heart",
      },
      createdAt: couple.createdAt,
    });
  } catch (error) {
    console.error("Error fetching couple info:", error);
    return NextResponse.json({ coupled: false, partner: null }, { status: 200 });
  }
}
