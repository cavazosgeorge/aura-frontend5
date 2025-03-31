import React, { useMemo } from "react";
import {
  Box,
  Card,
  CardBody,
  Text,
  HStack,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";

import CommonTabSelect from "../../Common/CommonTabSelect";
import useComplianceStore from "../../../stores/complianceStore";
import { useComplianceDataQuery, useComplianceCSVDownload } from "../../../hooks/useComplianceQuery";
import ReviewDataPanel from "./ReviewDataPanel";

/**
 * Component for the User Account Review tab
 * Handles review type selection, department selection, and data display
 */
const UserAccountReviewPanel = () => {
  // Get UI state from Zustand store
  const reviewSelectedSystem = useComplianceStore(state => state.selectedSystem);
  const setReviewSelectedSystem = useComplianceStore(state => state.setSelectedSystem);
  const reviewSelectedDepartment = useComplianceStore(state => state.selectedDepartment);
  const setReviewSelectedDepartment = useComplianceStore(state => state.setSelectedDepartment);
  const reviewSelectedType = useComplianceStore(state => state.selectedReviewType);
  const setReviewSelectedType = useComplianceStore(state => state.setSelectedReviewType);
  const departmentConfigs = useComplianceStore(state => state.departmentConfigs);
  const setIsLoading = useComplianceStore(state => state.setIsLoading);
  const setError = useComplianceStore(state => state.setError);
  const setToastMessage = useComplianceStore(state => state.setToastMessage);
  const setSelectedDepartment = useComplianceStore(state => state.setSelectedDepartment);
  
  // Get system options from the department configs
  const systemOptions = useMemo(() => {
    return Object.keys(departmentConfigs);
  }, [departmentConfigs]);
  
  // Get departments by system from the department configs
  const departmentsBySystem = useMemo(() => {
    return departmentConfigs;
  }, [departmentConfigs]);
  
  // Use TanStack Query for data fetching
  const { data: complianceData, isLoading, dataUpdatedAt: dataFetchTimestamp } = 
    useComplianceDataQuery(reviewSelectedDepartment, {
      enabled: !!reviewSelectedDepartment,
      onError: (error) => {
        setError(error);
      }
    });
  
  // Update global loading state
  useMemo(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);
  
  // Use the CSV download hook
  const downloadCSV = useComplianceCSVDownload();
  
  // Use Zustand for downloading state
  const isDownloading = useComplianceStore(state => state.isLoading);

  const toast = useToast();

  // Color mode variables for consistent styling
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.900");
  const tableRowHoverBg = useColorModeValue("gray.50", "gray.700");
  const iconColor = useColorModeValue("blue.500", "blue.300");

  const handleReviewTypeChange = (e) => {
    setReviewSelectedType(e.target.value);
    setReviewSelectedSystem(""); // Reset system when review type changes
    setReviewSelectedDepartment(""); // Reset department when review type changes
  };

  const handleSystemChange = (e) => {
    const system = e.target.value;
    setReviewSelectedSystem(system);
    setReviewSelectedDepartment(""); // Reset department when system changes
  };

  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setReviewSelectedDepartment(department);
    // Update the global selected department in the store
    setSelectedDepartment(department);
    // No need to explicitly fetch data - TanStack Query will handle this
    // when the department changes and the query is enabled
  };

  const handleDownload = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    const MINIMUM_DOWNLOAD_TIME = 3000; // 3 seconds
    
    try {
      await downloadCSV(reviewSelectedDepartment);
      
      // Calculate how long the download took
      const downloadTime = Date.now() - startTime;
      
      // If the download was faster than our minimum time, wait a bit longer
      if (downloadTime < MINIMUM_DOWNLOAD_TIME) {
        await new Promise(resolve => setTimeout(resolve, MINIMUM_DOWNLOAD_TIME - downloadTime));
      }
      
      // Set toast message in Zustand store
      setToastMessage({
        title: "Download complete",
        description: `${reviewSelectedDepartment} compliance data has been downloaded`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // Also show toast directly for immediate feedback
      toast({
        title: "Download complete",
        description: `${reviewSelectedDepartment} compliance data has been downloaded`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Download failed:", error);
      
      // Set error in Zustand store
      setError(error);
      
      // Set toast message in Zustand store
      setToastMessage({
        title: "Download failed",
        description: "There was an error downloading the compliance data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      
      // Also show toast directly for immediate feedback
      toast({
        title: "Download failed",
        description: "There was an error downloading the compliance data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reviewTypeOptions = [
    { value: "Ad Hoc", label: "Ad Hoc Review" },
  ];

  // Get department options for the selected system
  const departmentOptions = useMemo(() => {
    if (!reviewSelectedSystem) return [];
    // Get departments and sort them in ascending order
    const departments = [...(departmentsBySystem[reviewSelectedSystem] || [])];
    return departments.sort((a, b) => a.label.localeCompare(b.label));
  }, [reviewSelectedSystem, departmentsBySystem]);

  return (
    <>
            {/* Selection Controls */}
            <Card 
              variant="outline" 
              mb={6} 
              borderColor={borderColor}
            >
              <CardBody>
                <HStack spacing={4} flexWrap="wrap">
                  <Box flex="1" minW="200px">
                    <Text mb={1} fontWeight="medium" color={textColor}>
                      1. Select Review Type
                    </Text>
                    <CommonTabSelect 
                      primaryOptions={reviewTypeOptions}
                      primaryPlaceholder="Select Review Type"
                      primaryValue={reviewSelectedType}
                      onPrimaryChange={handleReviewTypeChange}
                    />
                  </Box>
                  
                  {reviewSelectedType && (
                    <Box flex="1" minW="200px">
                      <Text mb={1} fontWeight="medium" color={textColor}>
                        2. Select System
                      </Text>
                      <CommonTabSelect 
                        primaryOptions={systemOptions}
                        primaryPlaceholder="Select System"
                        primaryValue={reviewSelectedSystem}
                        onPrimaryChange={handleSystemChange}
                        isLoading={isLoading}
                      />
                    </Box>
                  )}
                  
                  {reviewSelectedSystem && (
                    <Box flex="1" minW="200px">
                      <Text mb={1} fontWeight="medium" color={textColor}>
                        3. Select Department
                      </Text>
                      <CommonTabSelect 
                        primaryOptions={departmentOptions}
                        primaryPlaceholder="Select Department"
                        primaryValue={reviewSelectedDepartment}
                        onPrimaryChange={handleDepartmentChange}
                        isLoading={isLoading}
                      />
                    </Box>
                  )}
                </HStack>
              </CardBody>
            </Card>
            
            {/* Data Display */}
            <ReviewDataPanel
              selectedDepartment={reviewSelectedDepartment}
              dataFetchTimestamp={dataFetchTimestamp}
              isDownloading={isDownloading}
              handleDownload={handleDownload}
            />

    </>
  );
};

export default UserAccountReviewPanel;