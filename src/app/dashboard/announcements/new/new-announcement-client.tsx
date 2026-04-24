"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Megaphone,
  Type,
  MessageSquare,
  Upload,
  X,
  File,
  Send,
  Info,
  AlertTriangle,
  AlertCircle,
  Users,
  Building2,
  Target,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

const ANNOUNCEMENT_TYPES = [
  {
    value: "General",
    label: "General",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Info,
    description: "Regular updates and information",
  },
  {
    value: "Important",
    label: "Important",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: AlertTriangle,
    description: "Significant updates requiring attention",
  },
  {
    value: "Urgent",
    label: "Urgent",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    icon: AlertCircle,
    description: "Critical information for everyone",
  },
];

const TARGET_OPTIONS = [
  {
    value: "All",
    label: "All Employees",
    icon: Users,
    description: "Everyone in the company",
  },
  {
    value: "Department",
    label: "Department",
    icon: Building2,
    description: "Specific department only",
  },
  {
    value: "Team",
    label: "Team",
    icon: Target,
    description: "Specific team members",
  },
];

export function NewAnnouncementClient() {
  const router = useRouter();
  const { addNotification } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "General",
    target: "All",
    targetDetail: "",
  });

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (formData.target !== "All" && !formData.targetDetail.trim()) {
      newErrors.targetDetail = `Please specify the ${formData.target.toLowerCase()}`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success("Image uploaded successfully");
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you would upload the image to a server here
      // For now, we'll just simulate the announcement creation

      addNotification({
        userId: "all",
        type: "ANNOUNCEMENT",
        message: `New ${formData.type.toLowerCase()} announcement: ${formData.title}`,
        read: false,
      });

      toast.success("Announcement published successfully!");
      router.push("/dashboard/announcements");
    } catch (error) {
      toast.error("Failed to publish announcement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/announcements");
  };

  const selectedType = ANNOUNCEMENT_TYPES.find((t) => t.value === formData.type);
  const selectedTarget = TARGET_OPTIONS.find((t) => t.value === formData.target);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/announcements">
          <Button variant="ghost" size="sm" className="hover:text-purple-600 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Announcements
          </Button>
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-400">Announcements</span>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-gray-900 dark:text-white">New Post</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            New Announcement
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Create and publish a new announcement for your team
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} className="rounded-xl">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl"
          >
            {isSubmitting ? "Publishing..." : "Publish"}
            <Send className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Card */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Type className="w-5 h-5 text-purple-600" />
              Announcement Title
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-1">
                Title
                <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: "" });
                }}
                placeholder="Enter a clear, descriptive title..."
                className={`rounded-xl ${errors.title ? "border-rose-300 focus:border-rose-500" : ""}`}
              />
              {errors.title && <p className="text-sm text-rose-500">{errors.title}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Type Card */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-blue-600" />
              Announcement Type
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label>Select Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {ANNOUNCEMENT_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.type === type.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${type.color}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {type.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Card */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              Target Audience
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <Label>Select Target</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {TARGET_OPTIONS.map((target) => {
                  const Icon = target.icon;
                  return (
                    <button
                      key={target.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, target: target.value })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.target === target.value
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                          : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {target.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {target.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Detail Input */}
            {formData.target !== "All" && (
              <div className="space-y-2">
                <Label htmlFor="targetDetail" className="flex items-center gap-1">
                  {formData.target === "Department" ? "Department Name" : "Team Name"}
                  <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="targetDetail"
                  value={formData.targetDetail}
                  onChange={(e) => {
                    setFormData({ ...formData, targetDetail: e.target.value });
                    if (errors.targetDetail) setErrors({ ...errors, targetDetail: "" });
                  }}
                  placeholder={
                    formData.target === "Department"
                      ? "e.g., Engineering, Marketing..."
                      : "e.g., Alpha Team, Project X..."
                  }
                  className={`rounded-xl ${errors.targetDetail ? "border-rose-300 focus:border-rose-500" : ""}`}
                />
                {errors.targetDetail && (
                  <p className="text-sm text-rose-500">{errors.targetDetail}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Card */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-600" />
              Message Content
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <Label htmlFor="message" className="flex items-center gap-1">
                Message
                <span className="text-rose-500">*</span>
              </Label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: "" });
                }}
                placeholder="Write your announcement message here..."
                className={`w-full border rounded-xl px-3 py-2 text-sm min-h-[200px] bg-white dark:bg-gray-800 resize-none ${
                  errors.message
                    ? "border-rose-300 focus:border-rose-500 dark:border-rose-700"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              />
              {errors.message && <p className="text-sm text-rose-500">{errors.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Image Upload Card */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
              Image (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!imagePreview ? (
              <div
                className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Upload Image
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop an image here, or click to browse
                </p>
                <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-[300px] object-contain rounded-xl border border-gray-200 dark:border-gray-700"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="absolute top-2 right-2 rounded-lg"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50">
          <CardContent className="p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">
              Announcement Preview
            </h4>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {selectedType && (
                      <Badge className={`${selectedType.color} border-0`}>
                        {selectedType.label}
                      </Badge>
                    )}
                    {selectedTarget && (
                      <Badge variant="outline" className="text-gray-600">
                        {selectedTarget.label}
                        {formData.target !== "All" && formData.targetDetail && (
                          <span className="ml-1">: {formData.targetDetail}</span>
                        )}
                      </Badge>
                    )}
                  </div>
                  <h5 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {formData.title || "Untitled Announcement"}
                  </h5>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">
                    {formData.message || "No message content yet..."}
                  </p>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Attachment"
                      className="mt-4 max-h-[200px] rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="rounded-xl px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl px-6"
          >
            {isSubmitting ? "Publishing..." : "Publish"}
            <Send className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
}
