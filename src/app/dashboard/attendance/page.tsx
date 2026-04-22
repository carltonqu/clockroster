import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AttendanceClient } from "./attendance-client";
import { mockTimeEntries, mockEmployees } from "@/lib/mock-data";

export default function AttendancePage() {
  return (
    <DashboardLayout title="Attendance">
      <AttendanceClient entries={mockTimeEntries} employees={mockEmployees} />
    </DashboardLayout>
  );
}
