import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // If no token, redirect to signin (handled by withAuth)
    if (!token) {
      return NextResponse.next()
    }

    // Role-based access control
    const userRole = token.role as string
    
    // Define restricted routes by role
    const adminOnlyRoutes = [
      "/dashboard/admin",
      "/dashboard/employees",
      "/dashboard/payroll",
      "/dashboard/finance",
      "/dashboard/ai-insights",
      "/dashboard/scheduling",
      "/dashboard/supervisor-assignments",
    ]

    // Check if user is trying to access admin-only routes
    if (userRole === "EMPLOYEE") {
      const isAdminOnly = adminOnlyRoutes.some(route => 
        pathname === route || pathname.startsWith(`${route}/`)
      )
      
      if (isAdminOnly) {
        return NextResponse.redirect(new URL("/dashboard/employee", req.url))
      }
    }

    // Handle root dashboard redirect based on role
    if (pathname === "/dashboard") {
      if (userRole === "EMPLOYEE") {
        return NextResponse.redirect(new URL("/dashboard/employee", req.url))
      }
      return NextResponse.redirect(new URL("/dashboard/admin", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Protect all dashboard routes
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return token !== null
        }
        return true
      }
    },
    pages: {
      signIn: "/auth/signin",
    }
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
  ]
}
