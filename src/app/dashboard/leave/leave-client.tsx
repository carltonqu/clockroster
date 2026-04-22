"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export function LeaveClient() {
  const { leaveRequests, employees, addLeaveRequest, updateLeaveRequestStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    type: "Vacation",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && request.status.toLowerCase() === activeTab;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = employees.find((e) => e.id === formData.employeeId);
    if (employee) {
      addLeaveRequest({
        ...formData,
        employeeId: employee.id,
        employeeName: employee.fullName,
        status: "Pending",
      });
      toast.success(`Leave request submitted for ${employee.fullName}!`);
      setIsDialogOpen(false);
      setFormData({
        employeeId: "",
        type: "Vacation",
        startDate: "",
        endDate: "",
        reason: "",
      });
    }
  };

  const handleApprove = (id: string, employeeName: string) => {
    updateLeaveRequestStatus(id, "Approved");
    toast.success(`Approved leave request for ${employeeName}`);
  };

  const handleReject = (id: string, employeeName: string) => {
    updateLeaveRequestStatus(id, "Rejected");
    toast.error(`Rejected leave request for ${employeeName}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "Rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Vacation":
        return "bg-blue-100 text-blue-700";
      case "Sick Leave":
        return "bg-red-100 text-red-700";
      case "Personal":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const pendingCount = leaveRequests.filter((r) => r.status === "Pending").length;
  const approvedCount = leaveRequests.filter((r) => r.status === "Approved").length;
  const rejectedCount = leaveRequests.filter((r) => r.status === "Rejected").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Leave Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage employee leave requests and approvals
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Request Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit Leave Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee *</Label>
                <select
                  id="employee"
                  required
                  value={formData.employeeId}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeId: e.target.value })
                  }
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
              <div className="space-y-2">
                <Label htmlFor="type">Leave Type *</Label>
                <select
                  id="type"
                  required
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="Vacation">Vacation</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Personal">Personal</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Maternity/Paternity">Maternity/Paternity</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="Enter reason for leave..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Requests
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Approved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Rejected
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Table */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">
                  Pending
                  {pendingCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {pendingCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-[250px]"
                  />
                </div>
                <Button variant="outline" size="icon" onClick={() => toast.info("Filter feature coming soon!")}>
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No leave requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {request.employeeName}
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeColor(request.type)}>
                              {request.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">
                                {format(new Date(request.startDate), "MMM d")} -{" "}
                                {format(new Date(request.endDate), "MMM d, yyyy")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600 truncate max-w-[150px] block">
                              {request.reason}
                            </span>
                          </TableCell>
                          <TableCell>
                            {format(new Date(request.requestedAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {request.status === "Pending" && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleApprove(request.id, request.employeeName)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleReject(request.id, request.employeeName)}
                                >
                                  <XCircle className="h-4 w-4" />
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
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}
