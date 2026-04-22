import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SettingsClient } from "./settings-client";

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings">
      <SettingsClient />
    </DashboardLayout>
  );
}
