import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { NotificationsClient } from "./notifications-client"

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const organizationId = session.user.organizationId
  const userId = session.user.id

  // Fetch real notifications from database - filtered by organization and user
  const notifications = await prisma.notification.findMany({
    where: {
      organizationId,
      userId
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <DashboardLayout title="Notifications">
      <NotificationsClient notifications={notifications} />
    </DashboardLayout>
  )
}
