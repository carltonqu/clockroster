import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - List all employees for the organization
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = session.user.organizationId;

    const employees = await prisma.employee.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

// POST - Create a new employee
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = session.user.organizationId;
    const body = await request.json();

    // Generate employee ID (EMP001, EMP002, etc.)
    const lastEmployee = await prisma.employee.findFirst({
      where: { organizationId },
      orderBy: { employeeId: "desc" },
    });

    let nextNumber = 1;
    if (lastEmployee) {
      const match = lastEmployee.employeeId.match(/EMP(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }
    const employeeId = `EMP${String(nextNumber).padStart(3, "0")}`;

    // Map employment type to enum
    const employmentTypeMap: Record<string, string> = {
      "Full-time": "FULL_TIME",
      "Part-time": "PART_TIME",
      "Contract": "CONTRACT",
      "Intern": "INTERN",
    };

    // Map employment status to enum
    const employmentStatusMap: Record<string, string> = {
      "Active": "ACTIVE",
      "Inactive": "INACTIVE",
      "On Leave": "ON_LEAVE",
    };

    // Map pay frequency to rate type
    const rateTypeMap: Record<string, string> = {
      "Monthly": "MONTHLY",
      "Bi-weekly": "MONTHLY",
      "Weekly": "DAILY",
    };

    // Create the employee with correct schema fields
    const employee = await prisma.employee.create({
      data: {
        employeeId,
        organizationId,
        fullName: body.fullName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        department: body.department,
        position: body.position,
        employmentType: (employmentTypeMap[body.employmentType] || "FULL_TIME") as any,
        employmentStatus: (employmentStatusMap[body.employmentStatus] || "ACTIVE") as any,
        hireDate: body.hireDate ? new Date(body.hireDate) : new Date(),
        address: body.workLocation ? `Location: ${body.workLocation}` : undefined,
        emergencyContact: body.manager ? `Manager: ${body.manager}` : undefined,
        rate: body.salary ? parseFloat(body.salary) : 0,
        rateType: (rateTypeMap[body.payFrequency] || "MONTHLY") as any,
        profilePhoto: body.profilePhoto,
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
