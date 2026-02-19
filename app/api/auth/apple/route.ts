import { startAppleLogin } from "@/lib/social-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authUrl = await startAppleLogin();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Apple login error:", error);
    return NextResponse.redirect("/login?error=apple_failed");
  }
}
