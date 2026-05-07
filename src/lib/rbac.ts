// Role definitions
export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'EMPLOYEE'

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  ADMIN: 3,
  SUPERVISOR: 2,
  EMPLOYEE: 1
}

// Default home page for each role
export const ROLE_HOME: Record<UserRole, string> = {
  ADMIN: '/dashboard/admin',
  SUPERVISOR: '/dashboard/supervisor',
  EMPLOYEE: '/dashboard/employee'
}

// Route access rules
export const ROUTE_ACCESS = [
  // Admin only routes
  { prefix: '/dashboard/admin', roles: ['ADMIN'] },
  { prefix: '/dashboard/users', roles: ['ADMIN'] },
  { prefix: '/dashboard/settings/system', roles: ['ADMIN'] },
  
  // Admin and Supervisor routes
  { prefix: '/dashboard/employees', roles: ['ADMIN', 'SUPERVISOR'] },
  { prefix: '/dashboard/scheduling', roles: ['ADMIN', 'SUPERVISOR'] },
  { prefix: '/dashboard/payroll', roles: ['ADMIN', 'SUPERVISOR'] },
  { prefix: '/dashboard/finance', roles: ['ADMIN', 'SUPERVISOR'] },
  { prefix: '/dashboard/ai-insights', roles: ['ADMIN', 'SUPERVISOR'] },
  { prefix: '/dashboard/supervisor-assignments', roles: ['ADMIN', 'SUPERVISOR'] },
  { prefix: '/dashboard/attendance', roles: ['ADMIN', 'SUPERVISOR'] },
  
  // Supervisor only routes
  { prefix: '/dashboard/supervisor', roles: ['ADMIN', 'SUPERVISOR'] },
  
  // Employee routes (accessible by all)
  { prefix: '/dashboard/employee', roles: ['ADMIN', 'SUPERVISOR', 'EMPLOYEE'] },
  { prefix: '/dashboard/assets', roles: ['ADMIN', 'SUPERVISOR', 'EMPLOYEE'] },
  { prefix: '/dashboard/leave', roles: ['ADMIN', 'SUPERVISOR', 'EMPLOYEE'] },
  { prefix: '/dashboard/notifications', roles: ['ADMIN', 'SUPERVISOR', 'EMPLOYEE'] },
  { prefix: '/dashboard/settings', roles: ['ADMIN', 'SUPERVISOR', 'EMPLOYEE'] },
  { prefix: '/dashboard/announcements', roles: ['ADMIN', 'SUPERVISOR', 'EMPLOYEE'] },
]

// Check if a role has access to a route
export function hasRouteAccess(role: UserRole, pathname: string): boolean {
  // Root dashboard always accessible
  if (pathname === '/dashboard') return true
  
  const rule = ROUTE_ACCESS.find(
    r => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`)
  )
  
  if (!rule) return true // No restrictions defined
  
  return rule.roles.includes(role)
}

// Check if user can manage other users
export function canManageUsers(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'SUPERVISOR'
}

// Check if user can manage all users (admin only)
export function canManageAllUsers(role: UserRole): boolean {
  return role === 'ADMIN'
}

// Check if user can manage system settings
export function canManageSystem(role: UserRole): boolean {
  return role === 'ADMIN'
}
