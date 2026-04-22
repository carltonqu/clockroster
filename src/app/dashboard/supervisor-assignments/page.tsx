import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SupervisorAssignmentsClient } from "./supervisor-assignments-client";

export default function SupervisorAssignmentsPage() {
  return (
    <DashboardLayout title="Supervisor Assignments">
      <SupervisorAssignmentsClient />
    </DashboardLayout>
  );
}
