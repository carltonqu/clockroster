"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  User,
  CheckCircle,
  XCircle,
  Wrench,
  Sparkles,
  X,
  Package,
  Calendar,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

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

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; icon: any }> = {
  Available: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: CheckCircle,
  },
  Assigned: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    icon: User,
  },
  Maintenance: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    icon: Wrench,
  },
};

const CONDITION_CONFIG: Record<string, { bg: string; text: string }> = {
  Excellent: { bg: "bg-emerald-50 text-emerald-700", text: "" },
  Good: { bg: "bg-blue-50 text-blue-700", text: "" },
  Fair: { bg: "bg-amber-50 text-amber-700", text: "" },
  Poor: { bg: "bg-rose-50 text-rose-700", text: "" },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Available;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}

function ConditionBadge({ condition }: { condition: string }) {
  const config = CONDITION_CONFIG[condition] || CONDITION_CONFIG.Good;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg}`}>
      {condition}
    </span>
  );
}

export function AssetsClient() {
  const { assets, assetAssignments, employees, addAsset, assignAsset } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("assets");
  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assetForm, setAssetForm] = useState({
    name: "",
    type: "",
    brand: "",
    model: "",
    condition: "Good",
    status: "Available" as const,
    serialNumber: "",
  });
  const [assignForm, setAssignForm] = useState({
    assetId: "",
    employeeId: "",
    conditionOnAssign: "Good",
  });

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    addAsset(assetForm);
    toast.success(`Asset ${assetForm.name} added successfully!`);
    setIsAssetDialogOpen(false);
    setAssetForm({
      name: "",
      type: "",
      brand: "",
      model: "",
      condition: "Good",
      status: "Available",
      serialNumber: "",
    });
  };

  const handleAssignAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find((a) => a.id === assignForm.assetId);
    const employee = employees.find((e) => e.id === assignForm.employeeId);
    if (asset && employee) {
      assignAsset({
        assetId: asset.id,
        assetName: asset.name,
        employeeId: employee.id,
        employeeName: employee.fullName,
        dateAssigned: new Date().toISOString().split("T")[0],
        conditionOnAssign: assignForm.conditionOnAssign,
        isActive: true,
      });
      toast.success(`${asset.name} assigned to ${employee.fullName}!`);
      setIsAssignDialogOpen(false);
      setAssignForm({
        assetId: "",
        employeeId: "",
        conditionOnAssign: "Good",
      });
    }
  };

  const availableCount = assets.filter((a) => a.status === "Available").length;
  const assignedCount = assets.filter((a) => a.status === "Assigned").length;
  const maintenanceCount = assets.filter((a) => a.status === "Maintenance").length;

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
              Assets
            </h2>
            <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-0">
              <Sparkles className="w-3 h-3 mr-1" /> {assets.length} Total
            </Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage company assets and equipment
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAssetDialogOpen} onOpenChange={setIsAssetDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md rounded-xl">
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
              <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <DialogTitle>Add New Asset</DialogTitle>
                </div>
              </DialogHeader>
              <form onSubmit={handleAddAsset} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-medium text-gray-500">Asset Name *</Label>
                  <Input
                    id="name"
                    required
                    value={assetForm.name}
                    onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                    placeholder="MacBook Pro 16"
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-xs font-medium text-gray-500">Type *</Label>
                    <select
                      id="type"
                      required
                      value={assetForm.type}
                      onChange={(e) => setAssetForm({ ...assetForm, type: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800"
                    >
                      <option value="">Select Type</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Desktop">Desktop</option>
                      <option value="Mobile Phone">Mobile Phone</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Printer">Printer</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand" className="text-xs font-medium text-gray-500">Brand *</Label>
                    <Input
                      id="brand"
                      required
                      value={assetForm.brand}
                      onChange={(e) => setAssetForm({ ...assetForm, brand: e.target.value })}
                      placeholder="Apple"
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model" className="text-xs font-medium text-gray-500">Model</Label>
                  <Input
                    id="model"
                    value={assetForm.model}
                    onChange={(e) => setAssetForm({ ...assetForm, model: e.target.value })}
                    placeholder="MacBook Pro M3"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber" className="text-xs font-medium text-gray-500">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={assetForm.serialNumber}
                    onChange={(e) => setAssetForm({ ...assetForm, serialNumber: e.target.value })}
                    placeholder="ABC123456"
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition" className="text-xs font-medium text-gray-500">Condition</Label>
                    <select
                      id="condition"
                      value={assetForm.condition}
                      onChange={(e) => setAssetForm({ ...assetForm, condition: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-xs font-medium text-gray-500">Status</Label>
                    <select
                      id="status"
                      value={assetForm.status}
                      onChange={(e) => setAssetForm({ ...assetForm, status: e.target.value as any })}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800"
                    >
                      <option value="Available">Available</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAssetDialogOpen(false)} className="rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl">
                    Add Asset
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-xl">
                <User className="mr-2 h-4 w-4" />
                Assign Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-2xl">
              <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <DialogTitle>Assign Asset to Employee</DialogTitle>
                </div>
              </DialogHeader>
              <form onSubmit={handleAssignAsset} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="assignAsset" className="text-xs font-medium text-gray-500">Asset *</Label>
                  <select
                    id="assignAsset"
                    required
                    value={assignForm.assetId}
                    onChange={(e) => setAssignForm({ ...assignForm, assetId: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800"
                  >
                    <option value="">Select Asset</option>
                    {assets
                      .filter((a) => a.status === "Available")
                      .map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.name} ({asset.assetCode})
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignEmployee" className="text-xs font-medium text-gray-500">Employee *</Label>
                  <select
                    id="assignEmployee"
                    required
                    value={assignForm.employeeId}
                    onChange={(e) => setAssignForm({ ...assignForm, employeeId: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignCondition" className="text-xs font-medium text-gray-500">Condition on Assign</Label>
                  <select
                    id="assignCondition"
                    value={assignForm.conditionOnAssign}
                    onChange={(e) => setAssignForm({ ...assignForm, conditionOnAssign: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)} className="rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl">
                    Assign Asset
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Briefcase} label="Total Assets" value={assets.length} gradient="from-blue-500 to-cyan-500" delay={100} />
        <StatCard icon={CheckCircle} label="Available" value={availableCount} gradient="from-emerald-500 to-green-500" delay={200} />
        <StatCard icon={User} label="Assigned" value={assignedCount} gradient="from-blue-500 to-indigo-500" delay={300} />
        <StatCard icon={Wrench} label="In Maintenance" value={maintenanceCount} gradient="from-amber-500 to-orange-500" delay={400} />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <TabsList className="rounded-xl">
          <TabsTrigger value="assets" className="rounded-lg">Assets</TabsTrigger>
          <TabsTrigger value="assignments" className="rounded-lg">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4 mt-4">
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-50 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
                {searchQuery && (
                  <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="rounded-xl">
                    <X className="h-4 w-4 mr-1" /> Clear
                  </Button>
                )}
                <Button variant="outline" onClick={() => toast.info("Filter feature coming soon!")} className="rounded-xl">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Asset</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Brand/Model</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Condition</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</TableHead>
                      <TableHead className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-16">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4">
                              <Package className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No assets found</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add your first asset</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAssets.map((asset) => (
                        <TableRow key={asset.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white">
                                <Package className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{asset.name}</p>
                                <p className="text-xs text-gray-500 font-mono">{asset.assetCode}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">{asset.type}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-gray-900 dark:text-white">{asset.brand}</p>
                              <p className="text-xs text-gray-500">{asset.model}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <ConditionBadge condition={asset.condition} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={asset.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-lg">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuItem onClick={() => toast.info(`View ${asset.name}`)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.info(`Edit ${asset.name}`)}>
                                  Edit
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4 mt-4">
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm">
            <CardContent className="p-0 pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Asset</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Assigned To</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date Assigned</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Condition</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</TableHead>
                      <TableHead className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetAssignments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-16">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4">
                              <User className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No assignments found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      assetAssignments.map((assignment) => (
                        <TableRow key={assignment.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white">
                                <Package className="w-4 h-4" />
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">{assignment.assetName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">{assignment.employeeName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(assignment.dateAssigned).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <ConditionBadge condition={assignment.conditionOnAssign} />
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                              assignment.isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                                : "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700"
                            }`}>
                              {assignment.isActive ? "Active" : "Returned"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {assignment.isActive && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toast.success(`Returned ${assignment.assetName}`)}
                                className="rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20"
                              >
                                <XCircle className="h-4 w-4 mr-1 text-rose-600" />
                                Return
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
