import { logout } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect("/login");

  try {
    await logout();
  } catch (error) {
    console.error("Logout error:", error);
  }

  try {
    response.cookies.delete("weve_session");
  } catch (error) {
    console.error("Logout cookie clear error:", error);
  }

  return response;
}
