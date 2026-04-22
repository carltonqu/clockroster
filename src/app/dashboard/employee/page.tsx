import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EmployeeDashboardClient } from "./employee-dashboard-client";

export default function EmployeeDashboardPage() {
  return (
    <DashboardLayout title="My Dashboard">
      <EmployeeDashboardClient />
    </DashboardLayout>
  );
}
