import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PayrollClient } from "./payroll-client";
import { mockPayrollEntries, mockEmployees, mockCurrentUser } from "@/lib/mock-data";

export default function PayrollPage() {
  return (
    <DashboardLayout title="Payroll">
      <PayrollClient 
        entries={mockPayrollEntries} 
        employees={mockEmployees} 
        currentUserId={mockCurrentUser.id}
        userRole={mockCurrentUser.role}
      />
    </DashboardLayout>
  );
}
