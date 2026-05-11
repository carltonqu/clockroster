import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardClient } from "./dashboard-client";

async function getDashboardData(organizationId: string) {
  // Get employee count
  const employeeCount = await prisma.user.count({
    where: { organizationId },
  });

  return {
    employeeCount: Number(employeeCount),
    recentEntries: [],
    notifications: [],
    stats: {
      totalHours: 0,
      overtimeHours: 0,
      unreadNotifications: 0,
      lastPayroll: null,
    },
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { organization: true },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const data = await getDashboardData(user.organizationId);

  return (
    <DashboardLayout title="Dashboard">
      <DashboardClient
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tier: "Pro",
        }}
        stats={data.stats}
        recentEntries={data.recentEntries}
        notifications={data.notifications}
        isCurrentlyClockedIn={false}
      />
    </DashboardLayout>
  );
}
