import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Mock user role - in production this would come from session/token
// For demo purposes, we're using the mock data role
// NOTE: Update this to match mockCurrentUser.role in mock-data.ts
const MOCK_USER_ROLE = "EMPLOYEE"; // Change to "MANAGER" or "ADMIN" to test admin access

// Define role hierarchy
const ROLE_HIERARCHY = {
  EMPLOYEE: 1,
  MANAGER: 2,
  HR: 3,
  ADMIN: 4,
};

type UserRole = keyof typeof ROLE_HIERARCHY;

// Routes that are restricted to specific roles
const RESTRICTED_ROUTES: Record<string, UserRole[]> = {
  // Admin/Manager only routes
  "/dashboard/employees": ["MANAGER", "HR", "ADMIN"],
  "/dashboard/scheduling": ["MANAGER", "HR", "ADMIN"],
  "/dashboard/payroll": ["MANAGER", "HR", "ADMIN"],
  "/dashboard/finance": ["MANAGER", "HR", "ADMIN"],
  "/dashboard/ai-insights": ["MANAGER", "HR", "ADMIN"],
  "/dashboard/supervisor-assignments": ["MANAGER", "HR", "ADMIN"],
  "/dashboard/admin": ["MANAGER", "HR", "ADMIN"],
  // Employee routes - accessible by all
  "/dashboard/attendance": ["EMPLOYEE", "MANAGER", "HR", "ADMIN"],
  "/dashboard/assets": ["EMPLOYEE", "MANAGER", "HR", "ADMIN"],
  "/dashboard/leave": ["EMPLOYEE", "MANAGER", "HR", "ADMIN"],
  "/dashboard/notifications": ["EMPLOYEE", "MANAGER", "HR", "ADMIN"],
  "/dashboard/settings": ["EMPLOYEE", "MANAGER", "HR", "ADMIN"],
  "/dashboard/announcements": ["EMPLOYEE", "MANAGER", "HR", "ADMIN"],
};

// Routes that should redirect employees to their dashboard
const ADMIN_ONLY_ROUTES = [
  "/dashboard/employees",
  "/dashboard/scheduling",
  "/dashboard/payroll",
  "/dashboard/finance",
  "/dashboard/ai-insights",
  "/dashboard/supervisor-assignments",
  "/dashboard/admin",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect dashboard routes
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Get user role from cookie or header (in production)
  // For demo, we'll use the mock role - in real app this would come from auth token
  const userRole = (request.cookies.get("user-role")?.value || MOCK_USER_ROLE) as UserRole;

  // Check if accessing root dashboard
  if (pathname === "/dashboard") {
    // Employees should be redirected to their specific dashboard
    if (userRole === "EMPLOYEE") {
      return NextResponse.redirect(new URL("/dashboard/employee", request.url));
    }
    return NextResponse.next();
  }

  // Check if employee is trying to access admin-only routes
  if (userRole === "EMPLOYEE") {
    const isAdminOnlyRoute = ADMIN_ONLY_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isAdminOnlyRoute) {
      // Redirect employee to their dashboard
      return NextResponse.redirect(new URL("/dashboard/employee", request.url));
    }
  }

  // Check specific route permissions
  for (const [route, allowedRoles] of Object.entries(RESTRICTED_ROUTES)) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      if (!allowedRoles.includes(userRole)) {
        // User doesn't have permission - redirect to appropriate dashboard
        const redirectUrl = userRole === "EMPLOYEE" ? "/dashboard/employee" : "/dashboard";
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all dashboard routes except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/dashboard/:path*",
  ],
};
