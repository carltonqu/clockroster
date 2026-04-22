"use client";

import { useState, useMemo } from "react";
import {
  Brain,
  Lightbulb,
  TrendingUp,
  Users,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  mockEmployees,
  mockTimeEntries,
  mockLeaveRequests,
} from "@/lib/mock-data";

interface Insight {
  type: "positive" | "neutral" | "negative";
  title: string;
  description: string;
  recommendation: string;
}

function InsightCard({
  insight,
  index,
}: {
  insight: Insight;
  index: number;
}) {
  const icons = {
    positive: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
    neutral: { icon: Minus, color: "text-blue-500", bg: "bg-blue-50" },
    negative: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
  };
  const style = icons[insight.type];
  const Icon = style.icon;

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className={`${style.bg} ${style.color} p-2 rounded-lg`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{insight.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
          <div className="flex items-start gap-2 mt-2 text-sm">
            <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{insight.recommendation}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  trend,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  trend?: string;
  icon: any;
  color: string;
}) {
  return (
    <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {trend && <p className="text-xs text-gray-400 mt-0.5">{trend}</p>}
          </div>
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AIInsightsClient() {
  const [aiLoading, setAiLoading] = useState(false);
  const [showAIReport, setShowAIReport] = useState(false);

  // Calculate metrics from mock data
  const totalEmployees = mockEmployees.length;
  const activeEmployees = mockEmployees.filter(
    (e) => e.employmentStatus === "Active"
  ).length;

  // Calculate attendance rate
  const today = new Date().toISOString().split("T")[0];
  const todayEntries = mockTimeEntries.filter((e) => e.date === today);
  const attendanceRate =
    totalEmployees > 0
      ? Math.round((todayEntries.length / totalEmployees) * 100)
      : 0;

  // Mock insights
  const insights: Insight[] = [
    {
      type: "positive",
      title: "High Attendance Rate",
      description:
        "Your team has maintained a 96% attendance rate this month, which is above industry average.",
      recommendation:
        "Continue recognizing punctual employees to maintain this positive trend.",
    },
    {
      type: "neutral",
      title: "Overtime Trends",
      description:
        "Overtime hours have increased by 12% compared to last month.",
      recommendation:
        "Review workload distribution and consider hiring additional staff if trend continues.",
    },
    {
      type: "negative",
      title: "Leave Requests Backlog",
      description:
        "There are 3 pending leave requests that require approval.",
      recommendation:
        "Process pending requests within 48 hours to maintain employee satisfaction.",
    },
  ];

  // Top performers
  const topPerformers = [
    { name: "John Smith", department: "Engineering", score: 98 },
    { name: "Sarah Johnson", department: "Design", score: 95 },
    { name: "Michael Chen", department: "Marketing", score: 92 },
  ];

  // Needs improvement
  const needsImprovement = [
    { name: "David Wilson", department: "Sales", score: 72 },
  ];

  // Monthly trend data
  const monthlyTrend = [
    { month: "Jan", attendance: 94, lateRate: 3, undertimeRate: 2 },
    { month: "Feb", attendance: 95, lateRate: 2, undertimeRate: 2 },
    { month: "Mar", attendance: 93, lateRate: 4, undertimeRate: 1 },
    { month: "Apr", attendance: 96, lateRate: 2, undertimeRate: 1 },
    { month: "May", attendance: 97, lateRate: 1, undertimeRate: 1 },
    { month: "Jun", attendance: 96, lateRate: 2, undertimeRate: 1 },
  ];

  // Department performance
  const departmentPerformance = [
    { name: "Engineering", attendanceRate: 98, lateRate: 1, undertimeRate: 0 },
    { name: "Design", attendanceRate: 96, lateRate: 2, undertimeRate: 1 },
    { name: "Marketing", attendanceRate: 94, lateRate: 3, undertimeRate: 2 },
    { name: "Sales", attendanceRate: 92, lateRate: 4, undertimeRate: 2 },
    { name: "HR", attendanceRate: 97, lateRate: 1, undertimeRate: 1 },
  ];

  const generateAIReport = () => {
    setAiLoading(true);
    setShowAIReport(true);
    setTimeout(() => {
      setAiLoading(false);
      toast.success("AI Performance Report generated!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Brain className="w-6 h-6 text-violet-600" />
                AI Workforce Insights
              </h1>
              <Badge className="bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-0">
                <Crown className="w-3 h-3 mr-1" /> Admin Only
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              AI-powered analytics and performance insights
            </p>
          </div>
        </div>
        <Button
          onClick={generateAIReport}
          disabled={aiLoading}
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {aiLoading ? "Analyzing..." : "Generate AI Report"}
        </Button>
      </div>

      {/* AI Report Loading */}
      {showAIReport && aiLoading && (
        <div className="flex flex-col items-center justify-center py-12 bg-white border border-gray-200 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Analyzing workforce data...
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            This may take a moment
          </p>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Employees"
          value={totalEmployees}
          trend={`${activeEmployees} active`}
          icon={Users}
          color="bg-blue-500"
        />
        <MetricCard
          label="Attendance Rate"
          value={`${attendanceRate}%`}
          trend="Above average"
          icon={CheckCircle2}
          color="bg-emerald-500"
        />
        <MetricCard
          label="Late Rate"
          value="2%"
          trend="Improved from 3%"
          icon={AlertTriangle}
          color="bg-orange-500"
        />
        <MetricCard
          label="Avg Performance"
          value="94 pts"
          trend="Top 10% industry"
          icon={TrendingUp}
          color="bg-violet-500"
        />
      </div>

      {/* Monthly Trend Chart */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Monthly Performance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyTrend}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                  width={34}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={false}
                  name="Attendance"
                />
                <Line
                  type="monotone"
                  dataKey="lateRate"
                  stroke="#ea580c"
                  strokeWidth={2.5}
                  dot={false}
                  name="Late Rate"
                />
                <Line
                  type="monotone"
                  dataKey="undertimeRate"
                  stroke="#ca8a04"
                  strokeWidth={2.5}
                  dot={false}
                  name="Undertime Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Key Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} index={index} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topPerformers.map((emp, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-500 font-semibold">
                      #{index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.department}</p>
                    </div>
                  </div>
                  <span className="text-emerald-600 font-semibold">
                    {emp.score} pts
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Needs Improvement */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-red-500" />
              Needs Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {needsImprovement.map((emp, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-red-500 font-semibold">
                      #{index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.department}</p>
                    </div>
                  </div>
                  <span className="text-red-600 font-semibold">
                    {emp.score} pts
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            Department Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {departmentPerformance.map((dept, index) => (
              <div
                key={index}
                className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{dept.name}</span>
                  <span className="text-emerald-600 font-semibold">
                    {dept.attendanceRate}%
                  </span>
                </div>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span className="text-orange-600">{dept.lateRate}% late</span>
                  <span className="text-yellow-600">
                    {dept.undertimeRate}% undertime
                  </span>
                </div>
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    style={{ width: `${dept.attendanceRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
