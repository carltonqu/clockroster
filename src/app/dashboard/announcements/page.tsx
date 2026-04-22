import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AnnouncementsClient } from "./announcements-client";

export default function AnnouncementsPage() {
  return (
    <DashboardLayout title="Announcements">
      <AnnouncementsClient />
    </DashboardLayout>
  );
}
