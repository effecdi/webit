import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { photos } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId') || 'default';
  const mode = searchParams.get('mode') || 'dating';
  const albumId = searchParams.get('albumId');

  try {
    let query = db.select().from(photos)
      .where(and(eq(photos.userId, userId), eq(photos.mode, mode)));

    if (albumId) {
      query = db.select().from(photos)
        .where(and(
          eq(photos.userId, userId),
          eq(photos.mode, mode),
          eq(photos.albumId, parseInt(albumId))
        ));
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
    const { userId = 'default', url, caption, albumId, mode = 'dating' } = body;

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
    const { id, liked, caption } = body;

    const updates: Record<string, unknown> = {};
    if (liked !== undefined) updates.liked = liked;
    if (caption !== undefined) updates.caption = caption;

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
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  try {
    await db.delete(photos).where(eq(photos.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
