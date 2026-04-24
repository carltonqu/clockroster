"use client";

import { useState, useEffect } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  Copy,
  Sparkles,
  Search,
  X,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface Shift {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  role: string;
}

interface Schedule {
  id: string;
  employeeId: string;
  employeeName: string;
  weekStart: string;
  shifts: Shift[];
}

interface Employee {
  id: string;
  fullName: string;
}

interface SchedulingClientProps {
  schedules: Schedule[];
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
}: {
  icon: any;
  label: string;
  value: number;
  gradient: string;
  delay?: number;
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
        </div>
      </CardContent>
    </Card>
  );
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function SchedulingClient({ schedules, employees }: SchedulingClientProps) {
  const router = useRouter();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [localSchedules, setLocalSchedules] = useState<Schedule[]>(schedules);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = daysOfWeek.map((_, index) => addDays(weekStart, index));

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getShiftsForDay = (employeeId: string, dayName: string) => {
    const schedule = localSchedules.find((s) => s.employeeId === employeeId);
    return schedule?.shifts.filter((s) => s.day === dayName) || [];
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalShifts = localSchedules.reduce((acc, s) => acc + s.shifts.length, 0);
  const scheduledEmployees = localSchedules.filter((s) => s.shifts.length > 0).length;

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
              Scheduling
            </h2>
            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-0">
              <Sparkles className="w-3 h-3 mr-1" /> {totalShifts} Shifts
            </Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage employee schedules and shifts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("Copy schedule feature coming soon!")} className="rounded-xl">
            <Copy className="mr-2 h-4 w-4" />
            Copy Week
          </Button>
          <Button 
            onClick={() => router.push('/dashboard/scheduling/new')}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Shift
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Calendar} label="Total Shifts" value={totalShifts} gradient="from-blue-500 to-cyan-500" delay={100} />
        <StatCard icon={Users} label="Scheduled" value={scheduledEmployees} gradient="from-emerald-500 to-green-500" delay={200} />
        <StatCard icon={Sun} label="Open Slots" value={employees.length - scheduledEmployees} gradient="from-amber-500 to-orange-500" delay={300} />
      </div>

      {/* Week Navigation */}
      <Card className="border-gray-100 dark:border-gray-800 shadow-sm animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")} className="rounded-xl">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {format(weekStart, "MMMM d")} -{" "}
                  {format(addDays(weekStart, 6), "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Week View</p>
              </div>
              <Button variant="outline" size="icon" onClick={() => navigateWeek("next")} className="rounded-xl">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
                className="rounded-xl"
              >
                Week
              </Button>
              <Button
                variant={viewMode === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("day")}
                className="rounded-xl"
              >
                Day
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <div className="flex gap-2 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search employees..."
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
      </div>

      {/* Schedule Grid */}
      <Card className="border-gray-100 dark:border-gray-800 shadow-sm animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="grid grid-cols-8 gap-2 p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
              <div className="font-semibold text-sm text-gray-900 dark:text-white">Employee</div>
              {daysOfWeek.map((day, index) => (
                <div key={day} className="text-center">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{day.slice(0, 3)}</p>
                  <p className="text-xs text-gray-500">{format(weekDays[index], "MMM d")}</p>
                </div>
              ))}
            </div>

            {/* Employee Rows */}
            {filteredEmployees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No employees found</p>
              </div>
            ) : (
              filteredEmployees.map((employee) => (
                <div key={employee.id} className="grid grid-cols-8 gap-2 p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                      {employee.fullName.charAt(0)}
                    </div>
                    <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {employee.fullName}
                    </span>
                  </div>
                  {daysOfWeek.map((day) => {
                    const shifts = getShiftsForDay(employee.id, day);
                    return (
                      <div key={day} className="text-center">
                        {shifts.length > 0 ? (
                          <div className="space-y-1">
                            {shifts.map((shift) => (
                              <div
                                key={shift.id}
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs rounded-lg px-2 py-1 shadow-sm"
                              >
                                <p className="font-medium">{shift.startTime}</p>
                                <p className="opacity-80">{shift.endTime}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-8 flex items-center justify-center text-gray-300 dark:text-gray-600">
                            —
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
