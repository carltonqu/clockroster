"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
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
]

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
  { icon: UtensilsCrossed, name: "Restaurants & Cafes" },
  { icon: Store, name: "Retail Stores" },
  { icon: Package, name: "Warehouses" },
  { icon: Building, name: "Franchises" },
  { icon: Briefcase, name: "Corporate Teams" },
  { icon: Users, name: "Agencies" },
  { icon: Building2, name: "Service Businesses" },
  { icon: Globe, name: "Remote & Hybrid Teams" },
]

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
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Dark Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 -z-10" />
      
      {/* Animated Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-xl text-white tracking-tight">
              ClockRoster
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-slate-300 hover:text-blue-400 transition-all duration-300 hover:-translate-y-0.5">Features</Link>
            <Link href="#solutions" className="text-sm text-slate-300 hover:text-blue-400 transition-all duration-300 hover:-translate-y-0.5">Solutions</Link>
            <Link href="#industries" className="text-sm text-slate-300 hover:text-blue-400 transition-all duration-300 hover:-translate-y-0.5">Industries</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-300">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 rounded-xl px-5 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-blue-500/30 transition-colors duration-300 cursor-default">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Workforce Management Simplified
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
              Manage Your Team{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-6 leading-relaxed max-w-3xl mx-auto">
              Time tracking, scheduling, payroll, and workforce analytics — all in one beautiful, intuitive platform designed for modern businesses.
            </p>
            <p className="text-slate-400 mb-10 max-w-2xl mx-auto">
              Reduce manual work, improve team productivity, and gain complete visibility over your workforce operations from a single dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 text-base shadow-xl shadow-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-300"
                >
                  Start Managing Smarter Today
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 100} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-400">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
                  {stat.label}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Businesses Choose Our Platform
            </h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              Managing employees shouldn't be stressful, complicated, or time-consuming. Our system helps businesses simplify daily operations while improving accuracy, communication, and efficiency.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 100}>
                <div className="h-full p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 group cursor-default">
                  <h3 className="text-lg font-semibold text-white mb-3 transition-colors duration-300 group-hover:text-blue-400">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features Designed for Modern Teams
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 100}>
                <div className="h-full p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl group-hover:shadow-blue-500/30">
                      <feature.icon className="w-6 h-6 text-white transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2 transition-colors duration-300 group-hover:text-blue-400">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 mb-4">
                        {feature.description}
                      </p>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, i) => (
                          <li key={benefit} className="flex items-center gap-2 text-sm text-slate-400 transition-all duration-300 hover:translate-x-1">
                            <Check className="w-4 h-4 text-blue-400 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Solutions We Provide
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <AnimatedSection key={solution.title} delay={index * 150}>
                <div className="h-full text-center p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-3 group cursor-default">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl group-hover:shadow-blue-500/30">
                    <solution.icon className="w-8 h-8 text-white transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 transition-colors duration-300 group-hover:text-blue-400">
                    {solution.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {solution.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Perfect For
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {industries.map((industry, index) => (
              <AnimatedSection key={industry.name} delay={index * 50}>
                <div className="flex flex-col items-center p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 group cursor-default">
                  <industry.icon className="w-8 h-8 text-blue-400 mb-3 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6" />
                  <span className="text-sm font-medium text-slate-300 text-center transition-colors duration-300 group-hover:text-blue-400">
                    {industry.name}
                  </span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              
              <div className="relative z-10">
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
                    className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl px-8 h-12 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 bg-slate-950/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg text-white">
                ClockRoster
              </span>
            </Link>
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} ClockRoster. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
