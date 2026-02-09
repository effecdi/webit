import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { communityComments, communityPosts } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
  }

  try {
    const result = await db.select().from(communityComments)
      .where(eq(communityComments.postId, Number(postId)))
      .orderBy(desc(communityComments.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;

    const body = await request.json();
    const { postId, content, authorName } = body;

    if (!postId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const displayName = authorName || '익명';

    const [newComment] = await db.insert(communityComments).values({
      postId: Number(postId),
      userId,
      content,
      authorName: displayName,
    }).returning();

    await db.update(communityPosts)
      .set({ commentCount: sql`${communityPosts.commentCount} + 1` })
      .where(eq(communityPosts.id, Number(postId)));

    return NextResponse.json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const comment = await db.select().from(communityComments)
      .where(eq(communityComments.id, Number(id)));

    if (!comment.length || comment[0].userId !== userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const postId = comment[0].postId;

    await db.delete(communityComments).where(eq(communityComments.id, Number(id)));

    await db.update(communityPosts)
      .set({ commentCount: sql`GREATEST(${communityPosts.commentCount} - 1, 0)` })
      .where(eq(communityPosts.id, postId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
