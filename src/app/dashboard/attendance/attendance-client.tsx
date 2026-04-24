"use client";

import { useState, useEffect, useMemo } from "react";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, subDays } from "date-fns";
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
  Search,
  X,
  SlidersHorizontal,
  Building2,
  ArrowDownAZ,
  ArrowUpZA,
  MessageSquare,
  Send,
  Check,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sunrise,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  department: string;
}

interface AttendanceClientProps {
  entries: TimeEntry[];
  employees: Employee[];
}

// Filter types
type StatusFilter = "all" | "clocked-in" | "clocked-out" | "on-break";
type DateRangeFilter = "all" | "today" | "yesterday" | "last-7-days" | "last-30-days";
type TimeRangeFilter = "all" | "morning" | "afternoon" | "night";
type SortDirection = "asc" | "desc" | null;

interface FilterState {
  status: StatusFilter;
  dateRange: DateRangeFilter;
  timeRange: TimeRangeFilter;
  department: string;
  nameSort: SortDirection;
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
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{ id: string; name: string } | null>(null);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageText, setMessageText] = useState("");

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    dateRange: "all",
    timeRange: "all",
    department: "all",
    nameSort: null,
  });

  // Get unique departments from employees
  const uniqueDepartments = useMemo(() => {
    const depts = new Set(employees.map((emp) => emp.department).filter(Boolean));
    return Array.from(depts).sort();
  }, [employees]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status !== "all") count++;
    if (filters.dateRange !== "all") count++;
    if (filters.timeRange !== "all") count++;
    if (filters.department !== "all") count++;
    if (filters.nameSort !== null) count++;
    return count;
  }, [filters]);

  // Helper: Check if time falls within shift range
  const isTimeInRange = (dateString: string, range: TimeRangeFilter): boolean => {
    if (range === "all") return true;
    const date = new Date(dateString);
    const hour = date.getHours();

    switch (range) {
      case "morning":
        return hour >= 6 && hour < 14;
      case "afternoon":
        return hour >= 14 && hour < 22;
      case "night":
        return hour >= 22 || hour < 6;
      default:
        return true;
    }
  };

  // Helper: Check if date falls within range
  const isDateInRange = (dateString: string, range: DateRangeFilter): boolean => {
    if (range === "all") return true;
    const entryDate = parseISO(dateString);
    const today = new Date();

    switch (range) {
      case "today":
        return entryDate.toDateString() === today.toDateString();
      case "yesterday":
        const yesterday = subDays(today, 1);
        return entryDate.toDateString() === yesterday.toDateString();
      case "last-7-days":
        return isWithinInterval(entryDate, {
          start: startOfDay(subDays(today, 6)),
          end: endOfDay(today),
        });
      case "last-30-days":
        return isWithinInterval(entryDate, {
          start: startOfDay(subDays(today, 29)),
          end: endOfDay(today),
        });
      default:
        return true;
    }
  };

  // Helper: Get employee department
  const getEmployeeDepartment = (userId: string): string => {
    const emp = employees.find((e) => e.id === userId);
    return emp?.department || "";
  };

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let result = entries.filter((entry) => {
      // Search query filter
      const matchesSearch =
        searchQuery === "" ||
        entry.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.date.includes(searchQuery);

      // Status filter
      let matchesStatus = true;
      if (filters.status === "clocked-in") {
        matchesStatus = !entry.clockOut;
      } else if (filters.status === "clocked-out") {
        matchesStatus = !!entry.clockOut;
      } else if (filters.status === "on-break") {
        // For now, treat "on break" as clocked in (can be enhanced with break tracking)
        matchesStatus = !entry.clockOut;
      }

      // Date range filter
      const matchesDate = isDateInRange(entry.date, filters.dateRange);

      // Time range filter (based on clock-in time)
      const matchesTime = isTimeInRange(entry.clockIn, filters.timeRange);

      // Department filter
      const matchesDepartment =
        filters.department === "all" || getEmployeeDepartment(entry.userId) === filters.department;

      return matchesSearch && matchesStatus && matchesDate && matchesTime && matchesDepartment;
    });

    // Sorting
    if (filters.nameSort) {
      result = [...result].sort((a, b) => {
        const comparison = a.employeeName.localeCompare(b.employeeName);
        return filters.nameSort === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [entries, searchQuery, filters]);

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      status: "all",
      dateRange: "all",
      timeRange: "all",
      department: "all",
      nameSort: null,
    });
    setSearchQuery("");
  };

  // Update single filter
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

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

  const handleMessageClick = (entry: TimeEntry) => {
    setSelectedEmployee({ id: entry.userId, name: entry.employeeName });
    setMessageSubject("");
    setMessageText("");
    setIsMessageDialogOpen(true);
  };

  const handleSendMessage = () => {
    if (!selectedEmployee) return;
    if (!messageSubject.trim() || !messageText.trim()) {
      toast.error("Please fill in both subject and message");
      return;
    }
    // Simulate sending message
    toast.success(`Message sent to ${selectedEmployee.name}`);
    setIsMessageDialogOpen(false);
    setMessageSubject("");
    setMessageText("");
    setSelectedEmployee(null);
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

  // Helper to get status label
  const getStatusLabel = (status: StatusFilter): string => {
    const labels: Record<StatusFilter, string> = {
      all: "All Statuses",
      "clocked-in": "Clocked In",
      "clocked-out": "Clocked Out",
      "on-break": "On Break",
    };
    return labels[status];
  };

  // Helper to get date range label
  const getDateRangeLabel = (range: DateRangeFilter): string => {
    const labels: Record<DateRangeFilter, string> = {
      all: "All Dates",
      today: "Today",
      yesterday: "Yesterday",
      "last-7-days": "Last 7 Days",
      "last-30-days": "Last 30 Days",
    };
    return labels[range];
  };

  // Helper to get time range label
  const getTimeRangeLabel = (range: TimeRangeFilter): string => {
    const labels: Record<TimeRangeFilter, string> = {
      all: "All Shifts",
      morning: "Morning (6AM-2PM)",
      afternoon: "Afternoon (2PM-10PM)",
      night: "Night (10PM-6AM)",
    };
    return labels[range];
  };

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

      {/* Search and Filter */}
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
            <div className="flex items-center gap-2">
              {/* Filters Button */}
              <Button
                variant="outline"
                onClick={() => setIsFilterSheetOpen(true)}
                className="rounded-xl relative"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              
              {/* Clear All Button - Only show when filters are active */}
              {(activeFilterCount > 0 || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="rounded-xl text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4 mr-1" /> Clear All
                </Button>
              )}
            </div>
          </div>
          
          {/* Active Filter Pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.status !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="rounded-full px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {getStatusLabel(filters.status)}
                  <button 
                    onClick={() => updateFilter("status", "all")}
                    className="ml-2 hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.dateRange !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="rounded-full px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200"
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  {getDateRangeLabel(filters.dateRange)}
                  <button 
                    onClick={() => updateFilter("dateRange", "all")}
                    className="ml-2 hover:text-purple-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.timeRange !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="rounded-full px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200"
                >
                  <Sun className="w-3 h-3 mr-1" />
                  {getTimeRangeLabel(filters.timeRange)}
                  <button 
                    onClick={() => updateFilter("timeRange", "all")}
                    className="ml-2 hover:text-amber-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.department !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="rounded-full px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  <Building2 className="w-3 h-3 mr-1" />
                  {filters.department}
                  <button 
                    onClick={() => updateFilter("department", "all")}
                    className="ml-2 hover:text-emerald-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.nameSort && (
                <Badge 
                  variant="secondary" 
                  className="rounded-full px-3 py-1 bg-cyan-50 text-cyan-700 border border-cyan-200"
                >
                  {filters.nameSort === "asc" ? <ArrowDownAZ className="w-3 h-3 mr-1" /> : <ArrowUpZA className="w-3 h-3 mr-1" />}
                  Name: {filters.nameSort === "asc" ? "A-Z" : "Z-A"}
                  <button 
                    onClick={() => updateFilter("nameSort", null)}
                    className="ml-2 hover:text-cyan-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
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
                  <TableHead className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4">
                          <Clock className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No entries found</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
                        {(activeFilterCount > 0 || searchQuery) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearAllFilters}
                            className="mt-4 rounded-xl"
                          >
                            <X className="h-4 w-4 mr-1" /> Clear All Filters
                          </Button>
                        )}
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
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMessageClick(entry)}
                          className="rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Filter Sheet */}
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[450px] p-0">
          <SheetHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold">Filters</SheetTitle>
                <SheetDescription className="text-sm text-gray-500">
                  Refine your attendance records
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
          
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Status Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Status
              </Label>
              <Select
                value={filters.status}
                onValueChange={(value) => updateFilter("status", value as StatusFilter)}
              >
                <SelectTrigger className="w-full rounded-xl h-12">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="clocked-in">Clocked In</SelectItem>
                  <SelectItem value="clocked-out">Clocked Out</SelectItem>
                  <SelectItem value="on-break">On Break</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                Date Range
              </Label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) => updateFilter("dateRange", value as DateRangeFilter)}
              >
                <SelectTrigger className="w-full rounded-xl h-12">
                  <SelectValue placeholder="Select Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Range Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                Shift Time
              </Label>
              <Select
                value={filters.timeRange}
                onValueChange={(value) => updateFilter("timeRange", value as TimeRangeFilter)}
              >
                <SelectTrigger className="w-full rounded-xl h-12">
                  <SelectValue placeholder="Select Shift Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="morning">
                    <div className="flex items-center gap-2">
                      <Sunrise className="w-4 h-4" />
                      Morning (6AM - 2PM)
                    </div>
                  </SelectItem>
                  <SelectItem value="afternoon">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Afternoon (2PM - 10PM)
                    </div>
                  </SelectItem>
                  <SelectItem value="night">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Night (10PM - 6AM)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Department Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-500" />
                Department
              </Label>
              <Select
                value={filters.department}
                onValueChange={(value) => updateFilter("department", value || "all")}
              >
                <SelectTrigger className="w-full rounded-xl h-12">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {uniqueDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* Sort Options */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ArrowDownAZ className="w-4 h-4 text-cyan-500" />
                Sort Options
              </Label>
              
              {/* Name Sort */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Sort by Name</Label>
                <div className="flex gap-2">
                  <Button
                    variant={filters.nameSort === "asc" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter("nameSort", filters.nameSort === "asc" ? null : "asc")}
                    className={`flex-1 rounded-xl ${
                      filters.nameSort === "asc" 
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" 
                        : ""
                    }`}
                  >
                    <ArrowDownAZ className="w-4 h-4 mr-2" />
                    A-Z
                  </Button>
                  <Button
                    variant={filters.nameSort === "desc" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter("nameSort", filters.nameSort === "desc" ? null : "desc")}
                    className={`flex-1 rounded-xl ${
                      filters.nameSort === "desc" 
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" 
                        : ""
                    }`}
                  >
                    <ArrowUpZA className="w-4 h-4 mr-2" />
                    Z-A
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex-row gap-3">
            <Button
              variant="outline"
              onClick={clearAllFilters}
              disabled={activeFilterCount === 0 && !searchQuery}
              className="flex-1 rounded-xl"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <Button 
              onClick={() => setIsFilterSheetOpen(false)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl"
            >
              <Check className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="w-[90vw] max-w-[500px] rounded-2xl p-0">
          <DialogHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">Send Message</DialogTitle>
                <p className="text-sm text-gray-500">
                  To: {selectedEmployee?.name}
                </p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message-subject" className="text-sm font-medium text-gray-700">
                Subject
              </Label>
              <Input
                id="message-subject"
                placeholder="Enter message subject..."
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                className="rounded-xl h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message-text" className="text-sm font-medium text-gray-700">
                Message
              </Label>
              <textarea
                id="message-text"
                placeholder="Type your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full min-h-[120px] px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setIsMessageDialogOpen(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!messageSubject.trim() || !messageText.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
