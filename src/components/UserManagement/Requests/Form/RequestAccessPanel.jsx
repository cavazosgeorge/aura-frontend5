
import React, { memo } from "react";
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Select,
  Button,
  useColorModeValue
} from "@chakra-ui/react";

/**
 * RequestAccessPanel component for the Requests2 feature
 * Displays the form for requesting access
 * Uses React.memo to prevent unnecessary re-renders
 */
const RequestAccessPanel = ({ formState, handleFormChange, handleAddToCart }) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Mock data for dropdowns
  const systems = [
    { id: 'sys1', name: 'SAP' },
    { id: 'sys2', name: 'Oracle' },
    { id: 'sys3', name: 'Salesforce' },
    { id: 'sys4', name: 'Workday' },
    { id: 'sys5', name: 'ServiceNow' }
  ];
  
  const areas = [
    { id: 'area1', name: 'Finance', systemId: 'sys1' },
    { id: 'area2', name: 'HR', systemId: 'sys1' },
    { id: 'area3', name: 'Procurement', systemId: 'sys1' },
    { id: 'area4', name: 'CRM', systemId: 'sys3' },
    { id: 'area5', name: 'ITSM', systemId: 'sys5' },
    { id: 'area6', name: 'HCM', systemId: 'sys4' },
    { id: 'area7', name: 'ERP', systemId: 'sys2' }
  ];
  
  const roles = [
    { id: 'role1', name: 'Viewer', areaId: 'area1' },
    { id: 'role2', name: 'Editor', areaId: 'area1' },
    { id: 'role3', name: 'Admin', areaId: 'area1' },
    { id: 'role4', name: 'Approver', areaId: 'area1' },
    { id: 'role5', name: 'Viewer', areaId: 'area2' },
    { id: 'role6', name: 'Editor', areaId: 'area2' },
    { id: 'role7', name: 'Viewer', areaId: 'area3' },
    { id: 'role8', name: 'Editor', areaId: 'area3' },
    { id: 'role9', name: 'Admin', areaId: 'area3' },
    { id: 'role10', name: 'Viewer', areaId: 'area4' },
    { id: 'role11', name: 'Admin', areaId: 'area4' },
    { id: 'role12', name: 'Viewer', areaId: 'area5' },
    { id: 'role13', name: 'Admin', areaId: 'area5' },
    { id: 'role14', name: 'Viewer', areaId: 'area6' },
    { id: 'role15', name: 'Editor', areaId: 'area6' },
    { id: 'role16', name: 'Viewer', areaId: 'area7' },
    { id: 'role17', name: 'Editor', areaId: 'area7' },
    { id: 'role18', name: 'Admin', areaId: 'area7' }
  ];

  // Filter areas based on selected system
  const filteredAreas = formState.system 
    ? areas.filter(area => area.systemId === formState.system)
    : [];
  
  // Filter roles based on selected area
  const filteredRoles = formState.area
    ? roles.filter(role => role.areaId === formState.area)
    : [];

  return (
    <Box p={6}>
      <VStack spacing={4} align="stretch">
        <FormControl id="system" isRequired>
          <FormLabel>System</FormLabel>
          <Select
            placeholder="Select system"
            value={formState.system}
            onChange={(e) => handleFormChange('system', e.target.value)}
          >
            {systems.map(system => (
              <option key={system.id} value={system.id}>
                {system.name}
              </option>
            ))}
          </Select>
        </FormControl>
        
        {formState.system && (
          <FormControl id="area" isRequired>
            <FormLabel>Area</FormLabel>
            <Select
              placeholder="Select area"
              value={formState.area}
              onChange={(e) => handleFormChange('area', e.target.value)}
            >
              {filteredAreas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
        
        {formState.area && (
          <FormControl id="role" isRequired>
            <FormLabel>Role</FormLabel>
            <Select
              placeholder="Select role"
              value={formState.role}
              onChange={(e) => handleFormChange('role', e.target.value)}
            >
              {filteredRoles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
        
        <Button
          colorScheme="blue"
          onClick={handleAddToCart}
          mt={2}
          isDisabled={!formState.system || !formState.area || !formState.role}
        >
          Add to Cart
        </Button>
      </VStack>
    </Box>
  );
};

export default memo(RequestAccessPanel);
