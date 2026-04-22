"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  TrendingUp,
  Plane,
  Calendar,
  Package,
  Megaphone,
  Briefcase,
  Users,
  Clock,
  CheckSquare,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  mockEmployees,
  mockTimeEntries,
  mockLeaveRequests,
  mockSchedules,
} from "@/lib/mock-data";

const MODULES = [
  {
    href: "/dashboard/attendance",
    label: "Attendance Monitoring",
    icon: Activity,
    desc: "Track attendance and punctuality.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    href: "/dashboard/leave",
    label: "Leave Approvals",
    icon: Plane,
    desc: "Review and approve leave requests.",
    color: "from-green-500 to-emerald-500",
  },
  {
    href: "/dashboard/scheduling",
    label: "Scheduling",
    icon: Calendar,
    desc: "Plan and manage shifts.",
    color: "from-purple-500 to-violet-500",
  },
  {
    href: "/dashboard/assets",
    label: "Assets",
    icon: Package,
    desc: "Manage team assets and assignments.",
    color: "from-orange-500 to-amber-500",
  },
  {
    href: "/dashboard/announcements",
    label: "Announcements",
    icon: Megaphone,
    desc: "View and post team updates.",
    color: "from-pink-500 to-rose-500",
  },
  {
    href: "/dashboard/employees",
    label: "Team Members",
    icon: Users,
    desc: "View and manage your team.",
    color: "from-indigo-500 to-blue-500",
  },
];

export function SupervisorDashboardClient() {
  // Calculate stats
  const teamSize = mockEmployees.length;
  const clockedInNow = mockTimeEntries.filter((e) => !e.clockOut).length;
  const pendingApprovals = mockLeaveRequests.filter(
    (r) => r.status === "Pending"
  ).length;
  const onLeaveToday = mockLeaveRequests.filter(
    (r) => r.status === "Approved"
  ).length;

  // Today's team attendance
  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = mockTimeEntries
    .filter((e) => e.date === today)
    .slice(0, 5);

  // Pending leave requests
  const pendingLeaves = mockLeaveRequests
    .filter((r) => r.status === "Pending")
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Supervisor Dashboard
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Team management without financial access
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          <Briefcase className="w-3 h-3 mr-1" />
          Supervisor Access
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Team Size
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {teamSize}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Clocked In
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {clockedInNow}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Pending Approvals
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {pendingApprovals}
                </p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <CheckSquare className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">
                  On Leave
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {onLeaveToday}
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Plane className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Banner */}
      {pendingApprovals > 0 && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                You have {pendingApprovals} pending approval
                {pendingApprovals > 1 ? "s" : ""}
              </p>
              <p className="text-sm text-gray-500">
                Review and respond to leave requests from your team
              </p>
            </div>
            <Link href="/dashboard/leave">
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                Review
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Management Modules */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Management Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-blue-200">
                  <CardContent className="p-5 space-y-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.label}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Team Attendance */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                Today&apos;s Team Attendance
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {todayAttendance.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {todayAttendance.length === 0 ? (
                <p className="text-center py-6 text-gray-400 text-sm">
                  No attendance records yet
                </p>
              ) : (
                todayAttendance.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                        {entry.employeeName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {entry.employeeName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {entry.clockOut ? "Completed" : "Active"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        entry.clockOut
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }
                    >
                      {entry.clockOut ? "Done" : "Working"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Leave Requests */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Plane className="w-4 h-4 text-orange-500" />
                Pending Leave Requests
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {pendingLeaves.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {pendingLeaves.length === 0 ? (
                <p className="text-center py-6 text-gray-400 text-sm">
                  No pending leave requests
                </p>
              ) : (
                pendingLeaves.map((request) => (
                  <div key={request.id} className="p-3 rounded-lg bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {request.employeeName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {request.type} • {request.startDate} to{" "}
                          {request.endDate}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Reason: {request.reason}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          className="h-7 px-2 bg-green-500 hover:bg-green-600 text-white"
                          onClick={() =>
                            toast.success(
                              `Approved leave for ${request.employeeName}`
                            )
                          }
                        >
                          <CheckSquare className="w-3 h-3" />
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

      {/* Weekly Schedule Preview */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              This Week&apos;s Schedule
            </CardTitle>
            <Link href="/dashboard/scheduling">
              <Button variant="ghost" size="sm">
                View Full Schedule
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, index) => (
                <div key={day} className="text-center">
                  <p className="text-xs text-gray-500 mb-2">{day}</p>
                  <div className="space-y-1">
                    {mockSchedules.slice(0, 2).map((schedule) => {
                      const shift = schedule.shifts[index];
                      return shift ? (
                        <div
                          key={`${schedule.id}-${index}`}
                          className="text-[10px] p-1 bg-blue-50 rounded text-blue-700 truncate"
                        >
                          {schedule.employeeName.split(" ")[0]}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
