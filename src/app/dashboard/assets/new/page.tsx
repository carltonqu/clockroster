import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NewAssetClient } from "./new-asset-client";

export default function NewAssetPage() {
  return (
    <DashboardLayout title="Add New Asset">
      <NewAssetClient />
    </DashboardLayout>
  );
}
