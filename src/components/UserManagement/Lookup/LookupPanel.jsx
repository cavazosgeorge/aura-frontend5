import React, { useEffect } from "react";
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

// Import Zustand store
import useLookupStore from "../../../stores/lookupStore";

// Import components
import CommonTabHeader from "../../Common/CommonTabHeader";
import CommonTabSearch from "../../Common/CommonTabSearch";
import LookupTabs from "./LookupTabs";
import { GroupMembersTable, HierarchySelector, PendingGroupSelection, DisplayedGroupInfo } from "./Groups";
import { UsersTable, ComparisonCard, UserEmptyState } from "./Users";
import { UserGroupsModal, ComparisonModal } from "./Modals";
import { useStableLoading } from "./hooks";

/**
 * LookupPanel component that uses Zustand for state management
 * @param {Object} props - Component props
 * @param {Object} props.lookupSearch - The user search hook instance
 */
const LookupPanel = ({ lookupSearch }) => {
  // Get state and actions from Zustand store
  const {
    // Tab state
    activeTab,
    setActiveTab,
    
    // Loading states
    isLoading,
    loadingLevel,
    
    // Error state
    error,
    
    // Hierarchy state
    selectedSystem,
    hierarchyChain,
    selectedValuesByLevel,
    updateSelectedValueByLevel,
    hierarchyHasMoreMap,
    
    // Group data state
    pendingGroupData,
    displayedGroupData,
    clearGroupData,
    
    // Group members state
    allMembers,
    pageMembers,
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    sortField,
    sortDirection,
    handleSortChange,
    
    // Users tab state
    users,
    selectedUsers,
    toggleUserSelection,
    
    // Modal state
    isUserGroupsModalOpen,
    setIsUserGroupsModalOpen,
    selectedUserForGroups,
    isComparisonModalOpen,
    setIsComparisonModalOpen,
    selectedUsersForComparison,
    
    // Actions
    viewUserGroups,
    compareUsers,
    
    // Toast state
    showToast,
    toastMessage,
    toastStatus,
    setToast
  } = useLookupStore();
  
  // Use our custom hook for stable loading states
  const isHierarchyStableLoading = useStableLoading(isLoading && loadingLevel !== null);
  const isGroupStableLoading = useStableLoading(isLoading && loadingLevel === null);
  
  // System options for dropdown
  const systemOptions = [
    { value: "System1", label: "KZOPA" },
    { value: "System2", label: "System 2" },
  ];
  
  // Initialize toast
  const toast = useToast();
  
  // Show toast when state changes
  useEffect(() => {
    if (showToast) {
      toast({
        title: toastMessage,
        status: toastStatus,
        duration: 3000,
        isClosable: true,
      });
      setToast(false);
    }
  }, [showToast, toastMessage, toastStatus, toast, setToast]);
  
  // Color mode variables
  const borderColor = useColorModeValue("gray.200", "gray.700");
  
  // Handle tab change
  const handleTabChange = (index) => {
    setActiveTab(index);
  };
  
  // Finalize group selection
  const finalizeSelection = () => {
    if (pendingGroupData) {
      useLookupStore.setState({ 
        displayedGroupData: pendingGroupData,
        allMembers: pendingGroupData.members || [],
        currentPage: 1
      });
      
      // Trigger sorting and pagination
      useLookupStore.getState().sortAndPaginateMembers();
      
      setToast(true, "Group data loaded successfully", "success");
    }
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
        bg={useColorModeValue("white", "gray.800")}
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="sm"
      >
        <CardBody pt={4}>
          <LookupTabs handleTabChange={handleTabChange}>
            {/* Groups Tab */}
            <TabPanel p={0}>
              {error && (
                <Alert status="error" mb={4} borderRadius="md">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
              
              <HierarchySelector
                selectedSystem={selectedSystem}
                hierarchyChain={hierarchyChain}
                selectedValuesByLevel={selectedValuesByLevel}
                handleChange={(e, level) => updateSelectedValueByLevel(level, e.target.value)}
                isHierarchyStableLoading={isHierarchyStableLoading}
                loadingLevel={loadingLevel}
                hierarchyHasMoreMap={hierarchyHasMoreMap}
                systemOptions={systemOptions}
                borderColor={borderColor}
              />
              
              <PendingGroupSelection
                pendingGroupData={pendingGroupData}
                finalizeSelection={finalizeSelection}
                isGroupStableLoading={isGroupStableLoading}
                borderColor={borderColor}
              />
              
              <DisplayedGroupInfo
                displayedGroupData={displayedGroupData}
                clearGroupData={clearGroupData}
                borderColor={borderColor}
              />
              
              {displayedGroupData && (
                <GroupMembersTable
                  allMembers={allMembers}
                  displayedGroupData={displayedGroupData}
                  pageMembers={pageMembers}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  handleSortChange={handleSortChange}
                  viewUserGroups={viewUserGroups}
                  borderColor={borderColor}
                />
              )}
            </TabPanel>
            
            {/* Users Tab */}
            <TabPanel p={0}>
              {/* Comparison Card */}
              <ComparisonCard
                selectedUsers={selectedUsers}
                compareUsers={compareUsers}
                borderColor={borderColor}
              />
              
              {/* Search Component */}
              <CommonTabSearch
                mt={4}
                mb={4}
                placeholder="Search for users by name, username, or email"
                searchQuery={lookupSearch?.searchQuery || ""}
                setSearchQuery={lookupSearch?.setSearchQuery}
                fetchedUsers={lookupSearch?.searchResults || []}
                isLoading={lookupSearch?.isLoading || false}
                isMenuOpen={lookupSearch?.isMenuOpen || false}
                setMenuOpen={lookupSearch?.setMenuOpen}
                onSelectUser={lookupSearch?.handleUserSelect}
                selectedUsers={selectedUsers}
                contextName="lookup"
              />
              
              {/* Users Table or Empty State */}
              {users && users.length > 0 ? (
                <UsersTable
                  users={users}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  handleSortChange={handleSortChange}
                  viewUserGroups={viewUserGroups}
                  selectedUsers={selectedUsers}
                  toggleUserSelection={toggleUserSelection}
                  compareUsers={compareUsers}
                  borderColor={borderColor}
                />
              ) : (
                <UserEmptyState borderColor={borderColor} />
              )}
            </TabPanel>
          </LookupTabs>
          
          {/* Modals */}
          <UserGroupsModal
            isOpen={isUserGroupsModalOpen}
            onClose={() => setIsUserGroupsModalOpen(false)}
            user={selectedUserForGroups}
          />
          
          <ComparisonModal
            isOpen={isComparisonModalOpen}
            onClose={() => setIsComparisonModalOpen(false)}
            users={selectedUsersForComparison}
          />
        </CardBody>
      </Card>
    </Box>
  );
};

export default LookupPanel;