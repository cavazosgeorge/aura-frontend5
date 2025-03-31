import React, { useEffect, useCallback, useState } from 'react';
import { Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { QueryProvider } from "./api/QueryProvider";
import Navbar from "./components/Layout/Navbar/Navbar";
import Footer from "./components/Layout/Footer/Footer";
import LoginPage from "./components/Pages/Login/LoginPage";
import DashboardPage from "./components/Pages/Dashboard/DashboardPage";
import ProfilePage from "./components/Pages/Profile/ProfilePage";
import AboutUsPage from "./components/Pages/AboutUs/AboutUsPage";
import { Requests } from "./components/UserManagement/Requests";
import { TabProvider } from "./contexts/TabContext";
import { AuthProvider } from "./contexts/AuthContext";
import useAuthStore from "./stores/authStore";
import useProfileStore from "./stores/profileStore"; 
import DocumentationPage from './components/Pages/Documentation/DocumentationPage.jsx'; 
import DocumentationLayout from './components/Pages/Documentation/DocumentationLayout.jsx'; 
import NotFoundPage from './components/Pages/NotFoundPage'; // Import the NotFoundPage
import "./App.css";

// Component to handle conditional footer rendering
function AppContent() {
  const user = useAuthStore(state => state.user);
  const fetchUser = useAuthStore(state => state.fetchUser);
  const location = useLocation();
  
  // Add profile store hooks
  const fetchProfile = useProfileStore(state => state.fetchProfile);
  const clearProfile = useProfileStore(state => state.clearProfile);
  
  // Check if we're on the login page
  const isLoginPage = location.pathname === "/login" || location.pathname === "/";
  
  // Only show footer when logged in or not on login page
  const showFooter = user || !isLoginPage;
  
  // Use useCallback to memoize the fetchUser function to prevent infinite loops
  const fetchUserOnce = useCallback(() => {
    fetchUser();
  }, [fetchUser]); // Include fetchUser in dependency array
  
  useEffect(() => {
    // Fetch user data on component mount - only once
    fetchUserOnce();
  }, [fetchUserOnce]);
  
  // Load profile data when user is authenticated
  useEffect(() => {
    const loadProfileData = async () => {
      if (user) {
        try {
          // Load user profile data and store it in the profile store
          await fetchProfile();
          console.log('Profile data loaded successfully into store');
        } catch (error) {
          console.error('Error loading profile data:', error);
        }
      } else {
        // Clear profile data when user logs out
        clearProfile();
      }
    };
    
    loadProfileData();
  }, [user, fetchProfile, clearProfile]);
  
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Navbar will be shown when user is logged in */}
      {user && <Navbar />}
      
      <Box flex="1" display="flex" flexDirection="column">
        <Routes>
          {/* Standard routes with authentication */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/docs" element={<DocumentationLayout />}>
            {/* Redirect /docs to /docs/welcome by default */}
            <Route index element={<Navigate to="/docs/welcome" replace />} /> 
            {/* Child route renders DocumentationPage inside the layout */}
            <Route path=":docName" element={<DocumentationPage />} />
          </Route>
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
      
      {/* Footer will only be shown when user is logged in or not on login page */}
      {showFooter && <Footer />}
    </Box>
  );
}

// Main App component
function App() {
  // Initialize auth state at the application root
  const fetchUser = useAuthStore(state => state.fetchUser);
  
  useEffect(() => {
    // Fetch user data on app initialization
    fetchUser();
  }, [fetchUser]);
  
  return (
    <Router>
      <TabProvider>
        <AuthProvider>
          <QueryProvider>
            <AppContent />
          </QueryProvider>
        </AuthProvider>
      </TabProvider>
    </Router>
  );
}

export default App;


