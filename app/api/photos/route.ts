import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { photos, users } from '@/db/schema';
import { eq, and, desc, inArray, count } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';
import { getCoupleUserIds } from '@/lib/couple-utils';

const PHOTO_LIMITS: Record<string, number> = {
  free: 50,
  advanced: 500,
  premium: Infinity,
};

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;
  const coupleUserIds = await getCoupleUserIds(userId);
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('mode') || 'dating';
  const albumId = searchParams.get('albumId');

  try {
    let query;
    if (albumId) {
      query = db.select().from(photos)
        .where(and(
          inArray(photos.userId, coupleUserIds),
          eq(photos.mode, mode),
          eq(photos.albumId, parseInt(albumId))
        ));
    } else {
      query = db.select().from(photos)
        .where(and(inArray(photos.userId, coupleUserIds), eq(photos.mode, mode)));
    }

    const result = await query.orderBy(desc(photos.createdAt));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;
    const { url, caption, albumId, mode = 'dating' } = body;

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    const plan = user?.subscriptionPlan || 'free';
    const limit = PHOTO_LIMITS[plan] || 50;

    if (limit !== Infinity) {
      const coupleUserIds = await getCoupleUserIds(userId);
      const [photoCount] = await db
        .select({ total: count() })
        .from(photos)
        .where(inArray(photos.userId, coupleUserIds));

      if (photoCount.total >= limit) {
        return NextResponse.json(
          {
            error: 'PHOTO_LIMIT_REACHED',
            message: `사진 저장 한도(${limit}장)에 도달했습니다. 멤버십을 업그레이드하면 더 많은 사진을 저장할 수 있어요.`,
            currentCount: photoCount.total,
            limit,
          },
          { status: 403 }
        );
      }
    }

    const [newPhoto] = await db.insert(photos).values({
      userId,
      url,
      caption,
      albumId,
      mode,
      liked: false,
    }).returning();

    return NextResponse.json(newPhoto);
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json({ error: 'Failed to create photo' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, liked, caption, albumId } = body;

    const updates: Record<string, unknown> = {};
    if (liked !== undefined) updates.liked = liked;
    if (caption !== undefined) updates.caption = caption;
    if (albumId !== undefined) updates.albumId = albumId;

    const [updated] = await db.update(photos)
      .set(updates)
      .where(eq(photos.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating photo:', error);
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let id = searchParams.get('id');
    
    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id?.toString();
    }

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await db.delete(photos).where(eq(photos.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
