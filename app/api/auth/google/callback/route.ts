import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const inviteCode = url.searchParams.get("invite");
  if (inviteCode) {
    return NextResponse.redirect(`/invite-welcome?code=${inviteCode}`);
  }
  return NextResponse.redirect("/login");
}
