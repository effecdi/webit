import { startGoogleLogin } from "@/lib/social-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authUrl = await startGoogleLogin();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Google login error:", error);
    return NextResponse.redirect("/login?error=google_failed");
  }
}
