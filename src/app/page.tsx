import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
];

const features = [
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Effortless clock in and clock out system with automatic overtime calculations, attendance monitoring, and real-time timesheets.",
    benefits: ["Real-time attendance monitoring", "Automatic overtime computation", "Digital timesheets", "Late and absence tracking"],
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Create and manage employee schedules with an intuitive drag-and-drop planner.",
    benefits: ["Drag-and-drop shift management", "Group scheduling support", "Conflict and overlap detection", "Flexible shift adjustments"],
  },
  {
    icon: DollarSign,
    title: "Payroll Automation",
    description: "Sync worked hours directly to payroll with customizable salary structures and deductions.",
    benefits: ["Automated payroll calculations", "Custom pay rates and deductions", "Overtime integration", "Payroll-ready reports"],
  },
  {
    icon: BarChart3,
    title: "Workforce Analytics",
    description: "Get valuable insights into workforce performance and operational costs.",
    benefits: ["Labor cost monitoring", "Attendance trend analysis", "Performance insights", "Exportable reports and dashboards"],
  },
  {
    icon: Bell,
    title: "Notifications & Alerts",
    description: "Keep your team informed and connected with smart notifications.",
    benefits: ["Shift reminders", "Approval notifications", "Schedule change alerts", "Attendance updates"],
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Secure and organized access control for every level of your company.",
    benefits: ["Admin dashboards", "Supervisor management panels", "Employee self-service access", "Permission-based security"],
  },
];

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
];

const industries = [
  { icon: UtensilsCrossed, name: "Restaurants & Cafes" },
  { icon: Store, name: "Retail Stores" },
  { icon: Package, name: "Warehouses" },
  { icon: Building, name: "Franchises" },
  { icon: Briefcase, name: "Corporate Teams" },
  { icon: Users, name: "Agencies" },
  { icon: Building2, name: "Service Businesses" },
  { icon: Globe, name: "Remote & Hybrid Teams" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/80 via-white to-blue-100/60 -z-10" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-blue-100/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-xl text-gray-900 tracking-tight">
              ClockRoster
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#solutions" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Solutions</Link>
            <Link href="#industries" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Industries</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl px-5">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100/80 text-blue-700 border-0 rounded-full px-4 py-1.5 text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Workforce Management Simplified
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
              Manage Your Team{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed max-w-3xl mx-auto">
              Time tracking, scheduling, payroll, and workforce analytics — all in one beautiful, intuitive platform designed for modern businesses.
            </p>
            <p className="text-gray-500 mb-10 max-w-2xl mx-auto">
              Reduce manual work, improve team productivity, and gain complete visibility over your workforce operations from a single dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 text-base shadow-xl shadow-blue-200"
                >
                  Start Managing Smarter Today
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Businesses Choose Our Platform
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Managing employees shouldn't be stressful, complicated, or time-consuming. Our system helps businesses simplify daily operations while improving accuracy, communication, and efficiency.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((item) => (
              <div
                key={item.title}
                className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100/50 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/30 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-blue-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features Designed for Modern Teams
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-8 bg-white rounded-2xl border border-blue-100/50 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Solutions We Provide
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution) => (
              <div
                key={solution.title}
                className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100/50 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                  <solution.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {solution.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-20 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perfect For
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {industries.map((industry) => (
              <div
                key={industry.name}
                className="flex flex-col items-center p-6 bg-white rounded-xl border border-blue-100/50 hover:border-blue-200 hover:shadow-md transition-all duration-300"
              >
                <industry.icon className="w-8 h-8 text-blue-600 mb-3" />
                <span className="text-sm font-medium text-gray-700 text-center">
                  {industry.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl shadow-blue-200">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simplify Workforce Management Today
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Spend less time managing spreadsheets and more time growing your business.
            </p>
            <p className="text-blue-200 mb-8">
              Smart scheduling. Accurate payroll. Better workforce management — all in one platform.
            </p>
            <Link href="/auth/signin">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl px-8 h-12 text-base font-semibold shadow-lg"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-100/50 py-12 bg-white/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg text-gray-900">
                ClockRoster
              </span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} ClockRoster. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
