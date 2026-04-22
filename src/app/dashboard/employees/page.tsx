import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EmployeesClient } from "./employees-client";
import { mockEmployees } from "@/lib/mock-data";

export default function EmployeesPage() {
  return (
    <DashboardLayout title="Employees">
      <EmployeesClient employees={mockEmployees} />
    </DashboardLayout>
  );
}
