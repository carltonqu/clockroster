"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  MapPin,
  Clock,
  User,
  Edit,
  MessageSquare,
  FileDown,
  CheckCircle2,
  FileText,
  Upload,
  Download,
  File,
  Trash2,
  DollarSign,
  TrendingUp,
  UserCheck,
  Clock3,
  CreditCard,
  ChevronRight,
  MoreHorizontal,
  FolderOpen,
  History,
  Wallet,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import type { Employee, PayrollEntry, TimeEntry, Schedule } from "@/lib/mock-data";

interface ProfileClientProps {
  employee: Employee;
  payrollEntries: PayrollEntry[];
  timeEntries: TimeEntry[];
  schedule: Schedule | undefined;
}

// Status badge configuration
const STATUS_CONFIG: Record<string, { 
  bg: string; 
  text: string; 
  border: string; 
  gradient: string;
  icon: any;
}> = {
  Active: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    gradient: "from-emerald-500 to-green-500",
    icon: CheckCircle2,
  },
  Inactive: {
    bg: "bg-gray-50 dark:bg-gray-900",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-700",
    gradient: "from-gray-400 to-gray-500",
    icon: Clock,
  },
  "On Leave": {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    gradient: "from-amber-500 to-orange-500",
    icon: Clock,
  },
};

// Tenure calculation
function calculateTenure(hireDate: string): string {
  const hire = new Date(hireDate);
  const now = new Date();
  const diffTime = now.getTime() - hire.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30.44);
  const diffYears = Math.floor(diffMonths / 12);
  const remainingMonths = diffMonths % 12;

  if (diffYears > 0) {
    return `${diffYears} year${diffYears > 1 ? "s" : ""}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}` : ""}`;
  }
  if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`;
  }
  return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Get gradient based on name
function getGradient(name: string): string {
  const gradients = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-emerald-500 to-green-500",
    "from-orange-500 to-amber-500",
    "from-indigo-500 to-blue-500",
    "from-rose-500 to-pink-500",
  ];
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
}

// Document type icon mapping
function getDocumentIcon(type: string) {
  switch (type.toLowerCase()) {
    case "pdf":
      return <FileText className="w-5 h-5 text-red-500" />;
    case "doc":
    case "docx":
      return <FileText className="w-5 h-5 text-blue-500" />;
    case "jpg":
    case "jpeg":
    case "png":
      return <File className="w-5 h-5 text-purple-500" />;
    default:
      return <File className="w-5 h-5 text-gray-500" />;
  }
}

