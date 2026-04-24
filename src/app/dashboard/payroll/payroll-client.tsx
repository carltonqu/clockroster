"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { format, addDays, endOfMonth, setDate } from "date-fns";
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
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Trash2,
  Eye,
  FileText,
  Building,
  User,
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
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { Employee, PayrollEntry, Holiday } from "@/lib/mock-data";
import { computePayroll, PayrollBreakdown, PayrollInput } from "@/lib/payroll-engine";

// ─── Types ──────────────────────────────────────────────────────────

interface PayrollClientProps {
  entries: PayrollEntry[];
  employees: Employee[];
  currentUserId?: string;
  userRole?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────

function fmt(n: number) {
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function periodEndDate(start: string, type: string): string {
  const d = new Date(start);
  if (type === "WEEKLY") {
    d.setDate(d.getDate() + 6);
  } else if (type === "SEMI_MONTHLY") {
    if (d.getDate() <= 15) {
      d.setDate(15);
    } else {
      d.setMonth(d.getMonth() + 1, 0);
    }
  } else {
    d.setMonth(d.getMonth() + 1, 0);
  }
  return d.toISOString().split("T")[0];
}

// ─── Animation Components ───────────────────────────────────────────

function AnimatedCounter({ value, prefix = "" }: { value: number; prefix?: string }) {
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
  return <span>{prefix}{displayValue.toLocaleString()}</span>;
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
      className="border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:shadow-emerald-100/50 dark:hover:shadow-emerald-900/20 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
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
          <AnimatedCounter value={value} prefix={prefix} />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Status Badge ───────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  RELEASED: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    gradient: "from-emerald-500 to-green-500",
  },
  APPROVED: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    gradient: "from-blue-500 to-cyan-500",
  },
  DRAFT: {
    bg: "bg-gray-50 dark:bg-gray-900",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-700",
    gradient: "from-gray-400 to-gray-500",
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

// ─── Payslip View Component ─────────────────────────────────────────

function PayslipView({ entry }: { entry: PayrollEntry }) {
  const totalDeductions =
    entry.lateDeduction +
    entry.undertimeDeduction +
    entry.absenceDeduction +
    entry.sssEmployee +
    entry.philhealthEmployee +
    entry.pagibigEmployee +
    entry.withholdingTax +
    entry.totalOtherDeductions;

  return (
    <div className="font-mono text-sm space-y-4">
      <div className="text-center border-b pb-3">
        <h3 className="text-lg font-bold">PAYSLIP</h3>
        <p className="text-gray-500">{entry.employeeName}</p>
        <p className="text-xs text-gray-400">
          {format(new Date(entry.periodStart), "MMM d")} — {format(new Date(entry.periodEnd), "MMM d, yyyy")} · {entry.periodType}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Earnings */}
        <div className="space-y-1">
          <p className="font-bold text-xs uppercase tracking-wide text-gray-400 mb-2">Earnings</p>
          <PayslipRow label="Basic Pay" value={entry.basicPay} />
          {entry.otPay > 0 && <PayslipRow label="OT Pay" value={entry.otPay} />}
          {entry.nightDiffPay > 0 && <PayslipRow label="Night Differential" value={entry.nightDiffPay} />}
          {entry.holidayPay > 0 && <PayslipRow label="Holiday Pay" value={entry.holidayPay} />}
          {entry.allowances.map((a, i) => (
            <PayslipRow key={i} label={a.name} value={a.amount} />
          ))}
        </div>

        {/* Deductions */}
        <div className="space-y-1">
          <p className="font-bold text-xs uppercase tracking-wide text-gray-400 mb-2">Deductions</p>
          {entry.lateDeduction > 0 && <PayslipRow label="Late" value={entry.lateDeduction} red />}
          {entry.undertimeDeduction > 0 && <PayslipRow label="Undertime" value={entry.undertimeDeduction} red />}
          {entry.absenceDeduction > 0 && <PayslipRow label="Absences" value={entry.absenceDeduction} red />}
          <PayslipRow label="SSS" value={entry.sssEmployee} red />
          <PayslipRow label="PhilHealth" value={entry.philhealthEmployee} red />
          <PayslipRow label="Pag-IBIG" value={entry.pagibigEmployee} red />
          <PayslipRow label="Withholding Tax" value={entry.withholdingTax} red />
          {entry.otherDeductions.map((d, i) => (
            <PayslipRow key={i} label={d.name} value={d.amount} red />
          ))}
        </div>
      </div>

      <div className="border-t pt-3 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Gross Pay</span>
          <span className="font-semibold">{fmt(entry.grossPay)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Total Deductions</span>
          <span className="font-semibold text-red-500">{fmt(totalDeductions)}</span>
        </div>
        <div className="flex justify-between bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 rounded-lg px-3 py-2 mt-2">
          <span className="font-bold text-emerald-700 dark:text-emerald-400">NET PAY</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-400 text-lg">{fmt(entry.netPay)}</span>
        </div>
      </div>

      {/* Rate Info */}
      <div className="text-xs text-gray-400 pt-2 border-t">
        <div className="flex justify-between">
          <span>Rate Type: {entry.rateType}</span>
          <span>Rate: {fmt(entry.rate)}</span>
        </div>
        <div className="flex justify-between">
          <span>Daily: {fmt(entry.dailyRate)}</span>
          <span>Hourly: {fmt(entry.hourlyRate)}</span>
        </div>
      </div>
    </div>
  );
}

function PayslipRow({ label, value, red }: { label: string; value: number; red?: boolean }) {
  if (value === 0) return null;
  return (
    <div className="flex justify-between text-xs">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className={red ? "text-red-500" : ""}>{fmt(value)}</span>
    </div>
  );
}

// ─── Breakdown Preview Component ────────────────────────────────────

function BreakdownPreview({ bd }: { bd: PayrollBreakdown }) {
  const totalDeductions =
    bd.lateDeduction +
    bd.undertimeDeduction +
    bd.absenceDeduction +
    bd.sssEmployee +
    bd.philhealthEmployee +
    bd.pagibigEmployee +
    bd.withholdingTax +
    bd.totalOtherDeductions;

  return (
    <div className="font-mono text-sm space-y-4">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="font-bold text-xs uppercase tracking-wide text-gray-400 mb-2">Earnings</p>
          <BdRow label="Basic Pay" value={bd.basicPay} />
          {bd.totalOTPay > 0 && <BdRow label="OT Pay" value={bd.totalOTPay} />}
          {bd.nightDiffPay > 0 && <BdRow label="Night Differential" value={bd.nightDiffPay} />}
          {bd.totalHolidayPay > 0 && <BdRow label="Holiday Pay" value={bd.totalHolidayPay} />}
          {bd.allowances.map((a, i) => (
            <BdRow key={i} label={a.name} value={a.amount} />
          ))}
        </div>
        <div className="space-y-1">
          <p className="font-bold text-xs uppercase tracking-wide text-gray-400 mb-2">Deductions</p>
          {bd.lateDeduction > 0 && <BdRow label="Late" value={bd.lateDeduction} red />}
          {bd.undertimeDeduction > 0 && <BdRow label="Undertime" value={bd.undertimeDeduction} red />}
          {bd.absenceDeduction > 0 && <BdRow label="Absences" value={bd.absenceDeduction} red />}
          <BdRow label="SSS" value={bd.sssEmployee} red />
          <BdRow label="PhilHealth" value={bd.philhealthEmployee} red />
          <BdRow label="Pag-IBIG" value={bd.pagibigEmployee} red />
          <BdRow label="Withholding Tax" value={bd.withholdingTax} red />
          {bd.otherDeductions.map((d, i) => (
            <BdRow key={i} label={d.name} value={d.amount} red />
          ))}
        </div>
      </div>
      <div className="border-t pt-3 space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Gross Pay</span>
          <span className="font-semibold">{fmt(bd.grossPay)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Total Deductions</span>
          <span className="font-semibold text-red-500">{fmt(totalDeductions)}</span>
        </div>
        <div className="flex justify-between bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 rounded-lg px-3 py-2 mt-2">
          <span className="font-bold text-emerald-700 dark:text-emerald-400">NET PAY</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-400 text-lg">{fmt(bd.netPay)}</span>
        </div>
      </div>
    </div>
  );
}

function BdRow({ label, value, red }: { label: string; value: number; red?: boolean }) {
  if (value === 0) return null;
  return (
    <div className="flex justify-between text-xs">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className={red ? "text-red-500" : ""}>{fmt(value)}</span>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────

export function PayrollClient({ entries: initialEntries, employees, currentUserId, userRole }: PayrollClientProps) {
  const isAdmin = userRole === "MANAGER" || userRole === "HR" || true; // Default to admin for demo
  const { addPayrollEntry, approvePayroll, releasePayroll, holidays, addHoliday, deleteHoliday } = useStore();
  
  const [entries, setEntries] = useState<PayrollEntry[]>(initialEntries);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewEntry, setViewEntry] = useState<PayrollEntry | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  
  // Tabs
  const [tab, setTab] = useState<"run" | "history" | "holidays">("history");

  // Run Payroll Wizard
  const [step, setStep] = useState(1);
  const [computing, setComputing] = useState(false);
  const [breakdown, setBreakdown] = useState<PayrollBreakdown | null>(null);
  
  // Step 1: Employee & Period
  const [selectedUserId, setSelectedUserId] = useState(employees[0]?.id || "");
  const [periodType, setPeriodType] = useState<"WEEKLY" | "SEMI_MONTHLY" | "MONTHLY">("SEMI_MONTHLY");
  const [periodStart, setPeriodStart] = useState(
    format(setDate(new Date(), 1), "yyyy-MM-dd")
  );
  const [periodEnd, setPeriodEnd] = useState(
    periodEndDate(format(setDate(new Date(), 1), "yyyy-MM-dd"), "SEMI_MONTHLY")
  );

  // Step 2: Attendance
  const [attendance, setAttendance] = useState({
    daysWorked: 11,
    hoursWorked: 88,
    lateMinutes: 0,
    undertimeMinutes: 0,
    absenceDays: 0,
    regularOTHours: 0,
    restDayOTHours: 0,
    nightDiffHours: 0,
    regularHolidayWorkedHours: 0,
    specialHolidayWorkedHours: 0,
  });

  // Step 3: Allowances & Deductions
  const [allowances, setAllowances] = useState<{ name: string; amount: number }[]>([]);
  const [otherDeductions, setOtherDeductions] = useState<{ name: string; amount: number }[]>([]);

  // Holiday Form
  const [holidayForm, setHolidayForm] = useState<{ name: string; date: string; type: "Regular" | "Special" }>({ name: "", date: "", type: "Regular" });

  const selectedEmployee = employees.find((e) => e.id === selectedUserId);

  // Stats
  const totalGrossPay = entries.reduce((acc, e) => acc + e.grossPay, 0);
  const totalNetPay = entries.reduce((acc, e) => acc + e.netPay, 0);
  const totalDeductions = entries.reduce((acc, e) => acc + e.totalDeductions, 0);
  const totalHours = entries.reduce((acc, e) => acc + e.hoursWorked, 0);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch = entry.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.periodStart.includes(searchQuery);
      const matchesStatus = filterStatus === "All" || entry.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [entries, searchQuery, filterStatus]);

  // Attendance field setter
  const setAtt = useCallback((key: keyof typeof attendance, val: number) => {
    setAttendance((prev) => ({ ...prev, [key]: val }));
  }, []);

  // Compute preview
  const computePreview = useCallback(() => {
    if (!selectedEmployee) return;
    
    setComputing(true);
    
    // Use employee's rate - simulate monthly rate for demo
    const rate = selectedEmployee.position === "Senior Developer" ? 35000 : 
                 selectedEmployee.position === "UI/UX Designer" ? 28000 :
                 selectedEmployee.position === "Marketing Manager" ? 30000 :
                 selectedEmployee.position === "HR Specialist" ? 45000 :
                 selectedEmployee.position === "Sales Representative" ? 22000 : 25000;
    
    const input: PayrollInput = {
      rateType: "MONTHLY",
      rate,
      periodType,
      periodStart: new Date(periodStart),
      periodEnd: new Date(periodEnd),
      ...attendance,
      regularHolidayOTHours: 0,
      specialHolidayOTHours: 0,
      restDayRegularHolidayOTHours: 0,
      restDaySpecialHolidayOTHours: 0,
      regularHolidayRestDayWorkedHours: 0,
      specialHolidayRestDayWorkedHours: 0,
      regularHolidaysNotWorked: 0,
      allowances,
      otherDeductions,
    };

    const result = computePayroll(input);
    setBreakdown(result);
    setStep(4);
    setComputing(false);
  }, [selectedEmployee, periodType, periodStart, periodEnd, attendance, allowances, otherDeductions]);

  // Generate payroll
  const handleGenerate = useCallback(() => {
    if (!breakdown || !selectedEmployee) return;

    const newEntry: Omit<PayrollEntry, "id"> = {
      userId: selectedEmployee.id,
      employeeName: selectedEmployee.fullName,
      periodStart,
      periodEnd,
      periodType,
      status: "DRAFT",
      rateType: "MONTHLY",
      rate: selectedEmployee.position === "Senior Developer" ? 35000 : 
            selectedEmployee.position === "UI/UX Designer" ? 28000 :
            selectedEmployee.position === "Marketing Manager" ? 30000 :
            selectedEmployee.position === "HR Specialist" ? 45000 :
            selectedEmployee.position === "Sales Representative" ? 22000 : 25000,
      dailyRate: breakdown.dailyRate,
      hourlyRate: breakdown.hourlyRate,
      daysWorked: attendance.daysWorked,
      hoursWorked: attendance.hoursWorked,
      lateMinutes: attendance.lateMinutes,
      undertimeMinutes: attendance.undertimeMinutes,
      absenceDays: attendance.absenceDays,
      basicPay: breakdown.basicPay,
      otPay: breakdown.totalOTPay,
      nightDiffPay: breakdown.nightDiffPay,
      holidayPay: breakdown.totalHolidayPay,
      totalAllowances: breakdown.totalAllowances,
      allowances: breakdown.allowances,
      lateDeduction: breakdown.lateDeduction,
      undertimeDeduction: breakdown.undertimeDeduction,
      absenceDeduction: breakdown.absenceDeduction,
      sssEmployee: breakdown.sssEmployee,
      sssEmployer: breakdown.sssEmployer,
      philhealthEmployee: breakdown.philhealthEmployee,
      philhealthEmployer: breakdown.philhealthEmployer,
      pagibigEmployee: breakdown.pagibigEmployee,
      pagibigEmployer: breakdown.pagibigEmployer,
      withholdingTax: breakdown.withholdingTax,
      taxableIncome: breakdown.taxableIncome,
      otherDeductions: breakdown.otherDeductions,
      totalOtherDeductions: breakdown.totalOtherDeductions,
      grossPay: breakdown.grossPay,
      totalDeductions: breakdown.sssEmployee + breakdown.philhealthEmployee + breakdown.pagibigEmployee + 
                       breakdown.withholdingTax + breakdown.totalOtherDeductions + breakdown.lateDeduction + 
                       breakdown.undertimeDeduction + breakdown.absenceDeduction,
      netPay: breakdown.netPay,
    };

    const entry = addPayrollEntry(newEntry);
    setEntries((prev) => [entry, ...prev]);
    toast.success("Payroll generated successfully!");
    
    // Reset wizard
    setStep(1);
    setBreakdown(null);
    setTab("history");
    setAllowances([]);
    setOtherDeductions([]);
    setAttendance({
      daysWorked: 11,
      hoursWorked: 88,
      lateMinutes: 0,
      undertimeMinutes: 0,
      absenceDays: 0,
      regularOTHours: 0,
      restDayOTHours: 0,
      nightDiffHours: 0,
      regularHolidayWorkedHours: 0,
      specialHolidayWorkedHours: 0,
    });
  }, [breakdown, selectedEmployee, periodStart, periodEnd, periodType, attendance, addPayrollEntry]);

  // Handle approve
  const handleApprove = useCallback((id: string) => {
    approvePayroll(id);
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "APPROVED" } : e)));
    toast.success("Payroll approved!");
  }, [approvePayroll]);

  // Handle release
  const handleRelease = useCallback((id: string) => {
    releasePayroll(id);
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "RELEASED" } : e)));
    toast.success("Payroll released!");
  }, [releasePayroll]);

  // Handle add holiday
  const handleAddHoliday = useCallback(() => {
    if (!holidayForm.name || !holidayForm.date) {
      toast.warning("Please fill in all fields");
      return;
    }
    addHoliday(holidayForm);
    setHolidayForm({ name: "", date: "", type: "Regular" });
    toast.success("Holiday added!");
  }, [holidayForm, addHoliday]);

  // Handle delete holiday
  const handleDeleteHoliday = useCallback((id: string) => {
    deleteHoliday(id);
    toast.success("Holiday removed");
  }, [deleteHoliday]);

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
              <Sparkles className="w-3 h-3 mr-1" /> {entries.length} Entries
            </Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Philippine payroll with SSS, PhilHealth, Pag-IBIG & BIR Tax
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("Export feature coming soon!")} className="rounded-xl">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Total Gross Pay" value={Math.round(totalGrossPay)} gradient="from-blue-500 to-cyan-500" delay={100} prefix="₱" />
        <StatCard icon={TrendingDown} label="Total Deductions" value={Math.round(totalDeductions)} gradient="from-rose-500 to-pink-500" delay={200} prefix="₱" />
        <StatCard icon={Wallet} label="Net Pay" value={Math.round(totalNetPay)} gradient="from-emerald-500 to-green-500" delay={300} prefix="₱" />
        <StatCard icon={Clock} label="Total Hours" value={totalHours} gradient="from-purple-500 to-pink-500" delay={400} prefix="" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        {[
          { id: "run", label: "Run Payroll", icon: Calculator },
          { id: "history", label: "Payroll History", icon: FileText },
          { id: "holidays", label: "Holiday Calendar", icon: CalendarDays },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab 1: Run Payroll ── */}
      {tab === "run" && (
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <div className={`w-8 h-8 bg-gradient-to-br ${step === 1 ? "from-blue-500 to-cyan-500" : step === 2 ? "from-amber-500 to-orange-500" : step === 3 ? "from-purple-500 to-pink-500" : "from-emerald-500 to-green-500"} rounded-lg flex items-center justify-center`}>
                  {step === 1 ? <User className="w-4 h-4 text-white" /> : 
                   step === 2 ? <Clock className="w-4 h-4 text-white" /> :
                   step === 3 ? <DollarSign className="w-4 h-4 text-white" /> :
                   <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <span>
                  {step === 1 && "Step 1: Select Employee & Period"}
                  {step === 2 && "Step 2: Attendance"}
                  {step === 3 && "Step 3: Allowances & Deductions"}
                  {step === 4 && "Step 4: Payslip Preview"}
                </span>
              </CardTitle>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      step === s
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                        : step > s
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 1 */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-500">Employee *</Label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.fullName} · {e.position}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-500">Period Type</Label>
                  <select
                    value={periodType}
                    onChange={(e) => {
                      const t = e.target.value as typeof periodType;
                      setPeriodType(t);
                      setPeriodEnd(periodEndDate(periodStart, t));
                    }}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800"
                  >
                    <option value="WEEKLY">Weekly</option>
                    <option value="SEMI_MONTHLY">Semi-Monthly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500">Period Start</Label>
                    <Input
                      type="date"
                      value={periodStart}
                      onChange={(e) => {
                        setPeriodStart(e.target.value);
                        setPeriodEnd(periodEndDate(e.target.value, periodType));
                      }}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500">Period End</Label>
                    <Input
                      type="date"
                      value={periodEnd}
                      onChange={(e) => setPeriodEnd(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!selectedUserId}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl"
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500">Days Worked</Label>
                    <Input
                      type="number"
                      min={0}
                      value={attendance.daysWorked}
                      onChange={(e) => setAtt("daysWorked", Number(e.target.value))}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500">Hours Worked</Label>
                    <Input
                      type="number"
                      min={0}
                      value={attendance.hoursWorked}
                      onChange={(e) => setAtt("hoursWorked", Number(e.target.value))}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500">Late (minutes)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={attendance.lateMinutes}
                      onChange={(e) => setAtt("lateMinutes", Number(e.target.value))}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500">Undertime (minutes)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={attendance.undertimeMinutes}
                      onChange={(e) => setAtt("undertimeMinutes", Number(e.target.value))}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500">Absent Days</Label>
                    <Input
                      type="number"
                      min={0}
                      value={attendance.absenceDays}
                      onChange={(e) => setAtt("absenceDays", Number(e.target.value))}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500">Regular OT Hours</Label>
                    <Input
                      type="number"
                      min={0}
                      value={attendance.regularOTHours}
                      onChange={(e) => setAtt("regularOTHours", Number(e.target.value))}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500">Rest Day OT Hours</Label>
                    <Input
                      type="number"
                      min={0}
                      value={attendance.restDayOTHours}
                      onChange={(e) => setAtt("restDayOTHours", Number(e.target.value))}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500">Night Differential Hours</Label>
                    <Input
                      type="number"
                      min={0}
                      value={attendance.nightDiffHours}
                      onChange={(e) => setAtt("nightDiffHours", Number(e.target.value))}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl">
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm text-gray-700 dark:text-gray-300">Allowances</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAllowances((p) => [...p, { name: "", amount: 0 }])}
                      className="rounded-lg"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </div>
                  {allowances.length === 0 && (
                    <p className="text-xs text-gray-400">No allowances. Click Add to add.</p>
                  )}
                  {allowances.map((a, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <Input
                        type="text"
                        placeholder="Name (e.g. Transportation)"
                        value={a.name}
                        onChange={(e) =>
                          setAllowances((p) => p.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                        }
                        className="rounded-xl flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={a.amount || ""}
                        onChange={(e) =>
                          setAllowances((p) =>
                            p.map((x, j) => (j === i ? { ...x, amount: Number(e.target.value) } : x))
                          )
                        }
                        className="rounded-xl w-28"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAllowances((p) => p.filter((_, j) => j !== i))}
                        className="rounded-lg"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm text-gray-700 dark:text-gray-300">Other Deductions</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setOtherDeductions((p) => [...p, { name: "", amount: 0 }])}
                      className="rounded-lg"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </div>
                  {otherDeductions.length === 0 && (
                    <p className="text-xs text-gray-400">No additional deductions.</p>
                  )}
                  {otherDeductions.map((d, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <Input
                        type="text"
                        placeholder="Name (e.g. Cash Advance)"
                        value={d.name}
                        onChange={(e) =>
                          setOtherDeductions((p) =>
                            p.map((x, j) => (j === i ? { ...x, name: e.target.value } : x))
                          )
                        }
                        className="rounded-xl flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={d.amount || ""}
                        onChange={(e) =>
                          setOtherDeductions((p) =>
                            p.map((x, j) => (j === i ? { ...x, amount: Number(e.target.value) } : x))
                          )
                        }
                        className="rounded-xl w-28"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setOtherDeductions((p) => p.filter((_, j) => j !== i))}
                        className="rounded-lg"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="rounded-xl">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button
                    onClick={computePreview}
                    disabled={computing}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl"
                  >
                    {computing ? "Computing…" : "Preview Payslip"} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </>
            )}

            {/* Step 4 - Preview */}
            {step === 4 && breakdown && (
              <>
                <BreakdownPreview bd={breakdown} />
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setStep(3)} className="rounded-xl">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl"
                  >
                    Generate Payroll <Send className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Tab 2: Payroll History ── */}
      {tab === "history" && (
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          {/* Filters */}
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by employee or period..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800"
                  >
                    <option value="All">All Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="APPROVED">Approved</option>
                    <option value="RELEASED">Released</option>
                  </select>
                  {searchQuery && (
                    <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="rounded-xl">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
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
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Run payroll to create new entries</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEntries.map((entry) => (
                        <TableRow key={entry.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                                {entry.employeeName.charAt(0)}
                              </div>
                              <div>
                                <span className="font-medium text-gray-900 dark:text-white">{entry.employeeName}</span>
                                <p className="text-xs text-gray-400">{entry.periodType}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">
                            {format(new Date(entry.periodStart), "MMM d")} -{" "}
                            {format(new Date(entry.periodEnd), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">{entry.hoursWorked}h</TableCell>
                          <TableCell className="text-gray-900 dark:text-white">{fmt(entry.grossPay)}</TableCell>
                          <TableCell className="text-rose-600">{fmt(entry.totalDeductions)}</TableCell>
                          <TableCell className="font-semibold text-emerald-600">
                            {fmt(entry.netPay)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={entry.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setViewEntry(entry); setViewOpen(true); }}
                                className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <Eye className="h-4 w-4 text-gray-600" />
                              </Button>
                              {entry.status === "DRAFT" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApprove(entry.id)}
                                  className="rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                  <CheckCircle className="h-4 w-4 text-blue-600" />
                                </Button>
                              )}
                              {entry.status === "APPROVED" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRelease(entry.id)}
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
      )}

      {/* ── Tab 3: Holidays ── */}
      {tab === "holidays" && (
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Holiday
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  type="text"
                  placeholder="Holiday name"
                  value={holidayForm.name}
                  onChange={(e) => setHolidayForm((p) => ({ ...p, name: e.target.value }))}
                  className="rounded-xl"
                />
                <Input
                  type="date"
                  value={holidayForm.date}
                  onChange={(e) => setHolidayForm((p) => ({ ...p, date: e.target.value }))}
                  className="rounded-xl"
                />
                <select
                  value={holidayForm.type}
                  onChange={(e) => setHolidayForm((p) => ({ ...p, type: e.target.value as "Regular" | "Special" }))}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800"
                >
                  <option value="Regular">Regular Holiday</option>
                  <option value="Special">Special Non-Working Day</option>
                </select>
              </div>
              <Button
                onClick={handleAddHoliday}
                className="mt-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Holiday
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Holidays {new Date().getFullYear()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {holidays.length === 0 ? (
                <p className="text-gray-500 text-sm">No holidays configured.</p>
              ) : (
                <div className="space-y-2">
                  {holidays
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between py-2 border-b dark:border-gray-700 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-sm">{h.name}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(h.date), "EEEE, MMMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            h.type === "Regular"
                              ? "border-red-300 text-red-600"
                              : "border-orange-300 text-orange-600"
                          }
                        >
                          {h.type}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteHoliday(h.id)}
                          className="text-red-500 border-red-200 rounded-lg"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Payslip View Modal ── */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Payslip Details
            </DialogTitle>
          </DialogHeader>
          {viewEntry && <PayslipView entry={viewEntry} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
