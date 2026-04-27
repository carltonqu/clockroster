import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NewEmployeeClient } from "./new-employee-client";

export default async function NewEmployeePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const organizationId = session.user.organizationId;

  // Get unique departments from existing employees
  const employees = await prisma.employee.findMany({
    where: { organizationId },
    select: { department: true },
  });

  const departments = Array.from(
    new Set(employees.map((e) => e.department).filter(Boolean))
  );

  return (
    <DashboardLayout title="Add New Employee">
      <NewEmployeeClient departments={departments} />
    </DashboardLayout>
  );
}
