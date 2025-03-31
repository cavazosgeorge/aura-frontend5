
// src/stores/authStore.js
import { create } from 'zustand';

// --- Development Auth Bypass Configuration ---
// IMPORTANT: Adjust devUser structure to match the actual user data needed
const devUser = {
  id: 'dev-123',
  username: 'dev_user',
  email: 'dev_user@example.com',
  name: 'Development User',
  roles: ['developer', 'admin'], // Example roles
  // Add any other fields your application expects in the user object
};
const mockAccessToken = 'dev-access-token-mock';
const mockRefreshToken = 'dev-refresh-token-mock';
// --- End Development Auth Bypass Configuration ---

/**
 * Zustand store for managing authentication state across the application
 * Updated to use the AMER authentication service
 */
const useAuthStore = create((set, get) => ({
  // User state
  user: null,
  loading: true,
  
  // Set the user
  setUser: (userData) => set({ user: userData }),
  
  // Set loading state
  setLoading: (isLoading) => set({ loading: isLoading }),
  
  // Login user with AMER auth service
  login: async (username, password) => {
    // --- Development Auth Bypass ---
    if (import.meta.env.VITE_DEV_AUTH_BYPASS === 'true') {
      console.warn(
        '%c*** DEVELOPMENT AUTH LOGIN BYPASS ACTIVE ***',
        'color: orange; font-weight: bold;'
      );
      localStorage.setItem('accessToken', mockAccessToken);
      localStorage.setItem('refreshToken', mockRefreshToken);
      set({ user: devUser, loading: false });
      console.log('Mock login successful. User data:', devUser);
      // Return structure similar to successful API response if needed by caller
      return { user: devUser, accessToken: mockAccessToken, refreshToken: mockRefreshToken };
    }
    // --- End Development Auth Bypass ---

    // Original login logic
    try {
      set({ loading: true });
      
      // Use the VM's IP address for production
      const authServiceUrl = 'http://146.240.94.12:3002';
      
      const response = await fetch(`${authServiceUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        mode: 'cors',
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }
      
      const data = await response.json();
      
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Set user data in store
      set({ user: data.user, loading: false });
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      set({ loading: false });
      throw error;
    }
  },
  
  // Fetch user information
  fetchUser: async () => {
    // --- Development Auth Bypass ---
    const isBypassActive = import.meta.env.VITE_DEV_AUTH_BYPASS === 'true';
    const currentToken = localStorage.getItem('accessToken');

    if (isBypassActive && currentToken === mockAccessToken) {
      console.warn(
        '%c*** DEVELOPMENT AUTH SESSION BYPASS ACTIVE ***',
        'color: orange; font-weight: bold;'
      );
      set({ user: devUser, loading: false });
      console.log('Mock session restored. User data:', devUser);
      return devUser;
    }
    // --- End Development Auth Bypass ---

    // Original fetchUser logic
    try {
      set({ loading: true });
      
      // Check if we have a token
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        set({ user: null, loading: false });
        return null;
      }
      
      // Try to decode the JWT token to get user info
      try {
        // Make sure the token has the correct format before trying to decode it
        if (accessToken.split('.').length === 3) {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          
          // Create a user object from the token payload
          const user = {
            id: payload.sub || payload.id,
            username: payload.username || payload.preferred_username,
            email: payload.email,
            roles: payload.roles || [],
            // Add other user properties as needed
          };
          
          set({ user, loading: false });
          return user;
        }
      } catch (decodeError) {
        console.error('Could not decode JWT token:', decodeError);
        // Continue to fallback approach
      }
      
      // If we couldn't decode the token, try to fetch the user data from the API
      try {
        const authServiceUrl = 'http://146.240.94.12:3002';
        const response = await fetch(`${authServiceUrl}/api/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          credentials: 'same-origin'
        });
        
        if (response.ok) {
          const userData = await response.json();
          set({ user: userData, loading: false });
          return userData;
        } else {
          // If the API call fails, clear the tokens and set user to null
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          set({ user: null, loading: false });
          return null;
        }
      } catch (apiError) {
        console.error('Error fetching user data:', apiError);
        
        // For development/testing: use a mock user to avoid blocking the UI
        // Remove this in production when the API is fully available
        const mockUser = {
          id: '12345',
          username: 'testuser',
          email: 'test@example.com',
          roles: ['USER']
        };
        
        set({ user: mockUser, loading: false });
        return mockUser;
      }
    } catch (error) {
      console.error('Error in fetchUser:', error);
      set({ loading: false });
      return null;
    }
  },
  
  // Refresh the user token
  refreshUserToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const authServiceUrl = 'http://146.240.94.12:3002';
      const response = await fetch(`${authServiceUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ refreshToken }),
        mode: 'cors',
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      const data = await response.json();
      
      // Update tokens
      localStorage.setItem('accessToken', data.accessToken);
      
      // If a new refresh token is provided, update it as well
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      
      // Option 1: Clear tokens and set user to null (logs the user out)
      // localStorage.removeItem('accessToken');
      // localStorage.removeItem('refreshToken');
      // set({ user: null });
      
      // Option 2: Don't clear tokens, let the user continue with expired tokens
      // This might be better UX in some cases, as it doesn't log the user out unexpectedly
      // The next API call will fail and can be handled appropriately
      
      throw error;
    }
  },
  
  // Logout the user
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null });
  }
}));

export default useAuthStore;
