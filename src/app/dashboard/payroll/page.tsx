import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PayrollClient } from "./payroll-client";
import { mockPayrollEntries, mockEmployees } from "@/lib/mock-data";

export default function PayrollPage() {
  return (
    <DashboardLayout title="Payroll">
      <PayrollClient entries={mockPayrollEntries} employees={mockEmployees} />
    </DashboardLayout>
  );
}
