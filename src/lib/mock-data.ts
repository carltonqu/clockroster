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

// Mock Employees - Filipino Names
export const mockEmployees: Employee[] = [
  {
    id: "1",
    employeeId: "EMP001",
    fullName: "Juan Santos",
    email: "juan.santos@company.ph",
    phoneNumber: "+63 912-345-6789",
    department: "Engineering",
    position: "Senior Developer",
    employmentStatus: "Active",
    employmentType: "Full-time",
    hireDate: "2022-03-15",
  },
  {
    id: "2",
    employeeId: "EMP002",
    fullName: "Maria Garcia",
    email: "maria.garcia@company.ph",
    phoneNumber: "+63 913-456-7890",
    department: "Design",
    position: "UI/UX Designer",
    employmentStatus: "Active",
    employmentType: "Full-time",
    hireDate: "2022-06-20",
  },
  {
    id: "3",
    employeeId: "EMP003",
    fullName: "Ricardo Reyes",
    email: "ricardo.reyes@company.ph",
    phoneNumber: "+63 914-567-8901",
    department: "Marketing",
    position: "Marketing Manager",
    employmentStatus: "Active",
    employmentType: "Full-time",
    hireDate: "2021-11-08",
  },
  {
    id: "4",
    employeeId: "EMP004",
    fullName: "Ana Dela Cruz",
    email: "ana.delacruz@company.ph",
    phoneNumber: "+63 915-678-9012",
    department: "HR",
    position: "HR Specialist",
    employmentStatus: "Active",
    employmentType: "Full-time",
    hireDate: "2023-01-10",
  },
  {
    id: "5",
    employeeId: "EMP005",
    fullName: "Roberto Lim",
    email: "roberto.lim@company.ph",
    phoneNumber: "+63 916-789-0123",
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
    employeeName: "Juan Santos",
    clockIn: "2024-01-15T08:00:00Z",
    clockOut: "2024-01-15T17:00:00Z",
    overtimeMinutes: 0,
    date: "2024-01-15",
  },
  {
    id: "2",
    userId: "2",
    employeeName: "Maria Garcia",
    clockIn: "2024-01-15T08:30:00Z",
    clockOut: "2024-01-15T17:30:00Z",
    overtimeMinutes: 30,
    date: "2024-01-15",
  },
  {
    id: "3",
    userId: "3",
    employeeName: "Ricardo Reyes",
    clockIn: "2024-01-15T09:00:00Z",
    clockOut: null,
    overtimeMinutes: 0,
    date: "2024-01-15",
  },
  {
    id: "4",
    userId: "1",
    employeeName: "Juan Santos",
    clockIn: "2024-01-14T08:00:00Z",
    clockOut: "2024-01-14T18:00:00Z",
    overtimeMinutes: 60,
    date: "2024-01-14",
  },
  {
    id: "5",
    userId: "4",
    employeeName: "Ana Dela Cruz",
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
    employeeName: "Juan Santos",
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
    employeeName: "Maria Garcia",
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

// Mock Payroll Entries - Philippine Payroll Sample Data
export const mockPayrollEntries: PayrollEntry[] = [
  {
    id: "1",
    userId: "1",
    employeeName: "Juan Santos",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-15",
    periodType: "SEMI_MONTHLY",
    status: "RELEASED",
    rateType: "MONTHLY",
    rate: 35000,
    dailyRate: 1346.15,
    hourlyRate: 168.27,
    daysWorked: 11,
    hoursWorked: 88,
    lateMinutes: 15,
    undertimeMinutes: 0,
    absenceDays: 0,
    basicPay: 14807.69,
    otPay: 1262.03,
    nightDiffPay: 336.54,
    holidayPay: 1346.15,
    totalAllowances: 1500,
    allowances: [
      { name: "Transportation", amount: 1000 },
      { name: "Meal", amount: 500 },
    ],
    lateDeduction: 42.07,
    undertimeDeduction: 0,
    absenceDeduction: 0,
    sssEmployee: 787.50,
    sssEmployer: 1662.50,
    philhealthEmployee: 437.50,
    philhealthEmployer: 437.50,
    pagibigEmployee: 50,
    pagibigEmployer: 350,
    withholdingTax: 2083.33,
    taxableIncome: 14341.62,
    otherDeductions: [{ name: "Cash Advance", amount: 1000 }],
    totalOtherDeductions: 1000,
    grossPay: 19252.41,
    totalDeductions: 4400.40,
    netPay: 14852.01,
  },
  {
    id: "2",
    userId: "2",
    employeeName: "Maria Garcia",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-15",
    periodType: "SEMI_MONTHLY",
    status: "APPROVED",
    rateType: "MONTHLY",
    rate: 28000,
    dailyRate: 1076.92,
    hourlyRate: 134.62,
    daysWorked: 11,
    hoursWorked: 88,
    lateMinutes: 0,
    undertimeMinutes: 30,
    absenceDays: 0,
    basicPay: 11846.15,
    otPay: 504.82,
    nightDiffPay: 0,
    holidayPay: 1076.92,
    totalAllowances: 1100,
    allowances: [
      { name: "Transportation", amount: 800 },
      { name: "Rice Subsidy", amount: 300 },
    ],
    lateDeduction: 0,
    undertimeDeduction: 67.31,
    absenceDeduction: 0,
    sssEmployee: 630,
    sssEmployer: 1330,
    philhealthEmployee: 350,
    philhealthEmployer: 350,
    pagibigEmployee: 50,
    pagibigEmployer: 280,
    withholdingTax: 1041.67,
    taxableIncome: 10908.17,
    otherDeductions: [],
    totalOtherDeductions: 0,
    grossPay: 14460.58,
    totalDeductions: 2138.98,
    netPay: 12321.60,
  },
  {
    id: "3",
    userId: "3",
    employeeName: "Ricardo Reyes",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-15",
    periodType: "SEMI_MONTHLY",
    status: "DRAFT",
    rateType: "DAILY",
    rate: 650,
    dailyRate: 650,
    hourlyRate: 81.25,
    daysWorked: 11,
    hoursWorked: 88,
    lateMinutes: 45,
    undertimeMinutes: 0,
    absenceDays: 0,
    basicPay: 7150,
    otPay: 812.50,
    nightDiffPay: 162.50,
    holidayPay: 0,
    totalAllowances: 550,
    allowances: [
      { name: "Transportation", amount: 400 },
      { name: "Meal", amount: 150 },
    ],
    lateDeduction: 60.94,
    undertimeDeduction: 0,
    absenceDeduction: 0,
    sssEmployee: 450,
    sssEmployer: 950,
    philhealthEmployee: 250,
    philhealthEmployer: 250,
    pagibigEmployee: 50,
    pagibigEmployer: 200,
    withholdingTax: 0,
    taxableIncome: 0,
    otherDeductions: [{ name: "SSS Loan", amount: 500 }],
    totalOtherDeductions: 500,
    grossPay: 8614.06,
    totalDeductions: 1260.94,
    netPay: 7353.12,
  },
  {
    id: "4",
    userId: "4",
    employeeName: "Ana Dela Cruz",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-15",
    periodType: "SEMI_MONTHLY",
    status: "RELEASED",
    rateType: "MONTHLY",
    rate: 45000,
    dailyRate: 1730.77,
    hourlyRate: 216.35,
    daysWorked: 11,
    hoursWorked: 88,
    lateMinutes: 0,
    undertimeMinutes: 0,
    absenceDays: 0,
    basicPay: 19038.46,
    otPay: 2163.46,
    nightDiffPay: 432.69,
    holidayPay: 1730.77,
    totalAllowances: 2000,
    allowances: [
      { name: "Transportation", amount: 1200 },
      { name: "Communication", amount: 500 },
      { name: "Meal", amount: 300 },
    ],
    lateDeduction: 0,
    undertimeDeduction: 0,
    absenceDeduction: 0,
    sssEmployee: 1012.50,
    sssEmployer: 2137.50,
    philhealthEmployee: 562.50,
    philhealthEmployer: 562.50,
    pagibigEmployee: 50,
    pagibigEmployer: 450,
    withholdingTax: 3750,
    taxableIncome: 19361.46,
    otherDeductions: [{ name: "Pag-IBIG Loan", amount: 800 }],
    totalOtherDeductions: 800,
    grossPay: 25365.38,
    totalDeductions: 6175,
    netPay: 19190.38,
  },
  {
    id: "5",
    userId: "5",
    employeeName: "Roberto Lim",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-15",
    periodType: "SEMI_MONTHLY",
    status: "APPROVED",
    rateType: "HOURLY",
    rate: 95,
    dailyRate: 760,
    hourlyRate: 95,
    daysWorked: 11,
    hoursWorked: 88,
    lateMinutes: 20,
    undertimeMinutes: 0,
    absenceDays: 0,
    basicPay: 8360,
    otPay: 1187.50,
    nightDiffPay: 0,
    holidayPay: 0,
    totalAllowances: 660,
    allowances: [
      { name: "Transportation", amount: 440 },
      { name: "Meal", amount: 220 },
    ],
    lateDeduction: 31.67,
    undertimeDeduction: 0,
    absenceDeduction: 0,
    sssEmployee: 450,
    sssEmployer: 950,
    philhealthEmployee: 250,
    philhealthEmployer: 250,
    pagibigEmployee: 50,
    pagibigEmployer: 200,
    withholdingTax: 0,
    taxableIncome: 0,
    otherDeductions: [],
    totalOtherDeductions: 0,
    grossPay: 10175.83,
    totalDeductions: 731.67,
    netPay: 9444.16,
  },
];

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

// Mock Asset Assignments
export const mockAssetAssignments: AssetAssignment[] = [
  {
    id: "1",
    assetId: "1",
    assetName: "MacBook Pro 16",
    employeeId: "1",
    employeeName: "Juan Santos",
    dateAssigned: "2023-06-15",
    conditionOnAssign: "Good",
    isActive: true,
  },
  {
    id: "2",
    assetId: "3",
    assetName: "iPhone 15 Pro",
    employeeId: "2",
    employeeName: "Maria Garcia",
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
    employeeName: "Juan Santos",
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
    employeeName: "Ricardo Reyes",
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
    employeeName: "Ana Dela Cruz",
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
