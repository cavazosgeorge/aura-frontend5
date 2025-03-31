
import React, { memo, useCallback } from "react";
import {
  Box,
  Text,
  Heading,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  VStack,
  SimpleGrid,
  useToast
} from "@chakra-ui/react";
import useRequestsStore from "../../../../stores/requestsStore";

/**
 * Grid display for access templates
 * Shows templates in a responsive grid layout with 3 cards per row on large screens
 * Uses React.memo and useCallback to prevent unnecessary re-renders
 */
const TemplateGrid = ({ 
  templates = [], 
  borderColor, 
  onEditTemplate = () => {}, // Placeholder for edit handler
}) => {
  const toast = useToast();
  
  // Get selected users and addRequestToCart from the store
  const { selectedUsers = [], addRequestToCart = () => {} } = useRequestsStore();

  // --- Mock Data (Ideally move to a shared utility/context/store) ---
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
  // --- End Mock Data ---

  /**
   * Add all selected users to the cart with all accesses from the template
   * @param {Object} template - The template to use
   */
  const handleUseTemplate = useCallback((template) => {
    if (!selectedUsers || selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user before using a template",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    let requestsAdded = 0;

    // For each selected user, add all accesses from the template to the cart
    selectedUsers.forEach(user => {
      template.accesses.forEach(access => {
        // Find the names corresponding to the IDs stored in the template access
        const systemName = systems.find(s => s.id === access.system)?.name || access.system;
        const areaName = areas.find(a => a.id === access.area)?.name || access.area;
        const roleName = roles.find(r => r.id === access.role)?.name || access.role;
        
        const newRequest = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          user: user.name || user.displayName,
          userId: user.id,
          system: systemName,      // Use looked-up name
          systemId: access.system, // Keep original ID
          area: areaName,          // Use looked-up name
          areaId: access.area,     // Keep original ID
          role: roleName,          // Use looked-up name
          roleId: access.role,     // Keep original ID
          timestamp: new Date().toISOString()
        };
        
        addRequestToCart(newRequest);
        requestsAdded++;
      });
    });

    toast({
      title: "Requests added from template",
      description: `Added ${requestsAdded} request(s) to cart`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }, [selectedUsers, addRequestToCart, toast]);

  if (!templates || templates.length === 0) {
    return null;
  }

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {templates.map((template) => (
          <Card 
            key={template.id}
            variant="outline"
            borderColor={borderColor}
            height="100%"
          >
            <CardBody>
              <Heading size="sm" mb={3}>{template.name}</Heading>
              <VStack spacing={2} align="stretch" mb={3}>
                {template.accesses.map((access) => (
                  <Box 
                    key={access.id}
                    p={2}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={borderColor}
                  >
                    {/* Display looked-up names in the template card as well */}
                    <Text fontSize="sm">
                      {systems.find(s => s.id === access.system)?.name || access.system} - 
                      {areas.find(a => a.id === access.area)?.name || access.area} - 
                      {roles.find(r => r.id === access.role)?.name || access.role}
                    </Text>
                  </Box>
                ))}
              </VStack>
              <ButtonGroup size="sm" variant="outline" spacing="2" mt={3}>
                <Button 
                  colorScheme="green"
                  variant="solid"
                  onClick={() => handleUseTemplate(template)}                
                >
                  Use Template
                </Button>
                <Button 
                  colorScheme="yellow"
                  onClick={() => onEditTemplate(template.id)} // Call the handler
                >
                  Edit
                </Button>
              </ButtonGroup>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default memo(TemplateGrid);
