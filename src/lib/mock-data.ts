// Mock data for the ClockRoster demo app

export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  position: string;
  employmentStatus: string;
  employmentType: string;
  hireDate: string;
  profilePhoto?: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  employeeName: string;
  clockIn: string;
  clockOut: string | null;
  overtimeMinutes: number;
  date: string;
}

export interface Schedule {
  id: string;
  employeeId: string;
  employeeName: string;
  weekStart: string;
  shifts: Shift[];
}

export interface Shift {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  role: string;
}

export interface PayrollEntry {
  id: string;
  userId: string;
  employeeName: string;
  periodStart: string;
  periodEnd: string;
  status: "DRAFT" | "APPROVED" | "RELEASED";
  basicPay: number;
  otPay: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  hoursWorked: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Asset {
  id: string;
  assetCode: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  condition: string;
  status: "Available" | "Assigned" | "Maintenance";
  serialNumber?: string;
}

export interface AssetAssignment {
  id: string;
  assetId: string;
  assetName: string;
  employeeId: string;
  employeeName: string;
  dateAssigned: string;
  conditionOnAssign: string;
  isActive: boolean;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  requestedAt: string;
}

// Mock Employees
export const mockEmployees: Employee[] = [
  {
    id: "1",
    employeeId: "EMP001",
    fullName: "John Smith",
    email: "john.smith@company.com",
    phoneNumber: "+1 555-0101",
    department: "Engineering",
    position: "Senior Developer",
    employmentStatus: "Active",
    employmentType: "Full-time",
    hireDate: "2022-03-15",
  },
  {
    id: "2",
    employeeId: "EMP002",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phoneNumber: "+1 555-0102",
    department: "Design",
    position: "UI/UX Designer",
    employmentStatus: "Active",
    employmentType: "Full-time",
    hireDate: "2022-06-20",
  },
  {
    id: "3",
    employeeId: "EMP003",
    fullName: "Michael Chen",
    email: "michael.chen@company.com",
    phoneNumber: "+1 555-0103",
    department: "Marketing",
    position: "Marketing Manager",
    employmentStatus: "Active",
    employmentType: "Full-time",
    hireDate: "2021-11-08",
  },
  {
    id: "4",
    employeeId: "EMP004",
    fullName: "Emily Davis",
    email: "emily.davis@company.com",
    phoneNumber: "+1 555-0104",
    department: "HR",
    position: "HR Specialist",
    employmentStatus: "Active",
    employmentType: "Full-time",
    hireDate: "2023-01-10",
  },
  {
    id: "5",
    employeeId: "EMP005",
    fullName: "David Wilson",
    email: "david.wilson@company.com",
    phoneNumber: "+1 555-0105",
    department: "Sales",
    position: "Sales Representative",
    employmentStatus: "Active",
    employmentType: "Full-time",
    hireDate: "2022-09-05",
  },
];

// Mock Time Entries
export const mockTimeEntries: TimeEntry[] = [
  {
    id: "1",
    userId: "1",
    employeeName: "John Smith",
    clockIn: "2024-01-15T08:00:00Z",
    clockOut: "2024-01-15T17:00:00Z",
    overtimeMinutes: 0,
    date: "2024-01-15",
  },
  {
    id: "2",
    userId: "2",
    employeeName: "Sarah Johnson",
    clockIn: "2024-01-15T08:30:00Z",
    clockOut: "2024-01-15T17:30:00Z",
    overtimeMinutes: 30,
    date: "2024-01-15",
  },
  {
    id: "3",
    userId: "3",
    employeeName: "Michael Chen",
    clockIn: "2024-01-15T09:00:00Z",
    clockOut: null,
    overtimeMinutes: 0,
    date: "2024-01-15",
  },
  {
    id: "4",
    userId: "1",
    employeeName: "John Smith",
    clockIn: "2024-01-14T08:00:00Z",
    clockOut: "2024-01-14T18:00:00Z",
    overtimeMinutes: 60,
    date: "2024-01-14",
  },
  {
    id: "5",
    userId: "4",
    employeeName: "Emily Davis",
    clockIn: "2024-01-15T08:15:00Z",
    clockOut: "2024-01-15T16:45:00Z",
    overtimeMinutes: 0,
    date: "2024-01-15",
  },
];

// Mock Schedules
export const mockSchedules: Schedule[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "John Smith",
    weekStart: "2024-01-15",
    shifts: [
      { id: "s1", day: "Monday", startTime: "08:00", endTime: "17:00", role: "Developer" },
      { id: "s2", day: "Tuesday", startTime: "08:00", endTime: "17:00", role: "Developer" },
      { id: "s3", day: "Wednesday", startTime: "08:00", endTime: "17:00", role: "Developer" },
      { id: "s4", day: "Thursday", startTime: "08:00", endTime: "17:00", role: "Developer" },
      { id: "s5", day: "Friday", startTime: "08:00", endTime: "16:00", role: "Developer" },
    ],
  },
  {
    id: "2",
    employeeId: "2",
    employeeName: "Sarah Johnson",
    weekStart: "2024-01-15",
    shifts: [
      { id: "s6", day: "Monday", startTime: "08:30", endTime: "17:30", role: "Designer" },
      { id: "s7", day: "Tuesday", startTime: "08:30", endTime: "17:30", role: "Designer" },
      { id: "s8", day: "Wednesday", startTime: "08:30", endTime: "17:30", role: "Designer" },
      { id: "s9", day: "Thursday", startTime: "08:30", endTime: "17:30", role: "Designer" },
      { id: "s10", day: "Friday", startTime: "08:30", endTime: "16:30", role: "Designer" },
    ],
  },
];

