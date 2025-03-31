// hooks/useUserSearch.js
import { useState, useRef, useEffect } from 'react';
import { fetchData } from "../../../utils/ApiUtility";
import useDebounce from "../hooks/useDebounce";

export default function useUserSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const inputRef = useRef(null);

  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length >= 2) { // Reduced to 2 chars for easier testing
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
      setFetchedUsers([]);
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const onSelectUser = (user) => {
    // Ensure we don't add duplicates
    if (!selectedUsers.some(u => u.sAMAccountName === user.sAMAccountName)) {
      setSelectedUsers((prevSelected) => [...prevSelected, user]);
    }
    setSearchQuery('');
    setFetchedUsers([]);
    setMenuOpen(false);
  };
  
  const onDeselectUser = (user) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.filter((u) => u.sAMAccountName !== user.sAMAccountName)
    );
  };

  return {
    searchQuery, 
    setSearchQuery,
    fetchedUsers, 
    setFetchedUsers,
    selectedUsers, 
    setSelectedUsers,
    isLoading, 
    setIsLoading,
    isMenuOpen, 
    setMenuOpen,
    handleSearch,
    onSelectUser,
    onDeselectUser,
    debouncedSearchQuery,
    inputRef
  };
}