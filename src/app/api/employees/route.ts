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

    // Create the employee
    const employee = await prisma.employee.create({
      data: {
        employeeId,
        organizationId,
        fullName: body.fullName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        department: body.department,
        position: body.position,
        employmentType: body.employmentType,
        employmentStatus: body.employmentStatus || "ACTIVE",
        hireDate: body.hireDate || new Date().toISOString().split("T")[0],
        workLocation: body.workLocation,
        workSchedule: body.workSchedule,
        manager: body.manager,
        salary: body.salary ? parseFloat(body.salary) : null,
        payFrequency: body.payFrequency,
        profilePhoto: body.profilePhoto,
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
