"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { StarBackground } from "./components/StarBackground"
import {
  Clock,
  Calendar,
  DollarSign,
  BarChart3,
  Bell,
  Shield,
  Check,
  ArrowRight,
  Users,
  Sparkles,
  Play,
  Building2,
  UserCog,
  User,
  Store,
  Package,
  Briefcase,
  Building,
  Globe,
  UtensilsCrossed,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    tag: "TIME",
    title: "Time Tracking",
    description: "Effortless clock in and clock out system with automatic overtime calculations and real-time attendance monitoring.",
    icon: Clock,
    color: "bg-blue-100 text-blue-700",
    preview: "time",
  },
  {
    tag: "SCHEDULE",
    title: "Smart Scheduling",
    description: "Create and manage employee schedules with an intuitive drag-and-drop planner and visual calendar view.",
    icon: Calendar,
    color: "bg-emerald-100 text-emerald-700",
    preview: "schedule",
  },
  {
    tag: "PAYROLL",
    title: "Payroll Automation",
    description: "Sync worked hours directly to payroll with customizable salary structures and automated calculations.",
    icon: DollarSign,
    color: "bg-violet-100 text-violet-700",
    preview: "payroll",
  },
  {
    tag: "ANALYTICS",
    title: "Workforce Analytics",
    description: "Get valuable insights into workforce performance, labor costs, and operational efficiency with detailed reports.",
    icon: BarChart3,
    color: "bg-amber-100 text-amber-700",
    preview: "analytics",
  },
  {
    tag: "ALERTS",
    title: "Smart Notifications",
    description: "Keep your team informed with instant notifications for shifts, approvals, and schedule changes.",
    icon: Bell,
    color: "bg-rose-100 text-rose-700",
    preview: "alerts",
  },
  {
    tag: "SECURITY",
    title: "Role-Based Access",
    description: "Secure access control for every level with Admin, Supervisor, and Employee permission levels.",
    icon: Shield,
    color: "bg-cyan-100 text-cyan-700",
    preview: "security",
  },
]

// Feature Preview Components
function TimeTrackingPreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main Clock Card */}
      <div className="bg-white rounded-2xl shadow-lg p-4 w-40 transform -rotate-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-medium text-gray-700">Clock In</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">09:00</div>
        <div className="text-xs text-green-500">On Time ✓</div>
      </div>
      {/* Floating Stats Card */}
      <div className="absolute -right-2 top-2 bg-white rounded-xl shadow-md p-3 transform rotate-6">
        <div className="text-xs text-gray-500 mb-1">Today</div>
        <div className="text-lg font-bold text-blue-600">8h 30m</div>
      </div>
      {/* Decorative */}
      <div className="absolute -left-4 bottom-4 w-12 h-12 bg-blue-100 rounded-full opacity-60" />
      <div className="absolute right-8 -bottom-2 w-8 h-8 bg-yellow-200 rounded-full opacity-50" />
    </div>
  )
}

function SchedulePreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Calendar Card */}
      <div className="bg-white rounded-2xl shadow-lg p-3 w-44">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-700">Mon</span>
          <span className="text-xs text-gray-400">Tue</span>
          <span className="text-xs text-gray-400">Wed</span>
        </div>
        <div className="space-y-2">
          <div className="bg-emerald-100 rounded-lg p-2">
            <div className="text-xs font-medium text-emerald-700">Morning Shift</div>
            <div className="text-xs text-emerald-600">8:00 - 4:00</div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100">
            <div className="text-xs font-medium text-emerald-600">Evening Shift</div>
            <div className="text-xs text-emerald-500">4:00 - 12:00</div>
          </div>
        </div>
      </div>
      {/* Floating Badge */}
      <div className="absolute -right-4 top-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md transform rotate-12">
        +3
      </div>
      {/* Decorative */}
      <div className="absolute left-2 -top-2 w-10 h-10 bg-emerald-100 rounded-full opacity-50" />
    </div>
  )
}

function PayrollPreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Payroll Card */}
      <div className="bg-white rounded-2xl shadow-lg p-4 w-40">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-violet-600" />
          </div>
          <span className="text-xs font-medium text-gray-700">Payroll</span>
        </div>
        <div className="text-xl font-bold text-gray-900 mb-2">$4,250</div>
        <div className="flex gap-1">
          <div className="h-1.5 w-8 bg-violet-500 rounded-full" />
          <div className="h-1.5 w-6 bg-violet-300 rounded-full" />
          <div className="h-1.5 w-4 bg-violet-200 rounded-full" />
        </div>
      </div>
      {/* Stats Card */}
      <div className="absolute -right-2 -top-2 bg-white rounded-xl shadow-md p-3 transform rotate-6">
        <div className="text-xs text-gray-500">Tax</div>
        <div className="text-sm font-bold text-violet-600">-$425</div>
      </div>
      {/* Decorative */}
      <div className="absolute -left-4 bottom-4 w-12 h-12 bg-violet-100 rounded-full opacity-60" />
      <div className="absolute right-4 -bottom-2 w-6 h-6 bg-yellow-300 rounded-full opacity-50" />
    </div>
  )
}

function AnalyticsPreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Chart Card */}
      <div className="bg-white rounded-2xl shadow-lg p-4 w-44">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-700">Productivity</span>
          <span className="text-xs text-amber-500">+12%</span>
        </div>
        {/* Bar Chart */}
        <div className="flex items-end gap-2 h-16">
          <div className="w-4 bg-amber-200 rounded-t" style={{ height: '40%' }} />
          <div className="w-4 bg-amber-300 rounded-t" style={{ height: '60%' }} />
          <div className="w-4 bg-amber-400 rounded-t" style={{ height: '45%' }} />
          <div className="w-4 bg-amber-500 rounded-t" style={{ height: '80%' }} />
          <div className="w-4 bg-amber-600 rounded-t" style={{ height: '95%' }} />
        </div>
      </div>
      {/* Floating Metric */}
      <div className="absolute -right-4 top-6 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
        94%
      </div>
      {/* Decorative */}
      <div className="absolute left-0 top-2 w-8 h-8 bg-amber-100 rounded-full opacity-50" />
    </div>
  )
}

function AlertsPreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Notification Stack */}
      <div className="relative">
        {/* Background Cards */}
        <div className="absolute -top-2 left-2 bg-rose-50 rounded-xl p-3 w-36 opacity-50 transform -rotate-3" />
        <div className="absolute -top-1 left-1 bg-rose-100 rounded-xl p-3 w-36 opacity-70 transform -rotate-1" />
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-3 w-40 relative z-10">
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-rose-500" />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-800">Shift Alert</div>
              <div className="text-xs text-gray-500">Tomorrow 9AM</div>
            </div>
          </div>
        </div>
      </div>
      {/* Badge */}
      <div className="absolute -right-2 top-4 bg-rose-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
        3
      </div>
      {/* Decorative */}
      <div className="absolute -left-4 bottom-4 w-10 h-10 bg-rose-100 rounded-full opacity-60" />
    </div>
  )
}

function SecurityPreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Access Card */}
      <div className="bg-white rounded-2xl shadow-lg p-4 w-40">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-cyan-600" />
          </div>
          <span className="text-xs font-medium text-gray-700">Access</span>
        </div>
        {/* Role Tags */}
        <div className="space-y-2">
          <div className="bg-cyan-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg text-center">
            Admin
          </div>
          <div className="flex gap-2">
            <div className="bg-cyan-100 text-cyan-700 text-xs font-medium px-2 py-1 rounded flex-1 text-center">
              Manager
            </div>
            <div className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded flex-1 text-center">
              Staff
            </div>
          </div>
        </div>
      </div>
      {/* Lock Icon */}
      <div className="absolute -right-4 bottom-4 bg-cyan-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      {/* Decorative */}
      <div className="absolute left-2 -top-2 w-8 h-8 bg-cyan-100 rounded-full opacity-50" />
    </div>
  )
}

const previewComponents: Record<string, React.FC> = {
  time: TimeTrackingPreview,
  schedule: SchedulePreview,
  payroll: PayrollPreview,
  analytics: AnalyticsPreview,
  alerts: AlertsPreview,
  security: SecurityPreview,
}

