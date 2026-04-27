"use client";

import Link from "next/link";
import { useState } from "react";
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
  ChevronDown,
  ChevronUp,
  Play,
  Star,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const howItWorks = [
  {
    step: "01",
    title: "Set Up Your Team",
    description: "Add employees, departments, and roles in minutes. Import or create from scratch.",
    icon: Users,
    color: "from-blue-500 to-cyan-400",
  },
  {
    step: "02",
    title: "Track & Schedule",
    description: "Employees clock in/out, managers build schedules with drag-and-drop ease.",
    icon: Clock,
    color: "from-cyan-500 to-teal-400",
  },
  {
    step: "03",
    title: "Automate Payroll",
    description: "Hours sync automatically. Generate payroll with one click. Pay your team accurately.",
    icon: DollarSign,
    color: "from-teal-500 to-emerald-400",
  },
];

const features = [
  {
    title: "Smart Time Tracking",
    description: "Clock in/out with GPS verification. Real-time overtime detection and alerts.",
    icon: Clock,
    badge: "Free",
  },
  {
    title: "Visual Scheduling",
    description: "Drag-and-drop schedule builder. Manage shifts, swaps, and coverage effortlessly.",
    icon: Calendar,
    badge: "Pro",
  },
  {
    title: "Automated Payroll",
    description: "Custom pay rates, overtime multipliers, deductions, and direct deposit ready.",
    icon: DollarSign,
    badge: "Advanced",
  },
  {
    title: "Analytics Dashboard",
    description: "Labor cost charts, attendance trends, and insights for smarter decisions.",
    icon: BarChart3,
    badge: "Pro",
  },
  {
    title: "Smart Notifications",
    description: "Stay informed with shift alerts, approval requests, and payroll reminders.",
    icon: Bell,
    badge: "Free",
  },
  {
    title: "Role-Based Access",
    description: "Admin, Manager, HR, and Employee roles with granular permissions.",
    icon: Shield,
    badge: "Free",
  },
];

const testimonials = [
  {
    name: "Maria Santos",
    role: "HR Manager",
    company: "TechCorp Philippines",
    content: "ClockRoster saved us 10 hours per week on payroll processing. The automated calculations are spot on!",
    rating: 5,
  },
  {
    name: "John Reyes",
    role: "Operations Director",
    company: "Metro Retail Group",
    content: "Managing schedules for 200+ employees used to be a nightmare. Now it's done in minutes.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "Business Owner",
    company: "Cafe Delights",
    content: "Finally, a workforce tool that just works. My staff loves the easy clock-in feature.",
    rating: 5,
  },
];

const faqs = [
  {
    question: "How does the free plan work?",
    answer: "The free plan includes time tracking, clock in/out, overtime detection, and role-based access for up to 5 employees. No credit card required to start.",
  },
  {
    question: "Can I import my existing employee data?",
    answer: "Yes! You can import employees via CSV or add them manually. We'll guide you through the setup process.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use bank-level encryption, secure cloud hosting, and regular backups. Your data is isolated by organization.",
  },
  {
    question: "Can employees access their own records?",
    answer: "Yes, employees have their own portal to view schedules, request time off, access payslips, and track their attendance.",
  },
  {
    question: "What happens when I upgrade?",
    answer: "You get instant access to premium features. Your existing data remains intact, and we'll prorate your billing.",
  },
];

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">ClockRoster</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </Link>
              <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/signin">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-600/25">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4">
            <div className="px-4 space-y-3">
              <Link href="#features" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>
                Features
              </Link>
              <Link href="#how-it-works" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </Link>
              <Link href="#pricing" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </Link>
              <Link href="#faq" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </Link>
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-blue-600 text-white">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-white pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-blue-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-sm text-blue-700 font-medium">Trusted by 1,000+ teams worldwide</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Workforce Management
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Made Effortless
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Time tracking, smart scheduling, and automated payroll — all in one beautiful platform. 
            Save hours every week and pay your team accurately.
          </p>

          {/* Email CTA */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
            <Input
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-full px-5 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Link href={email ? `/auth/signup?email=${encodeURIComponent(email)}` : "/auth/signup"}>
              <Button className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 whitespace-nowrap">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <p className="text-sm text-gray-500 mb-12">
            No credit card required • Free 14-day trial • Cancel anytime
          </p>

          {/* Hero Image / Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-gray-200 bg-white">
              {/* Mock Dashboard UI */}
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-gray-400">clockroster.com/dashboard</span>
                  </div>
                </div>
              </div>
              <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
                    <p className="text-sm opacity-80">Total Hours Today</p>
                    <p className="text-2xl font-bold">248.5</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Active Now</p>
                    <p className="text-2xl font-bold text-gray-900">42</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-sm text-gray-500">On Leave</p>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-8 w-24 bg-blue-600 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-white rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full" />
                        <div className="flex-1">
                          <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
                          <div className="h-2 w-16 bg-gray-100 rounded" />
                        </div>
                        <div className="h-6 w-16 bg-green-100 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl shadow-blue-900/10 p-4 border border-gray-100 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Payroll Generated</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">Simple & Intuitive</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How ClockRoster Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in minutes, not days. Our streamlined setup gets your team productive immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div
                key={item.step}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Step number */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white font-bold text-lg mb-6 shadow-lg`}>
                    {item.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                    <item.icon className="w-7 h-7 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Connector line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-200 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">Powerful Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From clock-in to paycheck, we've got you covered with powerful tools designed for modern teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-cyan-500 transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                    {feature.badge}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
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

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by Teams Everywhere
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about their experience with ClockRoster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">Perfect for small teams getting started.</p>
              <ul className="space-y-3 mb-6">
                {["Up to 5 employees", "Time tracking", "Clock in/out", "Role-based access", "Basic reports"].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup">
                <Button variant="outline" className="w-full rounded-full">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl p-6 border-2 border-blue-500 relative shadow-xl shadow-blue-900/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-3 py-1">Most Popular</Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">For growing teams that need more power.</p>
              <ul className="space-y-3 mb-6">
                {["Up to 50 employees", "Everything in Free", "Visual scheduling", "Smart notifications", "Advanced analytics", "Priority support"].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup">
                <Button className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                  Start Pro Trial
                </Button>
              </Link>
            </div>

            {/* Advanced Plan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">$79</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">Full-featured for enterprises.</p>
              <ul className="space-y-3 mb-6">
                {["Unlimited employees", "Everything in Pro", "Automated payroll", "Custom integrations", "Dedicated support", "SLA guarantee"].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup">
                <Button variant="outline" className="w-full rounded-full">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-32 bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Questions? Answered.
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about ClockRoster.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
            </div>

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to streamline your workforce?
              </h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
                Join thousands of teams already saving hours every week with ClockRoster.
                Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button className="h-12 px-8 rounded-full bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="outline" className="h-12 px-8 rounded-full border-white text-white hover:bg-white/10">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">ClockRoster</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} ClockRoster. Built with Next.js & Tailwind CSS.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
