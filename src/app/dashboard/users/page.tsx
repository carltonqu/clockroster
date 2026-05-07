import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { UsersManagementClient } from "./users-management-client"

export default async function UsersManagementPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/auth/signin")
  }
  
  // Only admins can access user management
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }
  
  return (
    <DashboardLayout title="User Management">
      <UsersManagementClient />
    </DashboardLayout>
  )
}