const whyChoose = [
  {
    title: "Save Time on Manual Tasks",
    description: "Automate repetitive processes like attendance tracking, scheduling, overtime calculations, and payroll preparation.",
  },
  {
    title: "Reduce Payroll Errors",
    description: "Eliminate costly mistakes with automated hour calculations, custom pay rules, and accurate employee records.",
  },
  {
    title: "Improve Team Accountability",
    description: "Track attendance, monitor shift compliance, and stay updated with real-time employee activity.",
  },
  {
    title: "Increase Operational Efficiency",
    description: "Manage schedules, approvals, and workforce data from one centralized system accessible anywhere.",
  },
  {
    title: "Better Decision Making",
    description: "Use real-time analytics and reports to understand labor costs, productivity trends, and staffing performance.",
  },
  {
    title: "Scalable for Any Business",
    description: "Whether you have 5 employees or 500, the platform grows with your business needs.",
  },
]

const solutions = [
  {
    icon: Building2,
    title: "For Business Owners",
    description: "Gain full visibility over your workforce operations while reducing administrative workload and labor inefficiencies.",
  },
  {
    icon: UserCog,
    title: "For Supervisors",
    description: "Manage schedules, approve requests, monitor attendance, and oversee team productivity with ease.",
  },
  {
    icon: User,
    title: "For Employees",
    description: "Access schedules, track work hours, receive notifications, and manage attendance from a simple dashboard.",
  },
]

const industries = [
  { 
    id: "restaurants",
    icon: UtensilsCrossed, 
    name: "Restaurants & Cafes",
    description: "Manage shift-based schedules, track hours across multiple locations, and handle tips and overtime calculations.",
    preview: "restaurants"
  },
  { 
    id: "retail",
    icon: Store, 
    name: "Retail Stores",
    description: "Handle seasonal staffing, part-time workers, and complex scheduling across multiple store locations.",
    preview: "retail"
  },
  { 
    id: "warehouses",
    icon: Package, 
    name: "Warehouses",
    description: "Track attendance for shift workers, manage overtime, and ensure compliance with labor regulations.",
    preview: "warehouses"
  },
  { 
    id: "franchises",
    icon: Building, 
    name: "Franchises",
    description: "Centralized workforce management across multiple franchise locations with role-based access control.",
    preview: "franchises"
  },
  { 
    id: "corporate",
    icon: Briefcase, 
    name: "Corporate Teams",
    description: "Streamline HR processes, track PTO, manage remote workers, and generate detailed workforce reports.",
    preview: "corporate"
  },
  { 
    id: "agencies",
    icon: Users, 
    name: "Agencies",
    description: "Manage contractors and freelancers, track billable hours, and streamline client billing processes.",
    preview: "agencies"
  },
  { 
    id: "service",
    icon: Building2, 
    name: "Service Businesses",
    description: "Schedule field workers, track job completion times, and manage on-call rotations efficiently.",
    preview: "service"
  },
  { 
    id: "remote",
    icon: Globe, 
    name: "Remote & Hybrid Teams",
    description: "Track productivity across time zones, manage flexible schedules, and maintain team collaboration.",
    preview: "remote"
  },
]