// Mock Payroll Entries
export const mockPayrollEntries: PayrollEntry[] = [
  {
    id: "1",
    userId: "1",
    employeeName: "John Smith",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-15",
    status: "RELEASED",
    basicPay: 3000,
    otPay: 200,
    grossPay: 3200,
    deductions: 450,
    netPay: 2750,
    hoursWorked: 88,
  },
  {
    id: "2",
    userId: "2",
    employeeName: "Sarah Johnson",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-15",
    status: "APPROVED",
    basicPay: 2800,
    otPay: 150,
    grossPay: 2950,
    deductions: 420,
    netPay: 2530,
    hoursWorked: 86,
  },
  {
    id: "3",
    userId: "3",
    employeeName: "Michael Chen",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-15",
    status: "DRAFT",
    basicPay: 3500,
    otPay: 0,
    grossPay: 3500,
    deductions: 520,
    netPay: 2980,
    hoursWorked: 80,
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    type: "SCHEDULE",
    message: "Your schedule for next week has been published",
    read: false,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "1",
    type: "PAYROLL",
    message: "Payroll for Jan 1-15 has been processed",
    read: false,
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "3",
    userId: "1",
    type: "APPROVAL",
    message: "Your leave request has been approved",
    read: true,
    createdAt: "2024-01-14T14:00:00Z",
  },
];

// Mock Assets
export const mockAssets: Asset[] = [
  {
    id: "1",
    assetCode: "LAPTOP-001",
    name: "MacBook Pro 16",
    type: "Laptop",
    brand: "Apple",
    model: "MacBook Pro M3",
    condition: "Good",
    status: "Assigned",
    serialNumber: "ABC123456",
  },
  {
    id: "2",
    assetCode: "LAPTOP-002",
    name: "Dell XPS 15",
    type: "Laptop",
    brand: "Dell",
    model: "XPS 15 9520",
    condition: "Good",
    status: "Available",
    serialNumber: "DEF789012",
  },
  {
    id: "3",
    assetCode: "PHONE-001",
    name: "iPhone 15 Pro",
    type: "Mobile Phone",
    brand: "Apple",
    model: "iPhone 15 Pro",
    condition: "Excellent",
    status: "Assigned",
    serialNumber: "GHI345678",
  },
  {
    id: "4",
    assetCode: "MONITOR-001",
    name: "LG UltraWide 34",
    type: "Monitor",
    brand: "LG",
    model: "34WN80C-B",
    condition: "Good",
    status: "Available",
  },
];

// Mock Asset Assignments
export const mockAssetAssignments: AssetAssignment[] = [
  {
    id: "1",
    assetId: "1",
    assetName: "MacBook Pro 16",
    employeeId: "1",
    employeeName: "John Smith",
    dateAssigned: "2023-06-15",
    conditionOnAssign: "Good",
    isActive: true,
  },
  {
    id: "2",
    assetId: "3",
    assetName: "iPhone 15 Pro",
    employeeId: "2",
    employeeName: "Sarah Johnson",
    dateAssigned: "2023-08-20",
    conditionOnAssign: "Excellent",
    isActive: true,
  },
];

// Mock Leave Requests
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "John Smith",
    type: "Vacation",
    startDate: "2024-02-10",
    endDate: "2024-02-14",
    reason: "Family vacation",
    status: "Approved",
    requestedAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "2",
    employeeId: "3",
    employeeName: "Michael Chen",
    type: "Sick Leave",
    startDate: "2024-01-16",
    endDate: "2024-01-16",
    reason: "Not feeling well",
    status: "Pending",
    requestedAt: "2024-01-15T20:00:00Z",
  },
  {
    id: "3",
    employeeId: "4",
    employeeName: "Emily Davis",
    type: "Personal",
    startDate: "2024-01-20",
    endDate: "2024-01-20",
    reason: "Personal appointment",
    status: "Pending",
    requestedAt: "2024-01-14T10:00:00Z",
  },
];

// Mock current user
export const mockCurrentUser = {
  id: "1",
  name: "Admin User",
  email: "admin@clockroster.com",
  role: "MANAGER",
  tier: "Advanced",
  orgId: "org-1",
  image: null,
};

// Stats for dashboard
export const mockDashboardStats = {
  totalEmployees: mockEmployees.length,
  activeEmployees: mockEmployees.filter(e => e.employmentStatus === "Active").length,
  totalHoursThisMonth: 1240,
  overtimeHours: 45,
  pendingApprovals: mockLeaveRequests.filter(r => r.status === "Pending").length,
  unreadNotifications: mockNotifications.filter(n => !n.read).length,
};
