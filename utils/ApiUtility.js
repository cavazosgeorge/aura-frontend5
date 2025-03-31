/**
 * fetchData
 * 
 * A generic wrapper around fetch() that:
 *  - Appends the backend base URL
 *  - Injects bearer token from localStorage
 *  - Provides JSON or other response handling
 * 
 * @param {string} endpoint 
 * @param {string} componentName 
 * @param {string} [method="GET"] 
 * @param {Object|null} [body=null] 
 * @param {boolean} [rawResponse=false] 
 * @param {string} [responseType="json"] 
 * @param {AbortSignal} [signal] 
 * @returns {Promise<any>}
 */
export const fetchData = async (
  endpoint,
  componentName,
  method = "GET",
  body = null,
  rawResponse = false,
  responseType = 'json',
  signal
) => {
  // Use the AMER authentication service URL for auth endpoints
  // For other endpoints, use the regular backend URL
  const isAuthEndpoint = endpoint.startsWith('/api/auth');
  const backendUrl = isAuthEndpoint ? 'http://146.240.94.12:3002' : 'http://localhost:3000';
  const url = `${backendUrl}${endpoint}`;
  console.log(`[${componentName}] Fetching from URL:`, url);

  const headers = {
    "Content-Type": "application/json",
  };
  
  // Only add Authorization header if we have an access token
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const fetchConfig = {
    method,
    headers,
    signal,
    mode: 'cors', // Explicitly set CORS mode
    credentials: 'same-origin' // Don't send credentials for cross-origin requests
  };

  if (body) {
    fetchConfig.body = JSON.stringify(body);
  }

  try {
    // Add error handling for potential network issues
    let response;
    try {
      response = await fetch(url, fetchConfig);
    } catch (networkError) {
      console.error(`[${componentName}] Network error:`, networkError);
      throw new Error("Network connection error. Please check your internet connection.");
    }
    
    // Handle 401 Unauthorized errors by attempting to refresh the token
    if (response.status === 401 && !endpoint.includes('/api/auth/refresh')) {
      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const refreshResponse = await fetch(`${backendUrl}/api/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ refreshToken }),
            mode: 'cors', // Explicitly set CORS mode
            credentials: 'same-origin' // Don't send credentials for cross-origin requests
          });
          
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            
            // Update the access token
            localStorage.setItem("accessToken", refreshData.accessToken);
            
            // If a new refresh token is provided, update it as well
            if (refreshData.refreshToken) {
              localStorage.setItem("refreshToken", refreshData.refreshToken);
            }
            
            // Retry the original request with the new token
            headers["Authorization"] = `Bearer ${refreshData.accessToken}`;
            
            // Make the original request again with the new token
            response = await fetch(url, {
              ...fetchConfig,
              headers
            });
          } else {
            // If refresh fails, clear tokens and throw error
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            throw new Error("Session expired. Please log in again.");
          }
        } else {
          // No refresh token available
          throw new Error("Authentication required. Please log in.");
        }
      } catch (refreshError) {
        console.error(`[${componentName}] Token refresh error:`, refreshError);
        throw refreshError;
      }
    }
    
    if (!response.ok) {
      // Try to get error details from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      } catch (e) {
        // If we can't parse the error response, throw a generic error
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }

    if (responseType === 'blob') {
      return await response.blob();
    } else if (rawResponse) {
      return await response.text();
    } else {
      return await response.json();
    }
  } catch (error) {
    console.error(`[${componentName}] Fetch error:`, error);
    throw error;
  }
};