export function ProfileClient({
  employee,
  payrollEntries,
  timeEntries,
  schedule,
}: ProfileClientProps) {
  const router = useRouter();
  const { updateEmployee } = useStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(employee.profilePhoto);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editable form state
  const [formData, setFormData] = useState({
    fullName: employee.fullName,
    email: employee.email,
    phoneNumber: employee.phoneNumber || "",
    department: employee.department,
    position: employee.position,
    employmentType: employee.employmentType,
    employmentStatus: employee.employmentStatus,
    workLocation: employee.workLocation || "",
    workSchedule: employee.workSchedule || "",
    manager: employee.manager || "",
    salary: employee.salary || 0,
    payFrequency: employee.payFrequency || "Monthly",
  });

  const statusConfig = STATUS_CONFIG[employee.employmentStatus] || STATUS_CONFIG.Active;
  const StatusIcon = statusConfig.icon;
  const tenure = calculateTenure(employee.hireDate);
  const avatarGradient = getGradient(employee.fullName);

  // Mock documents data
  const documents = useMemo(() => [
    { id: "1", name: "Employment Contract.pdf", type: "pdf", size: "2.4 MB", uploadedAt: "2022-03-15", category: "Contract" },
    { id: "2", name: "Police Clearance.pdf", type: "pdf", size: "1.2 MB", uploadedAt: "2022-03-10", category: "Clearance" },
    { id: "3", name: "Government ID.jpg", type: "jpg", size: "3.1 MB", uploadedAt: "2022-03-12", category: "ID" },
    { id: "4", name: "Medical Certificate.pdf", type: "pdf", size: "1.8 MB", uploadedAt: "2022-06-20", category: "Medical" },
  ], []);

  const handleDownloadProfile = () => {
    toast.success("Profile PDF downloaded successfully!");
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      toast.success(`Message sent to ${employee.fullName}!`);
      setMessageText("");
      setIsMessageDialogOpen(false);
    }
  };

  const handleUploadDocument = () => {
    toast.success("Document upload initiated!");
  };

  const handleDownloadDocument = (docName: string) => {
    toast.success(`Downloading ${docName}...`);
  };

  const handleDeleteDocument = (docId: string) => {
    toast.success("Document deleted!");
  };

  const handleSave = () => {
    updateEmployee(employee.id, {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      department: formData.department,
      position: formData.position,
      employmentType: formData.employmentType,
      employmentStatus: formData.employmentStatus,
      workLocation: formData.workLocation,
      workSchedule: formData.workSchedule,
      manager: formData.manager,
      salary: formData.salary,
      payFrequency: formData.payFrequency,
      profilePhoto: profilePhoto,
    });
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    // Reset form data to original
    setFormData({
      fullName: employee.fullName,
      email: employee.email,
      phoneNumber: employee.phoneNumber || "",
      department: employee.department,
      position: employee.position,
      employmentType: employee.employmentType,
      employmentStatus: employee.employmentStatus,
      workLocation: employee.workLocation || "",
      workSchedule: employee.workSchedule || "",
      manager: employee.manager || "",
      salary: employee.salary || 0,
      payFrequency: employee.payFrequency || "Monthly",
    });
    setProfilePhoto(employee.profilePhoto);
    setIsEditing(false);
  };

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
        .stagger-1 { animation-delay: 50ms; }
        .stagger-2 { animation-delay: 100ms; }
        .stagger-3 { animation-delay: 150ms; }
        .stagger-4 { animation-delay: 200ms; }
      `}</style>

      {/* Breadcrumbs & Back Button */}
      <div className="flex items-center gap-2 text-sm text-gray-500 animate-fade-in-up">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/employees")}
          className="hover:text-blue-600 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Employees
        </Button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-400">Employees</span>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-gray-900 dark:text-white">{employee.fullName}</span>
      </div>

      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white shadow-xl animate-fade-in-up">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
        </div>
        
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Avatar - Editable */}
            <div className="relative group">
              <Avatar 
                className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-2xl cursor-pointer transition-transform group-hover:scale-105"
                onClick={() => isEditing && fileInputRef.current?.click()}
              >
                <AvatarImage src={profilePhoto} />
                <AvatarFallback className={`bg-gradient-to-br ${avatarGradient} text-white text-2xl sm:text-3xl font-bold`}>
                  {getInitials(formData.fullName)}
                </AvatarFallback>
              </Avatar>
              {/* Upload Overlay - only show when editing */}
              {isEditing && (
                <div 
                  className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-black/40 flex items-center justify-center cursor-pointer border-4 border-white"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-white" />
                </div>
              )}
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r ${statusConfig.gradient} flex items-center justify-center border-2 border-white shadow-lg`}>
                <StatusIcon className="w-4 h-4 text-white" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setProfilePhoto(reader.result as string);
                      toast.success("Profile photo updated! Click Save to confirm.");
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="text-xl font-bold bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    placeholder="Full Name"
                  />
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    placeholder="Position"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Input
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-auto bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="Department"
                    />
                    <select
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                      className="bg-white/20 border-white/30 text-white rounded-md px-3 py-1"
                    >
                      <option value="Full-time" className="text-gray-900">Full-time</option>
                      <option value="Part-time" className="text-gray-900">Part-time</option>
                      <option value="Contract" className="text-gray-900">Contract</option>
                      <option value="Intern" className="text-gray-900">Intern</option>
                    </select>
                    <select
                      value={formData.employmentStatus}
                      onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                      className="bg-white/20 border-white/30 text-white rounded-md px-3 py-1"
                    >
                      <option value="Active" className="text-gray-900">Active</option>
                      <option value="Inactive" className="text-gray-900">Inactive</option>
                      <option value="On Leave" className="text-gray-900">On Leave</option>
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">{formData.fullName}</h1>
                    <Badge className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {formData.employmentStatus}
                    </Badge>
                  </div>
                  <p className="text-blue-100 text-lg mb-3">{formData.position}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-blue-50">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      {formData.department}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      {formData.employmentType}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Hired {formatDate(employee.hireDate)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCancel}
                    className="bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur-sm"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-white text-blue-600 hover:bg-white/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur-sm"
                    >
                      <MoreHorizontal className="w-4 h-4 mr-2" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </DropdownMenuItem>
                    <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent className="max-w-[1440px] rounded-2xl">
                        <DialogHeader>
                          <DialogTitle>Send Message to {employee.fullName}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <textarea
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full min-h-[120px] p-3 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSendMessage} className="bg-gradient-to-r from-blue-600 to-cyan-500">
                              Send Message
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <DropdownMenuItem onClick={handleDownloadProfile}>
                      <FileDown className="w-4 h-4 mr-2" />
                      Download PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section - Vertical Sidebar Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex gap-6">
        {/* Vertical Sidebar Tabs */}
        <TabsList className="flex-col h-fit min-w-[200px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2 rounded-xl">
          <TabsTrigger value="overview" className="w-full justify-start gap-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white py-3">
            <User className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="employment" className="w-full justify-start gap-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white py-3">
            <Briefcase className="w-4 h-4" />
            Employment
          </TabsTrigger>
          <TabsTrigger value="documents" className="w-full justify-start gap-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white py-3">
            <FolderOpen className="w-4 h-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="activity" className="w-full justify-start gap-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white py-3">
            <History className="w-4 h-4" />
            Activity
          </TabsTrigger>
        </TabsList>
        
        {/* Content Area */}
        <div className="flex-1">

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information Card */}
            <Card className="border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-b border-blue-100 dark:border-blue-800">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500 uppercase">Full Name</Label>
                      <Input
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500 uppercase">Employee ID</Label>
                      <Input value={employee.employeeId} disabled className="bg-gray-100" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500 uppercase">Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500 uppercase">Phone</Label>
                      <Input
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Full Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formData.fullName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Employee ID</p>
                      <p className="font-medium text-gray-900 dark:text-white">{employee.employeeId}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-900 dark:text-white">{formData.email}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-900 dark:text-white">{formData.phoneNumber || "—"}</p>
                      </div>
                    </div>
                  </div>
                )}
                <Separator />
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Hire Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(employee.hireDate)}
                    </p>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {tenure}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-b border-emerald-100 dark:border-emerald-800">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Total Payroll</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {payrollEntries.length}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">entries processed</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Time Entries</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {timeEntries.length}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">recent records</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Documents</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {documents.length}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">files uploaded</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Department</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                      {formData.department}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{formData.position}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Preview */}
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5 text-purple-600" />
                Recent Activity
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("activity")}>
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {timeEntries.length > 0 ? (
                <div className="space-y-3">
                  {timeEntries.slice(0, 3).map((entry, index) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Clock3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatDate(entry.date)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {entry.clockIn ? new Date(entry.clockIn).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "—"}
                            {" - "}
                            {entry.clockOut ? new Date(entry.clockOut).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "In Progress"}
                          </p>
                        </div>
                      </div>
                      {entry.overtimeMinutes > 0 && (
                        <Badge className="bg-amber-50 text-amber-700 border border-amber-200">
                          +{entry.overtimeMinutes}m OT
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employment Tab */}
        <TabsContent value="employment" className="space-y-6 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employment Details Card */}
            <Card className="border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-b border-purple-100 dark:border-purple-800">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500 uppercase">Department</Label>
                      <Input
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500 uppercase">Position</Label>
                      <Input
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500 uppercase">Work Location</Label>
                      <Input
                        value={formData.workLocation}
                        onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                        placeholder="Office / Remote / Hybrid"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500 uppercase">Work Schedule</Label>
                      <Input
                        value={formData.workSchedule}
                        onChange={(e) => setFormData({ ...formData, workSchedule: e.target.value })}
                        placeholder="e.g. 9AM - 5PM"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <Label className="text-xs text-gray-500 uppercase">Manager / Supervisor</Label>
                      <Input
                        value={formData.manager}
                        onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                        placeholder="Manager name"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Department</p>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-900 dark:text-white">{formData.department}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Position / Role</p>
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-900 dark:text-white">{formData.position}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Employment Type</p>
                      <Badge variant="outline" className="font-medium">
                        {formData.employmentType}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Employment Status</p>
                      <Badge className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border font-medium`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {formData.employmentStatus}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Work Location</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formData.workLocation || "Office"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Work Schedule</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formData.workSchedule || "Standard (9AM - 5PM)"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Manager / Supervisor</p>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formData.manager || "Not Assigned"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compensation Card */}
            <Card className="border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-b border-emerald-100 dark:border-emerald-800">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                  Compensation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {isEditing ? (
                  <>
                    <div className="p-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl text-white">
                      <p className="text-sm text-emerald-100 mb-1">Current Salary</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">$</span>
                        <Input
                          type="number"
                          value={formData.salary}
                          onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70 text-2xl font-bold"
                        />
                      </div>
                      <p className="text-sm text-emerald-100 mt-1">
                        per {formData.payFrequency.toLowerCase()}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 uppercase">Pay Frequency</Label>
                        <select
                          value={formData.payFrequency}
                          onChange={(e) => setFormData({ ...formData, payFrequency: e.target.value })}
                          className="w-full border border-gray-200 rounded-md px-3 py-2"
                        >
                          <option value="Monthly">Monthly</option>
                          <option value="Bi-weekly">Bi-weekly</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Annually">Annually</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 uppercase">Currency</Label>
                        <Input value="USD" disabled className="bg-gray-100" />
                      </div>
                    </div>
                  </>
                ) : formData.salary ? (
                  <>
                    <div className="p-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl text-white">
                      <p className="text-sm text-emerald-100 mb-1">Current Salary</p>
                      <p className="text-4xl font-bold">
                        ${formData.salary.toLocaleString()}
                      </p>
                      <p className="text-sm text-emerald-100 mt-1">
                        per {formData.payFrequency.toLowerCase()}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Pay Frequency</p>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formData.payFrequency}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Currency</p>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <p className="font-medium text-gray-900 dark:text-white">USD</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No salary information available</p>
                    {isEditing && (
                      <Button variant="outline" size="sm" className="mt-4" onClick={() => setFormData({ ...formData, salary: 0 })}>
                        Add Salary Info
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Work Schedule Card */}
          {schedule && (
            <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Current Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {schedule.shifts.map((shift) => (
                    <div
                      key={shift.id}
                      className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <p className="text-xs font-medium text-gray-500 uppercase mb-2">{shift.day}</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {shift.startTime}
                      </p>
                      <p className="text-xs text-gray-400">to</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {shift.endTime}
                      </p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {shift.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6 animate-fade-in-up">
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-indigo-600" />
                Documents
                <Badge variant="secondary" className="ml-2">{documents.length}</Badge>
              </CardTitle>
              <Button
                onClick={handleUploadDocument}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center shadow-sm">
                          {getDocumentIcon(doc.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{doc.category}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>Uploaded {formatDate(doc.uploadedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadDocument(doc.name)}
                          className="rounded-lg"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="rounded-lg">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDownloadDocument(doc.name)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteDocument(doc.id)} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No documents yet</p>
                  <p className="text-sm mt-1">Upload employee documents here</p>
                  <Button
                    variant="outline"
                    onClick={handleUploadDocument}
                    className="mt-4"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload First Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Time Entries */}
            <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock3 className="w-5 h-5 text-blue-600" />
                  Recent Time Entries
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {timeEntries.length > 0 ? (
                  <div className="space-y-3">
                    {timeEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatDate(entry.date)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {entry.clockIn
                                ? new Date(entry.clockIn).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "—"}
                              {" - "}
                              {entry.clockOut
                                ? new Date(entry.clockOut).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "In Progress"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {entry.overtimeMinutes > 0 ? (
                            <Badge className="bg-amber-50 text-amber-700 border border-amber-200">
                              +{entry.overtimeMinutes}m OT
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Regular</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No time entries found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Payroll Entries */}
            <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Recent Payroll
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {payrollEntries.length > 0 ? (
                  <div className="space-y-3">
                    {payrollEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatDate(entry.periodStart)} - {formatDate(entry.periodEnd)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {entry.periodType} • {entry.rateType} Rate
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">
                            ${entry.netPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <Badge
                            className={
                              entry.status === "RELEASED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : entry.status === "APPROVED"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }
                          >
                            {entry.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No payroll entries found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Attendance Summary */}
          {payrollEntries.length > 0 && (
            <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Attendance Summary (Latest Period)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {(() => {
                  const latestPayroll = payrollEntries[0];
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <p className="text-xs text-blue-600 dark:text-blue-400 uppercase mb-1">Days Worked</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{latestPayroll.daysWorked}</p>
                      </div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <p className="text-xs text-purple-600 dark:text-purple-400 uppercase mb-1">Hours Worked</p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{latestPayroll.hoursWorked}</p>
                      </div>
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                        <p className="text-xs text-amber-600 dark:text-amber-400 uppercase mb-1">Late Minutes</p>
                        <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">{latestPayroll.lateMinutes}</p>
                      </div>
                      <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                        <p className="text-xs text-rose-600 dark:text-rose-400 uppercase mb-1">Absence Days</p>
                        <p className="text-2xl font-bold text-rose-900 dark:text-rose-300">{latestPayroll.absenceDays}</p>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
