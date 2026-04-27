import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PayrollClient } from "./payroll-client"

export default async function PayrollPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const organizationId = session.user.organizationId

  // Fetch real data from database - filtered by organization
  const [entries, employees] = await Promise.all([
    prisma.payroll.findMany({
      where: { organizationId },
      include: { allowances: true, otherDeductions: true },
      orderBy: { periodStart: 'desc' }
    }),
    prisma.employee.findMany({
      where: { organizationId },
      select: { id: true, fullName: true, employeeId: true }
    })
  ])

  return (
    <DashboardLayout title="Payroll">
      <PayrollClient 
        entries={entries} 
        employees={employees} 
        currentUserId={session.user.id}
        userRole={session.user.role}
      />
    </DashboardLayout>
  )
}
