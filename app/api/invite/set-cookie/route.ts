import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

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

  return NextResponse.redirect(new URL("/login", request.url));
}
