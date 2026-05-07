import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { canManageAllUsers, canManageUsers } from "@/lib/rbac"

// GET /api/users - List users (Admin sees all, Supervisor sees their employees)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { searchParams } = new URL(req.url)
    const role = searchParams.get("role")
    const status = searchParams.get("status")
    
    const where: any = {}
    
    // Filter by role if provided
    if (role) {
      where.role = role.toUpperCase()
    }
    
    // Filter by status if provided
    if (status) {
      where.status = status.toUpperCase()
    }
    
    // Role-based filtering
    if (session.user.role === "SUPERVISOR") {
      // Supervisors can only see employees they manage
      where.supervisorId = session.user.id
    } else if (session.user.role === "EMPLOYEE") {
      // Employees can't see other users
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    // Admins see all users (no additional filter)
    
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        department: true,
        position: true,
        createdAt: true,
        lastLoginAt: true,
        supervisorId: true,
        supervisor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            employees: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

// POST /api/users - Create new user (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Only admins can create users
    if (!canManageAllUsers(session.user.role as any)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    
    const body = await req.json()
    const { email, name, password, role, department, position, supervisorId } = body
    
    // Validate required fields
    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role.toUpperCase(),
        department,
        position,
        supervisorId,
        createdBy: session.user.id
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        department: true,
        position: true,
        createdAt: true
      }
    })
    
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}
