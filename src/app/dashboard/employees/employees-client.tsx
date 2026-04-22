"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Building2,
  Briefcase,
  Filter,
  X,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "Inactive":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
      case "On Leave":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employees
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your team members and their information
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@company.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="+1 555-0123"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <select
                    id="department"
                    required
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
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
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    required
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <select
                    id="employmentType"
                    value={formData.employmentType}
                    onChange={(e) =>
                      setFormData({ ...formData, employmentType: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hireDate">Hire Date</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) =>
                      setFormData({ ...formData, hireDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Employee</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {employees.filter((e) => e.employmentStatus === "Active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(employees.map((e) => e.department)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={() => toast.info("Filter feature coming soon!")}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {employee.fullName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{employee.fullName}</p>
                            <p className="text-sm text-gray-500">{employee.employeeId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-gray-400" />
                          <span>{employee.department}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3 text-gray-400" />
                          <span>{employee.position}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(employee.employmentStatus)}>
                          {employee.employmentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {employee.employmentType}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => toast.info(`View ${employee.fullName}`)}
                            >
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toast.info(`Edit ${employee.fullName}`)}
                            >
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
