import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NewAnnouncementClient } from "./new-announcement-client";

export default function NewAnnouncementPage() {
  return (
    <DashboardLayout title="New Announcement">
      <NewAnnouncementClient />
    </DashboardLayout>
  );
}
