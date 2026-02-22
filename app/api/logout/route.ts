import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Always prepare redirect response first - this must never fail
  const response = NextResponse.redirect(new URL("/login", request.url));

  // Clear session cookie on the response directly (maxAge: 0 expires it)
  response.cookies.set("weve_session", "", {
    httpOnly: true,
    secure: true,
    maxAge: 0,
    path: "/",
  });

  // Best-effort: delete session from DB using dynamic import
  // (avoids import-time crashes if DB module fails to initialize)
  try {
    const sessionId = request.cookies.get("weve_session")?.value;
    if (sessionId) {
      const { db } = await import("@/db");
      const { sessions } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");
      await db.delete(sessions).where(eq(sessions.sid, sessionId));
    }
  } catch (error) {
    console.error("Logout DB cleanup error:", error);
  }

  return response;
}
