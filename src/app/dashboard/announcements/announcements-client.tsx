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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

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
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addNotification } = useStore();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    priority: "medium" as const,
    isPinned: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnnouncement: Announcement = {
      ...formData,
      id: String(announcements.length + 1),
      author: "Admin User",
      createdAt: new Date().toISOString(),
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    
    // Also add as notification
    addNotification({
      userId: "all",
      type: "ANNOUNCEMENT",
      message: `New announcement: ${formData.title}`,
      read: false,
    });
    
    toast.success("Announcement published successfully!");
    setIsDialogOpen(false);
    setFormData({
      title: "",
      content: "",
      category: "General",
      priority: "medium",
      isPinned: false,
    });
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter announcement title..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="General">General</option>
                    <option value="Scheduling">Scheduling</option>
                    <option value="Payroll">Payroll</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Assets">Assets</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as any,
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <textarea
                  id="content"
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Enter announcement content..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[150px]"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={formData.isPinned}
                  onChange={(e) =>
                    setFormData({ ...formData, isPinned: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isPinned" className="cursor-pointer">
                  Pin this announcement
                </Label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Publish</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                onTogglePin={() => togglePin(announcement.id)}
                onDelete={() => deleteAnnouncement(announcement.id)}
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
              onTogglePin={() => togglePin(announcement.id)}
              onDelete={() => deleteAnnouncement(announcement.id)}
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
  onTogglePin: () => void;
  onDelete: () => void;
}

function AnnouncementCard({
  announcement,
  getPriorityColor,
  getCategoryColor,
  onTogglePin,
  onDelete,
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
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onTogglePin}>
                <Pin className="mr-2 h-4 w-4" />
                {announcement.isPinned ? "Unpin" : "Pin"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Edit feature coming soon!")}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={onDelete}
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
