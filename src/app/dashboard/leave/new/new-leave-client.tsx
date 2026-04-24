"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, differenceInDays, parseISO } from "date-fns";
import {
  ArrowLeft,
  ChevronRight,
  Calendar,
  User,
  FileText,
  Send,
  X,
  Clock,
  Briefcase,
  Heart,
  AlertCircle,
  Umbrella,
  Users,
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
import { useStore } from "@/lib/store";

const LEAVE_TYPES = [
  { 
    value: "Vacation", 
    label: "Vacation", 
    icon: Umbrella,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    description: "Annual paid time off"
  },
  { 
    value: "Sick Leave", 
    label: "Sick Leave", 
    icon: Heart,
    color: "bg-rose-100 text-rose-700 border-rose-200",
    description: "Medical or health-related"
  },
  { 
    value: "Personal", 
    label: "Personal", 
    icon: User,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    description: "Personal matters"
  },
  { 
    value: "Emergency", 
    label: "Emergency", 
    icon: AlertCircle,
    color: "bg-red-100 text-red-700 border-red-200",
    description: "Urgent situations"
  },
  { 
    value: "Maternity/Paternity", 
    label: "Maternity/Paternity", 
    icon: Users,
    color: "bg-pink-100 text-pink-700 border-pink-200",
    description: "Parental leave"
  },
  { 
    value: "Bereavement", 
    label: "Bereavement", 
    icon: Briefcase,
    color: "bg-gray-100 text-gray-700 border-gray-200",
    description: "Family loss"
  },
];

export function NewLeaveClient() {
  const router = useRouter();
  const { employees, addLeaveRequest } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    type: "Vacation",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [calculatedDays, setCalculatedDays] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate days when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = parseISO(formData.startDate);
      const end = parseISO(formData.endDate);
      const days = differenceInDays(end, start) + 1;
      setCalculatedDays(days > 0 ? days : 0);
    } else {
      setCalculatedDays(0);
    }
  }, [formData.startDate, formData.endDate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.employeeId) newErrors.employeeId = "Employee is required";
    if (!formData.type) newErrors.type = "Leave type is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.startDate && formData.endDate) {
      const start = parseISO(formData.startDate);
      const end = parseISO(formData.endDate);
      if (end < start) {
        newErrors.endDate = "End date must be after start date";
      }
    }
    if (!formData.reason.trim()) newErrors.reason = "Reason is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const employee = employees.find((e) => e.id === formData.employeeId);
      if (!employee) {
        toast.error("Employee not found");
        return;
      }

      addLeaveRequest({
        employeeId: employee.id,
        employeeName: employee.fullName,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        status: "Pending",
      });
      
      toast.success(`Leave request submitted for ${employee.fullName}!`);
      router.push("/dashboard/leave");
    } catch (error) {
      toast.error("Failed to submit leave request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/leave");
  };

  const selectedType = LEAVE_TYPES.find(t => t.value === formData.type);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Custom Styles */}
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
        <Link href="/dashboard/leave">
          <Button variant="ghost" size="sm" className="hover:text-blue-600 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Leave
          </Button>
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-400">Leave</span>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-gray-900 dark:text-white">Request Leave</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Request Leave
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Submit a new leave request for approval
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} className="rounded-xl">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
            <Send className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employee Selection Card */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Employee Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <Label htmlFor="employee" className="flex items-center gap-1">
                Select Employee
                <span className="text-rose-500">*</span>
              </Label>
              <select
                id="employee"
                value={formData.employeeId}
                onChange={(e) => {
                  setFormData({ ...formData, employeeId: e.target.value });
                  if (errors.employeeId) setErrors({ ...errors, employeeId: "" });
                }}
                className={`w-full border rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800 ${
                  errors.employeeId 
                    ? "border-rose-300 focus:border-rose-500 dark:border-rose-700" 
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <option value="">Select an employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} — {emp.position}
                  </option>
                ))}
              </select>
              {errors.employeeId && (
                <p className="text-sm text-rose-500">{errors.employeeId}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Leave Type Card */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Leave Type
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label>Select Leave Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {LEAVE_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.type === type.value
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30"
                          : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${type.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {type.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Selection Card */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Date Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-1">
                  Start Date
                  <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => {
                    setFormData({ ...formData, startDate: e.target.value });
                    if (errors.startDate) setErrors({ ...errors, startDate: "" });
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  className={`rounded-xl ${errors.startDate ? "border-rose-300 focus:border-rose-500" : ""}`}
                />
                {errors.startDate && (
                  <p className="text-sm text-rose-500">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center gap-1">
                  End Date
                  <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => {
                    setFormData({ ...formData, endDate: e.target.value });
                    if (errors.endDate) setErrors({ ...errors, endDate: "" });
                  }}
                  min={formData.startDate || new Date().toISOString().split("T")[0]}
                  className={`rounded-xl ${errors.endDate ? "border-rose-300 focus:border-rose-500" : ""}`}
                />
                {errors.endDate && (
                  <p className="text-sm text-rose-500">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Days Calculation */}
            {calculatedDays > 0 && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Leave Days</span>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-lg px-4 py-1">
                    {calculatedDays} {calculatedDays === 1 ? "day" : "days"}
                  </Badge>
                </div>
                {formData.startDate && formData.endDate && (
                  <p className="text-xs text-gray-500 mt-2">
                    {format(parseISO(formData.startDate), "MMM d, yyyy")} — {" "}
                    {format(parseISO(formData.endDate), "MMM d, yyyy")}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reason Card */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              Reason for Leave
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <Label htmlFor="reason" className="flex items-center gap-1">
                Reason
                <span className="text-rose-500">*</span>
              </Label>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => {
                  setFormData({ ...formData, reason: e.target.value });
                  if (errors.reason) setErrors({ ...errors, reason: "" });
                }}
                placeholder="Please provide a detailed reason for your leave request..."
                className={`w-full border rounded-xl px-3 py-2 text-sm min-h-[120px] bg-white dark:bg-gray-800 resize-none ${
                  errors.reason 
                    ? "border-rose-300 focus:border-rose-500 dark:border-rose-700" 
                    : "border-gray-200 dark:border-gray-700"
                }`}
              />
              {errors.reason && (
                <p className="text-sm text-rose-500">{errors.reason}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50">
          <CardContent className="p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Request Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Employee</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {employees.find(e => e.id === formData.employeeId)?.fullName || "—"}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Leave Type</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedType?.label || "—"}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Duration</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {calculatedDays > 0 ? `${calculatedDays} days` : "—"}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                  Pending Approval
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="rounded-xl px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl px-6"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
            <Send className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
}
