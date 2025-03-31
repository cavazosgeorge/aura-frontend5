import React from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Flex,
  Text,
  Button,
  Select,
  Icon,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import { FiPlusCircle } from "react-icons/fi";
import useComplianceStore from "../../../../stores/complianceStore";
import CommonTabSelect from "../../../Common/CommonTabSelect";

/**
 * Component for selecting system and department in the Compliance Admin panel
 */
const SystemDepartmentSelector = ({ onAddDepartmentClick }) => {
  // Get state and actions from Zustand store
  const systemOptions = useComplianceStore(state => state.systemOptions);
  const selectedSystem = useComplianceStore(state => state.selectedSystem);
  const setSelectedSystem = useComplianceStore(state => state.setSelectedSystem);
  const selectedDepartment = useComplianceStore(state => state.selectedDepartment);
  const setSelectedDepartment = useComplianceStore(state => state.setSelectedDepartment);
  const getDepartmentOptions = useComplianceStore(state => state.getDepartmentOptions);
  
  // Local UI state
  const departmentOptions = getDepartmentOptions();
  const isLoading = useComplianceStore(state => state.isLoading);

  // Color mode variables for consistent styling
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");

  // Handle system selection
  const handleSystemChange = (e) => {
    const system = e.target.value;
    setSelectedSystem(system);
    // Reset department selection when system changes
    setSelectedDepartment("");
  };

  // Handle department selection
  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);
  };

  return (
    <Card 
      variant="outline" 
      mb={6} 
      borderColor={borderColor}
    >
      <CardHeader>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="sm" color={textColor}>System & Department Configuration</Heading>
          <Button
            leftIcon={<Icon as={FiPlusCircle} />}
            colorScheme="green"
            size="sm"
            onClick={onAddDepartmentClick}
            isDisabled={!selectedSystem}
          >
            Add Department
          </Button>
        </Flex>
      </CardHeader>
      <CardBody pt={0}>
        <VStack spacing={4} align="stretch">
          {/* System Selection */}
          <Box>
            <Text mb={2} fontWeight="medium" color={textColor}>Select System</Text>
            <Select
              value={selectedSystem}
              onChange={handleSystemChange}
              placeholder="Select System"
              isDisabled={isLoading}
            >
              {systemOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Box>
          
          {/* Department Selection - Only show when a system is selected */}
          {selectedSystem && (
            <Box>
              <Text mb={2} fontWeight="medium" color={textColor}>Select Department</Text>
              <CommonTabSelect 
                primaryOptions={departmentOptions}
                primaryPlaceholder="Select Department"
                primaryValue={selectedDepartment}
                onPrimaryChange={handleDepartmentChange}
                isLoading={isLoading}
              />
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default SystemDepartmentSelector;