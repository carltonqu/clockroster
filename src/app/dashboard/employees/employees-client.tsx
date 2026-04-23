"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Building2,
  Briefcase,
  Filter,
  X,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Mail,
  Phone,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  position: string;
  employmentStatus: string;
  employmentType: string;
  hireDate: string;
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

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; icon: any }> = {
  Active: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  Inactive: {
    bg: "bg-gray-50 dark:bg-gray-900",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-700",
    icon: Clock,
  },
  "On Leave": {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    icon: Clock,
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Active;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}

export function EmployeesClient() {
  const { employees, addEmployee } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    department: "",
    position: "",
    employmentStatus: "Active",
    employmentType: "Full-time",
    hireDate: new Date().toISOString().split("T")[0],
  });

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee(formData);
    toast.success(`Employee ${formData.fullName} added successfully!`);
    setIsDialogOpen(false);
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      department: "",
      position: "",
      employmentStatus: "Active",
      employmentType: "Full-time",
      hireDate: new Date().toISOString().split("T")[0],
    });
  };

  const activeCount = employees.filter((e) => e.employmentStatus === "Active").length;
  const departmentCount = new Set(employees.map((e) => e.department)).size;

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
              Employees
            </h2>
            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-0">
              <Sparkles className="w-3 h-3 mr-1" /> {employees.length} Total
            </Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage your team members and their information
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
            <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <DialogTitle>Add New Employee</DialogTitle>
              </div>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-xs font-medium text-gray-500">Full Name *</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="John Doe"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-medium text-gray-500">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@company.com"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-xs font-medium text-gray-500">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="+1 555-0123"
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-xs font-medium text-gray-500">Department *</Label>
                  <select
                    id="department"
                    required
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800"
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-xs font-medium text-gray-500">Position *</Label>
                  <Input
                    id="position"
                    required
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="Software Engineer"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employmentType" className="text-xs font-medium text-gray-500">Employment Type</Label>
                  <select
                    id="employmentType"
                    value={formData.employmentType}
                    onChange={(e) =>
                      setFormData({ ...formData, employmentType: e.target.value })
                    }
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hireDate" className="text-xs font-medium text-gray-500">Hire Date</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) =>
                      setFormData({ ...formData, hireDate: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl">
                  Add Employee
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total Employees" value={employees.length} gradient="from-blue-500 to-cyan-500" delay={100} />
        <StatCard icon={CheckCircle2} label="Active" value={activeCount} gradient="from-emerald-500 to-green-500" delay={200} />
        <StatCard icon={Building2} label="Departments" value={departmentCount} gradient="from-purple-500 to-pink-500" delay={300} />
      </div>

      {/* Search and Filter */}
      <Card className="border-gray-100 dark:border-gray-800 shadow-sm animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <CardHeader className="pb-4 border-b border-gray-50 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees by name, email, department..."
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
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Employee</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Department</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Position</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee, index) => (
                  <TableRow key={employee.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold">
                          {employee.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{employee.fullName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {employee.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{employee.department}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{employee.position}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={employee.employmentStatus} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{employee.employmentType}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredEmployees.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No employees found</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
