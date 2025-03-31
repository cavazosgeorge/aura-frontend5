import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { fetchData } from '../../utils/ApiUtility';
import useDebounce from "../components/hooks/useDebounce";

export const SearchUsersContext = createContext();

export const useSearchUsers = () => {
  const context = useContext(SearchUsersContext);
  if (!context) {
    throw new Error('useSearchUsers must be used within a SearchUsersProvider');
  }
  return context;
};

export const SearchUsersProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const inputRef = useRef(null);

  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length >= 4) {
      handleSearch(debouncedSearchQuery);
    } else {
      setFetchedUsers([]);
    }
  }, [debouncedSearchQuery]);

  const handleSearch = async (query) => {
    setIsLoading(true);

    try {
      const data = await fetchData(`/api/v1/ad/user-info?displayName=${query}`, 'SearchUsers');
      console.log('Fetched users response:', data);
      setFetchedUsers(data);
      setMenuOpen(data.length > 0);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const onSelectUser = (user) => {
    setSelectedUsers((prevSelected) => [...prevSelected, user]);
    setSearchQuery('');
    setFetchedUsers([]);
    setMenuOpen(false);
  };

  const onDeselectUser = (user) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.filter((u) => u.sAMAccountName !== user.sAMAccountName)
    );
  };

  return (
    <SearchUsersContext.Provider value={{
      searchQuery, setSearchQuery,
      fetchedUsers, setFetchedUsers,
      selectedUsers, setSelectedUsers,
      isLoading, setIsLoading,
      isMenuOpen, setMenuOpen,
      handleSearch,
      onSelectUser,
      onDeselectUser,
      debouncedSearchQuery,
      inputRef
    }}>
      {children}
    </SearchUsersContext.Provider>
  );
};