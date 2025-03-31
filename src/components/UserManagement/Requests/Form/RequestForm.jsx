import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  VStack,
  Heading,
  Text,
  useToast,
  HStack,
  Badge,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';

/**
 * Optimized RequestForm component
 * Uses React.memo, useCallback, and useMemo to prevent unnecessary re-renders
 * 
 * @param {Object} props Component props
 * @param {Array} props.selectedUsers Currently selected users
 * @param {Function} props.onAddToCart Callback to add request to cart
 */
const RequestForm = ({ selectedUsers = [], onAddToCart = () => {} }) => {
  const toast = useToast();
  
  // Form state
  const [formState, setFormState] = useState({
    system: '',
    area: '',
    role: ''
  });
  
  // Color mode values
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  
  // Mock data for dropdowns
  const systems = useMemo(() => [
    { id: 'sys1', name: 'SAP' },
    { id: 'sys2', name: 'Oracle' },
    { id: 'sys3', name: 'Salesforce' },
    { id: 'sys4', name: 'Workday' },
    { id: 'sys5', name: 'ServiceNow' }
  ], []);
  
  const areas = useMemo(() => [
    { id: 'area1', name: 'Finance', systemId: 'sys1' },
    { id: 'area2', name: 'HR', systemId: 'sys1' },
    { id: 'area3', name: 'Procurement', systemId: 'sys1' },
    { id: 'area4', name: 'CRM', systemId: 'sys3' },
    { id: 'area5', name: 'ITSM', systemId: 'sys5' },
    { id: 'area6', name: 'HCM', systemId: 'sys4' },
    { id: 'area7', name: 'ERP', systemId: 'sys2' }
  ], []);
  
  const roles = useMemo(() => [
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
  ], []);
  
  // Filtered areas based on selected system
  const filteredAreas = useMemo(() => {
    if (!formState.system) return [];
    return areas.filter(area => area.systemId === formState.system);
  }, [areas, formState.system]);
  
  // Filtered roles based on selected area
  const filteredRoles = useMemo(() => {
    if (!formState.area) return [];
    return roles.filter(role => role.areaId === formState.area);
  }, [roles, formState.area]);
  
  // Handle form field changes
  const handleFormChange = useCallback((field, value) => {
    setFormState(prev => {
      const newState = { ...prev, [field]: value };
      
      // Reset dependent fields
      if (field === 'system') {
        newState.area = '';
        newState.role = '';
      } else if (field === 'area') {
        newState.role = '';
      }
      
      return newState;
    });
  }, []);
  
  // Handle adding request to cart
  const handleAddToCart = useCallback(() => {
    if (!formState.system || !formState.area || !formState.role) {
      toast({
        title: 'Missing information',
        description: 'Please select system, area, and role',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (selectedUsers.length === 0) {
      toast({
        title: 'No users selected',
        description: 'Please select at least one user',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Find selected system, area and role names
    const selectedSystem = systems.find(s => s.id === formState.system)?.name || '';
    const selectedArea = areas.find(a => a.id === formState.area)?.name || '';
    const selectedRole = roles.find(r => r.id === formState.role)?.name || '';
    
    // Add request for each selected user
    let requestsAdded = 0;
    selectedUsers.forEach(user => {
      const newRequest = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        user: user.name,
        userId: user.id,
        system: selectedSystem,
        systemId: formState.system,
        area: selectedArea,
        areaId: formState.area,
        role: selectedRole,
        roleId: formState.role,
        timestamp: new Date().toISOString()
      };
      
      onAddToCart(newRequest);
      requestsAdded++;
    });
    
    toast({
      title: 'Request added',
      description: `Added ${requestsAdded} request(s) to cart`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    // Reset form
    setFormState({
      system: '',
      area: '',
      role: ''
    });
  }, [formState, selectedUsers, onAddToCart, toast, systems, areas, roles]);
  
  return (
    <Box>
      <Heading size="md" mb={4}>Request Access</Heading>
      
      {selectedUsers.length > 0 ? (
        <Box mb={4} p={3} borderWidth="1px" borderRadius="md" bg={bgColor}>
          <Text fontWeight="medium">Selected Users:</Text>
          <HStack mt={2} flexWrap="wrap">
            {selectedUsers.map(user => (
              <Badge key={user.id} colorScheme="blue" py={1} px={2} borderRadius="md">
                {user.name}
              </Badge>
            ))}
          </HStack>
        </Box>
      ) : (
        <Box mb={4} p={3} borderWidth="1px" borderRadius="md" bg={bgColor}>
          <Text color="gray.500">No users selected. Please select users from the left panel.</Text>
        </Box>
      )}
      
      <Divider my={4} />
      
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
        
        <FormControl id="area" isRequired isDisabled={!formState.system}>
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
        
        <FormControl id="role" isRequired isDisabled={!formState.area}>
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
        
        <Button
          colorScheme="blue"
          size="md"
          onClick={handleAddToCart}
          isDisabled={selectedUsers.length === 0}
          mt={2}
        >
          Add to Cart
        </Button>
      </VStack>
    </Box>
  );
};

export default React.memo(RequestForm);