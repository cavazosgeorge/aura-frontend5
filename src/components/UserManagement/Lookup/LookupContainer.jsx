import React, { useEffect, useState, useMemo, useContext } from "react";
import LookupPanel from "./LookupPanel";
import useUserSearch from "../../hooks/useUserSearch";
import { GroupContext } from "../../../contexts/GroupContext";
import { getGroupMembersPaginated } from "../../../services/adService";
import useLookupStore from "../../../stores/lookupStore";

/**
 * LookupContainer - Container component for the Lookup functionality
 * Manages API calls and integration with external contexts
 * Uses Zustand store for state management
 */
const LookupContainer = () => {
  // Get all needed state and actions from Zustand store in one place to avoid redeclarations
  const { 
    // User search
    setUsers,
    
    // Loading states
    setIsLoading,
    setLoadingLevel,
    
    // Error handling
    setError,
    
    // Tab handling
    setActiveTab,
    
    // User comparison
    selectedUsersForComparison,
    setIsComparisonModalOpen,
    
    // Toast notifications
    setToast,
    
    // Group functionality
    setHierarchyChain,
    setSelectedSystem,
    setHierarchyHasMoreMap,
    setPendingGroupData
  } = useLookupStore();

  // Searching for users
  const lookupSearch = useUserSearch("lookup");

  // Make the search menu always appear on typing
  useEffect(() => {
    if (lookupSearch.searchQuery && lookupSearch.searchQuery.length > 0) {
      lookupSearch.setMenuOpen(true);
    } else {
      lookupSearch.setMenuOpen(false);
    }
  }, [lookupSearch.searchQuery, lookupSearch.setMenuOpen]);
  
  // Set search results as users in the store
  useEffect(() => {
    if (lookupSearch.searchResults && lookupSearch.searchResults.length > 0) {
      setUsers(lookupSearch.searchResults);
    }
  }, [lookupSearch.searchResults, setUsers]);

  // Tab handling
  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  // Override the compareUsers function to include validation
  const compareSelectedUsers = () => {
    if (!selectedUsersForComparison || selectedUsersForComparison.length === 0) {
      setToast(true, "Please select at least one user to compare", "warning");
      return;
    }
    setIsComparisonModalOpen(true);
  };
  
  // Set the compareUsers function in the store
  useEffect(() => {
    const originalCompareUsers = useLookupStore.getState().compareUsers;
    useLookupStore.setState({ compareUsers: compareSelectedUsers });
    
    // Restore original function on unmount
    return () => {
      useLookupStore.setState({ compareUsers: originalCompareUsers });
    };
  }, [selectedUsersForComparison]);

  // Group selection and finalization logic from GroupContext
  const {
    selectedSystem,
    selectedNode,
    selectedGroupData,
    hierarchyChain,
    isHierarchyLoading,
    isGroupLoading,
    errorMessage,
    currentLoadingLevel,
    setSelectedSystem: contextSetSelectedSystem,
    setSelectedNode,
    setHierarchyChain: contextSetHierarchyChain,
    selectHierarchyLevel,
    loadMoreHierarchy,
    hierarchyHasMoreMap,
  } = useContext(GroupContext);
  
  // Sync GroupContext state with our Zustand store
  useEffect(() => {
    setHierarchyChain(hierarchyChain);
  }, [hierarchyChain, setHierarchyChain]);

  useEffect(() => {
    setSelectedSystem(selectedSystem);
  }, [selectedSystem, setSelectedSystem]);

  useEffect(() => {
    setHierarchyHasMoreMap(hierarchyHasMoreMap);
  }, [hierarchyHasMoreMap, setHierarchyHasMoreMap]);

  useEffect(() => {
    setError(errorMessage);
  }, [errorMessage, setError]);

  // Update loading states
  useEffect(() => {
    setIsLoading(isHierarchyLoading || isGroupLoading);
    
    if (isHierarchyLoading) {
      setLoadingLevel(currentLoadingLevel || hierarchyChain.length);
    } else {
      setLoadingLevel(null);
    }
  }, [
    isHierarchyLoading, 
    isGroupLoading, 
    currentLoadingLevel, 
    hierarchyChain.length, 
    setIsLoading, 
    setLoadingLevel
  ]);
  
  // Modal handling and group data states are now managed by the Zustand store
  const { 
    setIsUserGroupsModalOpen,
    setSelectedUserForGroups,
    setDisplayedGroupData,
    setSelectedValuesByLevel
  } = useLookupStore();

  // Finalize group selection and fetch members
  const finalizeSelection = async () => {
    if (!pendingGroupData) return;

    try {
      // We ask the server for the entire list at once
      // page=1, pageSize=9999 (or a big number)
      const groupResponse = await getGroupMembersPaginated(
        pendingGroupData.groupName,
        1,
        9999,       // effectively "all"
        "cn",
        "asc"
      );

      // Store these members in local state
      const members = groupResponse.members || [];
      setAllMembers(members);

      // Keep basic data to display
      setDisplayedGroupData({
        groupName: pendingGroupData.groupName,
        totalCount: groupResponse.totalCount || 0
      });

      // Reset local pagination, sorting
      setCurrentPage(1);
      setSortField("cn");
      setSortDirection("asc");

      // Update totalPages based on the size of the array
      const newTotalPages = Math.ceil(members.length / pageSize);
      setTotalPages(newTotalPages);

      toast({
        title: "Group selected",
        description: `Now displaying data for ${pendingGroupData.groupName || "selected group"}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error fetching members:", error);
      toast({
        title: "Error",
        description: "Could not fetch group members.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    // Clear out pending selection so the user can pick another
    setPendingGroupData(null);
    setSelectedSystem("");
    setSelectedNode(null);
    setHierarchyChain([]);
  };

  // Sorting functionality
  const [sortField, setSortField] = useState("cn");
  const [sortDirection, setSortDirection] = useState("asc");
  const [allMembers, setAllMembers] = useState([]);

  const sortedMembers = useMemo(() => {
    if (!allMembers || allMembers.length === 0) return [];

    // Helper to handle missing fields
    function getValue(obj, field) {
      const val =
        obj[field] ||
        (field === "cn" ? obj.fullName || obj.displayName || "" : "") ||
        (field === "samAccountName" ? obj.sAMAccountName || "" : "") ||
        (field === "mail" ? obj.email || "" : "") ||
        "";
      return val.toLowerCase();
    }

    const copy = [...allMembers];
    copy.sort((a, b) => {
      const aVal = getValue(a, sortField);
      const bVal = getValue(b, sortField);

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [allMembers, sortField, sortDirection]);

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <Icon as={FiChevronUp} ml={1} />
    ) : (
      <Icon as={FiChevronDown} ml={1} />
    );
  };

  // Pagination functionality
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Update total pages when sorted members or page size changes
  useEffect(() => {
    const newTotalPages = Math.ceil(sortedMembers.length / pageSize);
    setTotalPages(newTotalPages);
    // If current page is out of range after re-sorting, reset to 1
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }
  }, [sortedMembers, pageSize, currentPage]);

  // Calculate page members
  const pageStartIndex = (currentPage - 1) * pageSize;
  const pageEndIndex = pageStartIndex + pageSize;
  const pageMembers = sortedMembers.slice(pageStartIndex, pageEndIndex);

  // Pagination navigation functions
  const goToFirstPage = () => {
    setCurrentPage(1);
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  
  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  // Use the LookupPanel component which gets its state from the Zustand store
  // Pass the lookupSearch hook to enable search functionality
  return <LookupPanel lookupSearch={lookupSearch} />;
};

export default LookupContainer;