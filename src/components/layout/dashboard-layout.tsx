"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  DollarSign,
  Bell,
  Settings,
  Menu,
  LogOut,
  Briefcase,
  FileText,
  ChevronDown,
  UserCircle,
  TrendingUp,
  Brain,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { mockNotifications, mockCurrentUser } from "@/lib/mock-data";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Employees", href: "/dashboard/employees", icon: Users },
  { name: "Attendance", href: "/dashboard/attendance", icon: Clock },
  { name: "Scheduling", href: "/dashboard/scheduling", icon: Calendar },
  { name: "Payroll", href: "/dashboard/payroll", icon: DollarSign },
  { name: "Assets", href: "/dashboard/assets", icon: Briefcase },
  { name: "Leave", href: "/dashboard/leave", icon: FileText },
  { name: "Announcements", href: "/dashboard/announcements", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

// Admin-only navigation items
const adminNavigation = [
  { name: "Finance", href: "/dashboard/finance", icon: TrendingUp },
  { name: "AI Insights", href: "/dashboard/ai-insights", icon: Brain },
  { name: "Supervisor Assignments", href: "/dashboard/supervisor-assignments", icon: Crown },
];

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const pathname = usePathname();
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  // Check if current page is an admin-only page
  const isAdminPage = pathname?.includes("/finance") || 
                      pathname?.includes("/ai-insights") || 
                      pathname?.includes("/supervisor-assignments") ||
                      pathname?.includes("/admin");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-16 shrink-0 items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              ClockRoster
            </span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                        isActive
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 shrink-0 ${
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 group-hover:text-blue-600 dark:text-gray-500"
                        }`}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
              
              {/* Admin-only section */}
              <li className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Admin Only
                </p>
              </li>
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                        isActive
                          ? "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
                          : "text-gray-700 hover:bg-gray-50 hover:text-purple-600 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 shrink-0 ${
                          isActive
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-gray-400 group-hover:text-purple-600 dark:text-gray-500"
                        }`}
                      />
                      {item.name}
                      <Badge className="ml-auto text-[10px] bg-purple-100 text-purple-700">Admin</Badge>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
            <Link
              href="/"
              className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <LogOut className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-blue-600 dark:text-gray-500" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden dark:bg-gray-900 dark:border-b dark:border-gray-800">
        <Sheet>
          <SheetTrigger>
            <Button variant="ghost" size="icon" className="-m-2.5 p-2.5">
              <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-white dark:bg-gray-900">
            <div className="flex h-16 shrink-0 items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                ClockRoster
              </span>
            </div>
            <nav className="mt-6 flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                          isActive
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                            : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                      >
                        <item.icon
                          className={`h-5 w-5 shrink-0 ${
                            isActive
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-400 group-hover:text-blue-600 dark:text-gray-500"
                          }`}
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
                
                {/* Admin-only section mobile */}
                <li className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
                  <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Admin Only
                  </p>
                </li>
                {adminNavigation.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                          isActive
                            ? "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
                            : "text-gray-700 hover:bg-gray-50 hover:text-purple-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                      >
                        <item.icon
                          className={`h-5 w-5 shrink-0 ${
                            isActive
                              ? "text-purple-600 dark:text-purple-400"
                              : "text-gray-400 group-hover:text-purple-600 dark:text-gray-500"
                          }`}
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex-1">
          <span className="font-semibold text-gray-900 dark:text-white">
            {title || "Dashboard"}
          </span>
        </div>
        <Link href="/dashboard/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <main className="lg:pl-72">
        {/* Desktop header */}
        <div className="hidden lg:sticky lg:top-0 lg:z-40 lg:flex lg:h-16 lg:items-center lg:gap-x-4 lg:border-b lg:border-gray-200 lg:bg-white lg:px-8 dark:lg:border-gray-800 dark:lg:bg-gray-900">
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-x-4">
            <Link href="/dashboard/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {mockCurrentUser.name}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href="/">
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Back to Home
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
