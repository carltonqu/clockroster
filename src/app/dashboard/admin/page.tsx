import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AdminDashboardClient } from "./admin-dashboard-client"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }

  const organizationId = session.user.organizationId

  // Fetch real data from database - filtered by organization
  const [employees, totalHoursAgg, pendingLeaveCount, unreadNotificationsCount] = await Promise.all([
    prisma.employee.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.timeEntry.aggregate({
      where: { 
        organizationId,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { overtimeMinutes: true }
    }),
    prisma.leaveRequest.count({
      where: { 
        organizationId,
        status: 'PENDING'
      }
    }),
    prisma.notification.count({
      where: { 
        organizationId,
        read: false
      }
    })
  ])

  const totalEmployees = employees.length
  const activeEmployees = employees.filter(e => e.employmentStatus === 'ACTIVE').length

  return (
    <DashboardLayout title="Admin Dashboard">
      <AdminDashboardClient 
        employees={employees}
        totalEmployees={totalEmployees}
        activeEmployees={activeEmployees}
        totalHours={Math.round((totalHoursAgg._sum.overtimeMinutes || 0) / 60)}
        pendingLeaveRequests={pendingLeaveCount}
        unreadNotifications={unreadNotificationsCount}
      />
    </DashboardLayout>
  )
}
