import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, organizationName } = await req.json()

    // Validate input
    if (!name || !email || !password || !organizationName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      )
    }

    // Generate organization slug
    const slug = organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    // Check if slug exists
    const existingOrg = await prisma.organization.findUnique({
      where: { slug }
    })

    if (existingOrg) {
      return NextResponse.json(
        { error: "Organization name already taken" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create organization and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: organizationName,
          slug,
        }
      })

      // Create user as admin of the organization
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "ADMIN",
          organizationId: organization.id,
        }
      })

      return { user, organization }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      organization: {
        id: result.organization.id,
        name: result.organization.name,
        slug: result.organization.slug,
      }
    })

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    )
  }
}
