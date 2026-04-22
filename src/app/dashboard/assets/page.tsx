import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AssetsClient } from "./assets-client";
import { mockAssets, mockAssetAssignments, mockEmployees } from "@/lib/mock-data";

export default function AssetsPage() {
  return (
    <DashboardLayout title="Assets">
      <AssetsClient
        assets={mockAssets}
        assignments={mockAssetAssignments}
        employees={mockEmployees}
      />
    </DashboardLayout>
  );
}
