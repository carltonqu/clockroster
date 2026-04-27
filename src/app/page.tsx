"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
  Star,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Interactive Grid Background Component - Hero only
function InteractiveGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    container.addEventListener("mousemove", handleMouseMove);

    const gridSize = 40;
    const dots: { x: number; y: number; baseX: number; baseY: number }[] = [];

    for (let x = 0; x < canvas.width + gridSize; x += gridSize) {
      for (let y = 0; y < canvas.height + gridSize; y += gridSize) {
        dots.push({ x, y, baseX: x, baseY: y });
      }
    }

    let time = 0;
    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach((dot) => {
        const dx = mouseRef.current.x - dot.baseX;
        const dy = mouseRef.current.y - dot.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;

        let offsetX = 0;
        let offsetY = 0;

        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * 15;
          offsetX = (dx / dist) * force;
          offsetY = (dy / dist) * force;
        }

        // Add subtle wave animation
        offsetX += Math.sin(time + dot.baseY * 0.01) * 2;
        offsetY += Math.cos(time + dot.baseX * 0.01) * 2;

        dot.x = dot.baseX + offsetX;
        dot.y = dot.baseY + offsetY;

        const alpha = dist < maxDist ? 0.8 : 0.3;
        const size = dist < maxDist ? 2.5 : 1.5;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
        ctx.fill();
      });

      // Draw connections
      ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < gridSize * 1.5) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-auto"
        style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)" }}
      />
    </div>
  );
}

