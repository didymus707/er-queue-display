import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export default async function middleware(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request);

  if (!user) {
    if (
      request.nextUrl.pathname === "/receptionist" ||
      request.nextUrl.pathname === "/doctor"
    ) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};