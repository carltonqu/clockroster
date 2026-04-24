"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Package,
  Save,
  X,
  Laptop,
  Smartphone,
  Monitor,
  Printer,
  Tablet,
  Tag,
  FileText,
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

const ASSET_TYPES = [
  { value: "Laptop", label: "Laptop", icon: Laptop },
  { value: "Desktop", label: "Desktop", icon: Monitor },
  { value: "Mobile Phone", label: "Mobile Phone", icon: Smartphone },
  { value: "Tablet", label: "Tablet", icon: Tablet },
  { value: "Monitor", label: "Monitor", icon: Monitor },
  { value: "Printer", label: "Printer", icon: Printer },
  { value: "Other", label: "Other", icon: Package },
];

const CONDITIONS = [
  { value: "New", label: "New", color: "bg-emerald-100 text-emerald-700" },
  { value: "Good", label: "Good", color: "bg-blue-100 text-blue-700" },
  { value: "Fair", label: "Fair", color: "bg-amber-100 text-amber-700" },
  { value: "Poor", label: "Poor", color: "bg-rose-100 text-rose-700" },
];

export function NewAssetClient() {
  const router = useRouter();
  const { addAsset } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    brand: "",
    model: "",
    serialNumber: "",
    condition: "Good",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Asset name is required";
    if (!formData.type) newErrors.type = "Asset type is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      addAsset({
        name: formData.name,
        type: formData.type,
        brand: formData.brand,
        model: formData.model,
        serialNumber: formData.serialNumber,
        condition: formData.condition,
        status: "Available",
      });
      
      toast.success(`Asset "${formData.name}" added successfully!`);
      router.push("/dashboard/assets");
    } catch (error) {
      toast.error("Failed to add asset. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/assets");
  };

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
        <Link href="/dashboard/assets">
          <Button variant="ghost" size="sm" className="hover:text-amber-600 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Assets
          </Button>
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-400">Assets</span>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-gray-900 dark:text-white">Add New Asset</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Asset
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Add a new company asset or equipment to the inventory
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
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl"
          >
            {isSubmitting ? "Saving..." : "Save Asset"}
            <Save className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Asset Information Card */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-600" />
              Asset Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Asset Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1">
                Asset Name
                <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                placeholder="e.g., MacBook Pro 16"
                className={`rounded-xl ${errors.name ? "border-rose-300 focus:border-rose-500" : ""}`}
              />
              {errors.name && (
                <p className="text-sm text-rose-500">{errors.name}</p>
              )}
            </div>

            {/* Type and Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type" className="flex items-center gap-1">
                  Type
                  <span className="text-rose-500">*</span>
                </Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => {
                    setFormData({ ...formData, type: e.target.value });
                    if (errors.type) setErrors({ ...errors, type: "" });
                  }}
                  className={`w-full border rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800 ${
                    errors.type 
                      ? "border-rose-300 focus:border-rose-500 dark:border-rose-700" 
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <option value="">Select Type</option>
                  {ASSET_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-sm text-rose-500">{errors.type}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand" className="flex items-center gap-1">
                  Brand
                  <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => {
                    setFormData({ ...formData, brand: e.target.value });
                    if (errors.brand) setErrors({ ...errors, brand: "" });
                  }}
                  placeholder="e.g., Apple"
                  className={`rounded-xl ${errors.brand ? "border-rose-300 focus:border-rose-500" : ""}`}
                />
                {errors.brand && (
                  <p className="text-sm text-rose-500">{errors.brand}</p>
                )}
              </div>
            </div>

            {/* Model and Serial Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g., MacBook Pro M3 2023"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="e.g., ABC123456789"
                  className="rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Condition Card */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              Condition Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label>Asset Condition</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CONDITIONS.map((condition) => (
                  <button
                    key={condition.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, condition: condition.value })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.condition === condition.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                    }`}
                  >
                    <Badge className={`${condition.color} border-0 mb-2`}>
                      {condition.label}
                    </Badge>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {condition.value === "New" && "Brand new, unused"}
                      {condition.value === "Good" && "Minor wear, fully functional"}
                      {condition.value === "Fair" && "Visible wear, still works"}
                      {condition.value === "Poor" && "Heavy wear, needs repair"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Card */}
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional information about this asset..."
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm min-h-[120px] bg-white dark:bg-gray-800 resize-none"
              />
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
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl px-6"
          >
            {isSubmitting ? "Saving..." : "Save Asset"}
            <Save className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
}
