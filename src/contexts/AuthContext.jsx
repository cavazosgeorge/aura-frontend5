import React, { createContext, useState, useEffect, useCallback } from "react";
import { fetchData } from "../../utils/ApiUtility";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchUser = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");
    
    if (!accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setAuthError(null);
      
      // Set mock user data for testing
      setUser({
        displayName: "Test User",
        name: "Test User",
        sAMAccountName: "test.user",
        mail: "test.user@example.com", 
        department: "IT",
        id: "test.user"
      });
      
      // Uncomment this when API is available
      // const data = await fetchData("/api/v1/users/authenticated", "AuthProvider", "GET");
      // setUser(data);
    } catch (error) {
      console.error("Error fetching user info:", error);
      setAuthError(error.message || "Failed to authenticate user");
      
      if (error.status === 401) {
        try {
          await refreshUserToken();
        } catch (refreshError) {
          logout();
        }
      } else {
        // Don't automatically logout on connection errors
        if (error.message.includes("Network connection error")) {
          console.log("Network error, but keeping current session");
        } else {
          logout();
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUserToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (!refreshToken) {
      logout();
      return;
    }
    
    try {
      const response = await fetchData("/api/v1/auth/refresh", "AuthProvider", "POST", {
        refreshToken
      });
      
      localStorage.setItem("accessToken", response.accessToken);
      await fetchUser();
    } catch (error) {
      console.error("Error refreshing token:", error);
      setAuthError("Session expired. Please login again.");
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "accessToken" || e.key === "refreshToken") {
        if (e.newValue === null) {
          setUser(null);
        } else if (e.key === "accessToken" && e.newValue) {
          fetchUser();
        }
      }
    };
    
    // Add try-catch to handle potential SecurityError in isolated environments
    try {
      window.addEventListener("storage", handleStorageChange);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    } catch (error) {
      console.error("Error setting up storage event listener:", error);
    }
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      authError,
      fetchUser, 
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};