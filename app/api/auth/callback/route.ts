import { handleCallback } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const result = await handleCallback(new URL(request.url));

    if (result.success) {
      const cookieStore = await cookies();
      const inviteCode = cookieStore.get("pending_invite_code")?.value;

      if (inviteCode) {
        cookieStore.delete("pending_invite_code");
        return NextResponse.redirect(`/invite-welcome?code=${inviteCode}`);
      }

      return NextResponse.redirect("/splash");
    } else {
      console.error("Auth callback failed:", result.error);
      return NextResponse.redirect("/login?error=callback_failed");
    }
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect("/login?error=callback_error");
  }
}
