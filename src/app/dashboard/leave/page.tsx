import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { LeaveClient } from "./leave-client";
import { mockLeaveRequests, mockEmployees } from "@/lib/mock-data";

export default function LeavePage() {
  return (
    <DashboardLayout title="Leave Management">
      <LeaveClient requests={mockLeaveRequests} employees={mockEmployees} />
    </DashboardLayout>
  );
}
