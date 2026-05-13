import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { UsersManagementClient } from "./users-management-client"

export default function UsersManagementPage() {
  return (
    <DashboardLayout title="User Management">
      <UsersManagementClient />
    </DashboardLayout>
  )
}
