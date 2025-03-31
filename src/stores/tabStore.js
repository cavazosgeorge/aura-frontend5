// src/stores/tabStore.js
import { create } from 'zustand';

/**
 * Zustand store for managing tab state across the application
 * Replaces the TabContext for more efficient state management
 */
const useTabStore = create((set) => ({
  // Current active tab index
  activeTab: 0,
  
  // Set the active tab
  setActiveTab: (tabIndex) => set({ activeTab: tabIndex }),
  
  // Reset tab state (useful when navigating away)
  resetTab: () => set({ activeTab: 0 })
}));

export default useTabStore;