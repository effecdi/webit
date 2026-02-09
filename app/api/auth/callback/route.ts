import { handleCallback } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.REPLIT_DOMAINS
    ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
    : "http://localhost:5000";

  try {
    const result = await handleCallback(new URL(request.url));

    if (result.success) {
      const cookieStore = await cookies();
      const inviteCode = cookieStore.get("pending_invite_code")?.value;

      if (inviteCode) {
        cookieStore.delete("pending_invite_code");
        return NextResponse.redirect(new URL(`/invite-welcome?code=${inviteCode}`, baseUrl));
      }

      return NextResponse.redirect(new URL("/splash", baseUrl));
    } else {
      console.error("Auth callback failed:", result.error);
      return NextResponse.redirect(new URL("/login?error=callback_failed", baseUrl));
    }
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/login?error=callback_error", baseUrl));
  }
}
