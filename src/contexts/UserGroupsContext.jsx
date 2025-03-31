import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchData } from '../../utils/ApiUtility';

export const UserGroupsContext = createContext();

export const useUserGroups = () => {
  const context = useContext(UserGroupsContext);
  if (!context) {
    throw new Error('useUserGroups must be used within a UserGroupsProvider');
  }
  return context;
};

// export const UserGroupsProvider = ({ children }) => {
//   const [userGroups, setUserGroups] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   const fetchUserGroups = useCallback(async (user) => {
//     if (!user || !user.sAMAccountName) {
//       setError('Valid user information is required');
//       return;
//     }
    
//     setSelectedUser(user);
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const data = await fetchData(
//         `/api/v1/ad/user-groups?sAMAccountName=${user.sAMAccountName}`, 
//         'UserGroups'
//       );
      
//       console.log('Fetched user groups:', data);
//       setUserGroups(data);
//     } catch (error) {
//       console.error('Error fetching user groups:', error);
//       setError(error.message || 'Failed to fetch user groups');
//       setUserGroups([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);
  
//   const clearUserGroups = () => {
//     setUserGroups([]);
//     setSelectedUser(null);
//     setError(null);
//   };
  
//   return (
//     <UserGroupsContext.Provider value={{
//       userGroups,
//       selectedUser,
//       isLoading,
//       error,
//       fetchUserGroups,
//       clearUserGroups
//     }}>
//       {children}
//     </UserGroupsContext.Provider>
//   );
// };


export const UserGroupsProvider = ({ children }) => {
  const [userGroups, setUserGroups] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchUserGroups = useCallback(async (user) => {
    if ((!user || !user.sAMAccountName) && (!user.isGroup || !user.dn)) {
      setError('Valid user or group information is required');
      return;
    }
    
    setSelectedUser(user);
    setIsLoading(true);
    setError(null);
    
    try {
      let url;
      
      if (user.isGroup && user.dn) {
        // Handle group memberships - pass DN and isGroup flag
        url = `/api/v1/ad/user-groups?dn=${encodeURIComponent(user.dn)}&isGroup=true`;
      } else {
        // Handle regular user memberships
        url = `/api/v1/ad/user-groups?sAMAccountName=${encodeURIComponent(user.sAMAccountName)}`;
      }
      
      const data = await fetchData(url, 'UserGroups');
      
      console.log('Fetched memberships:', data);
      setUserGroups(data);
    } catch (error) {
      console.error('Error fetching memberships:', error);
      setError(error.message || 'Failed to fetch memberships');
      setUserGroups([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const clearUserGroups = () => {
    setUserGroups([]);
    setSelectedUser(null);
    setError(null);
  };
  
  return (
    <UserGroupsContext.Provider value={{
      userGroups,
      selectedUser,
      isLoading,
      error,
      fetchUserGroups,
      clearUserGroups
    }}>
      {children}
    </UserGroupsContext.Provider>
  );
};