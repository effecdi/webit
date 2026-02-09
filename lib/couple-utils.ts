import { db } from "@/db";
import { couples } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function getCoupleUserIds(userId: string): Promise<string[]> {
  try {
    const [couple] = await db
      .select()
      .from(couples)
      .where(or(eq(couples.user1Id, userId), eq(couples.user2Id, userId)));

    if (!couple) return [userId];

    return [couple.user1Id, couple.user2Id];
  } catch {
    return [userId];
  }
}

export async function getPartnerId(userId: string): Promise<string | null> {
  try {
    const [couple] = await db
      .select()
      .from(couples)
      .where(or(eq(couples.user1Id, userId), eq(couples.user2Id, userId)));

    if (!couple) return null;

    return couple.user1Id === userId ? couple.user2Id : couple.user1Id;
  } catch {
    return null;
  }
}

export async function getCoupleRecord(userId: string) {
  try {
    const [couple] = await db
      .select()
      .from(couples)
      .where(or(eq(couples.user1Id, userId), eq(couples.user2Id, userId)));

    return couple || null;
  } catch {
    return null;
  }
}
