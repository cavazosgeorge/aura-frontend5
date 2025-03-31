// src/hooks/useComplianceQuery.js
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook for fetching compliance data using TanStack Query
 * This separates server-side data fetching from client-side state management
 * Works alongside useComplianceStore for complete compliance functionality
 * 
 * @param {string} department - The department to fetch compliance data for
 * @param {Object} options - Additional options for the query
 * @returns {Object} - TanStack Query result object
 */
export const useComplianceDataQuery = (department, options = {}) => {
  return useQuery({
    queryKey: ['complianceData', department],
    queryFn: async () => {
      if (!department) {
        return [];
      }
      
      const response = await fetch(`/api/v1/ad/fetchMembersAndGroupsByDepartment?department=${department}`);
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    },
    enabled: !!department,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options
  });
};

/**
 * Custom hook for downloading compliance CSV data
 * Returns a function that can be called to download the CSV
 * 
 * @returns {Function} - Function to download CSV for a department
 */
export const useComplianceCSVDownload = () => {
  const downloadCSV = async (department) => {
    try {
      const response = await fetch(
        `/api/v1/ad/fetchMembersAndGroupsByDepartment?department=${department}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'text/csv',
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${department}_compliance_data.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    } catch (error) {
      console.error("Error downloading CSV:", error);
      return false;
    }
  };

  return downloadCSV;
};

/**
 * Example usage in a component:
 * 
 * import useComplianceStore from '../stores/complianceStore';
 * import { useComplianceDataQuery, useComplianceCSVDownload } from '../hooks/useComplianceQuery';
 * 
 * function ComplianceTable() {
 *   // Get client-side state from Zustand
 *   const selectedDepartment = useComplianceStore(state => state.selectedDepartment);
 *   const setSelectedDepartment = useComplianceStore(state => state.setSelectedDepartment);
 *   const currentPage = useComplianceStore(state => state.currentPage);
 *   const setCurrentPage = useComplianceStore(state => state.setCurrentPage);
 *   
 *   // Fetch data with TanStack Query
 *   const { data: complianceData, isLoading } = useComplianceDataQuery(selectedDepartment);
 *   
 *   // Get CSV download function
 *   const downloadCSV = useComplianceCSVDownload();
 *   
 *   const handleDownload = async () => {
 *     const success = await downloadCSV(selectedDepartment);
 *     if (success) {
 *       toast({
 *         title: "Download successful",
 *         status: "success",
 *         duration: 3000,
 *         isClosable: true,
 *       });
 *     } else {
 *       toast({
 *         title: "Download failed",
 *         status: "error",
 *         duration: 3000,
 *         isClosable: true,
 *       });
 *     }
 *   };
 *   
 *   // ... rest of component
 * }
 */