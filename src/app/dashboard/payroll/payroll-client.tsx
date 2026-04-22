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
  TrendingUp,
  Users,
  Clock,
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

interface PayrollEntry {
  id: string;
  userId: string;
  employeeName: string;
  periodStart: string;
  periodEnd: string;
  status: "DRAFT" | "APPROVED" | "RELEASED";
  basicPay: number;
  otPay: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  hoursWorked: number;
}

interface Employee {
  id: string;
  fullName: string;
}

interface PayrollClientProps {
  entries: PayrollEntry[];
  employees: Employee[];
}

export function PayrollClient({ entries, employees }: PayrollClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntries = entries.filter(
    (entry) =>
      entry.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.periodStart.includes(searchQuery)
  );

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

  const totalGrossPay = entries.reduce((acc, e) => acc + e.grossPay, 0);
  const totalNetPay = entries.reduce((acc, e) => acc + e.netPay, 0);
  const totalDeductions = entries.reduce((acc, e) => acc + e.deductions, 0);

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
          <Button variant="outline" onClick={() => toast.info("Export feature coming soon!")}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => toast.info("Generate payroll feature coming soon!")}>
            <Calculator className="mr-2 h-4 w-4" />
            Generate Payroll
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
            <TrendingUp className="h-4 w-4 text-orange-600" />
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
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {entries.reduce((acc, e) => acc + e.hoursWorked, 0)}h
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
