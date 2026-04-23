"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Save,
  Sparkles,
  CheckCircle,
  Mail,
  Lock,
  Moon,
  Sun,
  Layout,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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

export function SettingsClient() {
  const [profileForm, setProfileForm] = useState({
    name: "Admin User",
    email: "admin@clockroster.com",
    phone: "+1 555-0123",
    department: "Management",
  });

  const [companyForm, setCompanyForm] = useState({
    companyName: "ClockRoster Inc.",
    address: "123 Business Ave, Suite 100",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    country: "USA",
    timezone: "America/Los_Angeles",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    weeklyDigest: true,
    payrollAlerts: true,
    scheduleChanges: true,
    leaveRequests: true,
  });

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully!`);
  };

  const enabledNotifications = Object.values(notifications).filter(Boolean).length;

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
              Settings
            </h2>
            <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-0">
              <Sparkles className="w-3 h-3 mr-1" /> Configuration
            </Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage your account and application preferences
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Bell} label="Notifications Enabled" value={enabledNotifications} gradient="from-blue-500 to-cyan-500" delay={100} />
        <StatCard icon={Shield} label="Security Score" value={85} gradient="from-emerald-500 to-green-500" delay={200} suffix="%" />
        <StatCard icon={Zap} label="System Status" value={100} gradient="from-purple-500 to-pink-500" delay={300} suffix="%" />
      </div>

      <Tabs defaultValue="profile" className="space-y-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 lg:w-fit rounded-xl p-1">
          <TabsTrigger value="profile" className="rounded-lg gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="company" className="rounded-lg gap-2">
            <Building2 className="h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Profile Settings</CardTitle>
                  <CardDescription>Update your personal information and contact details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-medium text-gray-500">Full Name</Label>
                  <Input
                    id="name"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-medium text-gray-500">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-medium text-gray-500">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-xs font-medium text-gray-500">Department</Label>
                  <Input
                    id="department"
                    value={profileForm.department}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, department: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button onClick={() => handleSave("Profile")} className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Settings */}
        <TabsContent value="company">
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Company Settings</CardTitle>
                  <CardDescription>Manage your company information and business details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="companyName" className="text-xs font-medium text-gray-500">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyForm.companyName}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, companyName: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-xs font-medium text-gray-500">Address</Label>
                  <Input
                    id="address"
                    value={companyForm.address}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, address: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-xs font-medium text-gray-500">City</Label>
                  <Input
                    id="city"
                    value={companyForm.city}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, city: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-xs font-medium text-gray-500">State</Label>
                  <Input
                    id="state"
                    value={companyForm.state}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, state: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip" className="text-xs font-medium text-gray-500">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={companyForm.zip}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, zip: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-xs font-medium text-gray-500">Country</Label>
                  <Input
                    id="country"
                    value={companyForm.country}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, country: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button onClick={() => handleSave("Company")} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified about important events</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                {[
                  { key: "emailAlerts", label: "Email Alerts", description: "Receive important alerts via email", icon: Mail },
                  { key: "pushNotifications", label: "Push Notifications", description: "Receive push notifications in your browser", icon: Bell },
                  { key: "weeklyDigest", label: "Weekly Digest", description: "Get a summary of activities every week", icon: Layout },
                  { key: "payrollAlerts", label: "Payroll Alerts", description: "Notifications about payroll processing and payments", icon: CheckCircle },
                  { key: "scheduleChanges", label: "Schedule Changes", description: "Get notified when schedules are updated", icon: Layout },
                  { key: "leaveRequests", label: "Leave Requests", description: "Notifications about leave request approvals and updates", icon: CheckCircle },
                ].map(({ key, label, description, icon: Icon }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg flex items-center justify-center">
                          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-sm font-medium">{label}</Label>
                          <p className="text-xs text-gray-500">{description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications[key as keyof typeof notifications]}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, [key]: checked })
                        }
                      />
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave("Notification")} className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Security Settings</CardTitle>
                  <CardDescription>Manage your password and security preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-xs font-medium text-gray-500">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="••••••••" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-xs font-medium text-gray-500">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="••••••••" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-medium text-gray-500">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" className="rounded-xl" />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button onClick={() => handleSave("Security")} className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl">
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Appearance Settings</CardTitle>
                  <CardDescription>Customize the look and feel of the application</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
                      <Moon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Dark Mode</Label>
                      <p className="text-xs text-gray-500">Toggle between light and dark themes</p>
                    </div>
                  </div>
                  <Switch onCheckedChange={() => toast.info("Dark mode toggle coming soon!")} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-lg flex items-center justify-center">
                      <Layout className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Compact View</Label>
                      <p className="text-xs text-gray-500">Use a more compact layout for tables and lists</p>
                    </div>
                  </div>
                  <Switch onCheckedChange={() => toast.info("Compact view toggle coming soon!")} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg flex items-center justify-center">
                      <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Show Animations</Label>
                      <p className="text-xs text-gray-500">Enable or disable UI animations</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button onClick={() => handleSave("Appearance")} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
