import { handleKakaoCallback } from "@/lib/social-auth";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
      return NextResponse.redirect("/login?error=missing_params");
    }

    const result = await handleKakaoCallback(code, state);

    if (result.success) {
      const cookieStore = await cookies();
      const inviteCode = cookieStore.get("pending_invite_code")?.value;

      if (inviteCode) {
        cookieStore.delete("pending_invite_code");
        return NextResponse.redirect(`/invite-welcome?code=${inviteCode}`);
      }

      return NextResponse.redirect("/splash");
    } else {
      console.error("Kakao callback failed:", result.error);
      return NextResponse.redirect("/login?error=kakao_callback_failed");
    }
  } catch (error) {
    console.error("Kakao callback error:", error);
    return NextResponse.redirect("/login?error=kakao_error");
  }
}
