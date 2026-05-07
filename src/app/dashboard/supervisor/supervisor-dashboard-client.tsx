"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  Users,
  Clock,
  ClipboardList,
  Briefcase,
  Calendar,
  CheckSquare,
  RefreshCw,
  Activity,
  TrendingUp,
  UserCheck,
  UserX,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Employee {
  id: string
  name: string
  email: string
  role: string
  status: string
  department: string | null
  position: string | null
  lastLoginAt: string | null
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color = "blue",
}: {
  label: string
  value: number
  sub: string
  icon: any
  color?: "blue" | "green" | "purple" | "orange" | "red"
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
          <div className={`p-2 rounded-lg ${colorMap[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SupervisorDashboardClient() {
  const { data: session } = useSession()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/users?role=EMPLOYEE")
      if (!response.ok) throw new Error("Failed to fetch employees")
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      toast.error("Failed to load team data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const activeEmployees = employees.filter((e) => e.status === "ACTIVE").length
  const clockedInCount = 5 // Mock data - would come from attendance API
  const onLeaveCount = 2 // Mock data
  const pendingRequests = 3 // Mock data

  const recentActivity = [
    { id: "1", employeeName: "John Doe", action: "clocked in", time: "5 mins ago" },
    { id: "2", employeeName: "Jane Smith", action: "submitted leave request", time: "15 mins ago" },
    { id: "3", employeeName: "Mike Johnson", action: "completed task", time: "1 hour ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supervisor Dashboard</h1>
          <p className="text-sm text-gray-500">
            Manage your team and monitor performance
          </p>
        </div>
        <Button variant="outline" onClick={fetchEmployees} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Team Size"
          value={employees.length}
          sub={`${activeEmployees} active`}
          icon={Users}
          color="blue"
        />
        <StatCard
          label="Clocked In"
          value={clockedInCount}
          sub="currently working"
          icon={Clock}
          color="green"
        />
        <StatCard
          label="On Leave"
          value={onLeaveCount}
          sub="employees"
          icon={Briefcase}
          color="purple"
        />
        <StatCard
          label="Pending"
          value={pendingRequests}
          sub="need action"
          icon={ClipboardList}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/dashboard/attendance">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Attendance</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/employees">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm font-medium">My Team</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/scheduling">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium">Scheduling</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/leave">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                  <ClipboardList className="h-5 w-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium">Leave Requests</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Team */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                My Team
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {employees.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : employees.length === 0 ? (
              <p className="text-center py-6 text-gray-400 text-sm">
                No team members assigned yet
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {employees.slice(0, 5).map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {employee.position || "Employee"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        employee.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {employee.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            <Link href="/dashboard/employees">
              <Button variant="ghost" className="w-full mt-4 text-sm">
                View All Team Members
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Today's Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              Today&apos;s Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <UserCheck className="w-6 h-6 mx-auto mb-1 text-green-600" />
                <p className="text-lg font-bold text-green-700">{clockedInCount}</p>
                <p className="text-xs text-green-600">Present</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-yellow-600" />
                <p className="text-lg font-bold text-yellow-700">0</p>
                <p className="text-xs text-yellow-600">Late</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <UserX className="w-6 h-6 mx-auto mb-1 text-red-600" />
                <p className="text-lg font-bold text-red-700">{onLeaveCount}</p>
                <p className="text-xs text-red-600">On Leave</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.employeeName}</span>{" "}
                    {activity.action}
                  </p>
                </div>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
