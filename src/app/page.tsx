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
  Zap,
  Play,
  Sparkles,
  Timer,
  FileText,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Timer,
    title: "Time Tracking",
    description: "Effortless clock in/out with automatic overtime calculations.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Visual drag-and-drop scheduler for seamless shift planning.",
  },
  {
    icon: DollarSign,
    title: "Payroll Automation",
    description: "Sync hours directly to payroll with custom rates and deductions.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Real-time insights into labor costs and attendance trends.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Stay informed with smart alerts for shifts and approvals.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Secure permissions tailored for admins, supervisors, and staff.",
  },
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "500+", label: "Companies" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 -z-10" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-blue-100/50">
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
            <Link href="#pricing" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link>
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
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-6 bg-blue-100/80 text-blue-700 border-0 rounded-full px-4 py-1.5 text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Workforce Management Simplified
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
              Manage your team{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                effortlessly
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Time tracking, scheduling, and payroll — all in one beautiful, intuitive platform designed for modern teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 text-base shadow-xl shadow-blue-200"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-8 h-12 text-base border-gray-200 hover:bg-gray-50"
                >
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Powerful features to streamline your workforce operations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-blue-100/50 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl shadow-blue-200">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to streamline your workforce?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of teams already using ClockRoster to manage their time and scheduling.
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
