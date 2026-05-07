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
  Target,
  Clock,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  BrainCircuit,
  FileText,
  Download,
  RefreshCw,
  Filter,
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
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  mockEmployees,
  mockTimeEntries,
  mockLeaveRequests,
  mockPayrollEntries,
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

// Extended mock data for AI insights
const productivityData = [
  { hour: "8AM", productivity: 75, energy: 80 },
  { hour: "9AM", productivity: 85, energy: 90 },
  { hour: "10AM", productivity: 95, energy: 95 },
  { hour: "11AM", productivity: 92, energy: 88 },
  { hour: "12PM", productivity: 78, energy: 70 },
  { hour: "1PM", productivity: 65, energy: 55 },
  { hour: "2PM", productivity: 82, energy: 75 },
  { hour: "3PM", productivity: 88, energy: 82 },
  { hour: "4PM", productivity: 85, energy: 78 },
  { hour: "5PM", productivity: 72, energy: 65 },
];

const skillRadarData = [
  { subject: "Technical", A: 85, B: 70, fullMark: 100 },
  { subject: "Communication", A: 78, B: 90, fullMark: 100 },
  { subject: "Leadership", A: 72, B: 85, fullMark: 100 },
  { subject: "Problem Solving", A: 90, B: 75, fullMark: 100 },
  { subject: "Collaboration", A: 82, B: 88, fullMark: 100 },
  { subject: "Innovation", A: 88, B: 72, fullMark: 100 },
];

const burnoutRiskData = [
  { name: "Low Risk", value: 32, color: "#10b981" },
  { name: "Medium Risk", value: 12, color: "#f59e0b" },
  { name: "High Risk", value: 4, color: "#ef4444" },
];

const turnoverPrediction = [
  { month: "Jul", probability: 5, predicted: 2 },
  { month: "Aug", probability: 8, predicted: 3 },
  { month: "Sep", probability: 6, predicted: 2 },
  { month: "Oct", probability: 12, predicted: 5 },
  { month: "Nov", probability: 10, predicted: 4 },
  { month: "Dec", probability: 15, predicted: 6 },
];

const sentimentData = [
  { date: "Week 1", positive: 72, neutral: 20, negative: 8 },
  { date: "Week 2", positive: 75, neutral: 18, negative: 7 },
  { date: "Week 3", positive: 68, neutral: 22, negative: 10 },
  { date: "Week 4", positive: 78, neutral: 15, negative: 7 },
];

