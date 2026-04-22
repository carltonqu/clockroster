"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Calendar,
  TrendingUp,
  Plane,
  ClipboardList,
  Activity,
  DollarSign,
  User,
  FileText,
  Bell,
  Sparkles,
  ArrowRight,
  CheckCircle,
  MapPin,
  Briefcase,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  mockTimeEntries,
  mockSchedules,
  mockLeaveRequests,
  mockPayrollEntries,
  mockNotifications,
} from "@/lib/mock-data";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_BADGE: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Approved: "bg-green-100 text-green-700 border-green-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
};

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  gradient,
}: {
  icon: any;
  label: string;
  value: string | number;
  subtext?: string;
  gradient: string;
}) {
  return (
    <Card className="group border-0 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
      <div
        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`}
      />
      <CardContent className="p-5 relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {label}
            </p>
            <p className="text-xl font-bold text-gray-900 mt-2">{value}</p>
            {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
          </div>
          <div
            className={`bg-gradient-to-br ${gradient} p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({
  href,
  label,
  icon: Icon,
  gradient,
}: {
  href: string;
  label: string;
  icon: any;
  gradient: string;
}) {
  return (
    <Link href={href}>
      <div className="group flex flex-col items-center gap-2 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-blue-100/50 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
        <div
          className={`bg-gradient-to-br ${gradient} p-3 rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs text-center text-gray-600 group-hover:text-gray-900 font-medium leading-tight">
          {label}
        </span>
      </div>
    </Link>
  );
}

export function EmployeeDashboardClient() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const user = { name: "John Smith", role: "Employee" };

  // Get today's data
  const today = new Date().toISOString().slice(0, 10);
  const todayEntry = mockTimeEntries.find((e) => e.date === today);

  // Calculate week hours
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekHours = mockTimeEntries
    .filter((e) => new Date(e.date) >= weekStart && e.clockOut)
    .reduce((acc, e) => {
      const start = new Date(e.clockIn);
      const end = new Date(e.clockOut!);
      return acc + (end.getTime() - start.getTime()) / 3600000;
    }, 0);

  // Today's shift
  const todayShift = mockSchedules[0]?.shifts.find(
    (s) => s.day === new Date().toLocaleDateString("en-US", { weekday: "long" })
  );

  // My requests
  const myRequests = mockLeaveRequests
    .filter((r) => r.employeeName === "John Smith")
    .slice(0, 3);

  // Pending count
  const pendingCount = myRequests.filter((r) => r.status === "Pending").length;

  // Recent payslip
  const recentPayslip = mockPayrollEntries[0];

  // Unread notifications
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const quickActions = [
    {
      href: "/dashboard/attendance",
      label: isClockedIn ? "Clock Out" : "Clock In",
      icon: Clock,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      href: "/dashboard/scheduling",
      label: "My Schedule",
      icon: Calendar,
      gradient: "from-purple-500 to-violet-500",
    },
    {
      href: "/dashboard/leave",
      label: "Request Leave",
      icon: Plane,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      href: "/dashboard/attendance",
      label: "Attendance",
      icon: Activity,
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      href: "/dashboard/payroll",
      label: "Payslips",
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      href: "/dashboard/settings",
      label: "Profile",
      icon: User,
      gradient: "from-gray-500 to-slate-500",
    },
    {
      href: "/dashboard/leave",
      label: "Requests",
      icon: FileText,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      href: "/dashboard/notifications",
      label: "Alerts",
      icon: Bell,
      gradient: "from-red-500 to-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-green-200">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {greeting()}, {user.name}!
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {formatDate(new Date())}
            </p>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-0 px-3 py-1.5">
          <Sparkles className="w-3 h-3 mr-1" /> Employee Portal
        </Badge>
      </div>

      {/* Status Banner */}
      <div>
        {isClockedIn || todayEntry?.clockOut === null ? (
          <div className="relative rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-1 shadow-lg shadow-green-200">
            <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                </div>
                <div>
                  <p className="font-semibold text-lg">You&apos;re clocked in</p>
                  <p className="text-green-100 text-sm">
                    Since {todayEntry ? formatTime(todayEntry.clockIn) : "8:00 AM"}
                  </p>
                </div>
              </div>
              <Button
                className="bg-white text-green-600 hover:bg-green-50 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                onClick={() => {
                  setIsClockedIn(false);
                  toast.success("Clocked out successfully!");
                }}
              >
                Clock Out <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  Ready to start your day?
                </p>
                <p className="text-gray-500 text-sm">
                  You haven&apos;t clocked in today
                </p>
              </div>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-200 rounded-xl font-semibold transition-all hover:scale-105"
              onClick={() => {
                setIsClockedIn(true);
                toast.success("Clocked in successfully!");
              }}
            >
              Clock In <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Today's Shift"
          value={
            todayShift
              ? `${todayShift.startTime} – ${todayShift.endTime}`
              : "No shift"
          }
          subtext={todayShift?.role}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Hours This Week"
          value={`${weekHours.toFixed(1)} hrs`}
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={Plane}
          label="Leave Balance"
          value="15 days"
          subtext="Vacation remaining"
          gradient="from-purple-500 to-violet-500"
        />
        <StatCard
          icon={ClipboardList}
          label="Pending Requests"
          value={pendingCount}
          gradient="from-orange-500 to-amber-500"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Actions
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {quickActions.map((action) => (
            <QuickAction key={action.label} {...action} />
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card className="border-0 shadow-lg shadow-gray-100/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                Today&apos;s Schedule
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {todayShift ? "Scheduled" : "Rest Day"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {todayShift ? (
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-blue-900 text-lg">
                    {todayShift.role || "Regular Shift"}
                  </span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      isClockedIn
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {isClockedIn ? "In Progress" : "Upcoming"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-800">
                  <Clock className="w-5 h-5" />
                  <p className="text-lg font-bold">
                    {todayShift.startTime} – {todayShift.endTime}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-blue-600 mt-3">
                  <MapPin className="w-4 h-4" />
                  <p className="text-sm">Main Office</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No shift scheduled today</p>
                <p className="text-xs mt-1">Enjoy your rest day!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Requests */}
        <Card className="border-0 shadow-lg shadow-gray-100/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-white" />
                </div>
                My Requests
              </CardTitle>
              <Link href="/dashboard/leave">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {myRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl">
                <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No requests yet</p>
                <Link href="/dashboard/leave">
                  <Button variant="outline" size="sm" className="mt-3 rounded-xl">
                    Submit Request
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {myRequests.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          r.status === "Approved"
                            ? "bg-green-100"
                            : r.status === "Rejected"
                            ? "bg-red-100"
                            : "bg-yellow-100"
                        }`}
                      >
                        {r.status === "Approved" ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : r.status === "Rejected" ? (
                          <ClipboardList className="w-5 h-5 text-red-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {r.type}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(r.startDate).toLocaleDateString()} -{" "}
                          {new Date(r.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium border ${
                        STATUS_BADGE[r.status] ||
                        "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Payslip & Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg shadow-gray-100/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              Recent Payslip
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {recentPayslip ? (
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">
                      {new Date(recentPayslip.periodStart).toLocaleDateString(
                        "en-US",
                        { month: "long", year: "numeric" }
                      )}
                    </p>
                    <p className="text-xs text-emerald-500">
                      Period: {new Date(recentPayslip.periodStart).toLocaleDateString()} -{" "}
                      {new Date(recentPayslip.periodEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    className={
                      recentPayslip.status === "RELEASED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {recentPayslip.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gross Pay</span>
                    <span className="font-medium">
                      ${recentPayslip.grossPay.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Deductions</span>
                    <span className="font-medium text-red-600">
                      -${recentPayslip.deductions.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-emerald-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Net Pay</span>
                      <span className="font-bold text-emerald-700">
                        ${recentPayslip.netPay.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No payslip available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-gray-100/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                Notifications
              </CardTitle>
              {unreadCount > 0 && (
                <Badge className="bg-red-100 text-red-700">{unreadCount} new</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {mockNotifications.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-3 rounded-xl ${
                    n.read ? "bg-gray-50" : "bg-blue-50 border border-blue-100"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      n.read ? "bg-gray-200" : "bg-blue-200"
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{n.message}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
              ))}
            </div>
            <Link href="/dashboard/notifications">
              <Button variant="ghost" size="sm" className="w-full mt-3 text-blue-600">
                View all notifications
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
