import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProfileClient } from "./profile-client";
import { mockEmployees, mockPayrollEntries, mockTimeEntries, mockSchedules } from "@/lib/mock-data";
import { notFound } from "next/navigation";

// Generate static params for all employees
export function generateStaticParams() {
  return mockEmployees.map((employee) => ({
    id: employee.id,
  }));
}

interface EmployeeProfilePageProps {
  params: {
    id: string;
  };
}

export default function EmployeeProfilePage({ params }: EmployeeProfilePageProps) {
  const employee = mockEmployees.find((e) => e.id === params.id);
  
  if (!employee) {
    notFound();
  }

  // Get related data for this employee
  const employeePayroll = mockPayrollEntries
    .filter((p) => p.userId === params.id)
    .slice(0, 3);
  
  const employeeTimeEntries = mockTimeEntries
    .filter((t) => t.userId === params.id)
    .slice(0, 5);
  
  const employeeSchedule = mockSchedules.find((s) => s.employeeId === params.id);

  return (
    <DashboardLayout title={`${employee.fullName} - Profile`}>
      <ProfileClient 
        employee={employee}
        payrollEntries={employeePayroll}
        timeEntries={employeeTimeEntries}
        schedule={employeeSchedule}
      />
    </DashboardLayout>
  );
}
