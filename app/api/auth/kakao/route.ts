import { startKakaoLogin } from "@/lib/social-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authUrl = await startKakaoLogin();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Kakao login error:", error);
    return NextResponse.redirect("/login?error=kakao_failed");
  }
}
