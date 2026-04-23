"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  DollarSign,
  Download,
  Calculator,
  CheckCircle,
  Send,
  Filter,
  Plus,
  Sparkles,
  Search,
  X,
  Wallet,
  TrendingDown,
  TrendingUp,
  Clock,
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
  prefix = "",
}: {
  icon: any;
  label: string;
  value: number;
  gradient: string;
  delay?: number;
  prefix?: string;
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
          {prefix}<AnimatedCounter value={value} />
        </div>
      </CardContent>
    </Card>
  );
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string }> = {
  RELEASED: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  APPROVED: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
  },
  DRAFT: {
    bg: "bg-gray-50 dark:bg-gray-900",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-700",
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {status}
    </span>
  );
}

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

  const totalGrossPay = payrollEntries.reduce((acc, e) => acc + e.grossPay, 0);
  const totalNetPay = payrollEntries.reduce((acc, e) => acc + e.netPay, 0);
  const totalDeductions = payrollEntries.reduce((acc, e) => acc + e.deductions, 0);
  const totalHours = payrollEntries.reduce((acc, e) => acc + e.hoursWorked, 0);

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
              Payroll
            </h2>
            <Badge className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-0">
              <Sparkles className="w-3 h-3 mr-1" /> {payrollEntries.length} Entries
            </Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage employee payroll and compensation
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md rounded-xl">
                <Plus className="mr-2 h-4 w-4" />
                Add Payroll
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
              <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <DialogTitle>Add Payroll Entry</DialogTitle>
                </div>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="employee" className="text-xs font-medium text-gray-500">Employee *</Label>
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
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800"
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
                    <Label htmlFor="periodStart" className="text-xs font-medium text-gray-500">Period Start *</Label>
                    <Input
                      id="periodStart"
                      type="date"
                      required
                      value={formData.periodStart}
                      onChange={(e) =>
                        setFormData({ ...formData, periodStart: e.target.value })
                      }
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="periodEnd" className="text-xs font-medium text-gray-500">Period End *</Label>
                    <Input
                      id="periodEnd"
                      type="date"
                      required
                      value={formData.periodEnd}
                      onChange={(e) =>
                        setFormData({ ...formData, periodEnd: e.target.value })
                      }
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basicPay" className="text-xs font-medium text-gray-500">Basic Pay *</Label>
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
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otPay" className="text-xs font-medium text-gray-500">Overtime Pay</Label>
                    <Input
                      id="otPay"
                      type="number"
                      value={formData.otPay}
                      onChange={(e) =>
                        setFormData({ ...formData, otPay: Number(e.target.value) })
                      }
                      onBlur={calculateNetPay}
                      placeholder="0"
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deductions" className="text-xs font-medium text-gray-500">Deductions</Label>
                    <Input
                      id="deductions"
                      type="number"
                      value={formData.deductions}
                      onChange={(e) =>
                        setFormData({ ...formData, deductions: Number(e.target.value) })
                      }
                      onBlur={calculateNetPay}
                      placeholder="0"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hoursWorked" className="text-xs font-medium text-gray-500">Hours Worked</Label>
                    <Input
                      id="hoursWorked"
                      type="number"
                      value={formData.hoursWorked}
                      onChange={(e) =>
                        setFormData({ ...formData, hoursWorked: Number(e.target.value) })
                      }
                      placeholder="80"
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Gross Pay:</span>
                    <span className="font-medium text-gray-900 dark:text-white">${formData.grossPay.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Deductions:</span>
                    <span className="font-medium text-rose-600">-${formData.deductions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-900 dark:text-white">Net Pay:</span>
                    <span className="text-emerald-600">${formData.netPay.toLocaleString()}</span>
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
                  <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl">
                    Add Payroll Entry
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => toast.info("Export feature coming soon!")} className="rounded-xl">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Total Gross Pay" value={totalGrossPay} gradient="from-blue-500 to-cyan-500" delay={100} prefix="$" />
        <StatCard icon={TrendingDown} label="Total Deductions" value={totalDeductions} gradient="from-rose-500 to-pink-500" delay={200} prefix="$" />
        <StatCard icon={Wallet} label="Net Pay" value={totalNetPay} gradient="from-emerald-500 to-green-500" delay={300} prefix="$" />
        <StatCard icon={Clock} label="Total Hours" value={totalHours} gradient="from-purple-500 to-pink-500" delay={400} suffix="h" />
      </div>

      {/* Search and Table */}
      <Card className="border-gray-100 dark:border-gray-800 shadow-sm animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <CardHeader className="pb-4 border-b border-gray-50 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by employee or period..."
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
            <Button variant="outline" className="ml-auto rounded-xl" onClick={() => toast.info("Filter feature coming soon!")}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Employee</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Period</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hours</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gross Pay</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Deductions</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Net Pay</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4">
                          <DollarSign className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No payroll entries found</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add your first payroll entry</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                            {entry.employeeName.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{entry.employeeName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {format(new Date(entry.periodStart), "MMM d")} -{" "}
                        {format(new Date(entry.periodEnd), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">{entry.hoursWorked}h</TableCell>
                      <TableCell className="text-gray-900 dark:text-white">${entry.grossPay.toLocaleString()}</TableCell>
                      <TableCell className="text-rose-600">${entry.deductions.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-emerald-600">
                        ${entry.netPay.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={entry.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {entry.status === "DRAFT" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.success(`Approved payroll for ${entry.employeeName}`)}
                              className="rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                          {entry.status === "APPROVED" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.success(`Released payroll for ${entry.employeeName}`)}
                              className="rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                            >
                              <Send className="h-4 w-4 text-emerald-600" />
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
