
import React, { memo, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  Heading,
  Divider,
  useColorModeValue,
  Badge
} from "@chakra-ui/react";
import { FiPlus, FiX } from "react-icons/fi";

/**
 * Template form component for creating and editing access templates.
 * Allows users to create and save access templates
 * Uses React.memo to prevent unnecessary re-renders
 */
const TemplateForm = ({
  templateName,
  setTemplateName,
  templateFormState,
  handleTemplateFormChange,
  templateAccesses,
  setTemplateAccesses,
  handleAddAccess,
  handleSaveTemplate,
  setTemplateFormState,
  isEditing = false,
  initialName = '',
  initialAccesses = [],
  onCancel = () => {}
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("gray.50", "gray.700");

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
  const filteredAreas = templateFormState.system 
    ? areas.filter(area => area.systemId === templateFormState.system)
    : [];
  
  // Filter roles based on selected area
  const filteredRoles = templateFormState.area
    ? roles.filter(role => role.areaId === templateFormState.area)
    : [];

  // Helper function to get name from ID
  const getSystemName = (id) => systems.find(s => s.id === id)?.name || id;
  const getAreaName = (id) => areas.find(a => a.id === id)?.name || id;
  const getRoleName = (id) => roles.find(r => r.id === id)?.name || id;

  // Remove an access from template
  const handleRemoveAccess = (accessId) => {
    setTemplateAccesses(prev => prev.filter(access => access.id !== accessId));
  };

  // Effect to populate form when editing starts
  useEffect(() => {
    if (isEditing) {
      setTemplateName(initialName || '');
      setTemplateAccesses(initialAccesses || []);
      // Reset the dropdowns as well
      setTemplateFormState(prev => ({ ...prev, system: '', area: '', role: '' }));
    }
    // Intentionally not resetting on isEditing changing back to false
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [isEditing, initialName, initialAccesses, setTemplateName, setTemplateAccesses, setTemplateFormState]);

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <FormControl id="templateName" isRequired>
          <FormLabel>Template Name</FormLabel>
          <Input
            placeholder="Enter template name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </FormControl>

        <Divider my={2} />
        
        <Heading size="sm" mb={2}>Add Access</Heading>
        
        <FormControl id="system" isRequired>
          <FormLabel>System</FormLabel>
          <Select
            placeholder="Select system"
            value={templateFormState.system}
            onChange={(e) => handleTemplateFormChange('system', e.target.value)}
          >
            {systems.map(system => (
              <option key={system.id} value={system.id}>
                {system.name}
              </option>
            ))}
          </Select>
        </FormControl>
        
        {templateFormState.system && (
          <FormControl id="area" isRequired>
            <FormLabel>Area</FormLabel>
            <Select
              placeholder="Select area"
              value={templateFormState.area}
              onChange={(e) => handleTemplateFormChange('area', e.target.value)}
            >
              {filteredAreas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
        
        {templateFormState.area && (
          <FormControl id="role" isRequired>
            <FormLabel>Role</FormLabel>
            <Select
              placeholder="Select role"
              value={templateFormState.role}
              onChange={(e) => handleTemplateFormChange('role', e.target.value)}
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
          leftIcon={<FiPlus />}
          colorScheme="blue"
          variant="outline"
          onClick={handleAddAccess}
          isDisabled={!templateFormState.system || !templateFormState.area || !templateFormState.role}
        >
          Add Access
        </Button>
        
        {templateAccesses.length > 0 && (
          <Box mt={4}>
            <Heading size="sm" mb={2}>Template Accesses</Heading>
            <VStack spacing={2} align="stretch">
              {templateAccesses.map(access => (
                <HStack 
                  key={access.id}
                  p={2}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor={borderColor}
                  bg={bgColor}
                  justify="space-between"
                >
                  <Text fontSize="sm">
                    {getSystemName(access.system)} - {getAreaName(access.area)} - {getRoleName(access.role)}
                  </Text>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleRemoveAccess(access.id)}
                  >
                    <FiX />
                  </Button>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}
        
        <HStack spacing={4} mt={4}>
          <Button
            colorScheme={isEditing ? "blue" : "teal"}
            onClick={handleSaveTemplate}
            isDisabled={!templateName || templateAccesses.length === 0}
          >
            {isEditing ? "Update Template" : "Save Template"}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default memo(TemplateForm);