// Industry Preview Components
function RestaurantPreview() {
  return (
    <div className="relative w-full h-full p-6">
      <div className="bg-white rounded-2xl shadow-lg p-4 max-w-xs mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">Bistro Central</div>
            <div className="text-xs text-gray-500">3 locations</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-orange-50 rounded-lg p-2">
            <span className="text-sm text-gray-700">Morning Shift</span>
            <span className="text-sm font-medium text-orange-600">6:00 AM</span>
          </div>
          <div className="flex items-center justify-between bg-orange-50 rounded-lg p-2">
            <span className="text-sm text-gray-700">Evening Shift</span>
            <span className="text-sm font-medium text-orange-600">4:00 PM</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="flex-1 bg-gray-100 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-gray-900">12</div>
            <div className="text-xs text-gray-500">Staff</div>
          </div>
          <div className="flex-1 bg-gray-100 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-orange-600">$2.4k</div>
            <div className="text-xs text-gray-500">Tips</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RetailPreview() {
  return (
    <div className="relative w-full h-full p-6">
      <div className="bg-white rounded-2xl shadow-lg p-4 max-w-xs mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Store className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">Fashion Store</div>
            <div className="text-xs text-gray-500">5 branches</div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['M','T','W','T','F','S','S'].map((day, i) => (
            <div key={i} className={`text-center text-xs py-1 rounded ${i < 5 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {day}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600">Weekend Staff: 8</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span className="text-sm text-gray-600">Seasonal: 4</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function WarehousePreview() {
  return (
    <div className="relative w-full h-full p-6">
      <div className="bg-white rounded-2xl shadow-lg p-4 max-w-xs mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">LogiHub Warehouse</div>
            <div className="text-xs text-gray-500">24/7 Operations</div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Night Shift</span>
            <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded-full">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-8 h-8 bg-purple-300 rounded-full border-2 border-white" />
              ))}
            </div>
            <span className="text-sm text-gray-500">+12 on duty</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Overtime Today</span>
          <span className="font-semibold text-purple-600">4.5 hrs</span>
        </div>
      </div>
    </div>
  )
}

function FranchisePreview() {
  return (
    <div className="relative w-full h-full p-6">
      <div className="bg-white rounded-2xl shadow-lg p-4 max-w-xs mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Building className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">Coffee Chain Co.</div>
            <div className="text-xs text-gray-500">15 locations</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['Downtown', 'Mall', 'Airport'].map((loc, i) => (
            <div key={i} className="bg-green-50 rounded-lg p-2 text-center">
              <div className="text-xs font-medium text-green-700">{loc}</div>
              <div className="text-lg font-bold text-green-600">{8 + i * 2}</div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Employees</span>
            <span className="font-bold text-gray-900">127</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CorporatePreview() {
  return (
    <div className="relative w-full h-full p-6">
      <div className="bg-white rounded-2xl shadow-lg p-4 max-w-xs mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">TechCorp HQ</div>
            <div className="text-xs text-gray-500">350 employees</div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">In Office</span>
            </div>
            <span className="text-sm font-semibold text-green-600">142</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">Remote</span>
            </div>
            <span className="text-sm font-semibold text-blue-600">208</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">PTO Requests</span>
            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">12 pending</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AgencyPreview() {
  return (
    <div className="relative w-full h-full p-6">
      <div className="bg-white rounded-2xl shadow-lg p-4 max-w-xs mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">Creative Agency</div>
            <div className="text-xs text-gray-500">25 contractors</div>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          {['Design Team', 'Dev Team', 'Marketing'].map((team, i) => (
            <div key={i} className="flex items-center justify-between bg-pink-50 rounded-lg p-2">
              <span className="text-sm text-gray-700">{team}</span>
              <span className="text-sm font-medium text-pink-600">{40 + i * 15}h</span>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 text-white rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Billable This Month</span>
            <span className="font-bold">$18.5k</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ServicePreview() {
  return (
    <div className="relative w-full h-full p-6">
      <div className="bg-white rounded-2xl shadow-lg p-4 max-w-xs mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">Home Services Pro</div>
            <div className="text-xs text-gray-500">12 field teams</div>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-700">3 Teams On Job</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span className="text-sm text-gray-700">2 Teams En Route</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
            <span className="text-sm text-gray-700">7 Teams Available</span>
          </div>
        </div>
        <div className="bg-cyan-50 rounded-lg p-3">
          <div className="text-xs text-cyan-700 font-medium mb-1">On-Call Tonight</div>
          <div className="flex -space-x-2">
            {[1,2,3].map((i) => (
              <div key={i} className="w-8 h-8 bg-cyan-300 rounded-full border-2 border-white" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function RemotePreview() {
  return (
    <div className="relative w-full h-full p-6">
      <div className="bg-white rounded-2xl shadow-lg p-4 max-w-xs mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">Global Team</div>
            <div className="text-xs text-gray-500">12 time zones</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 mb-4">
          {['SF','NY','LD','TK','SY'].map((city, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center mb-1">
                <span className="text-xs font-bold text-teal-600">{city}</span>
              </div>
              <span className="text-xs text-gray-500">{9 + i}:00</span>
            </div>
          ))}
        </div>
        <div className="bg-teal-50 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-teal-700">Team Online</span>
            <span className="text-lg font-bold text-teal-600">24/42</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const industryPreviews: Record<string, React.FC> = {
  restaurants: RestaurantPreview,
  retail: RetailPreview,
  warehouses: WarehousePreview,
  franchises: FranchisePreview,
  corporate: CorporatePreview,
  agencies: AgencyPreview,
  service: ServicePreview,
  remote: RemotePreview,
}

// Industry Tabs Component
function IndustryTabs() {
  const [activeTab, setActiveTab] = useState("restaurants")
  const activeIndustry = industries.find(i => i.id === activeTab)
  const PreviewComponent = activeIndustry ? industryPreviews[activeIndustry.preview] : RestaurantPreview

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Left Side - Tab List */}
      <div className="space-y-2">
        {industries.map((industry) => (
          <button
            key={industry.id}
            onClick={() => setActiveTab(industry.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 ${
              activeTab === industry.id
                ? "bg-blue-50 border-2 border-blue-200 shadow-md"
                : "bg-white border-2 border-transparent hover:bg-gray-50"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
              activeTab === industry.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
            }`}>
              <industry.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className={`font-semibold transition-colors duration-300 ${
                activeTab === industry.id ? "text-blue-900" : "text-gray-900"
              }`}>
                {industry.name}
              </div>
              {activeTab === industry.id && (
                <div className="text-sm text-blue-600 mt-1 animate-fade-in">
                  {industry.description}
                </div>
              )}
            </div>
            {activeTab === industry.id && (
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Right Side - Preview */}
      <div className="relative">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-2 shadow-inner min-h-[400px]">
          <div className="bg-white rounded-2xl shadow-lg h-full min-h-[384px] overflow-hidden">
            <PreviewComponent />
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-60" />
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-100 rounded-full blur-2xl opacity-60" />
      </div>
    </div>
  )
}

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "500+", label: "Companies" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
]

// Hook for scroll animations
function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

// Animated Section Component
function AnimatedSection({ 
  children, 
  className = "",
  delay = 0 
}: { 
  children: React.ReactNode
  className?: string
  delay?: number 
}) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-xl text-gray-900 tracking-tight">
              ClockRoster
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-0.5">Features</Link>
            <Link href="#solutions" className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-0.5">Solutions</Link>
            <Link href="#industries" className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-0.5">Industries</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl px-5 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-300">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Blue Gradient BG with Stars */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        {/* Animated Stars Background */}
        <StarBackground />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <AnimatedSection className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border border-white/30 rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Workforce Management Simplified
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
              Manage Your Team{" "}
              <span className="text-blue-200">
                Effortlessly
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-6 leading-relaxed max-w-3xl mx-auto">
              Time tracking, scheduling, payroll, and workforce analytics — all in one beautiful, intuitive platform designed for modern businesses.
            </p>
            <p className="text-blue-200/80 mb-10 max-w-2xl mx-auto">
              Reduce manual work, improve team productivity, and gain complete visibility over your workforce operations from a single dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl px-8 h-12 text-base shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Start Managing Smarter Today
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 100} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110">
                  {stat.value}
                </div>
                <div className="text-sm text-blue-200 transition-colors duration-300 group-hover:text-white">
                  {stat.label}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section - White BG */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Businesses Choose Our Platform
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Managing employees shouldn't be stressful, complicated, or time-consuming. Our system helps businesses simplify daily operations while improving accuracy, communication, and efficiency.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 100}>
                <div className="h-full p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group cursor-default">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-blue-600">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Light BG */}
      <section id="features" className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features Designed for Modern Teams
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const PreviewComponent = previewComponents[feature.preview]
              return (
                <AnimatedSection key={feature.title} delay={index * 100}>
                  <div className="h-full bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group border border-gray-100">
                    {/* Tag */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${feature.color}`}>
                      {feature.tag}
                    </span>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    
                    {/* Beautiful UI Mockup Preview */}
                    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl mb-4 h-36 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                      <PreviewComponent />
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Solutions Section - Blue Gradient BG */}
      <section id="solutions" className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -translate-y-1/2" />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Solutions We Provide
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <AnimatedSection key={solution.title} delay={index * 150}>
                <div className="h-full text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-3 group cursor-default">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-500 group-hover:scale-110">
                    <solution.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {solution.title}
                  </h3>
                  <p className="text-blue-100 leading-relaxed">
                    {solution.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section - Tabbed Layout */}
      <section id="industries" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perfect For
            </h2>
          </AnimatedSection>
          
          <AnimatedSection delay={100}>
            <IndustryTabs />
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section - Dark Blue Gradient BG */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <AnimatedSection>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Simplify Workforce Management Today
              </h2>
              <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
                Spend less time managing spreadsheets and more time growing your business.
              </p>
              <p className="text-slate-400 mb-8">
                Smart scheduling. Accurate payroll. Better workforce management — all in one platform.
              </p>
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl px-8 h-12 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg text-gray-900">
                ClockRoster
              </span>
            </Link>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} ClockRoster. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
