import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardClient } from "./dashboard-client";
import {
  mockCurrentUser,
  mockDashboardStats,
  mockTimeEntries,
  mockNotifications,
  mockPayrollEntries,
} from "@/lib/mock-data";

export default function DashboardPage() {
  // Get recent entries (last 5)
  const recentEntries = mockTimeEntries.slice(0, 5).map((e) => ({
    ...e,
    clockIn: e.clockIn,
    clockOut: e.clockOut,
  }));

  // Get notifications
  const notifications = mockNotifications.map((n) => ({
    ...n,
    createdAt: n.createdAt,
  }));

  // Get last payroll
  const lastPayroll = mockPayrollEntries[0]?.netPay ?? null;

  const stats = {
    totalHours: mockDashboardStats.totalHoursThisMonth,
    overtimeHours: mockDashboardStats.overtimeHours,
    unreadNotifications: mockDashboardStats.unreadNotifications,
    lastPayroll,
  };

  return (
    <DashboardLayout title="Dashboard">
      <DashboardClient
        user={mockCurrentUser}
        stats={stats}
        recentEntries={recentEntries}
        notifications={notifications}
        isCurrentlyClockedIn={false}
      />
    </DashboardLayout>
  );
}
