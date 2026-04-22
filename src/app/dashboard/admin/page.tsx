import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AdminDashboardClient } from "./admin-dashboard-client";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout title="Admin Dashboard">
      <AdminDashboardClient />
    </DashboardLayout>
  );
}
