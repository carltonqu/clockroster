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
  Briefcase,
  User,
  Building2,
  Users2,
  Check,
  Eye,
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
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

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

type AssignmentType = "person" | "department" | "team";

interface AddShiftFormData {
  assignmentType: AssignmentType;
  selectedEmployees: string[];
  selectedDepartment: string;
  selectedTeam: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  role: string;
  weekOffset: number;
}

export function SchedulingClient({ schedules, employees }: SchedulingClientProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [shiftFormData, setShiftFormData] = useState<AddShiftFormData>({
    assignmentType: "person",
    selectedEmployees: [],
    selectedDepartment: "",
    selectedTeam: "",
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "17:00",
    role: "",
    weekOffset: 0,
  });
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

  const getDepartments = () => {
    const depts = new Set(employees.map((e) => e.department).filter(Boolean));
    return Array.from(depts);
  };

  const getEmployeesByDepartment = (dept: string) => {
    return employees.filter((e) => e.department === dept);
  };

  const getPreviewEmployees = () => {
    switch (shiftFormData.assignmentType) {
      case "person":
        return employees.filter((e) => shiftFormData.selectedEmployees.includes(e.id));
      case "department":
        return shiftFormData.selectedDepartment
          ? getEmployeesByDepartment(shiftFormData.selectedDepartment)
          : [];
      case "team":
        return shiftFormData.selectedTeam
          ? getEmployeesByDepartment(shiftFormData.selectedTeam)
          : [];
      default:
        return [];
    }
  };

  const handleAddShift = () => {
    const previewEmployees = getPreviewEmployees();
    if (previewEmployees.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    const targetWeekStart = format(
      addDays(startOfWeek(currentWeek, { weekStartsOn: 1 }), shiftFormData.weekOffset * 7),
      "yyyy-MM-dd"
    );

    const newSchedules = [...localSchedules];
    
    previewEmployees.forEach((employee) => {
      const existingScheduleIndex = newSchedules.findIndex(
        (s) => s.employeeId === employee.id && s.weekStart === targetWeekStart
      );
      
      const newShift = {
        id: `shift-${Date.now()}-${employee.id}`,
        day: shiftFormData.dayOfWeek,
        startTime: shiftFormData.startTime,
        endTime: shiftFormData.endTime,
        role: shiftFormData.role || employee.position || "Staff",
      };

      if (existingScheduleIndex >= 0) {
        newSchedules[existingScheduleIndex] = {
          ...newSchedules[existingScheduleIndex],
          shifts: [...newSchedules[existingScheduleIndex].shifts, newShift],
        };
      } else {
        newSchedules.push({
          id: `sched-${Date.now()}-${employee.id}`,
          employeeId: employee.id,
          employeeName: employee.fullName,
          weekStart: targetWeekStart,
          shifts: [newShift],
        });
      }
    });

    setLocalSchedules(newSchedules);
    toast.success(`Shift added for ${previewEmployees.length} employee(s)`);
    setIsAddShiftOpen(false);
    setShiftFormData({
      assignmentType: "person",
      selectedEmployees: [],
      selectedDepartment: "",
      selectedTeam: "",
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "17:00",
      role: "",
      weekOffset: 0,
    });
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    setShiftFormData((prev) => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.includes(employeeId)
        ? prev.selectedEmployees.filter((id) => id !== employeeId)
        : [...prev.selectedEmployees, employeeId],
    }));
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalShifts = localSchedules.reduce((acc, s) => acc + s.shifts.length, 0);
  const scheduledEmployees = localSchedules.filter((s) => s.shifts.length > 0).length;
  const departments = getDepartments();

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
          <Dialog open={isAddShiftOpen} onOpenChange={setIsAddShiftOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md rounded-xl">
                <Plus className="mr-2 h-4 w-4" />
                Add Shift
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-[1440px] max-h-[90vh] overflow-y-auto rounded-2xl p-0">
              <DialogHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <DialogTitle>Add New Shift</DialogTitle>
                </div>
              </DialogHeader>

              <div className="p-6 space-y-6">
                {/* Assignment Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Assign To</Label>
                  <RadioGroup
                    value={shiftFormData.assignmentType}
                    onValueChange={(value) =>
                      setShiftFormData({
                        ...shiftFormData,
                        assignmentType: value as AssignmentType,
                        selectedEmployees: [],
                        selectedDepartment: "",
                        selectedTeam: "",
                      })
                    }
                    className="grid grid-cols-3 gap-3"
                  >
                    <div>
                      <RadioGroupItem value="person" id="person" className="peer sr-only" />
                      <Label
                        htmlFor="person"
                        className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all hover:border-blue-400 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-500 dark:peer-data-[state=checked]:bg-blue-950/30"
                      >
                        <User className="w-5 h-5 mb-2 text-gray-500 peer-data-[state=checked]:text-blue-500" />
                        <span className="text-sm font-medium">Person</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="department" id="department" className="peer sr-only" />
                      <Label
                        htmlFor="department"
                        className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all hover:border-blue-400 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-500 dark:peer-data-[state=checked]:bg-blue-950/30"
                      >
                        <Building2 className="w-5 h-5 mb-2 text-gray-500 peer-data-[state=checked]:text-blue-500" />
                        <span className="text-sm font-medium">Department</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="team" id="team" className="peer sr-only" />
                      <Label
                        htmlFor="team"
                        className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all hover:border-blue-400 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-500 dark:peer-data-[state=checked]:bg-blue-950/30"
                      >
                        <Users2 className="w-5 h-5 mb-2 text-gray-500 peer-data-[state=checked]:text-blue-500" />
                        <span className="text-sm font-medium">Team</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Dynamic Selection Based on Type */}
                {shiftFormData.assignmentType === "person" && (
                  <div className="space-y-3 animate-fade-in-up">
                    <Label className="text-sm font-medium text-gray-700">Select Employees</Label>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 max-h-[200px] overflow-y-auto">
                      <div className="space-y-2">
                        {employees.map((employee) => (
                          <div
                            key={employee.id}
                            className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                            onClick={() => toggleEmployeeSelection(employee.id)}
                          >
                            <Checkbox
                              checked={shiftFormData.selectedEmployees.includes(employee.id)}
                              onCheckedChange={() => toggleEmployeeSelection(employee.id)}
                            />
                            <div className="flex items-center gap-2 flex-1">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                                {employee.fullName.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{employee.fullName}</p>
                                <p className="text-xs text-gray-500">{employee.department}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {shiftFormData.selectedEmployees.length > 0 && (
                      <p className="text-sm text-blue-600">
                        {shiftFormData.selectedEmployees.length} employee(s) selected
                      </p>
                    )}
                  </div>
                )}

                {shiftFormData.assignmentType === "department" && (
                  <div className="space-y-3 animate-fade-in-up">
                    <Label htmlFor="dept-select" className="text-sm font-medium text-gray-700">Select Department</Label>
                    <select
                      id="dept-select"
                      value={shiftFormData.selectedDepartment}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, selectedDepartment: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 h-12"
                    >
                      <option value="">Choose a department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {shiftFormData.selectedDepartment && (
                      <p className="text-sm text-blue-600">
                        {getEmployeesByDepartment(shiftFormData.selectedDepartment).length} employee(s) in this department
                      </p>
                    )}
                  </div>
                )}

                {shiftFormData.assignmentType === "team" && (
                  <div className="space-y-3 animate-fade-in-up">
                    <Label htmlFor="team-select" className="text-sm font-medium text-gray-700">Select Team</Label>
                    <select
                      id="team-select"
                      value={shiftFormData.selectedTeam}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, selectedTeam: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 h-12"
                    >
                      <option value="">Choose a team</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {shiftFormData.selectedTeam && (
                      <p className="text-sm text-blue-600">
                        {getEmployeesByDepartment(shiftFormData.selectedTeam).length} employee(s) in this team
                      </p>
                    )}
                  </div>
                )}

                {/* Shift Details */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">Shift Details</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="day" className="text-xs text-gray-500">Day of Week</Label>
                      <select
                        id="day"
                        value={shiftFormData.dayOfWeek}
                        onChange={(e) => setShiftFormData({ ...shiftFormData, dayOfWeek: e.target.value })}
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm bg-white dark:bg-gray-800 h-10"
                      >
                        {daysOfWeek.map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-xs text-gray-500">Role/Position</Label>
                      <Input
                        id="role"
                        value={shiftFormData.role}
                        onChange={(e) => setShiftFormData({ ...shiftFormData, role: e.target.value })}
                        placeholder="e.g., Manager"
                        className="rounded-xl h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startTime" className="text-xs text-gray-500">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={shiftFormData.startTime}
                        onChange={(e) => setShiftFormData({ ...shiftFormData, startTime: e.target.value })}
                        className="rounded-xl h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime" className="text-xs text-gray-500">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={shiftFormData.endTime}
                        onChange={(e) => setShiftFormData({ ...shiftFormData, endTime: e.target.value })}
                        className="rounded-xl h-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Week Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Week</Label>
                  <RadioGroup
                    value={String(shiftFormData.weekOffset)}
                    onValueChange={(value) => setShiftFormData({ ...shiftFormData, weekOffset: Number(value) })}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div>
                      <RadioGroupItem value="0" id="current-week" className="peer sr-only" />
                      <Label
                        htmlFor="current-week"
                        className="flex items-center justify-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer transition-all hover:border-blue-400 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-500 dark:peer-data-[state=checked]:bg-blue-950/30"
                      >
                        <span className="text-sm font-medium">Current Week</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="1" id="next-week" className="peer sr-only" />
                      <Label
                        htmlFor="next-week"
                        className="flex items-center justify-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer transition-all hover:border-blue-400 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-500 dark:peer-data-[state=checked]:bg-blue-950/30"
                      >
                        <span className="text-sm font-medium">Next Week</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Preview */}
                {getPreviewEmployees().length > 0 && (
                  <div className="space-y-3 animate-fade-in-up">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <Label className="text-sm font-medium text-gray-700">Preview: Affected Employees</Label>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 max-h-[150px] overflow-y-auto">
                      <div className="flex flex-wrap gap-2">
                        {getPreviewEmployees().map((emp) => (
                          <Badge
                            key={emp.id}
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {emp.fullName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="font-medium text-blue-900 dark:text-blue-300">Shift Summary:</p>
                      <p>{shiftFormData.dayOfWeek}, {shiftFormData.startTime} - {shiftFormData.endTime}</p>
                      <p>For {getPreviewEmployees().length} employee(s)</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddShiftOpen(false)}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddShift}
                    disabled={getPreviewEmployees().length === 0}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Add Shift
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
