import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardClient } from "./dashboard-client";
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getSession();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <DashboardLayout title="Dashboard" user={user}>
      <DashboardClient
        user={{
          id: user.id,
          name: user.email.split("@")[0],
          email: user.email,
          role: "ADMIN",
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
