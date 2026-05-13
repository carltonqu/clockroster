import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ROLE_HOME, ROUTE_ACCESS } from "@/lib/rbac";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(?:jpg|jpeg|gif|png|svg|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Allow public auth pages
  if (
    pathname.startsWith("/auth/signin") ||
    pathname.startsWith("/auth/signup") ||
    pathname.startsWith("/auth/forgot-password") ||
    pathname.startsWith("/auth/reset-password") ||
    pathname.startsWith("/auth/error")
  ) {
    // If already logged in, redirect to dashboard
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    if (token) {
      const role = (token.role as "ADMIN" | "SUPERVISOR" | "EMPLOYEE") || "EMPLOYEE";
      return NextResponse.redirect(new URL(ROLE_HOME[role], req.url));
    }
    
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });
  
  if (!token) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const role = (token.role as "ADMIN" | "SUPERVISOR" | "EMPLOYEE") || "EMPLOYEE";

  // Redirect root dashboard to role-specific home
  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(ROLE_HOME[role], req.url));
  }

  // Check route access permissions
  const rule = ROUTE_ACCESS.find(
    (r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`)
  );

  if (rule && !rule.roles.includes(role)) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], req.url));
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
