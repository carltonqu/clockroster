"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  TrendingUp,
  Bell,
  DollarSign,
  Play,
  Pause,
  Calendar,
  ArrowRight,
  Users,
  Briefcase,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DashboardClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    tier: string;
  };
  stats: {
    totalHours: number;
    overtimeHours: number;
    unreadNotifications: number;
    lastPayroll: number | null;
  };
  recentEntries: Array<{
    id: string;
    employeeName: string;
    clockIn: string;
    clockOut: string | null;
    date: string;
  }>;
  notifications: Array<{
    id: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: string;
  }>;
  isCurrentlyClockedIn: boolean;
}

export function DashboardClient({
  user,
  stats,
  recentEntries,
  notifications,
  isCurrentlyClockedIn: initialClockedIn,
}: DashboardClientProps) {
  const [isClockedIn, setIsClockedIn] = useState(initialClockedIn);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  const handleClockInOut = () => {
    if (isClockedIn) {
      setIsClockedIn(false);
      setClockInTime(null);
      toast.success("Clocked out successfully!");
    } else {
      setIsClockedIn(true);
      setClockInTime(new Date());
      toast.success("Clocked in successfully!");
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "SCHEDULE":
        return <Calendar className="h-4 w-4" />;
      case "PAYROLL":
        return <DollarSign className="h-4 w-4" />;
      case "APPROVAL":
        return <FileText className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Here&apos;s what&apos;s happening with your team today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleClockInOut}
            className={`${
              isClockedIn
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {isClockedIn ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Clock Out
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Clock In
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}h</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Overtime
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overtimeHours}h</div>
            <p className="text-xs text-gray-500">Extra hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Notifications
            </CardTitle>
            <Bell className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadNotifications}</div>
            <p className="text-xs text-gray-500">Unread</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Last Payroll
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.lastPayroll?.toLocaleString() ?? "0"}
            </div>
            <p className="text-xs text-gray-500">Net pay</p>
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
        <Link href="/dashboard/scheduling">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm font-medium">Scheduling</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/payroll">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium">Payroll</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/assets">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                <Briefcase className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-sm font-medium">Assets</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Link href="/dashboard/attendance">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>Latest time entries from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{entry.employeeName}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(entry.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatTime(entry.clockIn)} -{" "}
                      {entry.clockOut ? formatTime(entry.clockOut) : "Active"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {entry.clockOut ? "Completed" : "In progress"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              <Link href="/dashboard/notifications">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>Recent updates and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    notification.read
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-blue-50 dark:bg-blue-950"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notification.read
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "bg-blue-200 dark:bg-blue-800"
                    }`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <Badge variant="default" className="text-[10px]">
                      New
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
