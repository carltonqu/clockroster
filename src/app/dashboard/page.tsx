import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardClient } from "./dashboard-client";
import { mockCurrentUser } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <DashboardClient
        user={{
          id: mockCurrentUser.id,
          name: mockCurrentUser.name,
          email: mockCurrentUser.email,
          role: mockCurrentUser.role,
          tier: "Pro",
        }}
        stats={{
          totalHours: 0,
          overtimeHours: 0,
          unreadNotifications: 0,
          lastPayroll: null,
        }}
        recentEntries={[]}
        notifications={[]}
        isCurrentlyClockedIn={false}
      />
    </DashboardLayout>
  );
}
