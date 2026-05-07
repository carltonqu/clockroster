"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  TrendingUp,
  DollarSign,
  Building2,
  Download,
  Search,
  ChevronDown,
  Crown,
  FileText,
  Calendar,
  Filter,
  Printer,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PieChartIcon,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import {
  mockPayrollEntries,
  mockEmployees,
} from "@/lib/mock-data";

const fmt = (n: number) =>
  `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function sumField(arr: any[], key: string): number {
  return arr.reduce((acc, e) => acc + (e[key] || 0), 0);
}

function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
  prefix = "",
}: {
  icon: any;
  label: string;
  value: number;
  gradient: string;
  prefix?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1">
      <div
        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`}
      />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            {label}
          </p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {prefix}
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`bg-gradient-to-br ${gradient} p-2.5 rounded-xl shadow-md`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const PIE_COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b"];

// Budget vs Actual mock data
const budgetData = [
  { department: "Engineering", budget: 150000, actual: 142000, variance: -5.3 },
  { department: "Sales", budget: 80000, actual: 87500, variance: 9.4 },
  { department: "Marketing", budget: 60000, actual: 58000, variance: -3.3 },
  { department: "HR", budget: 45000, actual: 42000, variance: -6.7 },
  { department: "Operations", budget: 70000, actual: 73500, variance: 5.0 },
];

// Cost projections
const projectionData = [
  { month: "Jul", projected: 485000, actual: null },
  { month: "Aug", projected: 490000, actual: null },
  { month: "Sep", projected: 495000, actual: null },
  { month: "Oct", projected: 505000, actual: null },
  { month: "Nov", projected: 510000, actual: null },
  { month: "Dec", projected: 520000, actual: null },
];

// Payroll compliance metrics
const complianceData = [
  { label: "SSS Contributions", completed: 45, total: 48, status: "on_track" },
  { label: "PhilHealth", completed: 48, total: 48, status: "complete" },
  { label: "Pag-IBIG", completed: 48, total: 48, status: "complete" },
  { label: "Tax Filing", completed: 12, total: 12, status: "complete" },
  { label: "13th Month", completed: 0, total: 48, status: "pending" },
];

