import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SchedulingClient } from "./scheduling-client"

export default async function SchedulingPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const organizationId = session.user.organizationId

  // Fetch real data from database - filtered by organization
  const [schedules, employees] = await Promise.all([
    prisma.schedule.findMany({
      where: { organizationId },
      include: { shifts: true },
      orderBy: { weekStart: 'desc' }
    }),
    prisma.employee.findMany({
      where: { organizationId },
      select: { id: true, fullName: true, employeeId: true }
    })
  ])

  return (
    <DashboardLayout title="Scheduling">
      <SchedulingClient schedules={schedules} employees={employees} />
    </DashboardLayout>
  )
}
