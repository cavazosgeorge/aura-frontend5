import React, { useState, useEffect } from "react";
import { Box, useDisclosure, useToast } from "@chakra-ui/react";
import useComplianceStore from "../../../../stores/complianceStore";

// Import our refactored components
import { 
  SystemDepartmentSelector, 
  OrganizationalUnitsTable, 
  GroupCNsTable 
} from './index';

// Import our modal components
import { 
  OrganizationalUnitModal, 
  GroupCNModal, 
  DepartmentModal 
} from './Modals';

// Import utility functions
import { saveDepartmentConfig } from './utils';

/**
 * Component for the Compliance Admin panel
 * Allows department admins to manage OUs and Group CNs
 */
const ComplianceAdminPanel = () => {
  // Get state and actions from Zustand store
  const systemOptions = useComplianceStore(state => state.systemOptions);
  const selectedSystem = useComplianceStore(state => state.selectedSystem);
  const selectedDepartment = useComplianceStore(state => state.selectedDepartment);
  const departmentConfigs = useComplianceStore(state => state.departmentConfigs);
  const updateDepartmentConfig = useComplianceStore(state => state.setDepartmentConfig);
  const addNewDepartment = useComplianceStore(state => state.addNewDepartment);
  
  // Local UI state
  const [isLoading, setIsLoading] = useState(false);
  const [departmentConfig, setDepartmentConfig] = useState({
    organizationalUnits: [],
    groupCNs: []
  });
  
  // State for editing OUs and CNs
  const [editingOU, setEditingOU] = useState(null);
  const [editingCN, setEditingCN] = useState(null);
  const [newOUName, setNewOUName] = useState("");
  const [newCNName, setNewCNName] = useState("");
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentCode, setNewDepartmentCode] = useState("");
  
  // Modal disclosures
  const { 
    isOpen: isOUModalOpen, 
    onOpen: onOUModalOpen, 
    onClose: onOUModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isCNModalOpen, 
    onOpen: onCNModalOpen, 
    onClose: onCNModalClose 
  } = useDisclosure();

  const {
    isOpen: isDepartmentModalOpen,
    onOpen: onDepartmentModalOpen,
    onClose: onDepartmentModalClose
  } = useDisclosure();

  const toast = useToast();

  // Load department configuration when department changes
  useEffect(() => {
    if (selectedDepartment) {
      // Get the config from the store
      const config = departmentConfigs[selectedDepartment] || {
        organizationalUnits: [],
        groupCNs: []
      };
      setDepartmentConfig(config);
    } else {
      // Reset department config when no department is selected
      setDepartmentConfig({
        organizationalUnits: [],
        groupCNs: []
      });
    }
  }, [selectedDepartment, departmentConfigs]);

  // Handle creating a new department
  const handleAddDepartment = () => {
    if (!newDepartmentCode.trim() || !newDepartmentName.trim()) {
      toast({
        title: "Error",
        description: "Department code and name are required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!selectedSystem) {
      toast({
        title: "Error",
        description: "Please select a system first",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      addNewDepartment(newDepartmentName.trim(), newDepartmentCode.trim(), selectedSystem);
      
      // Reset form fields
      setNewDepartmentName("");
      setNewDepartmentCode("");
      onDepartmentModalClose();
      
      // Show success message
      toast({
        title: "Success",
        description: `Department '${newDepartmentName}' added successfully to ${selectedSystem} system`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add department",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add new OU
  const handleAddOU = () => {
    if (!newOUName.trim()) {
      toast({
        title: "Error",
        description: "Organizational Unit name cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const updatedConfig = {
      ...departmentConfig,
      organizationalUnits: [
        ...departmentConfig.organizationalUnits,
        { id: Date.now().toString(), name: newOUName.trim() }
      ]
    };

    saveDepartmentConfig(selectedDepartment, updatedConfig, updateDepartmentConfig)
      .then(() => {
        setDepartmentConfig(updatedConfig);
        setNewOUName("");
        onOUModalClose();
        toast({
          title: "Success",
          description: "Organizational Unit added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(error => {
        console.error("Error saving department config:", error);
        toast({
          title: "Error",
          description: "Failed to add Organizational Unit",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Edit OU
  const handleEditOU = (ou) => {
    setEditingOU(ou);
    setNewOUName(ou.name);
    onOUModalOpen();
  };

  // Save edited OU
  const handleSaveOU = () => {
    if (!newOUName.trim()) {
      toast({
        title: "Error",
        description: "Organizational Unit name cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const updatedConfig = {
      ...departmentConfig,
      organizationalUnits: departmentConfig.organizationalUnits.map(ou => 
        ou.id === editingOU.id ? { ...ou, name: newOUName.trim() } : ou
      )
    };

    saveDepartmentConfig(selectedDepartment, updatedConfig, updateDepartmentConfig)
      .then(() => {
        setDepartmentConfig(updatedConfig);
        setEditingOU(null);
        setNewOUName("");
        onOUModalClose();
        toast({
          title: "Success",
          description: "Organizational Unit updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(error => {
        console.error("Error saving department config:", error);
        toast({
          title: "Error",
          description: "Failed to update Organizational Unit",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Delete OU
  const handleDeleteOU = (ouId) => {
    const updatedConfig = {
      ...departmentConfig,
      organizationalUnits: departmentConfig.organizationalUnits.filter(ou => ou.id !== ouId)
    };

    saveDepartmentConfig(selectedDepartment, updatedConfig, updateDepartmentConfig)
      .then(() => {
        setDepartmentConfig(updatedConfig);
        toast({
          title: "Success",
          description: "Organizational Unit deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(error => {
        console.error("Error saving department config:", error);
        toast({
          title: "Error",
          description: "Failed to delete Organizational Unit",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Add new CN
  const handleAddCN = () => {
    if (!newCNName.trim()) {
      toast({
        title: "Error",
        description: "Group CN name cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const updatedConfig = {
      ...departmentConfig,
      groupCNs: [
        ...departmentConfig.groupCNs,
        { id: Date.now().toString(), name: newCNName.trim() }
      ]
    };

    saveDepartmentConfig(selectedDepartment, updatedConfig, updateDepartmentConfig)
      .then(() => {
        setDepartmentConfig(updatedConfig);
        setNewCNName("");
        onCNModalClose();
        toast({
          title: "Success",
          description: "Group CN added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(error => {
        console.error("Error saving department config:", error);
        toast({
          title: "Error",
          description: "Failed to add Group CN",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Edit CN
  const handleEditCN = (cn) => {
    setEditingCN(cn);
    setNewCNName(cn.name);
    onCNModalOpen();
  };

  // Save edited CN
  const handleSaveCN = () => {
    if (!newCNName.trim()) {
      toast({
        title: "Error",
        description: "Group CN name cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const updatedConfig = {
      ...departmentConfig,
      groupCNs: departmentConfig.groupCNs.map(cn => 
        cn.id === editingCN.id ? { ...cn, name: newCNName.trim() } : cn
      )
    };

    saveDepartmentConfig(selectedDepartment, updatedConfig, updateDepartmentConfig)
      .then(() => {
        setDepartmentConfig(updatedConfig);
        setEditingCN(null);
        setNewCNName("");
        onCNModalClose();
        toast({
          title: "Success",
          description: "Group CN updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(error => {
        console.error("Error saving department config:", error);
        toast({
          title: "Error",
          description: "Failed to update Group CN",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Delete CN
  const handleDeleteCN = (cnId) => {
    const updatedConfig = {
      ...departmentConfig,
      groupCNs: departmentConfig.groupCNs.filter(cn => cn.id !== cnId)
    };

    saveDepartmentConfig(selectedDepartment, updatedConfig, updateDepartmentConfig)
      .then(() => {
        setDepartmentConfig(updatedConfig);
        toast({
          title: "Success",
          description: "Group CN deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(error => {
        console.error("Error saving department config:", error);
        toast({
          title: "Error",
          description: "Failed to delete Group CN",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Handle opening the department modal
  const handleOpenDepartmentModal = () => {
    setNewDepartmentName("");
    setNewDepartmentCode("");
    onDepartmentModalOpen();
  };

  // Handle opening the OU modal for adding
  const handleOpenOUModal = () => {
    setEditingOU(null);
    setNewOUName("");
    onOUModalOpen();
  };

  // Handle opening the CN modal for adding
  const handleOpenCNModal = () => {
    setEditingCN(null);
    setNewCNName("");
    onCNModalOpen();
  };

  return (
    <Box>
      {/* System and Department Selection */}
      <SystemDepartmentSelector onAddDepartmentClick={handleOpenDepartmentModal} />
      
      {/* Organizational Units Table */}
      <OrganizationalUnitsTable 
        selectedDepartment={selectedDepartment}
        departmentConfig={departmentConfig}
        onAddClick={handleOpenOUModal}
        onEditClick={handleEditOU}
        onDeleteClick={handleDeleteOU}
      />
      
      {/* Group CNs Table */}
      <GroupCNsTable 
        selectedDepartment={selectedDepartment}
        departmentConfig={departmentConfig}
        onAddClick={handleOpenCNModal}
        onEditClick={handleEditCN}
        onDeleteClick={handleDeleteCN}
      />
      
      {/* OU Modal */}
      <OrganizationalUnitModal 
        isOpen={isOUModalOpen}
        onClose={onOUModalClose}
        editingOU={editingOU}
        ouName={newOUName}
        setOUName={setNewOUName}
        onSave={editingOU ? handleSaveOU : handleAddOU}
      />
      
      {/* CN Modal */}
      <GroupCNModal 
        isOpen={isCNModalOpen}
        onClose={onCNModalClose}
        editingCN={editingCN}
        cnName={newCNName}
        setCNName={setNewCNName}
        onSave={editingCN ? handleSaveCN : handleAddCN}
      />
      
      {/* Department Modal */}
      <DepartmentModal 
        isOpen={isDepartmentModalOpen}
        onClose={onDepartmentModalClose}
        selectedSystem={selectedSystem}
        systemLabel={selectedSystem ? systemOptions.find(s => s.value === selectedSystem)?.label : ""}
        departmentName={newDepartmentName}
        setDepartmentName={setNewDepartmentName}
        departmentCode={newDepartmentCode}
        setDepartmentCode={setNewDepartmentCode}
        onSave={handleAddDepartment}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default ComplianceAdminPanel;