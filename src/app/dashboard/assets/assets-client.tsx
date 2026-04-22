"use client";

import { useState } from "react";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "Assigned":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return "bg-green-100 text-green-700";
      case "Good":
        return "bg-blue-100 text-blue-700";
      case "Fair":
        return "bg-yellow-100 text-yellow-700";
      case "Poor":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Assets
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage company assets and equipment
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAssetDialogOpen} onOpenChange={setIsAssetDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddAsset} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Asset Name *</Label>
                  <Input
                    id="name"
                    required
                    value={assetForm.name}
                    onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                    placeholder="MacBook Pro 16"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <select
                      id="type"
                      required
                      value={assetForm.type}
                      onChange={(e) => setAssetForm({ ...assetForm, type: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
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
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      required
                      value={assetForm.brand}
                      onChange={(e) => setAssetForm({ ...assetForm, brand: e.target.value })}
                      placeholder="Apple"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={assetForm.model}
                    onChange={(e) => setAssetForm({ ...assetForm, model: e.target.value })}
                    placeholder="MacBook Pro M3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={assetForm.serialNumber}
                    onChange={(e) => setAssetForm({ ...assetForm, serialNumber: e.target.value })}
                    placeholder="ABC123456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <select
                      id="condition"
                      value={assetForm.condition}
                      onChange={(e) => setAssetForm({ ...assetForm, condition: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={assetForm.status}
                      onChange={(e) => setAssetForm({ ...assetForm, status: e.target.value as any })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="Available">Available</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAssetDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Asset</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <User className="mr-2 h-4 w-4" />
                Assign Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Assign Asset to Employee</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAssignAsset} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="assignAsset">Asset *</Label>
                  <select
                    id="assignAsset"
                    required
                    value={assignForm.assetId}
                    onChange={(e) => setAssignForm({ ...assignForm, assetId: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
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
                  <Label htmlFor="assignEmployee">Employee *</Label>
                  <select
                    id="assignEmployee"
                    required
                    value={assignForm.employeeId}
                    onChange={(e) => setAssignForm({ ...assignForm, employeeId: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
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
                  <Label htmlFor="assignCondition">Condition on Assign</Label>
                  <select
                    id="assignCondition"
                    value={assignForm.conditionOnAssign}
                    onChange={(e) => setAssignForm({ ...assignForm, conditionOnAssign: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Assign Asset</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Assets
            </CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Available
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assets.filter((a) => a.status === "Available").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Assigned
            </CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {assets.filter((a) => a.status === "Assigned").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              In Maintenance
            </CardTitle>
            <Wrench className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {assets.filter((a) => a.status === "Maintenance").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" onClick={() => toast.info("Filter feature coming soon!")}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Brand/Model</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No assets found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{asset.name}</p>
                              <p className="text-sm text-gray-500">{asset.assetCode}</p>
                            </div>
                          </TableCell>
                          <TableCell>{asset.type}</TableCell>
                          <TableCell>
                            <div>
                              <p>{asset.brand}</p>
                              <p className="text-sm text-gray-500">{asset.model}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getConditionColor(asset.condition)}>
                              {asset.condition}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(asset.status)}>
                              {asset.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
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

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Date Assigned</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetAssignments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No assignments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      assetAssignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium">
                            {assignment.assetName}
                          </TableCell>
                          <TableCell>{assignment.employeeName}</TableCell>
                          <TableCell>
                            {new Date(assignment.dateAssigned).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={getConditionColor(assignment.conditionOnAssign)}>
                              {assignment.conditionOnAssign}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                assignment.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }
                            >
                              {assignment.isActive ? "Active" : "Returned"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {assignment.isActive && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toast.success(`Returned ${assignment.assetName}`)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
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
