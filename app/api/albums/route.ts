import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { albums, photos } from '@/db/schema';
import { eq, and, desc, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId') || 'default';
  const mode = searchParams.get('mode') || 'dating';
  const id = searchParams.get('id');

  try {
    // If ID is specified, return single album
    if (id) {
      const [album] = await db.select().from(albums)
        .where(eq(albums.id, parseInt(id)));
      
      if (!album) {
        return NextResponse.json({ error: 'Album not found' }, { status: 404 });
      }
      
      const [{ count: photoCount }] = await db.select({ count: count() })
        .from(photos)
        .where(eq(photos.albumId, album.id));
      
      return NextResponse.json({ ...album, photoCount: Number(photoCount) });
    }

    // Otherwise return all albums for user/mode
    const result = await db.select().from(albums)
      .where(and(eq(albums.userId, userId), eq(albums.mode, mode)))
      .orderBy(desc(albums.eventDate));

    const albumsWithCount = await Promise.all(
      result.map(async (album) => {
        const [{ count: photoCount }] = await db.select({ count: count() })
          .from(photos)
          .where(eq(photos.albumId, album.id));
        
        // Get most recent photo as thumbnail
        const [latestPhoto] = await db.select({ url: photos.url })
          .from(photos)
          .where(eq(photos.albumId, album.id))
          .orderBy(desc(photos.createdAt))
          .limit(1);
        
        return { 
          ...album, 
          photoCount: Number(photoCount),
          thumbnail: latestPhoto?.url || album.thumbnail
        };
      })
    );

    return NextResponse.json(albumsWithCount);
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'default', title, thumbnail, eventDate, mode = 'dating' } = body;

    const [newAlbum] = await db.insert(albums).values({
      userId,
      title,
      thumbnail,
      eventDate: eventDate ? new Date(eventDate) : null,
      mode,
    }).returning();

    return NextResponse.json({ ...newAlbum, photoCount: 0 });
  } catch (error) {
    console.error('Error creating album:', error);
    return NextResponse.json({ error: 'Failed to create album' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  try {
    await db.update(photos)
      .set({ albumId: null })
      .where(eq(photos.albumId, parseInt(id)));
    await db.delete(albums).where(eq(albums.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting album:', error);
    return NextResponse.json({ error: 'Failed to delete album' }, { status: 500 });
  }
}
