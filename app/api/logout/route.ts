import { logout } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await logout();
  } catch (error) {
    console.error("Logout error:", error);
  }

  const response = NextResponse.redirect(new URL("/login", request.url));

  try {
    response.cookies.delete("weve_session");
  } catch (error) {
    console.error("Logout cookie clear error:", error);
  }

  return response;
}
