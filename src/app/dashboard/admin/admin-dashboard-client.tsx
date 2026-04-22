"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  ClipboardList,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  UserX,
  Plane,
  CheckSquare,
  RefreshCw,
  ArrowRight,
  Activity,
  Crown,
  Briefcase,
  Calendar,
  BarChart3,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  mockEmployees,
  mockTimeEntries,
  mockPayrollEntries,
  mockLeaveRequests,
} from "@/lib/mock-data";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Clocked In": "bg-green-100 text-green-700",
    Present: "bg-blue-100 text-blue-700",
    Late: "bg-yellow-100 text-yellow-700",
    Absent: "bg-red-100 text-red-700",
    "On Leave": "bg-purple-100 text-purple-700",
    Active: "bg-green-100 text-green-700",
    Completed: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        map[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status === "Clocked In" && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
      )}
      {status}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  href,
  color = "blue",
}: {
  label: string;
  value: number;
  sub: string;
  icon: any;
  href?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red";
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };

  const content = (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">
              {label}
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {value.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
          <div className={`p-2 rounded-lg ${colorMap[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export function AdminDashboardClient() {
  const [loading, setLoading] = useState(false);

  // Calculate stats from mock data
  const totalEmployees = mockEmployees.length;
  const activeEmployees = mockEmployees.filter(
    (e) => e.employmentStatus === "Active"
  ).length;
  const onLeaveEmployees = mockLeaveRequests.filter(
    (r) => r.status === "Approved"
  ).length;
  const clockedInNow = mockTimeEntries.filter((e) => !e.clockOut).length;
  const pendingApprovals = mockLeaveRequests.filter(
    (r) => r.status === "Pending"
  ).length;

  // Financial summary
  const totalGross = mockPayrollEntries.reduce((acc, e) => acc + e.grossPay, 0);
  const totalNet = mockPayrollEntries.reduce((acc, e) => acc + e.netPay, 0);
  const totalReleased = mockPayrollEntries.filter(
    (e) => e.status === "RELEASED"
  ).length;
  const totalApproved = mockPayrollEntries.filter(
    (e) => e.status === "APPROVED"
  ).length;

  // Today's attendance
  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = mockTimeEntries
    .filter((e) => e.date === today)
    .map((e) => ({
      id: e.id,
      employeeName: e.employeeName,
      department: "Engineering",
      status: e.clockOut ? "Completed" : "Clocked In",
      actualIn: e.clockIn,
      actualOut: e.clockOut,
    }));

  // Pending approvals
  const pendingApprovalsList = mockLeaveRequests
    .filter((r) => r.status === "Pending")
    .map((r) => ({
      id: r.id,
      employeeName: r.employeeName,
      requestType: r.type,
      createdAt: r.requestedAt,
    }));

  // Recent activity
  const recentActivity = [
    {
      id: "1",
      employeeName: "John Smith",
      action: "clocked in",
      time: "2 mins ago",
    },
    {
      id: "2",
      employeeName: "Sarah Johnson",
      action: "submitted leave request",
      time: "15 mins ago",
    },
    {
      id: "3",
      employeeName: "Michael Chen",
      action: "approved payroll",
      time: "1 hour ago",
    },
    {
      id: "4",
      employeeName: "Emily Davis",
      action: "updated schedule",
      time: "2 hours ago",
    },
  ];

  const handleApproval = (id: string, status: "Approved" | "Rejected") => {
    toast.success(`Leave request ${status.toLowerCase()}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Full system access and financial controls
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("Refreshing...")}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/dashboard/settings">
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Financial Card */}
      <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs font-medium text-purple-100 uppercase">
                  Financial Overview
                </p>
                <Badge className="bg-white/20 text-white border-0 text-[10px]">
                  This Month
                </Badge>
              </div>

              <p className="text-xs text-purple-200 uppercase mb-1">
                Total Payroll
              </p>
              <p className="text-3xl font-bold">
                ${totalGross.toLocaleString()}
              </p>
              <p className="text-xs text-purple-200 mt-1">
                Net: ${totalNet.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {totalReleased > 0 && (
              <span className="text-xs bg-green-500/30 text-green-100 px-2 py-1 rounded-full">
                {totalReleased} Released
              </span>
            )}
            {totalApproved > 0 && (
              <span className="text-xs bg-yellow-500/30 text-yellow-100 px-2 py-1 rounded-full">
                {totalApproved} Approved
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Employees"
          value={totalEmployees}
          sub={`${activeEmployees} active`}
          icon={Users}
          href="/dashboard/employees"
          color="blue"
        />
        <StatCard
          label="Clocked In"
          value={clockedInNow}
          sub="currently working"
          icon={Clock}
          color="green"
        />
        <StatCard
          label="Pending"
          value={pendingApprovals}
          sub="need action"
          icon={ClipboardList}
          href="/dashboard/leave"
          color="orange"
        />
        <StatCard
          label="On Leave"
          value={onLeaveEmployees}
          sub="employees"
          icon={Plane}
          color="purple"
        />
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-xs text-red-600 font-medium">Late Today</p>
              <p className="text-lg font-bold text-gray-900">1</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-100">
          <CardContent className="p-3 flex items-center gap-3">
            <UserX className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-xs text-orange-600 font-medium">Absent</p>
              <p className="text-lg font-bold text-gray-900">0</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-100">
          <CardContent className="p-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-xs text-yellow-600 font-medium">
                Payroll Alerts
              </p>
              <p className="text-lg font-bold text-gray-900">2</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link href="/dashboard/employees">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Employees</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/payroll">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm font-medium">Payroll</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/scheduling">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium">Scheduling</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/reports">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-sm font-medium">Reports</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Attendance */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Today&apos;s Attendance
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {todayAttendance.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {todayAttendance.length === 0 ? (
                <p className="text-center py-6 text-gray-400 text-sm">
                  No attendance records
                </p>
              ) : (
                todayAttendance.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                        {record.employeeName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {record.employeeName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {record.department}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={record.status} />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-orange-500" />
                Pending Approvals
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {pendingApprovalsList.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {pendingApprovalsList.length === 0 ? (
                <p className="text-center py-6 text-gray-400 text-sm">
                  No pending approvals
                </p>
              ) : (
                pendingApprovalsList.map((item) => (
                  <div key={item.id} className="p-2 rounded-lg bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.employeeName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.requestType}
                        </p>
                        <p className="text-xs text-gray-300">Just now</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          className="h-7 px-2 bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => handleApproval(item.id, "Approved")}
                        >
                          <CheckSquare className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleApproval(item.id, "Rejected")}
                        >
                          <UserX className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {recentActivity.length === 0 ? (
              <p className="text-center py-6 text-gray-400 text-sm">
                No recent activity
              </p>
            ) : (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.employeeName}</span>{" "}
                      {activity.action}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
