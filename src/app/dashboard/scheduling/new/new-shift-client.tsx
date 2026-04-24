"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ChevronRight,
  User,
  Building2,
  Users2,
  Calendar,
  Briefcase,
  CheckCircle2,
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface Employee {
  id: string;
  fullName: string;
  department: string;
}

interface NewShiftClientProps {
  employees: Employee[];
}

type AssignmentType = "person" | "department" | "team";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function NewShiftClient({ employees }: NewShiftClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    assignmentType: "person" as AssignmentType,
    selectedEmployees: [] as string[],
    selectedDepartment: "",
    selectedTeam: "",
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "17:00",
    role: "",
  });

  const departments = Array.from(
    new Set(employees.map((e) => e.department).filter(Boolean))
  );

  const toggleEmployeeSelection = (employeeId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.includes(employeeId)
        ? prev.selectedEmployees.filter((id) => id !== employeeId)
        : [...prev.selectedEmployees, employeeId],
    }));
  };

  const getEmployeesByDepartment = (dept: string) => {
    return employees.filter((e) => e.department === dept);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Shift created successfully!");
    router.push("/dashboard/scheduling");
  };

  const getSelectedCount = () => {
    if (formData.assignmentType === "person") {
      return formData.selectedEmployees.length;
    } else if (formData.assignmentType === "department") {
      return formData.selectedDepartment
        ? getEmployeesByDepartment(formData.selectedDepartment).length
        : 0;
    } else {
      return formData.selectedTeam
        ? getEmployeesByDepartment(formData.selectedTeam).length
        : 0;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/scheduling">
          <Button variant="ghost" size="sm" className="hover:text-blue-600 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Scheduling
          </Button>
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-400">Scheduling</span>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-gray-900 dark:text-white">Add New Shift</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Shift
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Create a new shift for employees
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/scheduling")}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || getSelectedCount() === 0}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white"
          >
            {isSubmitting ? "Creating..." : "Create Shift"}
          </Button>
        </div>
      </div>

      {/* Selected Count Badge */}
      {getSelectedCount() > 0 && (
        <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-0">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {getSelectedCount()} employee(s) will be assigned
        </Badge>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignment Type */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Assign To
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <RadioGroup
              value={formData.assignmentType}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
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

            {/* Dynamic Selection */}
            {formData.assignmentType === "person" && (
              <div className="space-y-3 animate-fade-in-up">
                <Label className="text-sm font-medium text-gray-700">Select Employees</Label>
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 max-h-[300px] overflow-y-auto">
                  <div className="space-y-2">
                    {employees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                        onClick={() => toggleEmployeeSelection(employee.id)}
                      >
                        <Checkbox
                          checked={formData.selectedEmployees.includes(employee.id)}
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
              </div>
            )}

            {formData.assignmentType === "department" && (
              <div className="space-y-3 animate-fade-in-up">
                <Label className="text-sm font-medium text-gray-700">Select Department</Label>
                <select
                  value={formData.selectedDepartment}
                  onChange={(e) => setFormData({ ...formData, selectedDepartment: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800"
                >
                  <option value="">Choose a department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.assignmentType === "team" && (
              <div className="space-y-3 animate-fade-in-up">
                <Label className="text-sm font-medium text-gray-700">Select Team</Label>
                <select
                  value={formData.selectedTeam}
                  onChange={(e) => setFormData({ ...formData, selectedTeam: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800"
                >
                  <option value="">Choose a team</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shift Details */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              Shift Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Day of Week</Label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800"
              >
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Start Time</Label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">End Time</Label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Role / Position</Label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Senior Developer"
                className="rounded-xl"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
