"use client";

import { useState, useCallback } from "react";
import {
  mockEmployees,
  mockPayrollEntries,
  mockAssets,
  mockAssetAssignments,
  mockLeaveRequests,
  mockNotifications,
  Employee,
  PayrollEntry,
  Asset,
  AssetAssignment,
  LeaveRequest,
  Notification,
} from "./mock-data";

// Global store (singleton pattern for demo)
let globalEmployees = [...mockEmployees];
let globalPayrollEntries = [...mockPayrollEntries];
let globalAssets = [...mockAssets];
let globalAssetAssignments = [...mockAssetAssignments];
let globalLeaveRequests = [...mockLeaveRequests];
let globalNotifications = [...mockNotifications];

// Hook to use the store
export function useStore() {
  const [employees, setEmployeesState] = useState(globalEmployees);
  const [payrollEntries, setPayrollEntriesState] = useState(globalPayrollEntries);
  const [assets, setAssetsState] = useState(globalAssets);
  const [assetAssignments, setAssetAssignmentsState] = useState(globalAssetAssignments);
  const [leaveRequests, setLeaveRequestsState] = useState(globalLeaveRequests);
  const [notifications, setNotificationsState] = useState(globalNotifications);

  // Employees
  const addEmployee = useCallback((employee: Omit<Employee, "id" | "employeeId">) => {
    const newId = String(globalEmployees.length + 1);
    const newEmployeeId = `EMP${String(globalEmployees.length + 1).padStart(3, "0")}`;
    const newEmployee: Employee = {
      ...employee,
      id: newId,
      employeeId: newEmployeeId,
    };
    globalEmployees = [...globalEmployees, newEmployee];
    setEmployeesState(globalEmployees);
    return newEmployee;
  }, []);

  // Payroll
  const addPayrollEntry = useCallback((entry: Omit<PayrollEntry, "id">) => {
    const newId = String(globalPayrollEntries.length + 1);
    const newEntry: PayrollEntry = {
      ...entry,
      id: newId,
    };
    globalPayrollEntries = [...globalPayrollEntries, newEntry];
    setPayrollEntriesState(globalPayrollEntries);
    return newEntry;
  }, []);

  // Assets
  const addAsset = useCallback((asset: Omit<Asset, "id" | "assetCode">) => {
    const newId = String(globalAssets.length + 1);
    const newAssetCode = `ASSET-${String(globalAssets.length + 1).padStart(3, "0")}`;
    const newAsset: Asset = {
      ...asset,
      id: newId,
      assetCode: newAssetCode,
    };
    globalAssets = [...globalAssets, newAsset];
    setAssetsState(globalAssets);
    return newAsset;
  }, []);

  const assignAsset = useCallback((assignment: Omit<AssetAssignment, "id">) => {
    const newId = String(globalAssetAssignments.length + 1);
    const newAssignment: AssetAssignment = {
      ...assignment,
      id: newId,
    };
    globalAssetAssignments = [...globalAssetAssignments, newAssignment];
    setAssetAssignmentsState(globalAssetAssignments);
    return newAssignment;
  }, []);

  // Leave Requests
  const addLeaveRequest = useCallback((request: Omit<LeaveRequest, "id" | "requestedAt">) => {
    const newId = String(globalLeaveRequests.length + 1);
    const newRequest: LeaveRequest = {
      ...request,
      id: newId,
      requestedAt: new Date().toISOString(),
    };
    globalLeaveRequests = [...globalLeaveRequests, newRequest];
    setLeaveRequestsState(globalLeaveRequests);
    return newRequest;
  }, []);

  const updateLeaveRequestStatus = useCallback((id: string, status: LeaveRequest["status"]) => {
    globalLeaveRequests = globalLeaveRequests.map((r) =>
      r.id === id ? { ...r, status } : r
    );
    setLeaveRequestsState(globalLeaveRequests);
  }, []);

  // Notifications
  const addNotification = useCallback((notification: Omit<Notification, "id" | "createdAt">) => {
    const newId = String(globalNotifications.length + 1);
    const newNotification: Notification = {
      ...notification,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    globalNotifications = [newNotification, ...globalNotifications];
    setNotificationsState(globalNotifications);
    return newNotification;
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    globalNotifications = globalNotifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotificationsState(globalNotifications);
  }, []);

  return {
    employees,
    payrollEntries,
    assets,
    assetAssignments,
    leaveRequests,
    notifications,
    addEmployee,
    addPayrollEntry,
    addAsset,
    assignAsset,
    addLeaveRequest,
    updateLeaveRequestStatus,
    addNotification,
    markNotificationAsRead,
  };
}
