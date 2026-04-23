"use client";

import { useState, useEffect } from "react";
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
  Sparkles,
  CheckCircle,
  AlertCircle,
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

function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const duration = 600;
    const steps = 20;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{displayValue}</span>;
}

function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
  delay = 0,
  suffix = "",
}: {
  icon: any;
  label: string;
  value: number;
  gradient: string;
  delay?: number;
  suffix?: string;
}) {
  return (
    <Card
      className="border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </CardTitle>
        <div
          className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          <AnimatedCounter value={value} />
          {suffix}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This month</p>
      </CardContent>
    </Card>
  );
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

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "SCHEDULE":
        return "from-blue-500 to-cyan-500";
      case "PAYROLL":
        return "from-emerald-500 to-green-500";
      case "APPROVAL":
        return "from-purple-500 to-pink-500";
      default:
        return "from-amber-500 to-orange-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.name}!
            </h2>
            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-0">
              <Sparkles className="w-3 h-3 mr-1" /> {user.role}
            </Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Here&apos;s what&apos;s happening with your team today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isClockedIn && (
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-pulse-ring" />
              </div>
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Clocked In
              </span>
            </div>
          )}
          <Button
            onClick={handleClockInOut}
            className={`${
              isClockedIn
                ? "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
                : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
            } text-white shadow-md rounded-xl`}
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
        <StatCard
          icon={Clock}
          label="Total Hours"
          value={stats.totalHours}
          gradient="from-blue-500 to-cyan-500"
          delay={100}
          suffix="h"
        />
        <StatCard
          icon={TrendingUp}
          label="Overtime"
          value={stats.overtimeHours}
          gradient="from-amber-500 to-orange-500"
          delay={200}
          suffix="h"
        />
        <StatCard
          icon={Bell}
          label="Notifications"
          value={stats.unreadNotifications}
          gradient="from-purple-500 to-pink-500"
          delay={300}
        />
        <StatCard
          icon={DollarSign}
          label="Last Payroll"
          value={stats.lastPayroll || 0}
          gradient="from-emerald-500 to-green-500"
          delay={400}
          suffix=""
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
        {[
          { href: "/dashboard/employees", icon: Users, label: "Employees", color: "from-blue-500 to-cyan-500" },
          { href: "/dashboard/scheduling", icon: Calendar, label: "Scheduling", color: "from-emerald-500 to-green-500" },
          { href: "/dashboard/payroll", icon: DollarSign, label: "Payroll", color: "from-purple-500 to-pink-500" },
          { href: "/dashboard/assets", icon: Briefcase, label: "Assets", color: "from-amber-500 to-orange-500" },
        ].map((action, index) => (
          <Link key={action.href} href={action.href}>
            <Card className="group hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer border-gray-100 dark:border-gray-800">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {action.label}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
        {/* Recent Activity */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-50 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              </div>
              <Link href="/dashboard/attendance">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>Latest time entries from your team</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
                  style={{ animationDelay: `${700 + index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold">
                      {entry.employeeName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{entry.employeeName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(entry.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatTime(entry.clockIn)} -{" "}
                      {entry.clockOut ? formatTime(entry.clockOut) : "Active"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.clockOut ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <CheckCircle className="w-3 h-3" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600">
                          <div className="relative">
                            <div className="w-2 h-2 bg-amber-500 rounded-full" />
                            <div className="absolute inset-0 w-2 h-2 bg-amber-500 rounded-full animate-ping opacity-75" />
                          </div>
                          In progress
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {recentEntries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-50 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500" />
                <CardTitle className="text-base font-semibold">Notifications</CardTitle>
              </div>
              <Link href="/dashboard/notifications">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>Recent updates and alerts</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {notifications.slice(0, 5).map((notification, index) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-4 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors ${
                    !notification.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                  }`}
                  style={{ animationDelay: `${700 + index * 50}ms` }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 text-[10px]">
                      New
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            {notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No notifications</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
