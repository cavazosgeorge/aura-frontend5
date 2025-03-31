
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Container,
  Heading,
  useToast,
  Box,
  Flex,
  Text,
  Icon, // Import Icon component
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  useColorModeValue
} from "@chakra-ui/react";

// Import components
import UserSearch from "./Search/UserSearch";
import { RequestAccessPanel, TemplatesPanel } from "./Form";
import RequestCart from "./Cart/RequestCart";
import CommonTabHeader from "../../Common/CommonTabHeader";

// Import icons
import { FiUserPlus, FiGrid } from 'react-icons/fi'; 

// Import hooks and utilities
import useAuthStore from "../../../stores/authStore";
import useRequestsStore from "../../../stores/requestsStore";

/**
 * Optimized container component for the Requests feature
 * Uses React hooks like useCallback and useMemo to prevent unnecessary re-renders
 * Focuses on performance optimization
 */
const RequestsContainer = () => {
  const authUser = useAuthStore(state => state.user);
  const toast = useToast();
  const [tabIndex, setTabIndex] = useState(0);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateAccesses, setTemplateAccesses] = useState([]);
  const [editingTemplateId, setEditingTemplateId] = useState(null); // State for editing
  
  // Form state for Request Access Panel
  const [formState, setFormState] = useState({
    system: "",
    area: "",
    role: ""
  });
  
  // Form state for Template Form selects
  const [templateFormState, setTemplateFormState] = useState({
    system: "",
    area: "",
    role: ""
  });
  
  // Color mode values
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");
  
  // Get state and actions from Zustand store
  const {
    selectedUsers = [],
    addSelectedUser = () => {},
    removeSelectedUser = () => {},
    setActiveUser = () => {},
    addRequestToCart = () => {},
    cartItems = [],
    removeFromCart = () => {},
    clearCart = () => {},
    submitRequests = () => {},
    templates = [],
    saveTemplate = () => {},
    updateTemplate = () => {}
  } = useRequestsStore() || {};
  
  // Memoized handler for adding current user to selected users
  const handleRequestForMyself = useCallback(() => {
    if (authUser) {
      const userObj = {
        id: authUser.id || 'current-user',
        name: authUser.displayName || 'Current User',
        email: authUser.mail || 'user@example.com',
      };
      
      addSelectedUser(userObj);
      
      toast({
        title: "Added yourself",
        description: "You have been added to the selected users",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [authUser, addSelectedUser, toast]);
  
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
  
  // Handle Template Form select field changes
  const handleTemplateFormChange = useCallback((field, value) => {
    setTemplateFormState(prev => {
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
      
      addRequestToCart(newRequest);
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
  }, [formState, selectedUsers, addRequestToCart, toast]);
  
  // Handle adding access to template
  const handleAddAccess = useCallback(() => {
    if (!templateFormState.system || !templateFormState.area || !templateFormState.role) {
      toast({
        title: 'Missing information',
        description: 'Please select system, area, and role',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const newAccess = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      system: templateFormState.system,
      area: templateFormState.area,
      role: templateFormState.role
    };
    
    setTemplateAccesses(prev => [...prev, newAccess]);
    
    // Reset area and role but keep system
    setTemplateFormState(prev => ({
      ...prev,
      area: '',
      role: ''
    }));
    
    toast({
      title: 'Access added',
      description: `Access added to template`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  }, [templateFormState, toast]);
  
  // Handle saving a template
  const handleSaveTemplate = useCallback(() => {
    if (!templateName) {
      toast({
        title: 'Missing template name',
        description: 'Please enter a name for your template',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (templateAccesses.length === 0) {
      toast({
        title: 'No access defined',
        description: 'Please add at least one access to your template',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (editingTemplateId) {
      const success = updateTemplate(editingTemplateId, templateName, templateAccesses);
      if (success) {
        toast({
          title: 'Template updated',
          description: `Template "${templateName}" has been updated`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error updating template',
          description: 'An error occurred while updating the template',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      const success = saveTemplate(templateName, templateAccesses);
      if (success) {
        toast({
          title: 'Template saved',
          description: `Template "${templateName}" has been saved`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error saving template',
          description: 'An error occurred while saving the template',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
    
    // Reset template form
    setTemplateName('');
    setTemplateAccesses([]);
    setShowTemplateForm(false);
    setEditingTemplateId(null);
    setTemplateFormState({ system: '', area: '', role: '' });
  }, [templateName, templateAccesses, saveTemplate, updateTemplate, editingTemplateId, toast]);
  
  // Function to initiate editing a template
  const handleEditTemplateStart = useCallback((templateId) => {
    const templateToEdit = templates.find(t => t.id === templateId);
    if (templateToEdit) {
      setEditingTemplateId(templateId);
      setTemplateName(templateToEdit.name);
      setTemplateAccesses(templateToEdit.accesses);
      setShowTemplateForm(true);
      setTabIndex(1); // Switch to Templates tab if not already there
      setTemplateFormState({ system: '', area: '', role: '' });
    } else {
      toast({
        title: "Error",
        description: "Template not found.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [templates, toast, setTabIndex]);
  
  // Function to cancel editing
  const handleCancelEdit = useCallback(() => {
    setEditingTemplateId(null);
    setTemplateName('');
    setTemplateAccesses([]);
    setShowTemplateForm(false);
    setTemplateFormState({ system: '', area: '', role: '' });
  }, []);
  
  // UseEffect to load templates from store or mock data
  useEffect(() => {
    // Example: Load templates if needed (replace with actual logic)
  }, []);
  
  return (
    <Container maxW="container.xl" py={4}>
      <CommonTabHeader 
        title="Access Requests" 
        subtitle="Request access for yourself or others"
      />
      
      {/* User Search - Moved outside of the tabs */}
      <Box mt={6} mb={4}>
        <UserSearch 
          onSelectUser={addSelectedUser}
          selectedUsers={selectedUsers || []}
          onRemoveUser={removeSelectedUser}
          onRequestForMyself={handleRequestForMyself}
          currentUserId={authUser?.id}
        />
      </Box>
      
      {/* Main Content Tabs */}
      <Box 
        borderWidth="1px" 
        borderRadius="lg" 
        borderColor={borderColor}
        bg={bgColor}
        overflow="hidden"
        boxShadow="sm"
      >
        <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed"> {/* Revert variant */}
          <TabList>
            <Tab>
              <Flex align="center">
                {/* Conditionally color the icon */}
                <Icon as={FiUserPlus} mr={2} color={tabIndex === 0 ? 'blue.500' : 'inherit'} />
                Request Access
              </Flex>
            </Tab>
            <Tab>
              <Flex align="center">
                {/* Conditionally color the icon */}
                <Icon as={FiGrid} mr={2} color={tabIndex === 1 ? 'blue.500' : 'inherit'} />
                Templates
              </Flex>
            </Tab>
          </TabList>
          
          <TabPanels>
            {/* Request Access Tab */}
            <TabPanel p={4}>
              <RequestAccessPanel
                formState={formState}
                handleFormChange={handleFormChange}
                handleAddToCart={handleAddToCart}
              />
            </TabPanel>
            
            {/* Templates Tab */}
            <TabPanel p={4}>
              <TemplatesPanel
                showTemplateForm={showTemplateForm}
                setShowTemplateForm={setShowTemplateForm}
                templateName={templateName}
                setTemplateName={setTemplateName}
                templateFormState={templateFormState}
                handleTemplateFormChange={handleTemplateFormChange}
                templateAccesses={templateAccesses}
                setTemplateAccesses={setTemplateAccesses}
                handleAddAccess={handleAddAccess}
                handleSaveTemplate={handleSaveTemplate}
                templates={templates}
                setTemplateFormState={setTemplateFormState}
                onEditTemplate={handleEditTemplateStart} // Pass down edit handler
                editingTemplateId={editingTemplateId} // Pass down edit state
                onCancelEdit={handleCancelEdit} // Pass down cancel handler
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      
      {/* Request Cart - displayed below the tabs */}
      <Box mt={6}>
        <RequestCart 
          cartItems={cartItems || []}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onSubmit={submitRequests}
        />
      </Box>
    </Container>
  );
};

export default RequestsContainer;
