import React, { createContext, useState, useCallback, useMemo } from "react";
import { fetchData } from '../../utils/ApiUtility';

export const ComplianceContext = createContext();

export const ComplianceProvider = ({ children }) => {
  const [selectedReviewType, setSelectedReviewType] = useState("");
  const [selectedSystem, setSelectedSystem] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [complianceData, setComplianceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [dataFetchTimestamp, setDataFetchTimestamp] = useState(null);
  const [departmentConfigs, setDepartmentConfigs] = useState({});
  // State to store custom departments added by users
  const [customDepartments, setCustomDepartments] = useState([]);

  const downloadCSV = useCallback(async (department) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetchData(`/api/v1/ad/fetchMembersAndGroupsByDepartment?department=${department}`, "ComplianceContext",
          "GET",
          null,
          true,
          'blob' 
        );
        
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${department}_compliance_data.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        resolve(); // Resolve the promise when download is complete
      } catch (error) {
        console.error("Error downloading CSV:", error);
        reject(error); // Reject the promise if there's an error
      }
    });
  }, []);

  const fetchComplianceData = useCallback(async (department) => {
    setIsLoading(true);
    try {
      const response = await fetchData(`/api/v1/ad/fetchMembersAndGroupsByDepartment?department=${department}`, "ComplianceContext",
        "GET",
        null,
        true
      );
      console.log('Raw CSV data:', response);
      
      const parsedData = parseCSV(response);
      console.log('Parsed data:', parsedData);
      
      setComplianceData(parsedData);
      setDataFetchTimestamp(new Date().toLocaleString());
    } catch (error) {
      console.error("Error fetching compliance data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper function to parse CSV data
  const parseCSV = (csvString) => {
    const lines = csvString.split('\n');
    const headers = lines[0].split(',').map(header => header.replace(/['"]+/g, '').trim());
    return lines.slice(1).filter(line => line.trim() !== '').map(line => {
      const values = line.split(',').map(value => value.replace(/['"]+/g, '').trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });
  };

  // Mock department configuration data - in a real app, this would be fetched from an API
  const fetchDepartmentConfig = useCallback(async (department) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data or existing data if available
      if (departmentConfigs[department]) {
        return departmentConfigs[department];
      }
      
      // Mock data for demonstration purposes
      const mockConfig = {
        organizationalUnits: [
          { id: '1', name: `${department}-OU-Users` },
          { id: '2', name: `${department}-OU-Admins` }
        ],
        groupCNs: [
          { id: '1', name: `${department}-Users` },
          { id: '2', name: `${department}-Admins` },
          { id: '3', name: `${department}-Readers` }
        ]
      };
      
      // Store the config in state
      setDepartmentConfigs(prev => ({
        ...prev,
        [department]: mockConfig
      }));
      
      return mockConfig;
    } catch (error) {
      console.error("Error fetching department config:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [departmentConfigs]);

  // System options
  const systemOptions = [
    { value: "KZO", label: "KZO System" },
    { value: "CZO", label: "CZO System" },
  ];

  // Department options organized by system
  const departmentsBySystem = {
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
  };
  
  // Get departments for the currently selected system
  const unsortedDepartmentOptions = useMemo(() => {
    if (!selectedSystem) return [];
    return departmentsBySystem[selectedSystem] || [];
  }, [selectedSystem]);

  // Save department configuration
  const saveDepartmentConfig = useCallback(async (department, config) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      // For now, we'll just update our local state
      setDepartmentConfigs(prev => ({
        ...prev,
        [department]: config
      }));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return config;
    } catch (error) {
      console.error("Error saving department config:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a new department
  const addNewDepartment = useCallback(async (departmentName, departmentCode, system) => {
    setIsLoading(true);
    try {
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
      setCustomDepartments(prev => [...prev, newDepartment]);
      
      // Create initial empty configuration for the new department
      const initialConfig = {
        organizationalUnits: [],
        groupCNs: []
      };
      
      // Save the initial configuration
      setDepartmentConfigs(prev => ({
        ...prev,
        [departmentCode]: initialConfig
      }));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newDepartment;
    } catch (error) {
      console.error("Error adding new department:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [customDepartments, departmentsBySystem]);

  const totalCount = 1; // We now only have one row in the main table
  
  const departmentOptions = useMemo(() => {
    // Combine built-in departments with custom departments
    return [...unsortedDepartmentOptions, ...customDepartments].sort((a, b) => {
      const labelA = a.label.split(' ')[0]; // Get the first word of the label
      const labelB = b.label.split(' ')[0];
      return labelA.localeCompare(labelB);
    });
  }, [unsortedDepartmentOptions, customDepartments]);
  
  const value = {
    selectedReviewType,
    setSelectedReviewType,
    // System selection
    selectedSystem,
    setSelectedSystem,
    systemOptions,
    // Department selection
    selectedDepartment,
    setSelectedDepartment,
    complianceData,
    totalCount,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    isLoading,
    fetchComplianceData,
    dataFetchTimestamp,
    downloadCSV,
    // New properties for admin feature
    departmentOptions,
    departmentsBySystem,
    fetchDepartmentConfig,
    saveDepartmentConfig,
    departmentConfigs,
    addNewDepartment,
    customDepartments
  };

  return (
    <ComplianceContext.Provider value={value}>
      {children}
    </ComplianceContext.Provider>
  );
};


