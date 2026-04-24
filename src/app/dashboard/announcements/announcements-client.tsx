"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Bell,
  Plus,
  Megaphone,
  Calendar,
  Pin,
  MoreHorizontal,
  Trash2,
  Edit,
  Sparkles,
  X,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  isPinned: boolean;
  priority: "low" | "medium" | "high";
}

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

const PRIORITY_CONFIG: Record<string, { bg: string; text: string; border: string; icon: any }> = {
  high: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
    icon: Bell,
  },
  medium: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    icon: Megaphone,
  },
  low: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    icon: Megaphone,
  },
};

const CATEGORY_CONFIG: Record<string, { bg: string; text: string; icon: any }> = {
  General: { bg: "bg-blue-50 text-blue-700", text: "", icon: Megaphone },
  Scheduling: { bg: "bg-emerald-50 text-emerald-700", text: "", icon: Calendar },
  Payroll: { bg: "bg-purple-50 text-purple-700", text: "", icon: Bell },
  Holiday: { bg: "bg-orange-50 text-orange-700", text: "", icon: Calendar },
  Assets: { bg: "bg-pink-50 text-pink-700", text: "", icon: Bell },
};

function PriorityBadge({ priority }: { priority: string }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.General;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg}`}>
      {category}
    </span>
  );
}

const initialAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Welcome to ClockRoster!",
    content:
      "We're excited to introduce our new workforce management platform. This tool will help you track time, manage schedules, and streamline payroll. Take some time to explore the features and let us know if you have any questions!",
    category: "General",
    author: "Admin",
    createdAt: "2024-01-15T08:00:00Z",
    isPinned: true,
    priority: "high",
  },
  {
    id: "2",
    title: "New Schedule Published",
    content:
      "The schedules for next week (Jan 22-28) have been published. Please review your assigned shifts and let your supervisor know if you have any conflicts.",
    category: "Scheduling",
    author: "HR Team",
    createdAt: "2024-01-14T14:00:00Z",
    isPinned: false,
    priority: "medium",
  },
  {
    id: "3",
    title: "Payroll Processing Update",
    content:
      "Payroll for the period Jan 1-15 will be processed on Jan 20. Please ensure all your time entries are submitted and approved by Jan 18.",
    category: "Payroll",
    author: "Finance",
    createdAt: "2024-01-13T10:00:00Z",
    isPinned: false,
    priority: "high",
  },
];

export function AnnouncementsClient() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [searchQuery, setSearchQuery] = useState("");
  const { addNotification } = useStore();

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewAnnouncement = () => {
    router.push("/dashboard/announcements/new");
  };

  const togglePin = (id: string) => {
    setAnnouncements(
      announcements.map((a) =>
        a.id === id ? { ...a, isPinned: !a.isPinned } : a
      )
    );
    toast.success("Announcement updated!");
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    toast.success("Announcement deleted!");
  };

  const pinnedAnnouncements = filteredAnnouncements.filter((a) => a.isPinned);
  const regularAnnouncements = filteredAnnouncements.filter((a) => !a.isPinned);

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
              Announcements
            </h2>
            <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0">
              <Sparkles className="w-3 h-3 mr-1" /> {announcements.length} Total
            </Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Stay updated with company news and important information
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[250px] rounded-xl"
            />
          </div>
          {searchQuery && (
            <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="rounded-xl">
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
          <Button 
            onClick={handleNewAnnouncement}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-md rounded-xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Megaphone} label="Total Announcements" value={announcements.length} gradient="from-blue-500 to-cyan-500" delay={100} />
        <StatCard icon={Pin} label="Pinned" value={announcements.filter((a) => a.isPinned).length} gradient="from-amber-500 to-orange-500" delay={200} />
        <StatCard icon={Bell} label="High Priority" value={announcements.filter((a) => a.priority === "high").length} gradient="from-rose-500 to-pink-500" delay={300} />
      </div>

      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Pin className="h-4 w-4 text-white" />
            </div>
            Pinned Announcements
          </h3>
          <div className="grid gap-4">
            {pinnedAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onTogglePin={() => togglePin(announcement.id)}
                onDelete={() => deleteAnnouncement(announcement.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Announcements */}
      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Megaphone className="h-4 w-4 text-white" />
          </div>
          Recent Announcements
        </h3>
        <div className="grid gap-4">
          {regularAnnouncements.length === 0 ? (
            <Card className="border-gray-100 dark:border-gray-800">
              <CardContent className="flex flex-col items-center justify-center py-16 text-gray-400">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4">
                  <Megaphone className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No announcements found</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Create your first announcement</p>
              </CardContent>
            </Card>
          ) : (
            regularAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onTogglePin={() => togglePin(announcement.id)}
                onDelete={() => deleteAnnouncement(announcement.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface AnnouncementCardProps {
  announcement: Announcement;
  onTogglePin: () => void;
  onDelete: () => void;
}

function AnnouncementCard({
  announcement,
  onTogglePin,
  onDelete,
}: AnnouncementCardProps) {
  return (
    <Card className={`border-gray-100 dark:border-gray-800 shadow-sm hover-lift ${announcement.isPinned ? "border-l-4 border-l-amber-500" : ""}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <CategoryBadge category={announcement.category} />
              <PriorityBadge priority={announcement.priority} />
              {announcement.isPinned && (
                <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200">
                  <Pin className="h-3 w-3 mr-1" />
                  Pinned
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg text-gray-900 dark:text-white">{announcement.title}</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1">
              <span className="text-gray-500">By {announcement.author}</span>
              <span className="flex items-center gap-1 text-gray-500">
                <Calendar className="h-3 w-3" />
                {format(new Date(announcement.createdAt), "MMM d, yyyy")}
              </span>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem onClick={onTogglePin}>
                <Pin className="mr-2 h-4 w-4" />
                {announcement.isPinned ? "Unpin" : "Pin"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Edit feature coming soon!")}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{announcement.content}</p>
      </CardContent>
    </Card>
  );
}
