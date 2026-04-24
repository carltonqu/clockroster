import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NewLeaveClient } from "./new-leave-client";

export default function NewLeavePage() {
  return (
    <DashboardLayout title="Request Leave">
      <NewLeaveClient />
    </DashboardLayout>
  );
}
