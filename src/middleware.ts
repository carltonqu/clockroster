import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session token from cookies
  const sessionToken = request.cookies.get("session_token")?.value;

  // Public paths that don't require authentication
  const publicPaths = ["/auth/login", "/auth/signup"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (sessionToken && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is not logged in and tries to access protected pages, redirect to login
  if (!sessionToken && !isPublicPath && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
