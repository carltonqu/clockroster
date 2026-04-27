import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AttendanceClient } from "./attendance-client"

export default async function AttendancePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const organizationId = session.user.organizationId

  // Fetch real data from database - filtered by organization
  const [entries, employees] = await Promise.all([
    prisma.timeEntry.findMany({
      where: { organizationId },
      orderBy: { date: 'desc' },
      take: 100
    }),
    prisma.employee.findMany({
      where: { organizationId },
      select: { id: true, fullName: true, employeeId: true }
    })
  ])

  return (
    <DashboardLayout title="Attendance">
      <AttendanceClient entries={entries} employees={employees} />
    </DashboardLayout>
  )
}
