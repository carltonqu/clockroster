"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  UserMinus,
  Crown,
  Briefcase,
  Search,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { mockEmployees } from "@/lib/mock-data";

interface Employee {
  id: string;
  fullName: string;
  department: string;
  position: string;
  isSupervisor?: boolean;
}

export function SupervisorAssignmentsClient() {
  const [employees, setEmployees] = useState<Employee[]>(
    mockEmployees.map((e) => ({
      ...e,
      isSupervisor: e.position.toLowerCase().includes("manager") || e.position.toLowerCase().includes("lead"),
    }))
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = employees.filter(
    (e) =>
      e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const supervisors = filteredEmployees.filter((e) => e.isSupervisor);
  const regularEmployees = filteredEmployees.filter((e) => !e.isSupervisor);

  const toggleSupervisor = (id: string) => {
    setEmployees(
      employees.map((e) =>
        e.id === id ? { ...e, isSupervisor: !e.isSupervisor } : e
      )
    );
    const emp = employees.find((e) => e.id === id);
    toast.success(
      `${emp?.fullName} is now ${emp?.isSupervisor ? "a regular employee" : "a supervisor"}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Supervisor Assignments
              </h1>
              <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-0">
                <Crown className="w-3 h-3 mr-1" /> Admin Only
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Manage supervisor roles and permissions
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{supervisors.length}</p>
                <p className="text-xs text-gray-500">Supervisors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{regularEmployees.length}</p>
                <p className="text-xs text-gray-500">Regular Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Current Supervisors */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-500" />
            Current Supervisors
          </CardTitle>
        </CardHeader>
        <CardContent>
          {supervisors.length === 0 ? (
            <p className="text-center py-6 text-gray-400">No supervisors assigned</p>
          ) : (
            <div className="space-y-2">
              {supervisors.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                      {emp.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{emp.fullName}</p>
                      <p className="text-xs text-gray-500">
                        {emp.position} • {emp.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700">Supervisor</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => toggleSupervisor(emp.id)}
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Employees */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            Available Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          {regularEmployees.length === 0 ? (
            <p className="text-center py-6 text-gray-400">No available employees</p>
          ) : (
            <div className="space-y-2">
              {regularEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3">
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
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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

      {/* Info Card */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Supervisor Permissions</p>
              <p className="text-sm text-gray-600 mt-1">
                Supervisors can manage team attendance, approve leave requests, and view scheduling.
                They do NOT have access to financial reports, payroll data, or AI insights.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
