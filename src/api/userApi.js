// src/api/userApi.js
import { fetchData } from '../../utils/ApiUtility';

/**
 * Search for users in Active Directory
 * @param {string} query - Search query
 * @param {string} domain - Optional domain to search in
 * @returns {Promise<Array>} - Array of user objects
 */
export const searchUsers = async ({ query, domain }) => {
  if (!query || query.length < 2) {
    return [];
  }
  
  // Add domain parameter if provided
  const endpoint = domain 
    ? `/api/v1/ad/user-info?displayName=${query}&domain=${domain}` 
    : `/api/v1/ad/user-info?displayName=${query}`;
    
  return await fetchData(endpoint, 'SearchUsers');
};

/**
 * Get available domains for Active Directory
 * @returns {Promise<Array>} - Array of domain objects
 */
export const getDomains = async () => {
  return await fetchData('/api/v1/ad/domains', 'GetDomains');
};

/**
 * Get requests for a specific user
 * @param {string} userId - User ID to get requests for
 * @returns {Promise<Array>} - Array of request objects
 */
export const getUserRequests = async (userId) => {
  // API call removed as functionality is deprecated
  console.warn('getUserRequests API call is deprecated and has been removed. Returning empty array.');
  return [];
  /* Original code:
  if (!userId) {
    return [];
  }
  
  try {
    return await fetchData(`/api/v1/requests/user/${userId}`, 'GetUserRequests');
  } catch (error) {
    console.error('Error fetching user requests:', error);
    return [];
  }
  */
};

/**
 * Get request by ID
 * @param {string} requestId - Request ID to get
 * @returns {Promise<Object>} - Request object
 */
export const getRequestById = async (requestId) => {
  if (!requestId) {
    return null;
  }
  
  try {
    return await fetchData(`/api/v1/requests/${requestId}`, 'GetRequestById');
  } catch (error) {
    console.error('Error fetching request by ID:', error);
    return null;
  }
};