export function FinanceClient() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [detailTab, setDetailTab] = useState<"department" | "employee">(
    "department"
  );
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [activeReportTab, setActiveReportTab] = useState("overview");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const departments = useMemo(() => {
    const depts = new Set(
      mockEmployees.map((e) => e.department).filter(Boolean)
    );
    return ["All", ...Array.from(depts).sort()];
  }, []);

  const filtered = useMemo(() => {
    return mockPayrollEntries.filter((entry) => {
      const entryMonth = new Date(entry.periodStart).toISOString().slice(0, 7);
      if (selectedMonth && entryMonth !== selectedMonth) return false;
      if (selectedStatus !== "All" && entry.status !== selectedStatus)
        return false;
      const emp = mockEmployees.find((e) => e.fullName === entry.employeeName);
      if (selectedDepartment !== "All" && emp?.department !== selectedDepartment)
        return false;
      return true;
    });
  }, [selectedMonth, selectedDepartment, selectedStatus]);

  const totals = useMemo(() => {
    const grossPay = sumField(filtered, "grossPay");
    const netPay = sumField(filtered, "netPay");
    const deductions = sumField(filtered, "deductions");
    const basicPay = sumField(filtered, "basicPay");
    const otPay = sumField(filtered, "otPay");

    return {
      employeeCount: new Set(filtered.map((e) => e.userId)).size,
      basicPay,
      otPay,
      grossPay,
      deductions,
      netPay,
    };
  }, [filtered]);

  const trendData = useMemo(() => {
    const months: { key: string; label: string }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: d.toISOString().slice(0, 7),
        label: MONTH_LABELS[d.getMonth()],
      });
    }
    return months.map(({ key, label }) => {
      const monthEntries = mockPayrollEntries.filter(
        (e) => new Date(e.periodStart).toISOString().slice(0, 7) === key
      );
      return {
        month: label,
        gross: Math.round(sumField(monthEntries, "grossPay")),
        net: Math.round(sumField(monthEntries, "netPay")),
      };
    });
  }, []);

  const pieData = useMemo(() => {
    const data = [
      { name: "Basic Pay", value: Math.round(totals.basicPay) },
      { name: "Overtime", value: Math.round(totals.otPay) },
      { name: "Allowances", value: Math.round(totals.grossPay - totals.basicPay - totals.otPay) },
    ];
    return data.filter((d) => d.value > 0);
  }, [totals]);

  const byDepartment = useMemo(() => {
    const map = new Map<
      string,
      {
        department: string;
        employeeCount: number;
        grossPay: number;
        deductions: number;
        netPay: number;
      }
    >();
    filtered.forEach((e) => {
      const emp = mockEmployees.find((em) => em.fullName === e.employeeName);
      const dept = emp?.department || "Unknown";
      if (!map.has(dept))
        map.set(dept, {
          department: dept,
          employeeCount: 0,
          grossPay: 0,
          deductions: 0,
          netPay: 0,
        });
      const row = map.get(dept)!;
      row.employeeCount += 1;
      row.grossPay += e.grossPay;
      row.deductions += e.totalDeductions;
      row.netPay += e.netPay;
    });
    return Array.from(map.values()).sort((a, b) => b.netPay - a.netPay);
  }, [filtered]);

  const byEmployee = useMemo(() => {
    return filtered
      .map((e) => ({
        name: e.employeeName,
        grossPay: e.grossPay,
        deductions: e.totalDeductions,
        netPay: e.netPay,
        status: e.status,
      }))
      .filter((e) =>
        e.name.toLowerCase().includes(employeeSearch.toLowerCase())
      )
      .sort((a, b) => b.netPay - a.netPay);
  }, [filtered, employeeSearch]);

  const exportCSV = () => {
    // Generate CSV content
    const headers = ["Employee", "Department", "Gross Pay", "Deductions", "Net Pay", "Status"];
    const rows = filtered.map((entry) => {
      const emp = mockEmployees.find((e) => e.fullName === entry.employeeName);
      return [
        entry.employeeName,
        emp?.department || "Unknown",
        entry.grossPay.toFixed(2),
        entry.totalDeductions.toFixed(2),
        entry.netPay.toFixed(2),
        entry.status,
      ];
    });
    
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payroll-report-${selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };

  const printReport = () => {
    toast.success("Sending to printer...");
    window.print();
  };

  const generatePDF = () => {
    toast.info("PDF generation started...");
    setTimeout(() => {
      toast.success("PDF report generated!");
    }, 1500);
  };

  const selectCls =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none";

  // Calculate year-over-year growth
  const yoyGrowth = 8.5;
  const avgSalary = totals.employeeCount > 0 ? totals.grossPay / totals.employeeCount : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Financial Reports
              </h1>
              <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-0">
                <Crown className="w-3 h-3 mr-1" /> Admin Only
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Comprehensive payroll analytics, budgets, and compliance tracking
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={exportCSV}
            className="border-blue-200 hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={generatePDF}
            className="border-purple-200 hover:bg-purple-50"
          >
            <FileText className="w-4 h-4 mr-2" /> Export PDF
          </Button>
          <Button
            variant="outline"
            onClick={printReport}
            className="border-gray-200 hover:bg-gray-50"
          >
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
        </div>
      </div>

      {/* Report Tabs */}
      <Tabs value={activeReportTab} onValueChange={setActiveReportTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="budget" className="gap-2">
            <Target className="w-4 h-4" /> Budget
          </TabsTrigger>
          <TabsTrigger value="projections" className="gap-2">
            <TrendingUp className="w-4 h-4" /> Projections
          </TabsTrigger>
          <TabsTrigger value="compliance" className="gap-2">
            <CheckCircle2 className="w-4 h-4" /> Compliance
          </TabsTrigger>
        </TabsList>

      <TabsContent value="overview" className="space-y-6 m-0">
      {/* Enhanced Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Active Employees"
          value={totals.employeeCount}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={DollarSign}
          label="Total Gross Pay"
          value={Math.round(totals.grossPay)}
          prefix="$"
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={Wallet}
          label="Total Net Pay"
          value={Math.round(totals.netPay)}
          prefix="$"
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={Building2}
          label="Total Deductions"
          value={Math.round(totals.deductions)}
          prefix="$"
          gradient="from-orange-500 to-yellow-500"
        />
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Avg. Salary</p>
                <p className="text-xl font-bold text-gray-900">${avgSalary.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">YOY Growth</p>
                <p className="text-xl font-bold text-emerald-600 flex items-center gap-1">
                  +{yoyGrowth}%
                  <ArrowUpRight className="w-4 h-4" />
                </p>
              </div>
              <div className="bg-emerald-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Overtime Cost</p>
                <p className="text-xl font-bold text-gray-900">${Math.round(totals.otPay).toLocaleString()}</p>
              </div>
              <div className="bg-amber-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Tax Withheld</p>
                <p className="text-xl font-bold text-gray-900">${Math.round(sumField(filtered, 'withholdingTax')).toLocaleString()}</p>
              </div>
              <div className="bg-red-100 p-2 rounded-lg">
                <Target className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={selectCls}
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={selectCls}
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const d = new Date();
                  d.setMonth(d.getMonth() - i);
                  const key = d.toISOString().slice(0, 7);
                  return (
                    <option key={key} value={key}>
                      {MONTH_LABELS[d.getMonth()]} {d.getFullYear()}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className={selectCls}
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={selectCls}
              >
                <option value="All">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="APPROVED">Approved</option>
                <option value="RELEASED">Released</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-50">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              6-Month Payroll Trend
            </CardTitle>
            <CardDescription>Gross vs Net pay comparison</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(v) => fmt(Number(v))} />
                  <Legend />
                  <Bar
                    dataKey="gross"
                    name="Gross Pay"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="net"
                    name="Net Pay"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-50">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-blue-500" />
              Pay Distribution
            </CardTitle>
            <CardDescription>Breakdown of earnings components</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name}: ${(Number(percent) * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Tabs */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-4 border-b border-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              Detailed Breakdown
            </CardTitle>
            <div className="flex gap-2">
              {[
                { id: "department", label: "By Department" },
                { id: "employee", label: "By Employee" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setDetailTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    detailTab === t.id
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {detailTab === "employee" && (
            <div className="p-4 border-b border-gray-100">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className={`${selectCls} pl-9`}
                />
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {detailTab === "department" ? "Department" : "Employee"}
                  </th>
                  {detailTab === "department" && (
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Employees
                    </th>
                  )}
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Gross Pay
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Deductions
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Net Pay
                  </th>
                </tr>
              </thead>
              <tbody>
                {(detailTab === "department" ? byDepartment : byEmployee).map(
                  (row: any, i: number) => (
                    <tr
                      key={i}
                      className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {detailTab === "employee" ? (
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                              {row.name.charAt(0)}
                            </div>
                            <span>{row.name}</span>
                          </div>
                        ) : (
                          row.department
                        )}
                      </td>
                      {detailTab === "department" && (
                        <td className="px-6 py-4 text-right">
                          {row.employeeCount}
                        </td>
                      )}
                      <td className="px-6 py-4 text-right font-medium">
                        {fmt(row.grossPay)}
                      </td>
                      <td className="px-6 py-4 text-right text-red-500">
                        {fmt(row.deductions)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        {fmt(row.netPay)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </TabsContent>

      {/* Budget Tab */}
      <TabsContent value="budget" className="space-y-6 m-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-gray-100 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-50">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                Budget vs Actual by Department
              </CardTitle>
              <CardDescription>Track department spending against allocated budgets</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetData} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis type="number" tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(0)}k`} />
                    <YAxis dataKey="department" type="category" tick={{ fontSize: 12 }} width={80} />
                    <Tooltip formatter={(v) => fmt(Number(v))} />
                    <Legend />
                    <Bar dataKey="budget" name="Budget" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="actual" name="Actual" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-50">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Variance Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {budgetData.map((dept) => (
                  <div key={dept.department} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{dept.department}</span>
                      <Badge variant={dept.variance > 5 ? "destructive" : dept.variance < -5 ? "secondary" : "default"}>
                        {dept.variance > 0 ? '+' : ''}{dept.variance}%
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Budget: ${(dept.budget / 1000).toFixed(0)}k</span>
                      <span>Actual: ${(dept.actual / 1000).toFixed(0)}k</span>
                    </div>
                    <Progress value={(dept.actual / dept.budget) * 100} className="mt-2 h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-50">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Budget Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-600 uppercase">Total Budget</p>
                <p className="text-2xl font-bold text-blue-900">${(budgetData.reduce((a, b) => a + b.budget, 0) / 1000).toFixed(0)}k</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl">
                <p className="text-xs text-emerald-600 uppercase">Total Actual</p>
                <p className="text-2xl font-bold text-emerald-900">${(budgetData.reduce((a, b) => a + b.actual, 0) / 1000).toFixed(0)}k</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <p className="text-xs text-amber-600 uppercase">Variance</p>
                <p className="text-2xl font-bold text-amber-900">+2.1%</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <p className="text-xs text-purple-600 uppercase">Remaining</p>
                <p className="text-2xl font-bold text-purple-900">${((budgetData.reduce((a, b) => a + b.budget, 0) - budgetData.reduce((a, b) => a + b.actual, 0)) / 1000).toFixed(0)}k</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Projections Tab */}
      <TabsContent value="projections" className="space-y-6 m-0">
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-50">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Cost Projections (6-Month Forecast)
            </CardTitle>
            <CardDescription>AI-powered payroll cost projections based on current trends</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[...trendData.slice(-3), ...projectionData]} margin={{ left: -20 }}>
                  <defs>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => v ? fmt(Number(v)) : 'Projected'} />
                  <Legend />
                  <Area type="monotone" dataKey="gross" name="Historical" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="projected" name="Projected" stroke="#8b5cf6" fill="url(#colorProjected)" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Projected Q3 Cost</p>
                  <p className="text-xl font-bold">$1.48M</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expected Growth</p>
                  <p className="text-xl font-bold text-emerald-600">+4.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Headcount Forecast</p>
                  <p className="text-xl font-bold">52 employees</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Compliance Tab */}
      <TabsContent value="compliance" className="space-y-6 m-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-50">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Compliance Status
              </CardTitle>
              <CardDescription>Government contributions and filing status</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {complianceData.map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.status === 'complete' ? 'bg-emerald-100' : item.status === 'on_track' ? 'bg-blue-100' : 'bg-amber-100'}`}>
                        {item.status === 'complete' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : item.status === 'on_track' ? <Clock className="w-5 h-5 text-blue-600" /> : <Calendar className="w-5 h-5 text-amber-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.completed} of {item.total} processed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={item.status === 'complete' ? 'default' : item.status === 'on_track' ? 'secondary' : 'outline'}>
                        {item.status === 'complete' ? 'Complete' : item.status === 'on_track' ? 'On Track' : 'Pending'}
                      </Badge>
                      <Progress value={(item.completed / item.total) * 100} className="mt-2 w-24 h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-50">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">SSS Contribution Filing</p>
                    <p className="text-sm text-gray-500">Due in 3 days</p>
                  </div>
                  <Badge variant="destructive">Urgent</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 border-l-4 border-amber-500 bg-amber-50 rounded-r-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Quarterly Tax Filing</p>
                    <p className="text-sm text-gray-500">Due in 12 days</p>
                  </div>
                  <Badge variant="secondary">Upcoming</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">PhilHealth Remittance</p>
                    <p className="text-sm text-gray-500">Due in 18 days</p>
                  </div>
                  <Badge variant="secondary">Scheduled</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 border-l-4 border-gray-300 bg-gray-50 rounded-r-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">13th Month Pay Preparation</p>
                    <p className="text-sm text-gray-500">Due in 45 days</p>
                  </div>
                  <Badge variant="outline">Planning</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-50">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Compliance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <p className="text-3xl font-bold text-emerald-600">92%</p>
                <p className="text-sm text-gray-500">Overall Compliance</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-blue-600">4</p>
                <p className="text-sm text-gray-500">On-Time Filings</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-amber-600">1</p>
                <p className="text-sm text-gray-500">Pending Actions</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-gray-600">0</p>
                <p className="text-sm text-gray-500">Violations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  );
}
