// src/api/userQueries.js
import { useQuery } from '@tanstack/react-query';
import { searchUsers, getDomains } from './userApi';

/**
 * Hook for searching users with TanStack Query
 * @param {string} query - Search query
 * @param {string} domain - Optional domain to search in
 * @param {Object} options - Additional options for useQuery
 * @returns {Object} - TanStack Query result object
 */
export const useSearchUsersQuery = (query, domain, options = {}) => {
  return useQuery({
    queryKey: ['users', 'search', query, domain],
    queryFn: () => searchUsers({ query, domain }),
    enabled: !!query && query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options
  });
};

/**
 * Hook for getting available domains with TanStack Query
 * @param {Object} options - Additional options for useQuery
 * @returns {Object} - TanStack Query result object
 */
export const useDomainsQuery = (options = {}) => {
  return useQuery({
    queryKey: ['domains'],
    queryFn: getDomains,
    staleTime: 1000 * 60 * 60, // 1 hour
    ...options
  });
};