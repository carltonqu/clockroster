import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SchedulingClient } from "./scheduling-client";
import { mockSchedules, mockEmployees } from "@/lib/mock-data";

export default function SchedulingPage() {
  return (
    <DashboardLayout title="Scheduling">
      <SchedulingClient schedules={mockSchedules} employees={mockEmployees} />
    </DashboardLayout>
  );
}
