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
    description: "Effortless clock in and clock out system with automatic overtime calculations, attendance monitoring, and real-time timesheets.",
    icon: Clock,
    color: "bg-blue-100 text-blue-700",
  },
  {
    tag: "SCHEDULE",
    title: "Smart Scheduling",
    description: "Create and manage employee schedules with an intuitive drag-and-drop planner. Visual calendar view makes planning effortless.",
    icon: Calendar,
    color: "bg-green-100 text-green-700",
  },
  {
    tag: "PAYROLL",
    title: "Payroll Automation",
    description: "Sync worked hours directly to payroll with customizable salary structures, deductions, and automated calculations.",
    icon: DollarSign,
    color: "bg-purple-100 text-purple-700",
  },
  {
    tag: "ANALYTICS",
    title: "Workforce Analytics",
    description: "Get valuable insights into workforce performance, labor costs, and operational efficiency with detailed reports.",
    icon: BarChart3,
    color: "bg-orange-100 text-orange-700",
  },
  {
    tag: "ALERTS",
    title: "Notifications & Alerts",
    description: "Keep your team informed with smart notifications for shifts, approvals, schedule changes, and attendance updates.",
    icon: Bell,
    color: "bg-pink-100 text-pink-700",
  },
  {
    tag: "SECURITY",
    title: "Role-Based Access",
    description: "Secure and organized access control for every level of your company. Admin, Supervisor, and Employee roles.",
    icon: Shield,
    color: "bg-cyan-100 text-cyan-700",
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
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features Designed for Modern Teams
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 100}>
                <div className="h-full bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group border border-gray-100">
                  {/* Tag */}
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${feature.color}`}>
                    {feature.tag}
                  </span>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  {/* Mockup Preview */}
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-4 min-h-[140px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                    <div className="relative flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full" />
                        <div className="w-16 h-2 bg-gray-200 rounded-full" />
                        <div className="w-20 h-2 bg-blue-200 rounded-full" />
                      </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-2 right-2 w-8 h-8 bg-yellow-200 rounded-full opacity-50" />
                    <div className="absolute bottom-2 left-2 w-6 h-6 bg-blue-200 rounded-full opacity-50" />
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
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

      {/* Industries Section - White BG */}
      <section id="industries" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perfect For
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {industries.map((industry, index) => (
              <AnimatedSection key={industry.name} delay={index * 50}>
                <div className="flex flex-col items-center p-6 bg-gradient-to-b from-blue-50 to-white rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-500 hover:-translate-y-2 group cursor-default">
                  <industry.icon className="w-8 h-8 text-blue-600 mb-3 transition-all duration-500 group-hover:scale-125" />
                  <span className="text-sm font-medium text-gray-700 text-center">
                    {industry.name}
                  </span>
                </div>
              </AnimatedSection>
            ))}
          </div>
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