export function AIInsightsClient() {
  const [aiLoading, setAiLoading] = useState(false);
  const [showAIReport, setShowAIReport] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  // Enhanced insights with more categories
  const insights: Insight[] = [
    {
      type: "positive",
      title: "High Attendance Rate",
      description:
        "Your team has maintained a 96% attendance rate this month, which is 8% above industry average.",
      recommendation:
        "Continue recognizing punctual employees to maintain this positive trend. Consider implementing a recognition program.",
    },
    {
      type: "positive",
      title: "Overtime Efficiency Improved",
      description:
        "Overtime hours decreased by 15% while maintaining productivity levels.",
      recommendation:
        "Your scheduling optimization is working. Share best practices across departments.",
    },
    {
      type: "neutral",
      title: "Mid-Day Productivity Dip",
      description:
        "Productivity analysis shows a 20% dip between 1-2 PM across all departments.",
      recommendation:
        "Consider flexible lunch schedules or short energizing breaks during this period.",
    },
    {
      type: "negative",
      title: "Burnout Risk Detected",
      description:
        "4 employees show elevated burnout indicators based on overtime patterns and leave usage.",
      recommendation:
        "Schedule 1:1 check-ins with at-risk employees. Review workload distribution immediately.",
    },
    {
      type: "negative",
      title: "Skills Gap in Engineering",
      description:
        "Emerging project requirements indicate a gap in cloud architecture skills.",
      recommendation:
        "Consider upskilling current team or hiring specialists. Training ROI: 340%.",
    },
  ];

  // Top performers with more metrics
  const topPerformers = [
    { name: "John Smith", department: "Engineering", score: 98, trend: "up", hours: 168 },
    { name: "Sarah Johnson", department: "Design", score: 95, trend: "up", hours: 160 },
    { name: "Michael Chen", department: "Marketing", score: 92, trend: "stable", hours: 165 },
    { name: "Emily Davis", department: "Sales", score: 91, trend: "up", hours: 172 },
    { name: "Robert Wilson", department: "Engineering", score: 90, trend: "up", hours: 170 },
  ];

  // Needs improvement with reasons
  const needsImprovement = [
    { name: "David Wilson", department: "Sales", score: 72, reason: "Attendance", trend: "down" },
    { name: "Lisa Anderson", department: "Marketing", score: 74, reason: "Punctuality", trend: "stable" },
    { name: "James Brown", department: "Operations", score: 76, reason: "Productivity", trend: "down" },
  ];

  // Monthly trend data with predictions
  const monthlyTrend = [
    { month: "Jan", attendance: 94, lateRate: 3, undertimeRate: 2, predicted: false },
    { month: "Feb", attendance: 95, lateRate: 2, undertimeRate: 2, predicted: false },
    { month: "Mar", attendance: 93, lateRate: 4, undertimeRate: 1, predicted: false },
    { month: "Apr", attendance: 96, lateRate: 2, undertimeRate: 1, predicted: false },
    { month: "May", attendance: 97, lateRate: 1, undertimeRate: 1, predicted: false },
    { month: "Jun", attendance: 96, lateRate: 2, undertimeRate: 1, predicted: false },
    { month: "Jul", attendance: 97, lateRate: 1.5, undertimeRate: 0.8, predicted: true },
    { month: "Aug", attendance: 96, lateRate: 2, undertimeRate: 1, predicted: true },
  ];

  // Department performance with detailed metrics
  const departmentPerformance = [
    { name: "Engineering", attendanceRate: 98, lateRate: 1, undertimeRate: 0, productivity: 94, satisfaction: 88 },
    { name: "Design", attendanceRate: 96, lateRate: 2, undertimeRate: 1, productivity: 91, satisfaction: 92 },
    { name: "Marketing", attendanceRate: 94, lateRate: 3, undertimeRate: 2, productivity: 87, satisfaction: 85 },
    { name: "Sales", attendanceRate: 92, lateRate: 4, undertimeRate: 2, productivity: 89, satisfaction: 82 },
    { name: "HR", attendanceRate: 97, lateRate: 1, undertimeRate: 1, productivity: 86, satisfaction: 90 },
    { name: "Operations", attendanceRate: 95, lateRate: 2.5, undertimeRate: 1.5, productivity: 88, satisfaction: 84 },
  ];

  const generateAIReport = () => {
    setAiLoading(true);
    setShowAIReport(true);
    setTimeout(() => {
      setAiLoading(false);
      toast.success("AI Performance Report generated and emailed!");
    }, 2500);
  };

  const runDeepAnalysis = () => {
    setIsAnalyzing(true);
    toast.info("Running deep workforce analysis...");
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("Analysis complete! 12 new insights found.");
    }, 3000);
  };

  const exportInsights = () => {
    toast.success("Insights report exported to PDF");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                AI Workforce Intelligence
              </h1>
              <Badge className="bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-0">
                <Crown className="w-3 h-3 mr-1" /> Admin Only
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Predictive analytics, sentiment analysis, and workforce optimization
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={exportInsights}
            className="border-gray-200"
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button
            onClick={runDeepAnalysis}
            disabled={isAnalyzing}
            variant="outline"
            className="border-violet-200 hover:bg-violet-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} /> 
            {isAnalyzing ? "Analyzing..." : "Deep Analysis"}
          </Button>
          <Button
            onClick={generateAIReport}
            disabled={aiLoading}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {aiLoading ? "Generating..." : "Full Report"}
          </Button>
        </div>
      </div>

      {/* AI Report Loading */}
      {showAIReport && aiLoading && (
        <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            AI is analyzing your workforce data...
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Processing attendance patterns, productivity metrics, and sentiment analysis
          </p>
          <div className="mt-4 flex gap-2">
            <Badge variant="secondary">Analyzing trends</Badge>
            <Badge variant="secondary">Detecting patterns</Badge>
            <Badge variant="secondary">Generating insights</Badge>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Team Sentiment"
          value="78%"
          trend="+5% from last month"
          icon={Brain}
          color="bg-violet-500"
        />
        <MetricCard
          label="Burnout Risk"
          value="4"
          trend="Employees flagged"
          icon={AlertTriangle}
          color="bg-red-500"
        />
        <MetricCard
          label="Productivity Score"
          value="87/100"
          trend="Peak: 10-11 AM"
          icon={Zap}
          color="bg-amber-500"
        />
        <MetricCard
          label="Retention Risk"
          value="12%"
          trend="3 employees at risk"
          icon={Target}
          color="bg-blue-500"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="w-4 h-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <TrendingUp className="w-4 h-4" /> Performance
          </TabsTrigger>
          <TabsTrigger value="productivity" className="gap-2">
            <Zap className="w-4 h-4" /> Productivity
          </TabsTrigger>
          <TabsTrigger value="predictions" className="gap-2">
            <BrainCircuit className="w-4 h-4" /> Predictions
          </TabsTrigger>
          <TabsTrigger value="wellbeing" className="gap-2">
            <Users className="w-4 h-4" /> Wellbeing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 m-0">

      {/* Monthly Trend Chart with Predictions */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Monthly Performance Trend
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1" /> Actual
              </Badge>
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 rounded-full bg-violet-400 mr-1" /> Predicted
              </Badge>
            </div>
          </div>
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
                  dot={(props: any) => props.payload.predicted ? <></> : <circle cx={props.cx} cy={props.cy} r={4} fill="#059669" />}
                  strokeDasharray={(props: any) => props.payload?.predicted ? "5 5" : "0"}
                  name="Attendance %"
                />
                <Line
                  type="monotone"
                  dataKey="lateRate"
                  stroke="#ea580c"
                  strokeWidth={2}
                  dot={false}
                  name="Late Rate %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              AI-Generated Insights
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {insights.length} insights found
            </Badge>
          </div>
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                Top Performers
              </CardTitle>
              <Badge variant="outline" className="text-xs">This Month</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topPerformers.map((emp, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-500 font-semibold w-6">
                      #{index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.department} • {emp.hours} hrs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-600 font-semibold block">{emp.score} pts</span>
                    <span className={`text-xs ${emp.trend === 'up' ? 'text-emerald-500' : 'text-gray-400'}`}>
                      {emp.trend === 'up' ? '↑ Improving' : '→ Stable'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Needs Improvement */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 text-red-500" />
                Needs Attention
              </CardTitle>
              <Badge variant="destructive" className="text-xs">Action Required</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {needsImprovement.map((emp, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-red-500 font-semibold w-6">
                      #{index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.department} • {emp.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-red-600 font-semibold block">{emp.score} pts</span>
                    <span className={`text-xs ${emp.trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                      {emp.trend === 'down' ? '↓ Declining' : '→ Stable'}
                    </span>
                  </div>
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
            Department Performance Matrix
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
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">
                      {dept.attendanceRate}%
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-2">
                  <span>Prod: <span className="text-blue-600">{dept.productivity}%</span></span>
                  <span>Sat: <span className="text-emerald-600">{dept.satisfaction}%</span></span>
                </div>
                <div className="flex gap-1 text-xs">
                  <span className="text-orange-600">{dept.lateRate}% late</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-yellow-600">{dept.undertimeRate}% undertime</span>
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
      </TabsContent>

      {/* Performance Tab */}
      <TabsContent value="performance" className="space-y-6 m-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                Skill Distribution Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    <Radar name="Current Team" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                    <Radar name="Industry Avg" dataKey="B" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Performance Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Exceptional (90-100)</span>
                    <span className="font-medium">12 employees</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Good (80-89)</span>
                    <span className="font-medium">24 employees</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Average (70-79)</span>
                    <span className="font-medium">8 employees</span>
                  </div>
                  <Progress value={17} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Below Average (&lt;70)</span>
                    <span className="font-medium">4 employees</span>
                  </div>
                  <Progress value={8} className="h-2 bg-red-100" />
                </div>
              </div>
              <div className="mt-6 p-4 bg-violet-50 rounded-lg">
                <p className="text-sm font-medium text-violet-900">AI Recommendation</p>
                <p className="text-xs text-violet-700 mt-1">
                  67% of your workforce is performing above average. Focus mentoring efforts on the 8 employees in the below-average category.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Productivity Tab */}
      <TabsContent value="productivity" className="space-y-6 m-0">
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Daily Productivity & Energy Patterns
            </CardTitle>
            <CardDescription>Optimal work hours and energy levels throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="productivity" name="Productivity %" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="energy" name="Energy Level %" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg text-center">
                <p className="text-lg font-bold text-emerald-600">10-11 AM</p>
                <p className="text-xs text-gray-600">Peak Productivity</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg text-center">
                <p className="text-lg font-bold text-red-600">1-2 PM</p>
                <p className="text-xs text-gray-600">Lowest Dip</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-lg font-bold text-blue-600">3-4 PM</p>
                <p className="text-xs text-gray-600">Recovery Period</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Predictions Tab */}
      <TabsContent value="predictions" className="space-y-6 m-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-violet-500" />
                Turnover Risk Prediction
              </CardTitle>
              <CardDescription>ML-based prediction of employee attrition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={turnoverPrediction}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="predicted" name="Predicted Departures" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="font-medium text-red-900">High Risk Alert</span>
                </div>
                <p className="text-sm text-red-700">
                  3 employees in Engineering show elevated turnover risk. Recommend retention conversations within 2 weeks.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                Sentiment Analysis Trend
              </CardTitle>
              <CardDescription>Employee sentiment based on feedback and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="positive" name="Positive" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="neutral" name="Neutral" stroke="#6b7280" strokeWidth={2} />
                    <Line type="monotone" dataKey="negative" name="Negative" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Wellbeing Tab */}
      <TabsContent value="wellbeing" className="space-y-6 m-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Burnout Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {burnoutRiskData.map((item, index) => (
                  <div key={index} className="text-center p-4 rounded-xl" style={{ backgroundColor: `${item.color}15` }}>
                    <p className="text-3xl font-bold" style={{ color: item.color }}>{item.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{item.name}</p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: `${(item.value / 48) * 100}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <p className="font-medium text-amber-900">Wellbeing Insights</p>
                <ul className="mt-2 space-y-1 text-sm text-amber-700">
                  <li>• 4 employees working &gt;50 hrs/week consistently</li>
                  <li>• 3 employees haven&apos;t taken leave in 6+ months</li>
                  <li>• Weekend work up 23% compared to last quarter</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Work-Life Balance Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                    <circle cx="64" cy="64" r="56" stroke="#f59e0b" strokeWidth="12" fill="none" strokeDasharray="351.86" strokeDashoffset="88" strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-3xl font-bold text-gray-900">72</p>
                    <p className="text-xs text-gray-500">out of 100</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Overall work-life balance is <span className="font-medium text-amber-600">moderate</span>. 
                  4 employees need immediate attention.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
    </div>
  );
}