// Gradient Orb Component
function GradientOrb({ className }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-30 animate-pulse ${className}`}
      style={{
        background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #10b981 100%)",
      }}
    />
  );
}

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
    <div className="min-h-screen relative bg-gradient-to-b from-blue-50/50 via-white to-white">
      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-blue-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900">ClockRoster</span>
              </Link>

              <nav className="hidden md:flex items-center gap-8">
                <Link href="#features" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Features</Link>
                <Link href="#how-it-works" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">How It Works</Link>
                <Link href="#pricing" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link>
                <Link href="#faq" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">FAQ</Link>
              </nav>

              <div className="hidden md:flex items-center gap-3">
                <Link href="/auth/signin">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">Log in</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-600/25">
                    Get Started
                  </Button>
                </Link>
              </div>

              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-blue-100/50 py-4">
              <div className="px-4 space-y-3">
                <Link href="#features" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Features</Link>
                <Link href="#how-it-works" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
                <Link href="#pricing" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                <Link href="#faq" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
                <div className="pt-3 border-t border-blue-100/50 space-y-2">
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
              {/* Interactive Background - Hero only */}
          <div className="absolute inset-0 z-0">
            <InteractiveGridBackground />
          </div>
          
          <GradientOrb className="top-20 left-10 w-96 h-96" />
          <GradientOrb className="bottom-20 right-10 w-80 h-80" />
          <GradientOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200 mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-sm text-blue-700 font-medium">Trusted by 1,000+ teams worldwide</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Workforce Management
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                Made Effortless
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Time tracking, smart scheduling, and automated payroll — all in one beautiful platform.
              Save hours every week and pay your team accurately.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-full px-5 border-blue-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
              />
              <Link href={email ? `/auth/signup?email=${encodeURIComponent(email)}` : "/auth/signup"}>
                <Button className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 whitespace-nowrap">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500 mb-12">No credit card required • Free 14-day trial • Cancel anytime</p>

            {/* Dashboard Preview */}
            <div className="relative max-w-5xl mx-auto">
              {/* Floating notification badges */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-xl shadow-blue-900/10 p-3 border border-blue-100 hidden lg:block z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">+12 New</p>
                    <p className="text-[10px] text-gray-500">Employees</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl shadow-blue-900/10 p-3 border border-blue-100 hidden lg:block z-20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">$24,850</p>
                    <p className="text-[10px] text-gray-500">Payroll Saved</p>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-blue-200/50 bg-white">
                {/* Browser chrome */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 max-w-md mx-auto">
                      <div className="bg-white rounded-lg px-3 py-1.5 flex items-center gap-2 border border-slate-200 shadow-sm">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-xs text-gray-500">clockroster.com/dashboard</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 lg:p-8 bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                      <div className="relative bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl p-4 text-white shadow-lg shadow-blue-500/25">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm opacity-90">Total Hours Today</p>
                          <Clock className="w-4 h-4 opacity-70" />
                        </div>
                        <p className="text-3xl font-bold">248.5</p>
                        <p className="text-xs opacity-70 mt-1">+12% from yesterday</p>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500">Active Now</p>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <Users className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">42</p>
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <span className="inline-block w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-green-500" />
                        8 online
                      </p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500">On Leave</p>
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">5</p>
                      <p className="text-xs text-orange-500 mt-1">2 pending approval</p>
                    </div>
                  </div>

                  {/* Employee List */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                      <div>
                        <h4 className="font-semibold text-gray-900">Team Members</h4>
                        <p className="text-xs text-gray-500">8 employees on shift</p>
                      </div>
                      <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        + Add Employee
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {[
                        { name: "Sarah Chen", role: "Manager", status: "Active", statusColor: "green", avatar: "SC" },
                        { name: "Mike Johnson", role: "Developer", status: "On Break", statusColor: "yellow", avatar: "MJ" },
                        { name: "Emma Davis", role: "Designer", status: "Active", statusColor: "green", avatar: "ED" },
                        { name: "Alex Kim", role: "Analyst", status: "Offline", statusColor: "gray", avatar: "AK" },
                      ].map((employee, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-700">
                            {employee.avatar}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{employee.name}</p>
                            <p className="text-xs text-gray-500">{employee.role}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">{8 + i}:00 AM</span>
                            <span className={`px-2 py-1 text-[10px] font-medium rounded-full ${
                              employee.statusColor === 'green' ? 'bg-green-100 text-green-700' :
                              employee.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {employee.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payroll notification */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl shadow-blue-900/10 p-4 border border-blue-100 hidden lg:block z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Payroll Generated</p>
                    <p className="text-xs text-gray-500">Just now • $12,450</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 lg:py-32 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border border-blue-200 mb-6">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Simple & Intuitive</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                How ClockRoster <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Works</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get started in minutes, not days. Our streamlined setup gets your team productive immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {howItWorks.map((item, index) => (
                <div key={item.step} className="relative group">
                  {/* Card with enhanced styling */}
                  <div className="relative bg-white rounded-3xl p-8 border border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    {/* Step number badge */}
                    <div className="relative mb-6">
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} text-white font-bold text-xl shadow-lg shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        {item.step}
                      </div>
                      {/* Glow effect */}
                      <div className={`absolute inset-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
                    </div>
                    
                    {/* Icon with background */}
                    <div className="relative w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:from-blue-50 group-hover:to-cyan-50 group-hover:scale-105 transition-all duration-300 border border-slate-200/50 group-hover:border-blue-200">
                      <item.icon className="w-8 h-8 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
                    
                    {/* Arrow indicator */}
                    <div className="mt-6 flex items-center gap-2 text-blue-600 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                      <span className="text-sm font-medium">Learn more</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  
                  {/* Connector line between cards */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-6 w-8 lg:w-12">
                      <div className="relative h-0.5 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 lg:py-32 relative">
          <GradientOrb className="bottom-0 left-0 w-[400px] h-[400px]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">Powerful Features</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From clock-in to paycheck, we've got you covered with powerful tools designed for modern teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-cyan-500 transition-all duration-300">
                      <feature.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">{feature.badge}</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Small Business Owners Section */}
        <section className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Bento Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {/* Card 1 - Track Progress */}
              <div className="group bg-gradient-to-br from-blue-50/80 to-cyan-50/50 rounded-3xl p-8 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                {/* Top icons row */}
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-500">Clock In</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-500">Schedule</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-500">Team</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-500">Reports</span>
                  </div>
                </div>
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xl font-semibold shadow-lg shadow-blue-500/25">
                    JD
                  </div>
                </div>
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Track the progress</h3>
                <p className="text-gray-600 text-sm text-center">Monitor employee attendance and work hours conducted by your team leads in real-time.</p>
              </div>

              {/* Card 2 - Manage Documents */}
              <div className="group bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-3xl p-8 border border-slate-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                {/* Floating UI elements */}
                <div className="relative h-32 mb-4">
                  <div className="absolute top-0 right-0 bg-white rounded-xl shadow-lg p-3 border border-slate-100 w-48">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Check className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Timesheet</span>
                    </div>
                    <div className="text-xs text-gray-500">Approved by Manager</div>
                  </div>
                  <div className="absolute bottom-0 left-0 bg-white rounded-xl shadow-lg p-3 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-700">40 hours</div>
                        <div className="text-[10px] text-gray-500">This week</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">Manage the process</h3>
                <p className="text-gray-600 text-sm">Handle timesheets and payroll documents independently with automated workflows.</p>
              </div>

              {/* Card 3 - Collaborate */}
              <div className="group bg-gradient-to-br from-cyan-50/50 to-blue-50/30 rounded-3xl p-8 border border-cyan-100 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1">
                {/* Chat bubbles */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-sm font-semibold">
                      SM
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-slate-100 flex-1">
                      <p className="text-xs text-gray-600">Can you approve my time off request for next week?</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-white text-sm font-semibold">
                      JD
                    </div>
                    <div className="bg-blue-600 rounded-2xl rounded-tr-none p-3 shadow-sm flex-1">
                      <p className="text-xs text-white">Approved! Enjoy your vacation 🎉</p>
                    </div>
                  </div>
                </div>
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">Collaborate with team</h3>
                <p className="text-gray-600 text-sm">Communicate with your managers and colleagues directly within the platform.</p>
              </div>

              {/* Card 4 - Analytics */}
              <div className="group bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-slate-700 hover:shadow-xl hover:shadow-slate-900/20 transition-all duration-300 hover:-translate-y-1">
                {/* Chart */}
                <div className="mb-6">
                  <div className="flex items-end gap-2 h-24">
                    <div className="flex-1 bg-blue-500/30 rounded-t-lg h-[40%] group-hover:bg-blue-500/50 transition-colors"></div>
                    <div className="flex-1 bg-blue-500/40 rounded-t-lg h-[60%] group-hover:bg-blue-500/60 transition-colors"></div>
                    <div className="flex-1 bg-blue-500/50 rounded-t-lg h-[45%] group-hover:bg-blue-500/70 transition-colors"></div>
                    <div className="flex-1 bg-blue-500/60 rounded-t-lg h-[80%] group-hover:bg-blue-500/80 transition-colors"></div>
                    <div className="flex-1 bg-blue-500/70 rounded-t-lg h-[65%] group-hover:bg-blue-500/90 transition-colors"></div>
                    <div className="flex-1 bg-cyan-500 rounded-t-lg h-[90%] group-hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/30"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-slate-400">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span className="text-cyan-400 font-medium">Sat</span>
                  </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">Attendance</div>
                    <div className="text-lg font-bold text-white">98%</div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">Punctuality</div>
                    <div className="text-lg font-bold text-white">95%</div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                      <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">Automatically collect insights</h3>
                <p className="text-slate-400 text-sm">Get real-time analytics and reports on your team's performance and attendance patterns.</p>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border border-blue-200 mb-6">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Small Business Owners</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Trusted by <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">small business owners</span>
                <br className="hidden sm:block" /> managing their teams
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From cafes to retail shops, see how small business owners simplify employee management with ClockRoster.
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { 
                  name: "Maria Santos", 
                  role: "Cafe Owner", 
                  content: "ClockRoster transformed how I manage my cafe staff. Scheduling used to take hours, now it's done in minutes. My employees love the easy clock-in feature!",
                  avatar: "MS",
                  rating: 5
                },
                { 
                  name: "David Chen", 
                  role: "Retail Store Manager", 
                  content: "As a small retail owner, I needed something simple but powerful. ClockRoster gives me everything I need without the enterprise complexity. Highly recommend!",
                  avatar: "DC",
                  rating: 5
                },
                { 
                  name: "Sarah Johnson", 
                  role: "Boutique Owner", 
                  content: "Finally, a workforce tool that understands small business needs. The payroll automation alone saves me 5 hours every week. Best investment for my shop.",
                  avatar: "SJ",
                  rating: 5
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-gray-700 mb-6 leading-relaxed text-sm">"{testimonial.content}"</p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Original Testimonials Section */}
        <section className="py-20 lg:py-32 relative">
          <GradientOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">Testimonials</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Loved by Teams Everywhere</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">See what our customers have to say about their experience with ClockRoster.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-sm">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-semibold">{testimonial.name.split(' ').map(n => n[0]).join('')}</span>
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
        <section id="pricing" className="py-20 lg:py-32 relative">
          <GradientOrb className="top-0 right-1/4 w-[600px] h-[600px]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">Pricing</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Start free and scale as you grow. No hidden fees, cancel anytime.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { name: "Free", price: "$0", desc: "Perfect for small teams getting started.", features: ["Up to 5 employees", "Time tracking", "Clock in/out", "Role-based access", "Basic reports"], highlight: false },
                { name: "Pro", price: "$29", desc: "For growing teams that need more power.", features: ["Up to 50 employees", "Everything in Free", "Visual scheduling", "Smart notifications", "Advanced analytics", "Priority support"], highlight: true },
                { name: "Advanced", price: "$79", desc: "Full-featured for enterprises.", features: ["Unlimited employees", "Everything in Pro", "Automated payroll", "Custom integrations", "Dedicated support", "SLA guarantee"], highlight: false },
              ].map((plan) => (
                <div key={plan.name} className={`relative rounded-2xl p-6 border ${plan.highlight ? "border-2 border-blue-500 bg-white shadow-xl shadow-blue-900/10" : "border-blue-100 bg-white/90 backdrop-blur-sm"}`}>
                  {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="bg-blue-600 text-white px-3 py-1">Most Popular</Badge></div>}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4"><span className="text-4xl font-bold text-gray-900">{plan.price}</span><span className="text-gray-500">/month</span></div>
                  <p className="text-gray-600 text-sm mb-6">{plan.desc}</p>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-green-500 flex-shrink-0" />{f}</li>
                    ))}
                  </ul>
                  <Link href="/auth/signup">
                    <Button className={`w-full rounded-full ${plan.highlight ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`} variant={plan.highlight ? "default" : "outline"}>
                      {plan.highlight ? "Start Pro Trial" : "Get Started"}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 lg:py-32 relative">
          <GradientOrb className="bottom-0 left-0 w-[500px] h-[500px]" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">FAQ</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Questions? Answered.</h2>
              <p className="text-lg text-gray-600">Everything you need to know about ClockRoster.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100 overflow-hidden">
                  <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    {openFaq === index ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
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
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
              </div>
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to streamline your workforce?</h2>
                <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">Join thousands of teams already saving hours every week with ClockRoster. Start your free trial today.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/signup">
                    <Button className="h-12 px-8 rounded-full bg-white text-blue-600 hover:bg-blue-50 shadow-lg">Get Started Free<ArrowRight className="w-4 h-4 ml-2" /></Button>
                  </Link>
                  <Link href="/auth/signin">
                    <Button variant="outline" className="h-12 px-8 rounded-full border-white text-white hover:bg-white/10">View Demo</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-sm border-t border-blue-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">ClockRoster</span>
              </div>
              <p className="text-sm text-gray-500">© {new Date().getFullYear()} ClockRoster. Built with Next.js & Tailwind CSS.</p>
              <div className="flex items-center gap-6">
                <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link>
                <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms</Link>
                <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Support</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}