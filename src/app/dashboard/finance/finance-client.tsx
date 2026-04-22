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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  DollarSign,
  Building2,
  Sparkles,
  Download,
  Search,
  ChevronDown,
  Crown,
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

export function FinanceClient() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [detailTab, setDetailTab] = useState<"department" | "employee">(
    "department"
  );
  const [employeeSearch, setEmployeeSearch] = useState("");

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
      row.deductions += e.deductions;
      row.netPay += e.netPay;
    });
    return Array.from(map.values()).sort((a, b) => b.netPay - a.netPay);
  }, [filtered]);

  const byEmployee = useMemo(() => {
    return filtered
      .map((e) => ({
        name: e.employeeName,
        grossPay: e.grossPay,
        deductions: e.deductions,
        netPay: e.netPay,
        status: e.status,
      }))
      .filter((e) =>
        e.name.toLowerCase().includes(employeeSearch.toLowerCase())
      )
      .sort((a, b) => b.netPay - a.netPay);
  }, [filtered, employeeSearch]);

  const exportCSV = () => {
    toast.info("Export feature coming soon!");
  };

  const selectCls =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                Finance Summary
              </h1>
              <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-0">
                <Crown className="w-3 h-3 mr-1" /> Admin Only
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Payroll analytics and financial reports
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportCSV}
            className="border-blue-200 hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Employees"
          value={totals.employeeCount}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={DollarSign}
          label="Gross Pay"
          value={Math.round(totals.grossPay)}
          prefix="$"
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={DollarSign}
          label="Net Pay"
          value={Math.round(totals.netPay)}
          prefix="$"
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={Building2}
          label="Deductions"
          value={Math.round(totals.deductions)}
          prefix="$"
          gradient="from-orange-500 to-yellow-500"
        />
      </div>

      {/* Filters */}
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
              <TrendingUp className="w-4 h-4 text-blue-500" />
              6-Month Trend
            </CardTitle>
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
              <DollarSign className="w-4 h-4 text-blue-500" />
              Pay Distribution
            </CardTitle>
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
    </div>
  );
}
