// src/stores/complianceStore.js
import { create } from 'zustand';

/**
 * Zustand store for managing compliance UI state and filters
 * Replaces the ComplianceContext for more efficient state management
 * 
 * Note: All API calls and server-side data fetching should be handled by TanStack Query
 * This store only manages client-side state
 */
const useComplianceStore = create((set, get) => ({
  // Global UI State
  activeTab: 0, // 0: User Account Review, 1: Audit Trail, 2: Admin
  setActiveTab: (tabIndex) => set({ activeTab: tabIndex }),
  
  // User Account Review Panel State
  selectedReviewType: "",
  selectedSystem: "",
  selectedDepartment: "",
  currentPage: 1,
  itemsPerPage: 10,
  departmentConfigs: {},
  customDepartments: [],
  
  // Loading and error states
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error: error }),
  
  // Audit Trail Panel State
  auditTrailSearchQuery: "",
  setAuditTrailSearchQuery: (query) => set({ auditTrailSearchQuery: query }),
  auditTrailIsMenuOpen: false,
  setAuditTrailIsMenuOpen: (isOpen) => set({ auditTrailIsMenuOpen: isOpen }),
  auditTrailSelectedUsers: [],
  setAuditTrailSelectedUsers: (users) => set({ auditTrailSelectedUsers: users }),
  addAuditTrailSelectedUser: (user) => set(state => ({
    auditTrailSelectedUsers: [...state.auditTrailSelectedUsers, user]
  })),
  removeAuditTrailSelectedUser: (userId) => set(state => ({
    auditTrailSelectedUsers: state.auditTrailSelectedUsers.filter(user => user.id !== userId)
  })),
  clearAuditTrailSelectedUsers: () => set({ auditTrailSelectedUsers: [] }),
  
  // System options - static data
  systemOptions: [
    { value: "KZO", label: "KZO System" },
    { value: "CZO", label: "CZO System" },
  ],
  
  // Department options organized by system - static data
  departmentsBySystem: {
    "KZO": [
      { value: "VFF", label: "VFF" },
      { value: "LSS", label: "LSS Manufacturing" },
      { value: "GELFOAM", label: "Gelfoam" },
      { value: "LINE18", label: "Line 18" },
      { value: "APNPREP", label: "APNPREP" },
      { value: "ATGAM", label: "ATGAM Bio Ops" },
      { value: "KZOPA", label: "KZOPA Domain" },
      { value: "PI Data Historian", label: "PI Data Historian" },
      { value: "FT100", label: "Freeze Thaw Unit" },
    ],
    "CZO": [
      { value: "FINANCE", label: "Finance Department" },
      { value: "HR", label: "Human Resources" },
      { value: "IT", label: "Information Technology" },
      { value: "SALES", label: "Sales Department" },
      { value: "MARKETING", label: "Marketing Department" },
    ]
  },
  
  // Actions for UI state management
  setSelectedReviewType: (reviewType) => set({ selectedReviewType: reviewType }),
  
  setSelectedSystem: (system) => set({ selectedSystem: system }),
  
  setSelectedDepartment: (department) => set({ selectedDepartment: department }),
  
  setCurrentPage: (page) => set({ currentPage: page }),
  
  setItemsPerPage: (count) => set({ itemsPerPage: count }),
  
  // Department configuration management
  setDepartmentConfig: (department, config) => set(state => ({
    departmentConfigs: {
      ...state.departmentConfigs,
      [department]: config
    }
  })),
  
  // Get department options based on selected system and custom departments
  getDepartmentOptions: () => {
    const { selectedSystem, departmentsBySystem, customDepartments } = get();
    if (!selectedSystem) return [];
    
    const systemDepartments = departmentsBySystem[selectedSystem] || [];
    
    // Combine built-in departments with custom departments
    return [...systemDepartments, ...customDepartments.filter(dept => dept.system === selectedSystem)]
      .sort((a, b) => {
        const labelA = a.label.split(' ')[0]; // Get the first word of the label
        const labelB = b.label.split(' ')[0];
        return labelA.localeCompare(labelB);
      });
  },
  
  // Add a new department
  addNewDepartment: (departmentName, departmentCode, system) => {
    const { departmentsBySystem, customDepartments } = get();
    
    // Validate department code and name
    if (!departmentCode || !departmentName) {
      throw new Error("Department code and name are required");
    }

    if (!system) {
      throw new Error("System is required");
    }

    // Check if department code already exists in the selected system
    const systemDepartments = departmentsBySystem[system] || [];
    const departmentExists = [...systemDepartments, ...customDepartments]
      .some(dept => dept.value.toLowerCase() === departmentCode.toLowerCase());
    
    if (departmentExists) {
      throw new Error(`Department with code '${departmentCode}' already exists in ${system} system`);
    }

    // Create new department
    const newDepartment = {
      value: departmentCode,
      label: departmentName,
      system: system // Store the system this department belongs to
    };

    // Add to custom departments
    set(state => ({
      customDepartments: [...state.customDepartments, newDepartment],
      departmentConfigs: {
        ...state.departmentConfigs,
        [departmentCode]: {
          organizationalUnits: [],
          groupCNs: []
        }
      }
    }));
    
    return newDepartment;
  },
  
  // Remove a custom department
  removeCustomDepartment: (departmentCode) => {
    set(state => ({
      customDepartments: state.customDepartments.filter(dept => dept.value !== departmentCode)
    }));
  },
  
  // Toast notification management
  toastMessage: null,
  setToastMessage: (message) => set({ toastMessage: message }),
  clearToastMessage: () => set({ toastMessage: null }),
  
  // Reset all compliance state
  resetComplianceState: () => set({
    selectedReviewType: "",
    selectedSystem: "",
    selectedDepartment: "",
    currentPage: 1,
    itemsPerPage: 10,
    auditTrailSearchQuery: "",
    auditTrailIsMenuOpen: false,
    auditTrailSelectedUsers: [],
    error: null,
    isLoading: false,
    toastMessage: null
  })
}));

export default useComplianceStore;