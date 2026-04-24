import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NewEmployeeClient } from "./new-employee-client";
import { mockEmployees } from "@/lib/mock-data";

export default function NewEmployeePage() {
  // Get unique departments for the form
  const departments = Array.from(new Set(mockEmployees.map(e => e.department).filter(Boolean)));
  
  return (
    <DashboardLayout title="Add New Employee">
      <NewEmployeeClient departments={departments} />
    </DashboardLayout>
  );
}
