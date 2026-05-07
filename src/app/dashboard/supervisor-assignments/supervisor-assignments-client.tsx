"use client";

import { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  UserMinus,
  Crown,
  Briefcase,
  Search,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Building2,
  Shield,
  Settings,
  Siren,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  BarChart3,
  UserCircle,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { mockEmployees } from "@/lib/mock-data";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  performance: number;
  status: "active" | "warning" | "review";
}

interface Supervisor {
  id: string;
  fullName: string;
  email: string;
  department: string;
  position: string;
  teamSize: number;
  isSupervisor: boolean;
  permissions: string[];
  teamMembers?: TeamMember[];
}

// Mock team assignments
const mockTeamAssignments: Record<string, TeamMember[]> = {
  "1": [
    { id: "2", name: "Jane Smith", position: "Senior Developer", department: "Engineering", performance: 92, status: "active" },
    { id: "3", name: "Bob Johnson", position: "Developer", department: "Engineering", performance: 85, status: "active" },
    { id: "4", name: "Alice Williams", position: "Junior Developer", department: "Engineering", performance: 78, status: "warning" },
  ],
  "5": [
    { id: "6", name: "Carol Davis", position: "Sales Rep", department: "Sales", performance: 95, status: "active" },
    { id: "7", name: "David Miller", position: "Sales Rep", department: "Sales", performance: 72, status: "review" },
    { id: "8", name: "Eva Wilson", position: "Sales Rep", department: "Sales", performance: 88, status: "active" },
  ],
};

const availablePermissions = [
  { id: "attendance", label: "Manage Attendance", description: "Approve timesheets and view attendance reports" },
  { id: "leave", label: "Approve Leave", description: "Review and approve leave requests" },
  { id: "scheduling", label: "Team Scheduling", description: "Create and manage team schedules" },
  { id: "reports", label: "Team Reports", description: "View team performance and activity reports" },
  { id: "announcements", label: "Post Announcements", description: "Create announcements for team members" },
  { id: "assets", label: "Manage Assets", description: "Assign and track team equipment" },
];

