import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NewShiftClient } from "./new-shift-client";
import { mockEmployees } from "@/lib/mock-data";

export default function NewShiftPage() {
  return (
    <DashboardLayout title="Add New Shift">
      <NewShiftClient employees={mockEmployees} />
    </DashboardLayout>
  );
}
