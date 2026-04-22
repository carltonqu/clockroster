"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  DollarSign,
  Download,
  Calculator,
  CheckCircle,
  Send,
  Filter,
  Plus,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export function PayrollClient() {
  const { payrollEntries, employees, addPayrollEntry } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    employeeName: "",
    periodStart: "",
    periodEnd: "",
    status: "DRAFT" as const,
    basicPay: 0,
    otPay: 0,
    grossPay: 0,
    deductions: 0,
    netPay: 0,
    hoursWorked: 0,
  });

  const filteredEntries = payrollEntries.filter(
    (entry) =>
      entry.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.periodStart.includes(searchQuery)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPayrollEntry(formData);
    toast.success(`Payroll entry for ${formData.employeeName} added successfully!`);
    setIsDialogOpen(false);
    setFormData({
      userId: "",
      employeeName: "",
      periodStart: "",
      periodEnd: "",
      status: "DRAFT",
      basicPay: 0,
      otPay: 0,
      grossPay: 0,
      deductions: 0,
      netPay: 0,
      hoursWorked: 0,
    });
  };

  const calculateNetPay = () => {
    const gross = formData.basicPay + formData.otPay;
    const net = gross - formData.deductions;
    setFormData({ ...formData, grossPay: gross, netPay: net });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RELEASED":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "APPROVED":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "DRAFT":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const totalGrossPay = payrollEntries.reduce((acc, e) => acc + e.grossPay, 0);
  const totalNetPay = payrollEntries.reduce((acc, e) => acc + e.netPay, 0);
  const totalDeductions = payrollEntries.reduce((acc, e) => acc + e.deductions, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payroll
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage employee payroll and compensation
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Payroll
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Payroll Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Employee *</Label>
                  <select
                    id="employee"
                    required
                    value={formData.userId}
                    onChange={(e) => {
                      const emp = employees.find((emp) => emp.id === e.target.value);
                      setFormData({
                        ...formData,
                        userId: e.target.value,
                        employeeName: emp?.fullName || "",
                      });
                    }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="periodStart">Period Start *</Label>
                    <Input
                      id="periodStart"
                      type="date"
                      required
                      value={formData.periodStart}
                      onChange={(e) =>
                        setFormData({ ...formData, periodStart: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="periodEnd">Period End *</Label>
                    <Input
                      id="periodEnd"
                      type="date"
                      required
                      value={formData.periodEnd}
                      onChange={(e) =>
                        setFormData({ ...formData, periodEnd: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basicPay">Basic Pay *</Label>
                    <Input
                      id="basicPay"
                      type="number"
                      required
                      value={formData.basicPay}
                      onChange={(e) =>
                        setFormData({ ...formData, basicPay: Number(e.target.value) })
                      }
                      onBlur={calculateNetPay}
                      placeholder="3000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otPay">Overtime Pay</Label>
                    <Input
                      id="otPay"
                      type="number"
                      value={formData.otPay}
                      onChange={(e) =>
                        setFormData({ ...formData, otPay: Number(e.target.value) })
                      }
                      onBlur={calculateNetPay}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deductions">Deductions</Label>
                    <Input
                      id="deductions"
                      type="number"
                      value={formData.deductions}
                      onChange={(e) =>
                        setFormData({ ...formData, deductions: Number(e.target.value) })
                      }
                      onBlur={calculateNetPay}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hoursWorked">Hours Worked</Label>
                    <Input
                      id="hoursWorked"
                      type="number"
                      value={formData.hoursWorked}
                      onChange={(e) =>
                        setFormData({ ...formData, hoursWorked: Number(e.target.value) })
                      }
                      placeholder="80"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Gross Pay:</span>
                    <span className="font-medium">${formData.grossPay.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Deductions:</span>
                    <span className="font-medium text-red-600">-${formData.deductions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t">
                    <span>Net Pay:</span>
                    <span className="text-green-600">${formData.netPay.toLocaleString()}</span>
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
                  <Button type="submit">Add Payroll Entry</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => toast.info("Export feature coming soon!")}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Gross Pay
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalGrossPay.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Deductions
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDeductions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Net Pay
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalNetPay.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Hours
            </CardTitle>
            <Calculator className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payrollEntries.reduce((acc, e) => acc + e.hoursWorked, 0)}h
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Input
              placeholder="Search by employee or period..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline" className="ml-auto" onClick={() => toast.info("Filter feature coming soon!")}>
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
                  <TableHead>Period</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Gross Pay</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Pay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No payroll entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {entry.employeeName}
                      </TableCell>
                      <TableCell>
                        {format(new Date(entry.periodStart), "MMM d")} -{" "}
                        {format(new Date(entry.periodEnd), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{entry.hoursWorked}h</TableCell>
                      <TableCell>${entry.grossPay.toLocaleString()}</TableCell>
                      <TableCell>${entry.deductions.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">
                        ${entry.netPay.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {entry.status === "DRAFT" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.success(`Approved payroll for ${entry.employeeName}`)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {entry.status === "APPROVED" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.success(`Released payroll for ${entry.employeeName}`)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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
