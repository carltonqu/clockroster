import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SupervisorDashboardClient } from "./supervisor-dashboard-client";

export default function SupervisorDashboardPage() {
  return (
    <DashboardLayout title="Supervisor Dashboard">
      <SupervisorDashboardClient />
    </DashboardLayout>
  );
}
