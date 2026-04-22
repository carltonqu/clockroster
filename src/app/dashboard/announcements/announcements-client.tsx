"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

const mockAnnouncements: Announcement[] = [
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
  {
    id: "4",
    title: "Company Holiday - Martin Luther King Jr. Day",
    content:
      "Please note that the office will be closed on Monday, January 15th in observance of Martin Luther King Jr. Day. Regular operations will resume on Tuesday, January 16th.",
    category: "Holiday",
    author: "Admin",
    createdAt: "2024-01-10T09:00:00Z",
    isPinned: true,
    priority: "medium",
  },
  {
    id: "5",
    title: "Asset Inventory Update",
    content:
      "We'll be conducting an asset inventory check next week. Please ensure all company equipment assigned to you is in good condition and report any issues to the IT department.",
    category: "Assets",
    author: "IT Department",
    createdAt: "2024-01-09T11:00:00Z",
    isPinned: false,
    priority: "low",
  },
];

export function AnnouncementsClient() {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "General":
        return "bg-blue-100 text-blue-700";
      case "Scheduling":
        return "bg-green-100 text-green-700";
      case "Payroll":
        return "bg-purple-100 text-purple-700";
      case "Holiday":
        return "bg-orange-100 text-orange-700";
      case "Assets":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const pinnedAnnouncements = announcements.filter((a) => a.isPinned);
  const regularAnnouncements = announcements.filter((a) => !a.isPinned);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Announcements
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Stay updated with company news and important information
          </p>
        </div>
        <Button onClick={() => toast.info("Create announcement feature coming soon!")}>
          <Plus className="mr-2 h-4 w-4" />
          New Announcement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Announcements
            </CardTitle>
            <Megaphone className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pinned
            </CardTitle>
            <Pin className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pinnedAnnouncements.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              High Priority
            </CardTitle>
            <Bell className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter((a) => a.priority === "high").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Pin className="h-4 w-4 text-orange-500" />
            Pinned Announcements
          </h3>
          <div className="grid gap-4">
            {pinnedAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                getPriorityColor={getPriorityColor}
                getCategoryColor={getCategoryColor}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Announcements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Announcements</h3>
        <div className="grid gap-4">
          {regularAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              getPriorityColor={getPriorityColor}
              getCategoryColor={getCategoryColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface AnnouncementCardProps {
  announcement: Announcement;
  getPriorityColor: (priority: string) => string;
  getCategoryColor: (category: string) => string;
}

function AnnouncementCard({
  announcement,
  getPriorityColor,
  getCategoryColor,
}: AnnouncementCardProps) {
  return (
    <Card className={announcement.isPinned ? "border-orange-200 dark:border-orange-800" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getCategoryColor(announcement.category)}>
                {announcement.category}
              </Badge>
              <Badge className={getPriorityColor(announcement.priority)}>
                {announcement.priority} priority
              </Badge>
              {announcement.isPinned && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  <Pin className="h-3 w-3 mr-1" />
                  Pinned
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">{announcement.title}</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1">
              <span>By {announcement.author}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(announcement.createdAt), "MMM d, yyyy")}
              </span>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.info("Edit feature coming soon!")}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => toast.error("Delete feature coming soon!")}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300">{announcement.content}</p>
      </CardContent>
    </Card>
  );
}
