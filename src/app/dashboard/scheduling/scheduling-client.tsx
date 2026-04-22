"use client";

import { useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  Copy,
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

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function SchedulingClient({ schedules, employees }: SchedulingClientProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "day">("week");

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = daysOfWeek.map((_, index) => addDays(weekStart, index));

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getShiftsForDay = (employeeId: string, dayName: string) => {
    const schedule = schedules.find((s) => s.employeeId === employeeId);
    return schedule?.shifts.filter((s) => s.day === dayName) || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Scheduling
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage employee schedules and shifts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("Copy schedule feature coming soon!")}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Week
          </Button>
          <Button onClick={() => toast.info("Add shift feature coming soon!")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Shift
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <p className="font-semibold">
                  {format(weekStart, "MMMM d")} -{" "}
                  {format(addDays(weekStart, 6), "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-gray-500">Week View</p>
              </div>
              <Button variant="outline" size="icon" onClick={() => navigateWeek("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                Week
              </Button>
              <Button
                variant={viewMode === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("day")}
              >
                Day
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Shifts
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schedules.reduce((acc, s) => acc + s.shifts.length, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Scheduled Employees
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedules.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">320h</div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left font-medium text-gray-500 min-w-[150px]">
                    Employee
                  </th>
                  {daysOfWeek.map((day, index) => (
                    <th
                      key={day}
                      className="p-4 text-center font-medium text-gray-500 min-w-[120px]"
                    >
                      <div>{day.slice(0, 3)}</div>
                      <div className="text-xs text-gray-400">
                        {format(weekDays[index], "MMM d")}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {employee.fullName.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-sm">{employee.fullName}</span>
                      </div>
                    </td>
                    {daysOfWeek.map((day) => {
                      const shifts = getShiftsForDay(employee.id, day);
                      return (
                        <td key={day} className="p-2">
                          {shifts.length > 0 ? (
                            <div className="space-y-1">
                              {shifts.map((shift) => (
                                <div
                                  key={shift.id}
                                  className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded p-2 text-xs cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                                  onClick={() => toast.info(`Edit shift: ${shift.startTime} - ${shift.endTime}`)}
                                >
                                  <div className="font-medium text-blue-700 dark:text-blue-300">
                                    {shift.startTime} - {shift.endTime}
                                  </div>
                                  <div className="text-blue-600 dark:text-blue-400">
                                    {shift.role}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div
                              className="h-12 border border-dashed border-gray-200 dark:border-gray-700 rounded flex items-center justify-center cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                              onClick={() => toast.info(`Add shift for ${employee.fullName} on ${day}`)}
                            >
                              <Plus className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
