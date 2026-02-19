import { handleAppleCallback } from "@/lib/social-auth";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await handleAppleCallback(formData);

    if (result.success) {
      const cookieStore = await cookies();
      const inviteCode = cookieStore.get("pending_invite_code")?.value;

      if (inviteCode) {
        cookieStore.delete("pending_invite_code");
        return NextResponse.redirect("/invite-welcome", { status: 303 });
      }

      return NextResponse.redirect("/splash", { status: 303 });
    } else {
      console.error("Apple callback failed:", result.error);
      return NextResponse.redirect("/login?error=apple_callback_failed", { status: 303 });
    }
  } catch (error) {
    console.error("Apple callback error:", error);
    return NextResponse.redirect("/login?error=apple_error", { status: 303 });
  }
}
