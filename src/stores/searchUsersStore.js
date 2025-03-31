// src/stores/searchUsersStore.js
import { create } from 'zustand';

/**
 * Zustand store for managing user search UI state and selected users
 * Replaces the SearchUsersContext for more efficient state management
 * 
 * Note: All API calls and server-side data fetching should be handled by TanStack Query
 * This store only manages client-side state
 */
const useSearchUsersStore = create((set, get) => ({
  // UI State
  searchQuery: '',
  selectedUsers: [],
  isMenuOpen: false,
  
  // Actions for UI state management
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSelectedUsers: (users) => set({ selectedUsers: users }),
  
  setMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
  
  // User selection management
  selectUser: (user) => {
    const { selectedUsers } = get();
    // Ensure we don't add duplicates
    if (!selectedUsers.some(u => u.sAMAccountName === user.sAMAccountName)) {
      set({ 
        selectedUsers: [...selectedUsers, user],
        searchQuery: '',
        isMenuOpen: false
      });
    }
  },
  
  // Deselect a single user
  deselectUser: (user) => {
    const { selectedUsers } = get();
    set({
      selectedUsers: selectedUsers.filter(u => u.sAMAccountName !== user.sAMAccountName)
    });
  },
  
  // Clear all selected users
  clearSelectedUsers: () => set({ selectedUsers: [] })
}));

export default useSearchUsersStore;