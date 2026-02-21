import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { db } from '@/db';
import { users, sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'weve_session';

export async function POST(request: NextRequest) {
  try {
    const { access_token } = await request.json();

    if (!access_token) {
      return NextResponse.json({ error: 'No access token' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user }, error } = await supabase.auth.getUser(access_token);

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const metadata = user.user_metadata || {};
    const fullName = metadata.full_name as string | undefined;
    const nameParts = fullName ? fullName.split(' ') : [];

    const userData = {
      id: user.id,
      email: user.email ?? null,
      firstName: (metadata.first_name ?? metadata.given_name ?? nameParts[0]) as string | null ?? null,
      lastName: (metadata.last_name ?? metadata.family_name ?? (nameParts.length > 1 ? nameParts.slice(1).join(' ') : null)) as string | null ?? null,
      profileImageUrl: (metadata.avatar_url ?? metadata.picture) as string | null ?? null,
      provider: (user.app_metadata?.provider ?? 'supabase') as string,
      providerId: user.id,
    };

    await db.insert(users).values({
      ...userData,
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: users.id,
      set: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        updatedAt: new Date(),
      },
    });

    const sessionId = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(sessions).values({
      sid: sessionId,
      sess: { userId: user.id, claims: userData },
      expire: expiry,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax',
    });

    // Clean up old sessions for this user to avoid accumulation
    try {
      const allSessions = await db.select().from(sessions);
      const userSessions = allSessions.filter(s => {
        const sess = s.sess as { userId?: string };
        return sess?.userId === user.id && s.sid !== sessionId;
      });
      for (const old of userSessions) {
        await db.delete(sessions).where(eq(sessions.sid, old.sid));
      }
    } catch {
      // Non-critical cleanup failure, ignore
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session sync error:', error);
    return NextResponse.json({ error: 'Failed to sync session' }, { status: 500 });
  }
}
