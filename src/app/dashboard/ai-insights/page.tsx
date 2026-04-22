import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AIInsightsClient } from "./ai-insights-client";

export default function AIInsightsPage() {
  return (
    <DashboardLayout title="AI Insights">
      <AIInsightsClient />
    </DashboardLayout>
  );
}
