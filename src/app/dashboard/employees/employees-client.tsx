"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  User,
  DollarSign,
  Wallet,
  MapPin,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Check,
  UserCircle,
  CreditCard,
  Users2,
  Settings,
  FileText,
  Upload,
  File,
  Trash2,
  Download,
  Eye,
  Pencil,
  Snowflake,
  AlertTriangle,
  IdCard,
  BadgeCheck,
  UserCheck,
  ArrowUpDown,
  ArrowDownAZ,
  ArrowUpZA,
  CalendarArrowDown,
  CalendarArrowUp,
  SlidersHorizontal,
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  salary?: number;
  payFrequency?: string;
  workLocation?: string;
  manager?: string;
  workSchedule?: string;
  documents?: Document[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

// Filter types
type TenureRange = "all" | "new" | "junior" | "mid" | "senior";
type SortDirection = "asc" | "desc" | null;

interface FilterState {
  department: string;
  position: string;
  status: string;
  tenure: TenureRange;
  nameSort: SortDirection;
  dateSort: SortDirection;
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

const STEPS = [
  { id: 1, label: "Personal Details", icon: UserCircle },
  { id: 2, label: "Salary", icon: CreditCard },
  { id: 3, label: "Team Assignment", icon: Users2 },
  { id: 4, label: "Work Setup", icon: Settings },
  { id: 5, label: "Documents", icon: FileText },
];

const DOCUMENT_TYPES = [
  { value: "contract", label: "Employment Contract", icon: FileText },
  { value: "police_clearance", label: "Police Clearance", icon: FileText },
  { value: "office_id", label: "Office ID", icon: FileText },
  { value: "memo", label: "Internal Memo", icon: FileText },
  { value: "resume", label: "Resume/CV", icon: FileText },
  { value: "certificate", label: "Certificate", icon: FileText },
  { value: "other", label: "Other Document", icon: FileText },
];

// Helper function to calculate tenure from hire date
function getTenureCategory(hireDate: string): TenureRange {
  const hire = new Date(hireDate);
  const now = new Date();
  const diffTime = now.getTime() - hire.getTime();
  const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44);

  if (diffMonths < 6) return "new";
  if (diffMonths < 24) return "junior";
  if (diffMonths < 60) return "mid";
  return "senior";
}

// Helper function to get tenure label
function getTenureLabel(tenure: TenureRange): string {
  const labels: Record<TenureRange, string> = {
    all: "All Tenure",
    new: "New Hires (0-6 months)",
    junior: "Junior (6 months - 2 years)",
    mid: "Mid-level (2-5 years)",
    senior: "Senior (5+ years)",
  };
  return labels[tenure];
}

export function EmployeesClient() {
  const router = useRouter();
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    department: "all",
    position: "all",
    status: "all",
    tenure: "all",
    nameSort: null,
    dateSort: null,
  });

  // Action menu state
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [editEmployeeOpen, setEditEmployeeOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [freezeConfirmOpen, setFreezeConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editStep, setEditStep] = useState(1);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    employeeId: "",
    salary: "",
    payFrequency: "Monthly",
    currency: "USD",
    department: "",
    position: "",
    manager: "",
    employmentType: "Full-time",
    workLocation: "Office",
    workSchedule: "Standard",
    hireDate: "",
    employmentStatus: "Active",
  });

  // Get unique departments and positions for filter dropdowns
  const uniqueDepartments = useMemo(() => {
    const depts = new Set(employees.map((emp) => emp.department).filter(Boolean));
    return Array.from(depts).sort();
  }, [employees]);

  const uniquePositions = useMemo(() => {
    const positions = new Set(employees.map((emp) => emp.position).filter(Boolean));
    return Array.from(positions).sort();
  }, [employees]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.department !== "all") count++;
    if (filters.position !== "all") count++;
    if (filters.status !== "all") count++;
    if (filters.tenure !== "all") count++;
    if (filters.nameSort !== null) count++;
    if (filters.dateSort !== null) count++;
    return count;
  }, [filters]);

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    let result = employees.filter((emp) => {
      // Search query filter
      const matchesSearch =
        searchQuery === "" ||
        emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase());

      // Department filter
      const matchesDepartment =
        filters.department === "all" || emp.department === filters.department;

      // Position filter
      const matchesPosition =
        filters.position === "all" || emp.position === filters.position;

      // Status filter
      const matchesStatus =
        filters.status === "all" || emp.employmentStatus === filters.status;

      // Tenure filter
      const matchesTenure =
        filters.tenure === "all" ||
        getTenureCategory(emp.hireDate) === filters.tenure;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesPosition &&
        matchesStatus &&
        matchesTenure
      );
    });

    // Sorting
    if (filters.nameSort) {
      result = [...result].sort((a, b) => {
        const comparison = a.fullName.localeCompare(b.fullName);
        return filters.nameSort === "asc" ? comparison : -comparison;
      });
    }

    if (filters.dateSort) {
      result = [...result].sort((a, b) => {
        const dateA = new Date(a.hireDate).getTime();
        const dateB = new Date(b.hireDate).getTime();
        return filters.dateSort === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    return result;
  }, [employees, searchQuery, filters]);

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      department: "all",
      position: "all",
      status: "all",
      tenure: "all",
      nameSort: null,
      dateSort: null,
    });
    setSearchQuery("");
  };

  // Update single filter
  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const activeCount = employees.filter((e) => e.employmentStatus === "Active").length;
  const departmentCount = new Set(employees.map((e) => e.department).filter(Boolean)).size;

  // Action handlers
  const handleViewProfile = (employee: Employee) => {
    router.push(`/dashboard/employees/${employee.id}`);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditFormData({
      fullName: employee.fullName,
      email: employee.email,
      phoneNumber: employee.phoneNumber || "",
      employeeId: employee.employeeId,
      salary: String(employee.salary || ""),
      payFrequency: employee.payFrequency || "Monthly",
      currency: "USD",
      department: employee.department,
      position: employee.position,
      manager: employee.manager || "",
      employmentType: employee.employmentType,
      workLocation: employee.workLocation || "Office",
      workSchedule: employee.workSchedule || "Standard",
      hireDate: employee.hireDate,
      employmentStatus: employee.employmentStatus,
    });
    setEditStep(1);
    setEditEmployeeOpen(true);
  };

  const handleFreeze = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFreezeConfirmOpen(true);
  };

  const confirmFreeze = async () => {
    if (selectedEmployee) {
      try {
        const response = await fetch(`/api/employees/${selectedEmployee.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employmentStatus: "Inactive",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to freeze account");
        }

        updateEmployee(selectedEmployee.id, { employmentStatus: "Inactive" });
        toast.success(`${selectedEmployee.fullName}'s account has been frozen`);
        setFreezeConfirmOpen(false);
        setSelectedEmployee(null);
      } catch (error) {
        console.error("Error freezing account:", error);
        toast.error("Failed to freeze account. Please try again.");
      }
    }
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedEmployee) {
      try {
        const response = await fetch(`/api/employees/${selectedEmployee.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete employee");
        }

        deleteEmployee(selectedEmployee.id);
        toast.success(`${selectedEmployee.fullName} has been deleted`);
        setDeleteConfirmOpen(false);
        setSelectedEmployee(null);
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast.error("Failed to delete employee. Please try again.");
      }
    }
  };

  const handleEditNext = () => {
    if (editStep < 5) setEditStep(editStep + 1);
  };

  const handleEditBack = () => {
    if (editStep > 1) setEditStep(editStep - 1);
  };

  const isEditStepValid = () => {
    switch (editStep) {
      case 1:
        return editFormData.fullName && editFormData.email;
      case 2:
        return editFormData.salary && Number(editFormData.salary) > 0;
      case 3:
        return editFormData.department && editFormData.position;
      case 4:
        return editFormData.workLocation && editFormData.workSchedule;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleEditSubmit = async () => {
    if (selectedEmployee) {
      try {
        const response = await fetch(`/api/employees/${selectedEmployee.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: editFormData.fullName,
            email: editFormData.email,
            phoneNumber: editFormData.phoneNumber,
            salary: Number(editFormData.salary) || 0,
            payFrequency: editFormData.payFrequency,
            department: editFormData.department,
            position: editFormData.position,
            manager: editFormData.manager,
            employmentType: editFormData.employmentType,
            workLocation: editFormData.workLocation,
            workSchedule: editFormData.workSchedule,
            hireDate: editFormData.hireDate,
            employmentStatus: editFormData.employmentStatus,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update employee");
        }

        // Update local store
        updateEmployee(selectedEmployee.id, {
          fullName: editFormData.fullName,
          email: editFormData.email,
          phoneNumber: editFormData.phoneNumber,
          salary: Number(editFormData.salary) || 0,
          payFrequency: editFormData.payFrequency,
          department: editFormData.department,
          position: editFormData.position,
          manager: editFormData.manager,
          employmentType: editFormData.employmentType,
          workLocation: editFormData.workLocation,
          workSchedule: editFormData.workSchedule,
          hireDate: editFormData.hireDate,
          employmentStatus: editFormData.employmentStatus,
        });

        toast.success(`${editFormData.fullName} updated successfully!`);
        setEditEmployeeOpen(false);
        setEditStep(1);
      } catch (error) {
        console.error("Error updating employee:", error);
        toast.error("Failed to update employee. Please try again.");
      }
    }
  };

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
        <Button 
          onClick={() => router.push('/dashboard/employees/new')}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
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
            <div className="flex items-center gap-2">
              {/* Filters Button */}
              <Button
                variant="outline"
                onClick={() => setIsFilterSheetOpen(true)}
                className="rounded-xl relative"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              
              {/* Clear All Button - Only show when filters are active */}
              {(activeFilterCount > 0 || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="rounded-xl text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4 mr-1" /> Clear All
                </Button>
              )}
            </div>
          </div>
          
          {/* Active Filter Pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.department !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="rounded-full px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200"
                >
                  <Building2 className="w-3 h-3 mr-1" />
                  {filters.department}
                  <button 
                    onClick={() => updateFilter("department", "all")}
                    className="ml-2 hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.position !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="rounded-full px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200"
                >
                  <Briefcase className="w-3 h-3 mr-1" />
                  {filters.position}
                  <button 
                    onClick={() => updateFilter("position", "all")}
                    className="ml-2 hover:text-purple-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.status !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="rounded-full px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {filters.status}
                  <button 
                    onClick={() => updateFilter("status", "all")}
                    className="ml-2 hover:text-emerald-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.tenure !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="rounded-full px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {getTenureLabel(filters.tenure)}
                  <button 
                    onClick={() => updateFilter("tenure", "all")}
                    className="ml-2 hover:text-amber-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.nameSort && (
                <Badge 
                  variant="secondary" 
                  className="rounded-full px-3 py-1 bg-cyan-50 text-cyan-700 border border-cyan-200"
                >
                  {filters.nameSort === "asc" ? <ArrowDownAZ className="w-3 h-3 mr-1" /> : <ArrowUpZA className="w-3 h-3 mr-1" />}
                  Name: {filters.nameSort === "asc" ? "A-Z" : "Z-A"}
                  <button 
                    onClick={() => updateFilter("nameSort", null)}
                    className="ml-2 hover:text-cyan-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.dateSort && (
                <Badge 
                  variant="secondary" 
                  className="rounded-full px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200"
                >
                    {filters.dateSort === "desc" ? <CalendarArrowDown className="w-3 h-3 mr-1" /> : <CalendarArrowUp className="w-3 h-3 mr-1" />}
                  Hired: {filters.dateSort === "desc" ? "Newest" : "Oldest"}
                  <button 
                    onClick={() => updateFilter("dateSort", null)}
                    className="ml-2 hover:text-indigo-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
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
                      <Link href={`/dashboard/employees/${employee.id}`} className="block">
                        <div className="flex items-center gap-3 cursor-pointer group">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold group-hover:scale-105 transition-transform">
                            {employee.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{employee.fullName}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {employee.email}
                            </p>
                          </div>
                        </div>
                      </Link>
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
                          <DropdownMenuItem className="cursor-pointer p-0">
                            <Link href={`/dashboard/employees/${employee.id}`} className="flex items-center px-2 py-1.5 w-full">
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(employee)} className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleFreeze(employee)} 
                            className="cursor-pointer text-amber-600"
                            disabled={employee.employmentStatus === "Inactive"}
                          >
                            <Snowflake className="mr-2 h-4 w-4" />
                            Freeze Account
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(employee)} className="cursor-pointer text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Employee
                          </DropdownMenuItem>
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
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
              {(activeFilterCount > 0 || searchQuery) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="mt-4 rounded-xl"
                >
                  <X className="h-4 w-4 mr-1" /> Clear All Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter Sheet */}
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[450px] p-0">
          <SheetHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold">Filters</SheetTitle>
                <SheetDescription className="text-sm text-gray-500">
                  Refine your employee list
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
          
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Department Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                Department
              </Label>
              <Select
                value={filters.department}
                onValueChange={(value) => updateFilter("department", value || "all")}
              >
                <SelectTrigger className="w-full rounded-xl h-12">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {uniqueDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Position Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-500" />
                Position
              </Label>
              <Select
                value={filters.position}
                onValueChange={(value) => updateFilter("position", value || "all")}
              >
                <SelectTrigger className="w-full rounded-xl h-12">
                  <SelectValue placeholder="Select Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {uniquePositions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Employment Status
              </Label>
              <Select
                value={filters.status}
                onValueChange={(value) => updateFilter("status", value || "all")}
              >
                <SelectTrigger className="w-full rounded-xl h-12">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tenure Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Tenure (Years of Service)
              </Label>
              <Select
                value={filters.tenure}
                onValueChange={(value) => updateFilter("tenure", (value || "all") as TenureRange)}
              >
                <SelectTrigger className="w-full rounded-xl h-12">
                  <SelectValue placeholder="Select Tenure Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tenure</SelectItem>
                  <SelectItem value="new">New Hires (0-6 months)</SelectItem>
                  <SelectItem value="junior">Junior (6 months - 2 years)</SelectItem>
                  <SelectItem value="mid">Mid-level (2-5 years)</SelectItem>
                  <SelectItem value="senior">Senior (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* Sort Options */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-cyan-500" />
                Sort Options
              </Label>
              
              {/* Name Sort */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Sort by Name</Label>
                <div className="flex gap-2">
                  <Button
                    variant={filters.nameSort === "asc" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter("nameSort", filters.nameSort === "asc" ? null : "asc")}
                    className={`flex-1 rounded-xl ${
                      filters.nameSort === "asc" 
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" 
                        : ""
                    }`}
                  >
                    <ArrowDownAZ className="w-4 h-4 mr-2" />
                    A-Z
                  </Button>
                  <Button
                    variant={filters.nameSort === "desc" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter("nameSort", filters.nameSort === "desc" ? null : "desc")}
                    className={`flex-1 rounded-xl ${
                      filters.nameSort === "desc" 
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" 
                        : ""
                    }`}
                  >
                    <ArrowUpZA className="w-4 h-4 mr-2" />
                    Z-A
                  </Button>
                </div>
              </div>

              {/* Date Hired Sort */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Sort by Date Hired</Label>
                <div className="flex gap-2">
                  <Button
                    variant={filters.dateSort === "desc" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter("dateSort", filters.dateSort === "desc" ? null : "desc")}
                    className={`flex-1 rounded-xl ${
                      filters.dateSort === "desc" 
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" 
                        : ""
                    }`}
                  >
                    <CalendarArrowDown className="w-4 h-4 mr-2" />
                    Newest First
                  </Button>
                  <Button
                    variant={filters.dateSort === "asc" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter("dateSort", filters.dateSort === "asc" ? null : "asc")}
                    className={`flex-1 rounded-xl ${
                      filters.dateSort === "asc" 
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" 
                        : ""
                    }`}
                  >
                    <CalendarArrowUp className="w-4 h-4 mr-2" />
                    Oldest First
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex-row gap-3">
            <Button
              variant="outline"
              onClick={clearAllFilters}
              disabled={activeFilterCount === 0 && !searchQuery}
              className="flex-1 rounded-xl"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <Button 
              onClick={() => setIsFilterSheetOpen(false)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl"
            >
              <Check className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Profile Dialog */}
      <Dialog open={viewProfileOpen} onOpenChange={setViewProfileOpen}>
        <DialogContent className="w-[90vw] max-w-[1440px] max-h-[90vh] overflow-y-auto rounded-2xl p-0">
          <DialogHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <DialogTitle>Employee Profile</DialogTitle>
            </div>
          </DialogHeader>
          {selectedEmployee && (
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                  {selectedEmployee.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedEmployee.fullName}</h3>
                  <p className="text-gray-500">{selectedEmployee.position}</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedEmployee.employmentStatus} />
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-blue-500" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <div>
                    <p className="text-xs text-gray-500">Employee ID</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                      <IdCard className="w-3 h-3" /> {selectedEmployee.employeeId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {selectedEmployee.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {selectedEmployee.phoneNumber || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Hire Date</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {selectedEmployee.hireDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Employment Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  Employment Information
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {selectedEmployee.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Position</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedEmployee.position}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Employment Type</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedEmployee.employmentType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedEmployee.employmentStatus}</p>
                  </div>
                </div>
              </div>

              {/* Work Setup */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-purple-500" />
                  Work Setup
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <div>
                    <p className="text-xs text-gray-500">Work Location</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {selectedEmployee.workLocation || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Work Schedule</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {selectedEmployee.workSchedule || "—"}
                    </p>
                  </div>
                  {selectedEmployee.manager && (
                    <div>
                      <p className="text-xs text-gray-500">Manager</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> {selectedEmployee.manager}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Salary Info */}
              {selectedEmployee.salary && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    Salary Information
                  </h4>
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Annual Salary</p>
                        <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">
                          ${selectedEmployee.salary.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Pay Frequency</p>
                        <p className="text-sm font-medium text-emerald-900 dark:text-emerald-300">
                          {selectedEmployee.payFrequency}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents */}
              {selectedEmployee.documents && selectedEmployee.documents.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    Documents ({selectedEmployee.documents.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedEmployee.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <File className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button
                  variant="outline"
                  onClick={() => setViewProfileOpen(false)}
                  className="flex-1 rounded-xl"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setViewProfileOpen(false);
                    handleEdit(selectedEmployee);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={editEmployeeOpen} onOpenChange={setEditEmployeeOpen}>
        <DialogContent className="w-[85vw] max-w-[1200px] max-h-[95vh] overflow-y-auto rounded-2xl p-0">
          <DialogHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Pencil className="w-4 h-4 text-white" />
              </div>
              <DialogTitle>Edit Employee</DialogTitle>
            </div>
          </DialogHeader>

          <div className="p-6">
            {/* Stepper */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = editStep === step.id;
                  const isCompleted = editStep > step.id;
                  
                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md"
                              : isCompleted
                              ? "bg-gradient-to-br from-emerald-500 to-green-500 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>
                        <span
                          className={`text-xs mt-2 font-medium text-center ${
                            isActive
                              ? "text-blue-600 dark:text-blue-400"
                              : isCompleted
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {index < STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                            isCompleted
                              ? "bg-gradient-to-r from-emerald-500 to-green-500"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Content */}
            <div className="min-h-[400px]">
              {/* Step 1: Personal Details */}
              {editStep === 1 && (
                <div className="space-y-6 animate-fade-in-up w-full max-w-3xl mx-auto px-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Details</h3>
                      <p className="text-sm text-gray-500">Update the employee's basic information</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="edit-fullName" className="text-sm font-medium text-gray-700">Full Name *</Label>
                      <Input
                        id="edit-fullName"
                        required
                        value={editFormData.fullName}
                        onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                        placeholder="John Doe"
                        className="rounded-xl h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email" className="text-sm font-medium text-gray-700">Email Address *</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        required
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        placeholder="john@company.com"
                        className="rounded-xl h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
                      <Input
                        id="edit-phoneNumber"
                        value={editFormData.phoneNumber}
                        onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                        placeholder="+1 555-0123"
                        className="rounded-xl h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-employeeId" className="text-sm font-medium text-gray-700">Employee ID</Label>
                      <Input
                        id="edit-employeeId"
                        value={editFormData.employeeId}
                        onChange={(e) => setEditFormData({ ...editFormData, employeeId: e.target.value })}
                        className="rounded-xl h-12"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Salary */}
              {editStep === 2 && (
                <div className="space-y-6 animate-fade-in-up w-full max-w-3xl mx-auto px-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Salary Information</h3>
                      <p className="text-sm text-gray-500">Update the employee's compensation details</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="edit-salary" className="text-sm font-medium text-gray-700">Annual Salary *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="edit-salary"
                          type="number"
                          required
                          value={editFormData.salary}
                          onChange={(e) => setEditFormData({ ...editFormData, salary: e.target.value })}
                          placeholder="50000"
                          className="pl-12 rounded-xl h-12"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-currency" className="text-sm font-medium text-gray-700">Currency</Label>
                      <select
                        id="edit-currency"
                        value={editFormData.currency}
                        onChange={(e) => setEditFormData({ ...editFormData, currency: e.target.value })}
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 h-12"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="PHP">PHP - Philippine Peso</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-payFrequency" className="text-sm font-medium text-gray-700">Pay Frequency</Label>
                      <select
                        id="edit-payFrequency"
                        value={editFormData.payFrequency}
                        onChange={(e) => setEditFormData({ ...editFormData, payFrequency: e.target.value })}
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 h-12"
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Bi-weekly">Bi-weekly</option>
                        <option value="Weekly">Weekly</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Team Assignment */}
              {editStep === 3 && (
                <div className="space-y-6 animate-fade-in-up w-full max-w-3xl mx-auto px-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Users2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Team Assignment</h3>
                      <p className="text-sm text-gray-500">Update the employee's department and team</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="edit-department" className="text-sm font-medium text-gray-700">Department *</Label>
                      <select
                        id="edit-department"
                        required
                        value={editFormData.department}
                        onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 h-12"
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
                      <Label htmlFor="edit-position" className="text-sm font-medium text-gray-700">Position *</Label>
                      <Input
                        id="edit-position"
                        required
                        value={editFormData.position}
                        onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
                        placeholder="Software Engineer"
                        className="rounded-xl h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-manager" className="text-sm font-medium text-gray-700">Manager</Label>
                      <select
                        id="edit-manager"
                        value={editFormData.manager}
                        onChange={(e) => setEditFormData({ ...editFormData, manager: e.target.value })}
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 h-12"
                      >
                        <option value="">Select Manager</option>
                        {employees.filter(e => e.id !== selectedEmployee?.id).map((emp) => (
                          <option key={emp.id} value={emp.fullName}>
                            {emp.fullName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-employmentType" className="text-sm font-medium text-gray-700">Employment Type</Label>
                      <select
                        id="edit-employmentType"
                        value={editFormData.employmentType}
                        onChange={(e) => setEditFormData({ ...editFormData, employmentType: e.target.value })}
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 h-12"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Intern">Intern</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Work Setup */}
              {editStep === 4 && (
                <div className="space-y-6 animate-fade-in-up w-full max-w-3xl mx-auto px-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Work Setup</h3>
                      <p className="text-sm text-gray-500">Update the employee's work arrangement</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="edit-workLocation" className="text-sm font-medium text-gray-700">Work Location</Label>
                      <select
                        id="edit-workLocation"
                        value={editFormData.workLocation}
                        onChange={(e) => setEditFormData({ ...editFormData, workLocation: e.target.value })}
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 h-12"
                      >
                        <option value="Office">Office</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-workSchedule" className="text-sm font-medium text-gray-700">Work Schedule</Label>
                      <select
                        id="edit-workSchedule"
                        value={editFormData.workSchedule}
                        onChange={(e) => setEditFormData({ ...editFormData, workSchedule: e.target.value })}
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 h-12"
                      >
                        <option value="Standard">Standard (9AM - 5PM)</option>
                        <option value="Flexible">Flexible Hours</option>
                        <option value="Night Shift">Night Shift</option>
                        <option value="Weekend">Weekend Only</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-hireDate" className="text-sm font-medium text-gray-700">Hire Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="edit-hireDate"
                          type="date"
                          value={editFormData.hireDate}
                          onChange={(e) => setEditFormData({ ...editFormData, hireDate: e.target.value })}
                          className="pl-12 rounded-xl h-12"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-employmentStatus" className="text-sm font-medium text-gray-700">Employment Status</Label>
                      <select
                        id="edit-employmentStatus"
                        value={editFormData.employmentStatus}
                        onChange={(e) => setEditFormData({ ...editFormData, employmentStatus: e.target.value })}
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 h-12"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {editStep === 5 && (
                <div className="space-y-6 animate-fade-in-up w-full max-w-3xl mx-auto px-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Review Changes</h3>
                      <p className="text-sm text-gray-500">Review and confirm the updated information</p>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-2">
                        <p className="text-gray-500">Name</p>
                        <p className="font-medium text-gray-900 dark:text-white">{editFormData.fullName}</p>
                      </div>
                      <div className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-2">
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium text-gray-900 dark:text-white">{editFormData.email}</p>
                      </div>
                      <div className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-2">
                        <p className="text-gray-500">Salary</p>
                        <p className="font-medium text-gray-900 dark:text-white">${editFormData.salary ? Number(editFormData.salary).toLocaleString() : "—"} / {editFormData.payFrequency.toLowerCase()}</p>
                      </div>
                      <div className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-2">
                        <p className="text-gray-500">Department</p>
                        <p className="font-medium text-gray-900 dark:text-white">{editFormData.department}</p>
                      </div>
                      <div className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-2">
                        <p className="text-gray-500">Position</p>
                        <p className="font-medium text-gray-900 dark:text-white">{editFormData.position}</p>
                      </div>
                      <div className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-2">
                        <p className="text-gray-500">Work Setup</p>
                        <p className="font-medium text-gray-900 dark:text-white">{editFormData.workLocation} • {editFormData.workSchedule}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-500">Status</p>
                        <p className="font-medium text-gray-900 dark:text-white">{editFormData.employmentStatus}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 mt-8 border-t border-gray-100 dark:border-gray-800">
              <Button
                variant="outline"
                onClick={handleEditBack}
                disabled={editStep === 1}
                className="rounded-xl h-12 px-6"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              {editStep < 5 ? (
                <Button
                  onClick={handleEditNext}
                  disabled={!isEditStepValid()}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl h-12 px-6"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleEditSubmit}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl h-12 px-6"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Freeze Account Confirmation */}
      <AlertDialog open={freezeConfirmOpen} onOpenChange={setFreezeConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <Snowflake className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <AlertDialogTitle>Freeze Account?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              This will set <strong>{selectedEmployee?.fullName}</strong>'s employment status to "Inactive". 
              They will no longer be able to access the system until their account is reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmFreeze}
              className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl"
            >
              <Snowflake className="mr-2 h-4 w-4" />
              Freeze Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Employee Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <AlertDialogTitle>Delete Employee?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              This action cannot be undone. This will permanently delete <strong>{selectedEmployee?.fullName}</strong> 
              and all associated data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
