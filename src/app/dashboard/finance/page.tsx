import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FinanceClient } from "./finance-client";

export default function FinancePage() {
  return (
    <DashboardLayout title="Finance Summary">
      <FinanceClient />
    </DashboardLayout>
  );
}
