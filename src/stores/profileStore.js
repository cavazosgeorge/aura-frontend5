
// src/stores/profileStore.js
import { create } from 'zustand';
import { fetchUserProfile } from '../services/profileService';
// Import authStore to access the dev user data when bypassing
import useAuthStore from './authStore';

const useProfileStore = create((set) => ({
  profileData: null,
  loading: false,
  error: null,
  
  // Fetch and store profile data
  fetchProfile: async () => {
    // --- Development Auth Bypass ---
    if (import.meta.env.VITE_DEV_AUTH_BYPASS === 'true') {
      // Get the devUser directly from the authStore state
      const devUserData = useAuthStore.getState().user;
      if (devUserData) {
        console.warn(
          '%c*** DEVELOPMENT PROFILE FETCH BYPASS ACTIVE ***',
          'color: orange; font-weight: bold;'
        );
        set({ profileData: devUserData, loading: false, error: null });
        console.log('Mock profile data set from authStore:', devUserData);
        return devUserData; // Return mock data immediately
      } else {
        // This case might happen if fetchProfile is called before dev login bypass completes
        console.warn('Dev bypass active, but no user data found in authStore yet.');
        set({ profileData: null, loading: false, error: 'Dev bypass active, authStore empty.' });
        return null;
      }
    }
    // --- End Development Auth Bypass ---

    // Original logic if bypass is not active
    try {
      set({ loading: true, error: null });
      const data = await fetchUserProfile();
      set({ profileData: data, loading: false });
      return data;
    } catch (err) {
      console.error('Failed to load profile:', err);
      set({ error: err.message, loading: false });
      throw err;
    }
  },
  
  // Clear profile data (e.g., on logout)
  clearProfile: () => set({ profileData: null, loading: false, error: null }),
}));

export default useProfileStore;
