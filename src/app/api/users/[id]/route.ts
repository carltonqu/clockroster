import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { canManageAllUsers } from "@/lib/rbac"

// GET /api/users/[id] - Get specific user
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        department: true,
        position: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        supervisorId: true,
        supervisor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        employees: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
          }
        }
      }
    })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    // Check permissions
    if (session.user.role === "EMPLOYEE" && session.user.id !== params.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    
    if (session.user.role === "SUPERVISOR" && 
        user.supervisorId !== session.user.id && 
        session.user.id !== params.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    
    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    )
  }
}

// PATCH /api/users/[id] - Update user
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const body = await req.json()
    const { name, email, password, role, status, department, position, phone, supervisorId } = body
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })
    
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    // Permission checks
    const isAdmin = canManageAllUsers(session.user.role as any)
    const isSelf = session.user.id === params.id
    
    // Employees can only update their own profile (limited fields)
    if (session.user.role === "EMPLOYEE" && !isSelf) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    
    // Supervisors can update their employees or themselves
    if (session.user.role === "SUPERVISOR" && 
        !isSelf && 
        existingUser.supervisorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    
    // Build update data
    const updateData: any = {}
    
    if (name) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (department !== undefined) updateData.department = department
    if (position !== undefined) updateData.position = position
    
    // Only admins can update these fields
    if (isAdmin) {
      if (email) updateData.email = email
      if (role) updateData.role = role.toUpperCase()
      if (status) updateData.status = status.toUpperCase()
      if (supervisorId !== undefined) updateData.supervisorId = supervisorId
    }
    
    // Handle password update
    if (password) {
      // Users can update their own password, or admins can update any password
      if (isSelf || isAdmin) {
        updateData.password = await bcrypt.hash(password, 10)
      }
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        department: true,
        position: true,
        phone: true,
        updatedAt: true
      }
    })
    
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Delete user (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Only admins can delete users
    if (!canManageAllUsers(session.user.role as any)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    
    // Prevent deleting yourself
    if (session.user.id === params.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      )
    }
    
    await prisma.user.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", { status: 500 })
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}
