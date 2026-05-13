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

export interface Allowance {
  name: string;
  amount: number;
}

export interface OtherDeduction {
  name: string;
  amount: number;
}

export interface PayrollEntry {
  id: string;
  userId: string;
  employeeName: string;
  periodStart: string;
  periodEnd: string;
  periodType: "WEEKLY" | "SEMI_MONTHLY" | "MONTHLY";
  status: "DRAFT" | "APPROVED" | "RELEASED";
  
  // Rate information
  rateType: "MONTHLY" | "DAILY" | "HOURLY";
  rate: number;
  dailyRate: number;
  hourlyRate: number;
  
  // Attendance
  daysWorked: number;
  hoursWorked: number;
  lateMinutes: number;
  undertimeMinutes: number;
  absenceDays: number;
  
  // Earnings breakdown
  basicPay: number;
  otPay: number;
  nightDiffPay: number;
  holidayPay: number;
  totalAllowances: number;
  allowances: Allowance[];
  
  // Attendance deductions
  lateDeduction: number;
  undertimeDeduction: number;
  absenceDeduction: number;
  
  // Government deductions (Philippine)
  sssEmployee: number;
  sssEmployer: number;
  philhealthEmployee: number;
  philhealthEmployer: number;
  pagibigEmployee: number;
  pagibigEmployer: number;
  withholdingTax: number;
  taxableIncome: number;
  
  // Other deductions
  otherDeductions: OtherDeduction[];
  totalOtherDeductions: number;
  
  // Totals
  grossPay: number;
  totalDeductions: number;
  netPay: number;
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

// Employees start empty (no placeholder demo records)
export const mockEmployees: Employee[] = [];

// Time entries start empty
export const mockTimeEntries: TimeEntry[] = [];

// Schedules start empty
export const mockSchedules: Schedule[] = [];

// Payroll entries start empty
export const mockPayrollEntries: PayrollEntry[] = [];

// Mock Holidays (Philippine)
export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: "Regular" | "Special";
}

export const mockHolidays: Holiday[] = [
  { id: "1", name: "New Year's Day", date: "2024-01-01", type: "Regular" },
  { id: "2", name: "Chinese New Year", date: "2024-02-10", type: "Special" },
  { id: "3", name: "Araw ng Kagitingan", date: "2024-04-09", type: "Regular" },
  { id: "4", name: "Maundy Thursday", date: "2024-03-28", type: "Regular" },
  { id: "5", name: "Good Friday", date: "2024-03-29", type: "Regular" },
  { id: "6", name: "Black Saturday", date: "2024-03-30", type: "Special" },
  { id: "7", name: "Labor Day", date: "2024-05-01", type: "Regular" },
  { id: "8", name: "Independence Day", date: "2024-06-12", type: "Regular" },
  { id: "9", name: "Ninoy Aquino Day", date: "2024-08-21", type: "Special" },
  { id: "10", name: "National Heroes Day", date: "2024-08-26", type: "Regular" },
  { id: "11", name: "All Saints' Day", date: "2024-11-01", type: "Special" },
  { id: "12", name: "Bonifacio Day", date: "2024-11-30", type: "Regular" },
  { id: "13", name: "Christmas Day", date: "2024-12-25", type: "Regular" },
  { id: "14", name: "Rizal Day", date: "2024-12-30", type: "Regular" },
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

// Asset assignments start empty
export const mockAssetAssignments: AssetAssignment[] = [];

// Leave requests start empty
export const mockLeaveRequests: LeaveRequest[] = [];

// Mock current user
// To test EMPLOYEE role: change role to "EMPLOYEE"
// To test MANAGER role: change role to "MANAGER"
// To test HR role: change role to "HR"
// To test different roles: change role to "EMPLOYEE", "MANAGER", "HR", or "ADMIN"
export const mockCurrentUser = {
  id: "3",
  name: "Ricardo Reyes",
  email: "ricardo.reyes@company.com",
  role: "EMPLOYEE",
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
