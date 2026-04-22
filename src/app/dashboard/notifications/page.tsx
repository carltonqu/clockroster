import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NotificationsClient } from "./notifications-client";
import { mockNotifications } from "@/lib/mock-data";

export default function NotificationsPage() {
  return (
    <DashboardLayout title="Notifications">
      <NotificationsClient notifications={mockNotifications} />
    </DashboardLayout>
  );
}
