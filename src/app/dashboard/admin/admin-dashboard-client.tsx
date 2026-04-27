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
  Activity,
  Crown,
  Calendar,
  BarChart3,
  Settings,
  Brain,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Employee {
  id: string;
  fullName: string;
  employmentStatus: string;
  department: string;
}

interface AdminDashboardClientProps {
  employees: Employee[];
  totalEmployees: number;
  activeEmployees: number;
  totalHours: number;
  pendingLeaveRequests: number;
  unreadNotifications: number;
}

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

export function AdminDashboardClient({
  employees,
  totalEmployees,
  activeEmployees,
  totalHours,
  pendingLeaveRequests,
  unreadNotifications,
}: AdminDashboardClientProps) {
  const [loading, setLoading] = useState(false);

  // Calculate stats from real data
  const onLeaveEmployees = 0; // Will be fetched from leave requests
  const clockedInNow = 0; // Will be fetched from time entries

  // Empty data for new organizations
  const todayAttendance: any[] = [];
  const pendingApprovalsList: any[] = [];
  const recentActivity: any[] = [];

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

      {/* Financial Card - Empty for new orgs */}
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
                $0
              </p>
              <p className="text-xs text-purple-200 mt-1">
                Net: $0
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
              Add employees to get started
            </span>
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
          value={pendingLeaveRequests}
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
              <p className="text-lg font-bold text-gray-900">0</p>
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
              <p className="text-lg font-bold text-gray-900">0</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
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
          <Link href="/dashboard/leave">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                  <ClipboardList className="h-5 w-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium">Leave</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Admin-Only Features */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Crown className="w-4 h-4 text-purple-600" />
          Admin-Only Features
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/dashboard/finance">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-purple-200 hover:border-purple-300">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">Finance Summary</span>
                <Badge className="mt-1 text-[10px] bg-purple-100 text-purple-700">Admin</Badge>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/ai-insights">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-purple-200 hover:border-purple-300">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center mb-2">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">AI Insights</span>
                <Badge className="mt-1 text-[10px] bg-purple-100 text-purple-700">Admin</Badge>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/supervisor-assignments">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-purple-200 hover:border-purple-300">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mb-2">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">Supervisor Roles</span>
                <Badge className="mt-1 text-[10px] bg-purple-100 text-purple-700">Admin</Badge>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/settings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-purple-200 hover:border-purple-300">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-500 rounded-lg flex items-center justify-center mb-2">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">Settings</span>
                <Badge className="mt-1 text-[10px] bg-purple-100 text-purple-700">Admin</Badge>
              </CardContent>
            </Card>
          </Link>
        </div>
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
                0
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <p className="text-center py-6 text-gray-400 text-sm">
                No attendance records yet. Add employees and have them clock in.
              </p>
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
                0
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <p className="text-center py-6 text-gray-400 text-sm">
                No pending approvals
              </p>
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
            <p className="text-center py-6 text-gray-400 text-sm">
              No recent activity. Start by adding your first employee!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
