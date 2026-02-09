import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { communityPosts, communityLikes } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const updated = await db.update(communityPosts)
      .set({ viewCount: sql`COALESCE(${communityPosts.viewCount}, 0) + 1` })
      .where(eq(communityPosts.id, Number(id)))
      .returning();

    if (!updated.length) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const post = updated[0];

    const auth = await requireAuth();
    let isLiked = false;
    if (!isUnauthorized(auth)) {
      const likes = await db.select().from(communityLikes)
        .where(eq(communityLikes.postId, post.id));
      isLiked = likes.some(l => l.userId === auth.userId);
    }

    return NextResponse.json({ ...post, isLiked });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}
