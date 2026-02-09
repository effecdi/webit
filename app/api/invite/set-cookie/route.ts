import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = body.code;

    if (!code) {
      return NextResponse.json({ error: "Missing invite code" }, { status: 400 });
    }

    const cookieStore = await cookies();
    cookieStore.set("pending_invite_code", code, {
      httpOnly: false,
      secure: true,
      maxAge: 3600,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to set cookie" }, { status: 500 });
  }
}
