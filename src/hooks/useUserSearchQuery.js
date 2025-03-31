// src/hooks/useUserSearchQuery.js
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook for searching users using TanStack Query
 * This separates server-side data fetching from client-side state management
 * Works alongside useSearchUsersStore for complete user search functionality
 * 
 * @param {string} query - The search query string
 * @param {Object} options - Additional options for the query
 * @returns {Object} - TanStack Query result object
 */
export const useUserSearchQuery = (query, options = {}) => {
  return useQuery({
    queryKey: ['userSearch', query],
    queryFn: async () => {
      if (!query || query.length < 4) {
        return [];
      }
      
      const response = await fetch(`/api/v1/ad/user-info?displayName=${query}`);
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    },
    enabled: !!query && query.length >= 4,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
};

/**
 * Example usage in a component:
 * 
 * import useSearchUsersStore from '../stores/searchUsersStore';
 * import { useUserSearchQuery } from '../hooks/useUserSearchQuery';
 * import useDebounce from '../hooks/useDebounce';
 * 
 * function UserSearch() {
 *   // Get client-side state from Zustand
 *   const searchQuery = useSearchUsersStore(state => state.searchQuery);
 *   const setSearchQuery = useSearchUsersStore(state => state.setSearchQuery);
 *   const selectUser = useSearchUsersStore(state => state.selectUser);
 *   const selectedUsers = useSearchUsersStore(state => state.selectedUsers);
 *   const setMenuOpen = useSearchUsersStore(state => state.setMenuOpen);
 *   
 *   // Debounce the search query
 *   const debouncedQuery = useDebounce(searchQuery, 300);
 *   
 *   // Fetch data with TanStack Query
 *   const { data: fetchedUsers, isLoading } = useUserSearchQuery(debouncedQuery);
 *   
 *   // Update menu state based on fetched data
 *   useEffect(() => {
 *     if (fetchedUsers && fetchedUsers.length > 0) {
 *       setMenuOpen(true);
 *     } else {
 *       setMenuOpen(false);
 *     }
 *   }, [fetchedUsers, setMenuOpen]);
 *   
 *   // ... rest of component
 * }
 */