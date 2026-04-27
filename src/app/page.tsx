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

// Interactive Grid Background Component
function InteractiveGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

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
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)" }}
    />
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
    <div className="min-h-screen relative">
      {/* Interactive Background */}
      <InteractiveGridBackground />

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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-blue-100 bg-white/90 backdrop-blur-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-b border-blue-100">
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
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white shadow-lg">
                      <p className="text-sm opacity-80">Total Hours Today</p>
                      <p className="text-2xl font-bold">248.5</p>
                    </div>
                    <div className="bg-white/80 border border-blue-100 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-sm text-gray-500">Active Now</p>
                      <p className="text-2xl font-bold text-gray-900">42</p>
                    </div>
                    <div className="bg-white/80 border border-blue-100 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-sm text-gray-500">On Leave</p>
                      <p className="text-2xl font-bold text-gray-900">5</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-4 w-32 bg-blue-200 rounded" />
                      <div className="h-8 w-24 bg-blue-600 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-white/80 rounded-lg border border-blue-50">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full" />
                          <div className="flex-1">
                            <div className="h-3 w-24 bg-blue-200 rounded mb-2" />
                            <div className="h-2 w-16 bg-blue-100 rounded" />
                          </div>
                          <div className="h-6 w-16 bg-green-100 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl shadow-blue-900/10 p-4 border border-blue-100 hidden lg:block">
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
        <section id="how-it-works" className="py-20 lg:py-32 relative">
          <GradientOrb className="top-0 right-0 w-[500px] h-[500px]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">Simple & Intuitive</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How ClockRoster Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get started in minutes, not days. Our streamlined setup gets your team productive immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((item, index) => (
                <div key={item.step} className="relative group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white font-bold text-lg mb-6 shadow-lg`}>
                      {item.step}
                    </div>
                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                      <item.icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-transparent" />
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

        {/* Testimonials Section */}
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
                    <Button className={`w-full rounded-full ${plan.highlight ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`} variant={plan.highlight ? "default" : "outline