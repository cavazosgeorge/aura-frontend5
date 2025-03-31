import { create } from 'zustand';

/**
 * Zustand store for Lookup functionality
 * Manages state for group hierarchy, selected groups, users, and UI state
 */
const useLookupStore = create((set, get) => ({
  // Tab state
  activeTab: 0,
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Loading states
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  loadingLevel: null,
  setLoadingLevel: (loadingLevel) => set({ loadingLevel }),
  
  // Error state
  error: null,
  setError: (error) => set({ error }),

  // Hierarchy state
  selectedSystem: '',
  setSelectedSystem: (selectedSystem) => set({ selectedSystem }),
  hierarchyChain: [],
  setHierarchyChain: (hierarchyChain) => set({ hierarchyChain }),
  selectedValuesByLevel: {},
  setSelectedValuesByLevel: (selectedValuesByLevel) => set({ selectedValuesByLevel }),
  updateSelectedValueByLevel: (level, value) => {
    const newSelectedValues = { ...get().selectedValuesByLevel };
    
    // If we're updating a level, clear all higher levels
    if (level === 0) {
      // If system changed, reset everything
      set({ 
        selectedValuesByLevel: { 0: value },
        hierarchyChain: [],
        pendingGroupData: null,
        displayedGroupData: null
      });
    } else {
      // Clear higher levels when a level changes
      Object.keys(newSelectedValues).forEach(key => {
        if (parseInt(key) > level) {
          delete newSelectedValues[key];
        }
      });
      
      // Set the new value
      newSelectedValues[level] = value;
      set({ selectedValuesByLevel: newSelectedValues });
    }
  },
  hierarchyHasMoreMap: {},
  setHierarchyHasMoreMap: (hierarchyHasMoreMap) => set({ hierarchyHasMoreMap }),

  // Group data state
  pendingGroupData: null,
  setPendingGroupData: (pendingGroupData) => set({ pendingGroupData }),
  displayedGroupData: null,
  setDisplayedGroupData: (displayedGroupData) => set({ displayedGroupData }),
  clearGroupData: () => set({ 
    displayedGroupData: null,
    allMembers: [],
    pageMembers: [],
    currentPage: 1,
    totalPages: 0
  }),

  // Group members state
  allMembers: [],
  setAllMembers: (allMembers) => set({ allMembers }),
  pageMembers: [],
  setPageMembers: (pageMembers) => set({ pageMembers }),
  currentPage: 1,
  setCurrentPage: (currentPage) => set({ currentPage }),
  pageSize: 10,
  setPageSize: (pageSize) => set({ pageSize }),
  totalPages: 0,
  setTotalPages: (totalPages) => set({ totalPages }),
  sortField: 'cn',
  setSortField: (sortField) => set({ sortField }),
  sortDirection: 'asc',
  setSortDirection: (sortDirection) => set({ sortDirection }),
  
  // Handle sort change
  handleSortChange: (field) => {
    const currentSortField = get().sortField;
    const currentSortDirection = get().sortDirection;
    
    if (currentSortField === field) {
      // Toggle direction if same field
      set({ sortDirection: currentSortDirection === 'asc' ? 'desc' : 'asc' });
    } else {
      // Set new field and default to ascending
      set({ sortField: field, sortDirection: 'asc' });
    }
    
    // Re-sort the data
    get().sortAndPaginateMembers();
  },
  
  // Sort and paginate members
  sortAndPaginateMembers: () => {
    const { allMembers, sortField, sortDirection, currentPage, pageSize } = get();
    
    if (!allMembers || allMembers.length === 0) {
      set({ pageMembers: [], totalPages: 0 });
      return;
    }
    
    // Sort members
    const sortedMembers = [...allMembers].sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
    
    // Calculate pagination
    const totalPages = Math.ceil(sortedMembers.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageMembers = sortedMembers.slice(startIndex, endIndex);
    
    set({ pageMembers, totalPages });
  },
  
  // Users tab state
  users: [],
  setUsers: (users) => set({ users }),
  selectedUsers: [],
  setSelectedUsers: (selectedUsers) => set({ selectedUsers }),
  toggleUserSelection: (user) => {
    const { selectedUsers } = get();
    const isSelected = selectedUsers.some(u => 
      u.samAccountName === user.samAccountName || u.cn === user.cn
    );
    
    if (isSelected) {
      // Remove user from selection
      set({ 
        selectedUsers: selectedUsers.filter(u => 
          u.samAccountName !== user.samAccountName && u.cn !== user.cn
        ) 
      });
    } else {
      // Add user to selection (limit to 2 for comparison)
      if (selectedUsers.length < 2) {
        set({ selectedUsers: [...selectedUsers, user] });
      }
    }
  },
  
  // Modal state
  isUserGroupsModalOpen: false,
  setIsUserGroupsModalOpen: (isOpen) => set({ isUserGroupsModalOpen: isOpen }),
  selectedUserForGroups: null,
  setSelectedUserForGroups: (user) => set({ selectedUserForGroups: user }),
  isComparisonModalOpen: false,
  setIsComparisonModalOpen: (isOpen) => set({ isComparisonModalOpen: isOpen }),
  selectedUsersForComparison: [],
  setSelectedUsersForComparison: (users) => set({ selectedUsersForComparison: users }),
  
  // Actions
  viewUserGroups: (user) => {
    set({ 
      selectedUserForGroups: user,
      isUserGroupsModalOpen: true 
    });
  },
  
  compareUsers: () => {
    const { selectedUsers } = get();
    if (selectedUsers.length === 2) {
      set({
        selectedUsersForComparison: selectedUsers,
        isComparisonModalOpen: true
      });
    }
  },
  
  // Toast notifications
  showToast: false,
  toastMessage: '',
  toastStatus: 'info',
  setToast: (show, message = '', status = 'info') => 
    set({ showToast: show, toastMessage: message, toastStatus: status }),
}));

export default useLookupStore;