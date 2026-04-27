import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { EmployeesClient } from "./employees-client"

export default async function EmployeesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const organizationId = session.user.organizationId

  // Fetch real employees from database - filtered by organization
  const employees = await prisma.employee.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <DashboardLayout title="Employees">
      <EmployeesClient employees={employees} />
    </DashboardLayout>
  )
}
