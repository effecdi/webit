import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { communityPosts, communityLikes, users } from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('mode') || 'dating';
  const category = searchParams.get('category');
  const sort = searchParams.get('sort');

  try {
    const orderClause = sort === 'popular'
      ? desc(communityPosts.likeCount)
      : desc(communityPosts.createdAt);

    let query = db.select().from(communityPosts)
      .where(
        category && category !== '전체'
          ? and(eq(communityPosts.mode, mode), eq(communityPosts.category, category))
          : eq(communityPosts.mode, mode)
      )
      .orderBy(orderClause);

    const result = await query;

    const auth = await requireAuth();
    let likedPostIds: number[] = [];
    if (!isUnauthorized(auth)) {
      const likes = await db.select({ postId: communityLikes.postId })
        .from(communityLikes)
        .where(eq(communityLikes.userId, auth.userId));
      likedPostIds = likes.map(l => l.postId);
    }

    const postsWithLiked = result.map(post => ({
      ...post,
      isLiked: likedPostIds.includes(post.id),
    }));

    return NextResponse.json(postsWithLiked);
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;

    const body = await request.json();
    const { mode, category, title, content, authorName } = body;

    if (!mode || !category || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const displayName = authorName || '익명';

    const [newPost] = await db.insert(communityPosts).values({
      userId,
      mode,
      category,
      title,
      content,
      authorName: displayName,
      likeCount: 0,
      commentCount: 0,
    }).returning();

    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Error creating community post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
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

    const post = await db.select().from(communityPosts).where(eq(communityPosts.id, Number(id)));
    if (!post.length || post[0].userId !== userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    await db.delete(communityPosts).where(eq(communityPosts.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting community post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
