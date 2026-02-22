import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { db } from "@/db";
import { users, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "weve_session";

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();
    if (!accessToken) {
      return NextResponse.json({ error: "Missing access token" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const supaUser = data.user;
    const metadata = supaUser.user_metadata || {};
    const email = supaUser.email || null;
    const firstName = metadata.first_name || metadata.given_name || metadata.name || metadata.full_name || null;
    const lastName = metadata.last_name || metadata.family_name || null;
    const profileImageUrl = metadata.avatar_url || metadata.picture || null;
    const provider = supaUser.app_metadata?.provider || "supabase";
    const providerId = supaUser.id;

    // Find or create user
    let userId: string;
    const existingByProvider = await db
      .select()
      .from(users)
      .where(eq(users.providerId, providerId))
      .limit(1);

    if (existingByProvider.length > 0) {
      userId = existingByProvider[0].id;
      await db.update(users).set({
        email: email || existingByProvider[0].email,
        firstName: firstName || existingByProvider[0].firstName,
        lastName: lastName || existingByProvider[0].lastName,
        profileImageUrl: profileImageUrl || existingByProvider[0].profileImageUrl,
        updatedAt: new Date(),
      }).where(eq(users.id, userId));
    } else if (email) {
      const existingByEmail = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingByEmail.length > 0) {
        userId = existingByEmail[0].id;
        await db.update(users).set({
          provider,
          providerId,
          firstName: firstName || existingByEmail[0].firstName,
          lastName: lastName || existingByEmail[0].lastName,
          profileImageUrl: profileImageUrl || existingByEmail[0].profileImageUrl,
          updatedAt: new Date(),
        }).where(eq(users.id, userId));
      } else {
        userId = crypto.randomUUID();
        await db.insert(users).values({
          id: userId,
          email,
          firstName,
          lastName,
          profileImageUrl,
          provider,
          providerId,
          updatedAt: new Date(),
        });
      }
    } else {
      userId = crypto.randomUUID();
      await db.insert(users).values({
        id: userId,
        email: null,
        firstName,
        lastName,
        profileImageUrl,
        provider,
        providerId,
        updatedAt: new Date(),
      });
    }

    // Create session
    const sessionId = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(sessions).values({
      sid: sessionId,
      sess: { userId, claims: { id: userId, email, firstName, lastName, profileImageUrl } },
      expire: expiry,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error("Sync session error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
