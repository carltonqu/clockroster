"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Sparkles,
  X,
  User,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

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
  Approved: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: CheckCircle,
  },
  Pending: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    icon: Clock,
  },
  Rejected: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
    icon: XCircle,
  },
};

const TYPE_CONFIG: Record<string, { bg: string; text: string; icon: any }> = {
  Vacation: { bg: "bg-blue-50 text-blue-700", text: "", icon: Calendar },
  "Sick Leave": { bg: "bg-rose-50 text-rose-700", text: "", icon: Briefcase },
  Personal: { bg: "bg-purple-50 text-purple-700", text: "", icon: User },
  Emergency: { bg: "bg-red-50 text-red-700", text: "", icon: XCircle },
  "Maternity/Paternity": { bg: "bg-pink-50 text-pink-700", text: "", icon: User },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.Vacation;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg}`}>
      {type}
    </span>
  );
}

export function LeaveClient() {
  const router = useRouter();
  const { leaveRequests, employees, addLeaveRequest, updateLeaveRequestStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");


  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && request.status.toLowerCase() === activeTab;
  });



  const handleApprove = (id: string, employeeName: string) => {
    updateLeaveRequestStatus(id, "Approved");
    toast.success(`Approved leave request for ${employeeName}`);
  };

  const handleReject = (id: string, employeeName: string) => {
    updateLeaveRequestStatus(id, "Rejected");
    toast.error(`Rejected leave request for ${employeeName}`);
  };

  const pendingCount = leaveRequests.filter((r) => r.status === "Pending").length;
  const approvedCount = leaveRequests.filter((r) => r.status === "Approved").length;
  const rejectedCount = leaveRequests.filter((r) => r.status === "Rejected").length;

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
              Leave Management
            </h2>
            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-0">
              <Sparkles className="w-3 h-3 mr-1" /> {leaveRequests.length} Total
            </Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage employee leave requests and approvals
          </p>
        </div>
        <Button 
          onClick={() => router.push("/dashboard/leave/new")}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4" />
          Request Leave
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total Requests" value={leaveRequests.length} gradient="from-blue-500 to-cyan-500" delay={100} />
        <StatCard icon={Clock} label="Pending" value={pendingCount} gradient="from-amber-500 to-orange-500" delay={200} />
        <StatCard icon={CheckCircle} label="Approved" value={approvedCount} gradient="from-emerald-500 to-green-500" delay={300} />
        <StatCard icon={XCircle} label="Rejected" value={rejectedCount} gradient="from-rose-500 to-pink-500" delay={400} />
      </div>

      {/* Tabs and Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex gap-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        {/* Vertical Sidebar Tabs */}
        <TabsList className="flex-col h-fit min-w-[180px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2 rounded-xl">
          <TabsTrigger value="all" className="w-full justify-start gap-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white py-3">
            <FileText className="w-4 h-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="pending" className="w-full justify-start gap-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white py-3">
            <Clock className="w-4 h-4" />
            Pending
            {pendingCount > 0 && (
              <Badge className="ml-auto bg-amber-100 text-amber-700 border-0">{pendingCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="w-full justify-start gap-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white py-3">
            <CheckCircle className="w-4 h-4" />
            Approved
          </TabsTrigger>
          <TabsTrigger value="rejected" className="w-full justify-start gap-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white py-3">
            <XCircle className="w-4 h-4" />
            Rejected
          </TabsTrigger>
          <Separator className="my-2" />
          <div className="p-2 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full rounded-xl text-sm"
              />
            </div>
            {searchQuery && (
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="w-full rounded-xl justify-start">
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => toast.info("Filter feature coming soon!")} className="w-full rounded-xl justify-start">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
          </div>
        </TabsList>
        
        {/* Content Area */}
        <div className="flex-1">
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-50 dark:border-gray-800">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                {activeTab === "all" && "All Leave Requests"}
                {activeTab === "pending" && "Pending Requests"}
                {activeTab === "approved" && "Approved Requests"}
                {activeTab === "rejected" && "Rejected Requests"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <TabsContent value={activeTab} className="mt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Employee</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Duration</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Reason</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Requested</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</TableHead>
                      <TableHead className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-16">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4">
                              <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No leave requests found</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Create your first leave request</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request, index) => (
                        <TableRow key={request.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                                {request.employeeName.charAt(0)}
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">{request.employeeName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <TypeBadge type={request.type} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                              <Calendar className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-sm">
                                {format(new Date(request.startDate), "MMM d")} -{" "}
                                {format(new Date(request.endDate), "MMM d, yyyy")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[150px] block">
                              {request.reason || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                            {format(new Date(request.requestedAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={request.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            {request.status === "Pending" && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApprove(request.id, request.employeeName)}
                                  className="rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                >
                                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleReject(request.id, request.employeeName)}
                                  className="rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                >
                                  <XCircle className="h-4 w-4 text-rose-600" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}
