
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid'; // Assuming you're using uuid for IDs

/**
 * Zustand store for managing client-side state in the Requests feature
 * This includes UI state, filters, and other local state that doesn't need to be fetched from the server
 */
const useRequestsStore = create((set, get) => ({
  // Selected domain for filtering
  selectedDomain: null,
  setSelectedDomain: (domain) => set({ selectedDomain: domain }),
  
  // Active user being edited in the form
  activeUser: null,
  setActiveUser: (user) => set({ activeUser: user }),
  
  // Selected users for requests
  selectedUsers: [],
  addSelectedUser: (user) => {
    // Ensure we have a clean user object with needed fields
    const cleanUser = {
      ...user,
      id: user.id || user.sAMAccountName || user.email || `user-${Date.now()}`,
      name: user.name || user.displayName || 'Unknown User',
      displayName: user.displayName || user.name || 'Unknown User',
      email: user.email || user.mail || `${user.id || user.sAMAccountName || 'user'}@example.com`,
      sAMAccountName: user.sAMAccountName || user.id || `user-${Date.now()}`
    };
    
    // Force update of the state with raw setState 
    const currentState = get();
    
    // Check for duplicates based on any available ID
    const isDuplicate = currentState.selectedUsers.some(existing => 
      (existing.id && existing.id === cleanUser.id) || 
      (existing.sAMAccountName && existing.sAMAccountName === cleanUser.sAMAccountName) ||
      (existing.email && existing.email === cleanUser.email)
    );
    
    if (isDuplicate) {
      return;
    }
    
    set({ 
      selectedUsers: [...currentState.selectedUsers, cleanUser],
      // Also set as active user if appropriate
      activeUser: cleanUser
    });
  },
  removeSelectedUser: (user) => {
    const userId = user.id || user.userId || user.sAMAccountName;
    
    set((state) => {
      const filteredUsers = state.selectedUsers.filter(u => {
        const currentId = u.id || u.userId || u.sAMAccountName;
        return currentId !== userId;
      });
      
      return { selectedUsers: filteredUsers };
    });
  },
  clearSelectedUsers: () => set({ selectedUsers: [] }),
  
  // Bulk selected users for operations
  bulkSelectedUsers: [],
  toggleBulkSelection: (userId) => set((state) => ({
    bulkSelectedUsers: state.bulkSelectedUsers.includes(userId)
      ? state.bulkSelectedUsers.filter(id => id !== userId)
      : [...state.bulkSelectedUsers, userId]
  })),
  selectAllUsers: (userIds) => set({ bulkSelectedUsers: userIds }),
  clearBulkSelection: () => set({ bulkSelectedUsers: [] }),
  
  // User selections for the form (system, department, role)
  userSelections: {},
  setUserSelection: (userId, field, value) => set((state) => ({
    userSelections: {
      ...state.userSelections,
      [userId]: {
        ...state.userSelections[userId],
        [field]: value
      }
    }
  })),
  resetUserSelection: (userId) => set((state) => ({
    userSelections: {
      ...state.userSelections,
      [userId]: {
        system: "",
        department: "",
        role: ""
      }
    }
  })),
  
  // Requests cart - both names for compatibility
  requestsCart: [],
  cartItems: [], // Added for compatibility with new components
  
  addRequestToCart: (request) => {
    const newRequest = { 
      ...request, 
      id: request.id || uuidv4() 
    };
    
    set((state) => ({
      requestsCart: [...state.requestsCart, newRequest],
      cartItems: [...state.requestsCart, newRequest] // Update both arrays
    }));
  },
  
  removeFromCart: (requestId) => {
    set((state) => {
      const filteredCart = state.requestsCart.filter(request => request.id !== requestId);
      return {
        requestsCart: filteredCart,
        cartItems: filteredCart // Update both arrays
      };
    });
  },
  
  removeRequestFromCart: (requestId) => {
    // Call the new removeFromCart function for compatibility
    get().removeFromCart(requestId);
  },
  
  clearCart: () => set({ requestsCart: [], cartItems: [] }),
  clearRequestsCart: () => set({ requestsCart: [] }),
  // Remove all requests for a specific user
  removeUserFromCart: (userId) => set((state) => ({
    requestsCart: state.requestsCart.filter(request => request.userId !== userId),
    cartItems: state.cartItems.filter(item => item.userId !== userId) // Update cartItems too
  })),
  
  // Request submission state
  isSubmitting: false,
  submitRequests: async (requests) => {
    set({ isSubmitting: true });
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ isSubmitting: false });
      return false;
    }
  },
  
  // Templates
  templates: [],
  setTemplates: (templates) => set({ templates }),
  addTemplate: (template) => set((state) => ({
    templates: [...state.templates, template]
  })),
  saveTemplate: (name, accesses) => {
    if (!name || accesses.length === 0) return false;
    
    const newTemplate = {
      id: uuidv4(),
      name,
      accesses: [...accesses]
    };
    
    set((state) => ({
      templates: [...state.templates, newTemplate]
    }));
    
    return true;
  },
  updateTemplate: (templateId, newName, newAccesses) => {
    if (!templateId || !newName || newAccesses.length === 0) return false;
    
    set((state) => ({
      templates: state.templates.map(t => 
        t.id === templateId 
          ? { ...t, name: newName, accesses: [...newAccesses] } 
          : t
      )
    }));
    
    return true;
  },
  deleteTemplate: (templateId) => set((state) => ({
    templates: state.templates.filter(t => t.id !== templateId),
    recentlyUsed: state.recentlyUsed.filter(t => t.id !== templateId)
  })),
  
  // Recently used templates
  recentlyUsed: [],
  setRecentlyUsed: (recentlyUsed) => set({ recentlyUsed }),
  addToRecentlyUsed: (template) => set((state) => ({
    recentlyUsed: [template, ...state.recentlyUsed.filter(t => t.id !== template.id)].slice(0, 5)
  })),
  
  // UI state
  showTemplatesModal: false,
  setShowTemplatesModal: (isVisible) => set({ showTemplatesModal: isVisible }),
  
  // Recent searches
  recentSearches: [],
  addToRecentSearches: (searchQuery) => set((state) => ({
    recentSearches: state.recentSearches.includes(searchQuery)
      ? state.recentSearches
      : [searchQuery, ...state.recentSearches].slice(0, 5)
  })),
  clearRecentSearches: () => set({ recentSearches: [] })
}));

export default useRequestsStore;