export function SupervisorAssignmentsClient() {
  const [employees, setEmployees] = useState<Supervisor[]>(
    mockEmployees.map((e) => ({
      ...e,
      isSupervisor: e.position.toLowerCase().includes("manager") || e.position.toLowerCase().includes("lead"),
      permissions: ["attendance", "leave", "scheduling", "reports"],
      teamSize: mockTeamAssignments[e.id]?.length || 0,
      teamMembers: mockTeamAssignments[e.id] || [],
    }))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [expandedSupervisor, setExpandedSupervisor] = useState<string | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("supervisors");
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);

  const departments = useMemo(() => {
    const depts = new Set(employees.map((e) => e.department));
    return ["all", ...Array.from(depts).sort()];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (e) =>
        (e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.position.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedDepartment === "all" || e.department === selectedDepartment)
    );
  }, [employees, searchQuery, selectedDepartment]);

  const supervisors = filteredEmployees.filter((e) => e.isSupervisor);
  const regularEmployees = filteredEmployees.filter((e) => !e.isSupervisor);

  const toggleSupervisor = (id: string) => {
    setEmployees(
      employees.map((e) =>
        e.id === id ? { ...e, isSupervisor: !e.isSupervisor } : e
      )
    );
    const emp = employees.find((e) => e.id === id);
    const newStatus = !emp?.isSupervisor;
    toast.success(
      `${emp?.fullName} is now ${newStatus ? "a supervisor" : "a regular employee"}`
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedSupervisor(expandedSupervisor === id ? null : id);
  };

  const toggleSelect = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEmployees.length === regularEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(regularEmployees.map((e) => e.id));
    }
  };

  const bulkMakeSupervisors = () => {
    setEmployees(
      employees.map((e) =>
        selectedEmployees.includes(e.id) ? { ...e, isSupervisor: true } : e
      )
    );
    toast.success(`${selectedEmployees.length} employees promoted to supervisor`);
    setSelectedEmployees([]);
  };

  const openPermissionsDialog = (supervisor: Supervisor) => {
    setSelectedSupervisor(supervisor);
    setIsPermissionsDialogOpen(true);
  };

  const updatePermissions = (permissionId: string) => {
    if (!selectedSupervisor) return;
    
    const updatedPermissions = selectedSupervisor.permissions.includes(permissionId)
      ? selectedSupervisor.permissions.filter((p) => p !== permissionId)
      : [...selectedSupervisor.permissions, permissionId];
    
    setEmployees(
      employees.map((e) =>
        e.id === selectedSupervisor.id
          ? { ...e, permissions: updatedPermissions }
          : e
      )
    );
    
    setSelectedSupervisor({
      ...selectedSupervisor,
      permissions: updatedPermissions,
    });
  };

  const stats = {
    totalSupervisors: employees.filter((e) => e.isSupervisor).length,
    totalEmployees: employees.filter((e) => !e.isSupervisor).length,
    avgTeamSize: Math.round(
      employees
        .filter((e) => e.isSupervisor)
        .reduce((acc, e) => acc + (e.teamSize || 0), 0) /
        employees.filter((e) => e.isSupervisor).length || 0
    ),
    departmentsCovered: new Set(employees.filter((e) => e.isSupervisor).map((e) => e.department)).size,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Supervisor Management
              </h1>
              <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-0">
                <Crown className="w-3 h-3 mr-1" /> Admin Only
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Manage supervisor roles, team assignments, and permissions
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalSupervisors}</p>
                <p className="text-xs text-gray-500">Supervisors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalEmployees}</p>
                <p className="text-xs text-gray-500">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Layers className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgTeamSize}</p>
                <p className="text-xs text-gray-500">Avg Team Size</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.departmentsCovered}</p>
                <p className="text-xs text-gray-500">Departments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="supervisors" className="gap-2">
            <Briefcase className="w-4 h-4" /> Supervisors
          </TabsTrigger>
          <TabsTrigger value="assign" className="gap-2">
            <UserPlus className="w-4 h-4" /> Assign
          </TabsTrigger>
          <TabsTrigger value="structure" className="gap-2">
            <Layers className="w-4 h-4" /> Structure
          </TabsTrigger>
        </TabsList>

        {/* Supervisors Tab */}
        <TabsContent value="supervisors" className="space-y-6 m-0">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search supervisors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white"
            >
              <option value="all">All Departments</option>
              {departments.filter(d => d !== "all").map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Supervisors List */}
          <div className="space-y-4">
            {supervisors.length === 0 ? (
              <Card className="border-gray-100">
                <CardContent className="py-12 text-center">
                  <Crown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No supervisors assigned yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("assign")}
                  >
                    Assign Supervisors
                  </Button>
                </CardContent>
              </Card>
            ) : (
              supervisors.map((supervisor) => (
                <Card key={supervisor.id} className="border-gray-100 shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg">
                          {supervisor.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{supervisor.fullName}</p>
                            <Badge className="bg-purple-100 text-purple-700">Supervisor</Badge>
                          </div>
                          <p className="text-sm text-gray-500">{supervisor.position} • {supervisor.department}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" /> {supervisor.teamSize} team members
                            </span>
                            <span className="flex items-center gap-1">
                              <Shield className="w-3 h-3" /> {supervisor.permissions.length} permissions
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openPermissionsDialog(supervisor)}
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Permissions
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(supervisor.id)}
                        >
                          {expandedSupervisor === supervisor.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => toggleSupervisor(supervisor.id)}
                        >
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Expanded Team View */}
                    {expandedSupervisor === supervisor.id && (
                      <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Team Members ({supervisor.teamMembers?.length || 0})
                          </h4>
                          <Button variant="outline" size="sm">
                            <UserPlus className="w-3 h-3 mr-1" />
                            Add Member
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {supervisor.teamMembers?.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-sm font-medium">
                                  {member.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-gray-900">{member.name}</p>
                                  <p className="text-xs text-gray-500">{member.position}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="text-sm font-medium">{member.performance}%</p>
                                  <Progress value={member.performance} className="w-20 h-1.5 mt-1" />
                                </div>
                                <Badge 
                                  variant={member.status === "active" ? "default" : member.status === "warning" ? "secondary" : "destructive"}
                                  className="text-xs"
                                >
                                  {member.status}
                                </Badge>
                              </div>
                            </div>
                          )) || (
                            <p className="text-center py-4 text-gray-400 text-sm">No team members assigned</p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Assign Tab */}
        <TabsContent value="assign" className="space-y-6 m-0">
          {/* Bulk Actions */}
          {selectedEmployees.length > 0 && (
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-purple-900">
                    {selectedEmployees.length} employees selected
                  </p>
                  <Button onClick={bulkMakeSupervisors} className="bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Make Supervisors
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white"
            >
              <option value="all">All Departments</option>
              {departments.filter(d => d !== "all").map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Available Employees */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  Available Employees
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedEmployees.length === regularEmployees.length && regularEmployees.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                  <span className="text-sm text-gray-500">Select All</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {regularEmployees.length === 0 ? (
                <p className="text-center py-6 text-gray-400">No available employees</p>
              ) : (
                <div className="space-y-2">
                  {regularEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedEmployees.includes(emp.id)}
                          onCheckedChange={() => toggleSelect(emp.id)}
                        />
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-semibold">
                          {emp.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{emp.fullName}</p>
                          <p className="text-xs text-gray-500">
                            {emp.position} • {emp.department}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        onClick={() => toggleSupervisor(emp.id)}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Make Supervisor
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Structure Tab */}
        <TabsContent value="structure" className="space-y-6 m-0">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                Organization Structure
              </CardTitle>
              <CardDescription>Current reporting hierarchy by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Array.from(new Set(employees.map((e) => e.department))).map((dept) => {
                  const deptSupervisors = employees.filter(
                    (e) => e.department === dept && e.isSupervisor
                  );
                  const deptEmployees = employees.filter(
                    (e) => e.department === dept && !e.isSupervisor
                  );
                  
                  return (
                    <div key={dept} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 className="w-5 h-5 text-blue-500" />
                        <h3 className="font-semibold text-gray-900">{dept}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {deptSupervisors.length} supervisors
                        </Badge>
                      </div>
                      
                      {deptSupervisors.length > 0 ? (
                        <div className="space-y-3">
                          {deptSupervisors.map((sup) => (
                            <div key={sup.id} className="ml-4">
                              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                <Crown className="w-5 h-5 text-purple-500" />
                                <div>
                                  <p className="font-medium text-gray-900">{sup.fullName}</p>
                                  <p className="text-xs text-gray-500">{sup.position}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                                <span className="text-sm text-gray-500">
                                  {sup.teamSize} reports
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="ml-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                          <p className="text-sm text-amber-700 flex items-center gap-2">
                            <Siren className="w-4 h-4" />
                            No supervisor assigned to this department
                          </p>
                        </div>
                      )}
                      
                      <div className="mt-3 ml-4 text-sm text-gray-500">
                        {deptEmployees.length} team members without direct reports
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Supervisor Permissions Overview</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Team attendance management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Leave request approvals</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Schedule management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Team performance reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-500" />
                  <span>Financial reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-500" />
                  <span>Payroll data access</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Dialog */}
      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Manage Permissions
            </DialogTitle>
            <DialogDescription>
              Configure permissions for {selectedSupervisor?.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {availablePermissions.map((perm) => (
              <div
                key={perm.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
              >
                <Checkbox
                  checked={selectedSupervisor?.permissions.includes(perm.id)}
                  onCheckedChange={() => updatePermissions(perm.id)}
                />
                <div>
                  <p className="font-medium text-sm text-gray-900">{perm.label}</p>
                  <p className="text-xs text-gray-500">{perm.description}</p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPermissionsDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
