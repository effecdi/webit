import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { communityLikes, communityPosts } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;

    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
    }

    const existing = await db.select().from(communityLikes)
      .where(and(
        eq(communityLikes.postId, Number(postId)),
        eq(communityLikes.userId, userId)
      ));

    if (existing.length > 0) {
      await db.delete(communityLikes)
        .where(and(
          eq(communityLikes.postId, Number(postId)),
          eq(communityLikes.userId, userId)
        ));

      await db.update(communityPosts)
        .set({ likeCount: sql`GREATEST(${communityPosts.likeCount} - 1, 0)` })
        .where(eq(communityPosts.id, Number(postId)));

      return NextResponse.json({ liked: false });
    } else {
      await db.insert(communityLikes).values({
        postId: Number(postId),
        userId,
      });

      await db.update(communityPosts)
        .set({ likeCount: sql`${communityPosts.likeCount} + 1` })
        .where(eq(communityPosts.id, Number(postId)));

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}
