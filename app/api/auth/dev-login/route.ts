import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "weve_session";
const DEV_USER_ID = "dev-user-001";

export async function POST() {
  try {
    const userData = {
      id: DEV_USER_ID,
      email: "dev@weve.app",
      firstName: "위브",
      lastName: "사용자",
      profileImageUrl: null,
      provider: "dev",
      providerId: "dev-001",
    };

    await db
      .insert(users)
      .values({
        ...userData,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          updatedAt: new Date(),
        },
      });

    const sessionId = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(sessions).values({
      sid: sessionId,
      sess: { userId: userData.id, claims: userData },
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Dev login error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
