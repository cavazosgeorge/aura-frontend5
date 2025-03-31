import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Card,
  CardBody,
  TabPanel,
  Alert,
  AlertIcon,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { GroupContext } from "../../../contexts/GroupContext";

import CommonTabHeader from "../../Common/CommonTabHeader";

// Import our modular components
import { GroupMembersTable, HierarchySelector, PendingGroupSelection, DisplayedGroupInfo } from "./Groups";
import { UsersTable } from "./Users";
import EmptyStates from "./EmptyStates";
import LookupTabs from "./LookupTabs";
import { UserGroupsModal, ComparisonModal } from "./Modals";

const Lookup = ({ 
  // Search functionality
  lookupSearch, 
  
  // Tab handling
  handleTabChange,
  
  // User comparison functionality
  selectedUsersForComparison,
  setSelectedUsersForComparison,
  isComparisonModalOpen,
  compareSelectedUsers,
  handleCloseComparisonModal,
  
  // Sorting functionality
  sortField,
  sortDirection,
  handleSortChange,
  
  // Member data
  allMembers,
  setAllMembers,
  
  // Pagination functionality
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalPages,
  pageMembers,
  
  // Group selection and finalization
  pendingGroupData,
  setPendingGroupData,
  displayedGroupData,
  setDisplayedGroupData,
  selectedValuesByLevel,
  setSelectedValuesByLevel,
  finalizeSelection,
  
  // Loading states
  isHierarchyStableLoading,
  isGroupStableLoading,
  loadingLevel,
  setLoadingLevel,
  
  // Modal handling
  isUserGroupsModalOpen,
  setIsUserGroupsModalOpen,
  selectedUserForGroups,
  setSelectedUserForGroups,
}) => {
  // lookupSearch is now received as a prop

  // GroupContext
  const {
    selectedSystem,
    selectedNode,
    selectedGroupData,
    hierarchyChain,
    isHierarchyLoading,
    isGroupLoading,
    errorMessage,
    currentLoadingLevel,
    setSelectedSystem,
    setSelectedNode,
    setHierarchyChain,
    setSelectedGroupData,
    selectHierarchyLevel,
    loadMoreHierarchy,
    hierarchyHasMoreMap,
  } = useContext(GroupContext);



  // Group data states are now received as props
  // tabIndex is now received as a prop

  // Pagination and sorting states are now received as props

  // Loading states are now received as props
  
  // Color mode variables
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Toast for notifications

  const toast = useToast();

  // Whenever the user picks a new group from the hierarchy
  // we store it in pendingGroupData until they click "Use This Group"
  useEffect(() => {
    if (selectedNode?.type === "Group" && selectedGroupData) {
      setPendingGroupData(selectedGroupData);
    }
  }, [selectedGroupData, selectedNode]);

  // Clear everything out
  const clearGroupData = () => {
    setAllMembers([]);
    setDisplayedGroupData(null);
    setCurrentPage(1);
    setSortField("cn");
    setSortDirection("asc");
    setTotalPages(1);

    setPendingGroupData(null);
    setSelectedSystem("");
    setSelectedNode(null);
    setHierarchyChain([]);
    setSelectedGroupData(null);
    setSelectedValuesByLevel({});

    toast({
      title: "Data cleared",
      description: "Group data has been cleared. You can now select another group.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // --- 3) Hierarchy selection
  const handleChange = (e, level) => {
    const value = e.target.value;
    if (value === "LOAD_MORE") {
      loadMoreHierarchy(level);
      return;
    }

    setSelectedValuesByLevel((prev) => ({
      ...prev,
      [level]: value,
    }));

    setLoadingLevel(level);
    setTimeout(() => {
      selectHierarchyLevel(value, level);
    }, 50);
  };

  // System options for dropdown
  const systemOptions = [
    { value: "System1", label: "KZOPA" },
    { value: "System2", label: "System 2" },
  ];

  const viewUserGroups = (member) => {
    // Determine if this is a group or user
    const isGroup = member.memberType === "Group";
    
    const userObject = {
      sAMAccountName: member.samAccountName || member.sAMAccountName,
      name: member.cn || member.name || member.fullName || member.displayName,
      isGroup: isGroup,
      dn: member.dn  // Make sure this is passed from the backend
    };
    
    setSelectedUserForGroups(userObject);
    setIsUserGroupsModalOpen(true);
  };

  const toggleUserForComparison = (user) => {
    const standardizedUser = {
      sAMAccountName: user.samAccountName || user.sAMAccountName,
      cn: user.cn || user.name || user.fullName || user.displayName,
      mail: user.mail || user.email,
    };

    setSelectedUsersForComparison((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (u) => u.sAMAccountName === standardizedUser.sAMAccountName
      );
      if (isAlreadySelected) {
        return prevSelected.filter(
          (u) => u.sAMAccountName !== standardizedUser.sAMAccountName
        );
      } else {
        if (prevSelected.length < 2) {
          return [...prevSelected, standardizedUser];
        } else {
          return [prevSelected[1], standardizedUser];
        }
      }
    });
  };

  return (
    <Box as="section" width="100%" pt={4} pb={6}>
      <CommonTabHeader
        title="Lookup"
        description="Search for users or browse group hierarchies"
      />

      {/* Main Content */}
      <Card
        mt={4}
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="sm"
      >
        <CardBody pt={4}>
          <LookupTabs handleTabChange={handleTabChange}>
              {/* Groups Tab */}
              <TabPanel p={0}>
                {errorMessage && (
                  <Alert status="error" mb={4} borderRadius="md">
                    <AlertIcon />
                    {errorMessage}
                  </Alert>
                )}

                {/* Selection Controls */}
                <HierarchySelector
                  selectedSystem={selectedSystem}
                  hierarchyChain={hierarchyChain}
                  selectedValuesByLevel={selectedValuesByLevel}
                  handleChange={handleChange}
                  isHierarchyStableLoading={isHierarchyStableLoading}
                  loadingLevel={loadingLevel}
                  hierarchyHasMoreMap={hierarchyHasMoreMap}
                  systemOptions={systemOptions}
                  borderColor={borderColor}
                />

                {/* Pending Group Selection */}
                <PendingGroupSelection
                  pendingGroupData={pendingGroupData}
                  finalizeSelection={finalizeSelection}
                  isGroupStableLoading={isGroupStableLoading}
                  borderColor={borderColor}
                />

                {/* Currently Displayed Group Data */}
                <DisplayedGroupInfo
                  displayedGroupData={displayedGroupData}
                  clearGroupData={clearGroupData}
                  borderColor={borderColor}
                />

                {/* Groups Table */}
                {displayedGroupData && (
                  <GroupMembersTable
                    allMembers={allMembers}
                    displayedGroupData={displayedGroupData}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    totalPages={totalPages}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    handleSortChange={handleSortChange}
                    viewUserGroups={viewUserGroups}
                    borderColor={borderColor}
                    pageMembers={pageMembers}
                  />
                )}

                {/* Empty States */}
                {!displayedGroupData && !pendingGroupData && (
                  <EmptyStates 
                    selectedSystem={selectedSystem}
                    hierarchyChain={hierarchyChain}
                  />
                )}
              </TabPanel>

              {/* Users Tab */}
              <TabPanel p={0}>
                <UsersTable 
                  lookupSearch={lookupSearch}
                  selectedUsersForComparison={selectedUsersForComparison}
                  toggleUserForComparison={toggleUserForComparison}
                  compareSelectedUsers={compareSelectedUsers}
                  viewUserGroups={viewUserGroups}
                />
              </TabPanel>
          </LookupTabs>
        </CardBody>
      </Card>

      {/* Modals for user groups and comparison */}
      <UserGroupsModal
        isOpen={isUserGroupsModalOpen}
        onClose={() => setIsUserGroupsModalOpen(false)}
        user={selectedUserForGroups}
      />
      
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={handleCloseComparisonModal}
        users={selectedUsersForComparison}
      />
    </Box>
  );
};

export default Lookup;
