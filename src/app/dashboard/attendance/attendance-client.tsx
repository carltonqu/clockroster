"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Clock,
  Calendar,
  Download,
  Filter,
  Play,
  Pause,
  TrendingUp,
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Timer,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface TimeEntry {
  id: string;
  userId: string;
  employeeName: string;
  clockIn: string;
  clockOut: string | null;
  overtimeMinutes: number;
  date: string;
}

interface Employee {
  id: string;
  fullName: string;
}

interface AttendanceClientProps {
  entries: TimeEntry[];
  employees: Employee[];
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
        <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          <AnimatedCounter value={value} />
          {suffix}
        </div>
      </CardContent>
    </Card>
  );
}

export function AttendanceClient({ entries, employees }: AttendanceClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isClockedIn, setIsClockedIn] = useState(false);

  const filteredEntries = entries.filter(
    (entry) =>
      entry.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.date.includes(searchQuery)
  );

  const handleClockInOut = () => {
    if (isClockedIn) {
      setIsClockedIn(false);
      toast.success("Clocked out successfully!");
    } else {
      setIsClockedIn(true);
      toast.success("Clocked in successfully!");
    }
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a");
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const calculateDuration = (clockIn: string, clockOut: string | null) => {
    if (!clockOut) return "In progress";
    const start = new Date(clockIn);
    const end = new Date(clockOut);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);
    return `${diffHrs}h ${diffMins}m`;
  };

  const totalHoursToday = entries
    .filter((e) => e.date === new Date().toISOString().split("T")[0] && e.clockOut)
    .reduce((acc, e) => {
      const start = new Date(e.clockIn);
      const end = new Date(e.clockOut!);
      return acc + (end.getTime() - start.getTime()) / 3600000;
    }, 0);

  const activeEmployees = entries.filter((e) => !e.clockOut).length;
  const totalOvertime = entries.reduce((acc, e) => acc + (e.overtimeMinutes || 0), 0) / 60;
  const attendanceRate = employees.length > 0 ? Math.round((entries.length / employees.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Attendance
            </h2>
            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-0">
              <Sparkles className="w-3 h-3 mr-1" /> Live
            </Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Track employee clock-ins, clock-outs, and hours worked
          </p>
        </div>
        <div className="flex gap-2">
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
          <Button variant="outline" onClick={() => toast.info("Export feature coming soon!")} className="rounded-xl">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Total Hours Today" value={parseFloat(totalHoursToday.toFixed(1))} gradient="from-blue-500 to-cyan-500" delay={100} suffix="h" />
        <StatCard icon={Users} label="Active Now" value={activeEmployees} gradient="from-emerald-500 to-green-500" delay={200} />
        <StatCard icon={TrendingUp} label="Overtime Hours" value={parseFloat(totalOvertime.toFixed(1))} gradient="from-amber-500 to-orange-500" delay={300} suffix="h" />
        <StatCard icon={Calendar} label="Attendance Rate" value={attendanceRate} gradient="from-purple-500 to-pink-500" delay={400} suffix="%" />
      </div>

      {/* Search and Table */}
      <Card className="border-gray-100 dark:border-gray-800 shadow-sm animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <CardHeader className="pb-4 border-b border-gray-50 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by employee or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
            {searchQuery && (
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="rounded-xl">
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
            <Button variant="outline" className="ml-auto rounded-xl" onClick={() => toast.info("Filter feature coming soon!")}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Employee</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Clock In</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Clock Out</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Duration</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4">
                          <Clock className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No entries found</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                            {entry.employeeName.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{entry.employeeName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">{formatDate(entry.date)}</TableCell>
                      <TableCell className="font-mono text-sm text-gray-700 dark:text-gray-300">{formatTime(entry.clockIn)}</TableCell>
                      <TableCell className="font-mono text-sm text-gray-500 dark:text-gray-400">
                        {entry.clockOut ? formatTime(entry.clockOut) : "—"}
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${entry.clockOut ? 'text-gray-700 dark:text-gray-300' : 'text-amber-600'}`}>
                          {calculateDuration(entry.clockIn, entry.clockOut)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {entry.clockOut ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Active
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
