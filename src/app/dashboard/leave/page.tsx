import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LeaveClient } from "./leave-client"

export default async function LeavePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const organizationId = session.user.organizationId

  // Fetch real data from database - filtered by organization
  const [requests, employees] = await Promise.all([
    prisma.leaveRequest.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.employee.findMany({
      where: { organizationId },
      select: { id: true, fullName: true, employeeId: true }
    })
  ])

  return (
    <DashboardLayout title="Leave Management">
      <LeaveClient requests={requests} employees={employees} />
    </DashboardLayout>
  )
}
