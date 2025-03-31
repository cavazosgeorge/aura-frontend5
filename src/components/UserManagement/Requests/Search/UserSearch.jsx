
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  Spinner,
  Divider,
  useColorModeValue,
  useToast,
  Select,
  HStack,
  Tooltip
} from '@chakra-ui/react';
import { FiUser, FiSearch, FiHome } from 'react-icons/fi';
import debounce from 'lodash/debounce';

const UserSearch = ({ 
  onSelectUser = () => {}, 
  selectedUsers = [],
  onRemoveUser = () => {},
  onRequestForMyself = () => {},
  currentUserId
}) => {
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const menuRef = useRef(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  
  // Local state for search
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [homeSite, setHomeSite] = useState(
    () => localStorage.getItem('homeSite') || 'KZO'
  );
  const [selectedSite, setSelectedSite] = useState(homeSite); // Default selected to home

  // Constants
  const MIN_SEARCH_LENGTH = 5;
  
  // Get token from localStorage directly
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('accessToken') || '';
  }, []);
  
  // Custom handler for detecting clicks outside
  useEffect(() => {
    if (isMenuOpen || isFocused) {
      const handleClickOutside = (event) => {
        if (
          containerRef.current && 
          !containerRef.current.contains(event.target) &&
          menuRef.current && 
          !menuRef.current.contains(event.target)
        ) {
          setMenuOpen(false);
          setIsFocused(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside, true);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }
  }, [isMenuOpen, isFocused]);

  // Define site options
  const siteOptions = [
    { value: 'KZO', label: 'Kalamazoo' },
    { value: 'STM', label: 'Stamford' },
    { value: 'RMT', label: 'Rocky Mount' }
    // TODO: Fetch these options dynamically in the future?
  ];

  // Memoized search function with debounce to prevent excessive API calls
  const performSearch = useCallback(
    debounce(async (query) => {
      // TODO: Include selectedSite in the API call parameters
      // The backend will need to handle filtering based on the site
      console.log(`Searching for '${query}' within site: ${selectedSite}`);

      if (query.length >= MIN_SEARCH_LENGTH) {
        setIsLoading(true);
        
        try {
          // Get token for this specific request
          const token = getAuthToken();
          
          if (!token) {
            throw new Error('Authentication token is missing. Please log in again.');
          }
          
          // Hardcoded backend URL with correct path including /api prefix
          const backendUrl = 'http://146.240.94.12:3002';
          const endpoint = '/api/auth/search-users-minimal';
          const fullUrl = `${backendUrl}${endpoint}`;
          
          console.log('Initiating search request to:', fullUrl);
          console.log('Using auth token from localStorage:', token ? 'Token exists' : 'No token found');
          
          // Call the minimal search endpoint using fetch
          const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              searchTerm: query,
              limit: 10,
              site: selectedSite // Add the selected site to the request payload
            })
          });
          
          console.log('Response status:', response.status);
          
          if (!response.ok) {
            if (response.status === 401) {
              // Token might be expired, try to refresh it
              console.log('Token expired, attempting to refresh...');
              
              // Here you could potentially call the refreshUserToken function
              // from your auth store, but for simplicity we'll throw an error
              throw new Error('Your session has expired. Please log in again.');
            }
            
            const errorText = await response.text().catch(e => 'Failed to get error text');
            console.error('Error response body:', errorText);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
          
          const data = await response.json();
          console.log('Response data:', data);
          
          if (data && data.success && data.users) {
            // Transform the user data to match our expected format
            const transformedUsers = data.users.map(user => ({
              id: user.sAMAccountName || '',
              name: user.displayName || user.cn || user.sAMAccountName || '',
              email: user.mail || `${user.sAMAccountName}@pfizer.com` || '',
              department: user.department || ''
            }));
            
            setSearchResults(transformedUsers);
          } else {
            setSearchResults([]);
            console.warn('Search returned unexpected format:', data);
          }
        } catch (error) {
          console.error('Search error details:', error);

          let errorMessage = 'Failed to search users';
          if (error.message) {
            errorMessage = error.message;
          }
          
          toast({
            title: 'Search Error',
            description: error.message || 'Failed to search users',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setSearchResults([]);
        } finally {
          setIsLoading(false);
          setMenuOpen(true);
        }
      } else {
        setSearchResults([]);
        if (query.length === 0) {
          setMenuOpen(false);
        }
      }
    }, 300),
    [getAuthToken, selectedSite]
  );
  
  // Function to set the home site in localStorage
  const handleSetHomeSite = useCallback(() => {
    localStorage.setItem('homeSite', selectedSite);
    setHomeSite(selectedSite); // Update the homeSite state
    const selectedOption = siteOptions.find(option => option.value === selectedSite);
    toast({
      title: "Home Site Set",
      description: `${selectedOption?.label || selectedSite} is now your default site.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }, [selectedSite, siteOptions]);

  // Determine if the currently selected site is the home site
  const isCurrentSiteHome = selectedSite === homeSite;

  // Determine if the current user is already selected
  const isMyselfSelected = useMemo(() => {
    if (!currentUserId) return false; // Guard clause if prop isn't passed yet
    return selectedUsers.some(user => user.id === currentUserId);
  }, [selectedUsers, currentUserId]);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    performSearch(value);
  }, [performSearch]);
  
  // Get user initials for avatar
  const getUserInitials = useCallback((user) => {
    return (user.name || "?").split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase();
  }, []);
  
  // Get single initial for small avatar
  const getUserInitial = useCallback((user) => {
    return (user.name || "?").substring(0, 1).toUpperCase();
  }, []);

  return (
    <Card mb={6} variant="outline" borderColor={borderColor}>
      <CardBody>
        <Flex direction="row" justify="space-between" align="center" gap={4}>
          {/* Input container - Adjusted width */}
          <Box position="relative" width="55%" ref={containerRef}> 
            <InputGroup>
              <Input 
                placeholder="Search for users by name or email..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  setIsFocused(true);
                  if (searchQuery.length >= MIN_SEARCH_LENGTH) {
                    setMenuOpen(true);
                  }
                }}
                ref={inputRef}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Search users"
                  icon={<FiSearch />}
                  variant="ghost"
                  size="sm"
                />
              </InputRightElement>
            </InputGroup>

            {/* Search dropdown logic remains the same */}
            {(isMenuOpen || isFocused) && (
              <VStack
                ref={menuRef}
                spacing={0}
                position="absolute"
                zIndex="dropdown"
                mt="2px"
                border="1px solid"
                borderColor={borderColor}
                borderRadius="md"
                width="100%"
                maxH="220px"
                overflowY="auto"
                boxShadow="md"
                bg={cardBg}
              >
                {isLoading ? (
                  <Box p={4} textAlign="center">
                    <Flex direction="column" alignItems="center" gap={2}>
                      <Spinner
                        thickness="3px"
                        speed="0.8s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="md"
                      />
                      <Text fontSize="sm" color="gray.500">Searching...</Text>
                    </Flex>
                  </Box>
                ) : searchQuery.length === 0 ? (
                  <Box p={4} textAlign="center">
                    <Flex direction="column" alignItems="center" gap={2}>
                      <Box fontSize="lg" color="blue.300">
                        <FiSearch />
                      </Box>
                      <Text color="gray.500" fontSize="sm">
                        Start typing to search for users
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        Minimum {MIN_SEARCH_LENGTH} characters required
                      </Text>
                    </Flex>
                  </Box>
                ) : searchQuery.length < MIN_SEARCH_LENGTH ? (
                  <Box p={4} textAlign="center">
                    <Flex direction="column" alignItems="center" gap={2}>
                      <Box fontSize="lg" color="blue.300">
                        <FiSearch />
                      </Box>
                      <Text color="gray.500" fontSize="sm">
                        Please type {MIN_SEARCH_LENGTH - searchQuery.length} more character{MIN_SEARCH_LENGTH - searchQuery.length !== 1 ? 's' : ''}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        Minimum {MIN_SEARCH_LENGTH} characters required
                      </Text>
                    </Flex>
                  </Box>
                ) : searchResults.length === 0 ? (
                  <Box p={4} textAlign="center">
                    <Flex direction="column" alignItems="center" gap={2}>
                      <Box fontSize="lg" color="orange.300">
                        <FiSearch />
                      </Box>
                      <Text color="gray.500" fontSize="sm">No users found matching "{searchQuery}"</Text>
                      <Text fontSize="xs" color="gray.400">
                        Try a different search term
                      </Text>
                    </Flex>
                  </Box>
                ) : (
                  searchResults.map((user, index, array) => (
                    <Box key={user.id || index} width="100%">
                      <Box 
                        p={3}
                        _hover={{ bg: "blue.50" }}
                        cursor="pointer"
                        transition="background-color 0.2s"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectUser(user);
                          setSearchQuery("");
                          setMenuOpen(false);
                          setIsFocused(false);
                          
                          toast({
                            title: "User added",
                            description: `${user.name} has been added to selected users`,
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                          });
                        }}
                      >
                        <Flex alignItems="center" gap={3}>
                          {/* User avatar circle with initials */}
                          <Flex
                            bg="blue.500"
                            color="white"
                            borderRadius="full"
                            width="32px"
                            height="32px"
                            fontSize="sm"
                            fontWeight="bold"
                            justifyContent="center"
                            alignItems="center"
                          >
                            {getUserInitials(user)}
                          </Flex>
                          
                          <Box flex="1">
                            <Text fontWeight="bold" fontSize="sm">{user.name}</Text>
                            <Text fontSize="xs" color="gray.600">{user.email}</Text>
                          </Box>
                          
                          {/* Select button indicator */}
                          <Box
                            p={1}
                            borderRadius="md"
                            bg="blue.100"
                            color="blue.700"
                            fontSize="xs"
                            fontWeight="medium"
                          >
                            Select
                          </Box>
                        </Flex>
                      </Box>
                      {index !== array.length - 1 && <Divider />}
                    </Box>
                  ))
                )}
              </VStack>
            )}
          </Box>

          {/* Site Selection and Set Home Button - Adjusted width */}
          <HStack width="25%" spacing={2}> 
            <Select
              value={selectedSite}
              onChange={(e) => {
                setSelectedSite(e.target.value);
                // TODO: Potentially trigger a new search or clear results
                // when the site changes, depending on desired UX.
                // For now, just log the change.
                console.log(`Site changed to: ${e.target.value}`);
                // Clear search query and results when site changes?
                // setSearchQuery("");
                // setSearchResults([]);
                // setMenuOpen(false);
              }}
              size="md" // Match input size
            >
              {siteOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Tooltip 
              label={isCurrentSiteHome 
                ? `${siteOptions.find(o => o.value === homeSite)?.label || homeSite} is your Home Site` 
                : `Set ${siteOptions.find(o => o.value === selectedSite)?.label || selectedSite} as Home Site`}
              aria-label={isCurrentSiteHome ? "Current home site indicator" : "Set home site button"}
              placement="top" // Adjust placement as needed
              hasArrow
            >
              {/* Wrap the IconButton with Box for Tooltip to attach correctly when disabled */}
              <Box display="inline-block">
                <IconButton
                  icon={<FiHome />} // Use FiHome icon
                  aria-label={isCurrentSiteHome ? "This is your home site" : "Set as home site"} // Keep aria-label for accessibility
                  onClick={handleSetHomeSite}
                  variant={isCurrentSiteHome ? "solid" : "ghost"} // Conditional variant
                  colorScheme={isCurrentSiteHome ? "blue" : "gray"} // Conditional color
                  isDisabled={isCurrentSiteHome} // Disable button if it's already the home site
                />
              </Box>
            </Tooltip>
          </HStack>

          {/* Request for Myself Button - Now disables if current user is selected */}
          <Button
            leftIcon={<FiUser />}
            colorScheme="blue"
            variant="solid"
            onClick={onRequestForMyself}
            px={6}
            isDisabled={isMyselfSelected} // Disable if current user is already selected
          >
            Request for Myself
          </Button>
        </Flex>
        
        <Box mt={5} textAlign="left">
          <Flex alignItems="center" mb={3}>
            <Box 
              bg="blue.100" 
              color="blue.700" 
              borderRadius="full" 
              fontSize="xs" 
              px={2} 
              py={1} 
              mr={2}
            >
              {selectedUsers?.length || 0}
            </Box>
            <Text fontWeight="medium" fontSize="md">Selected Users</Text>
          </Flex>
          
          {selectedUsers?.length > 0 ? (
            <Flex gap={2} flexWrap="wrap">
              {selectedUsers.map((user) => (
                <Flex 
                  key={user.id} 
                  bg="blue.50" 
                  color="blue.700" 
                  borderRadius="full"
                  py={1}
                  pl={2}
                  pr={1}
                  alignItems="center"
                  fontSize="sm"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor="blue.100"
                >
                  <Flex 
                    bg="blue.500" 
                    color="white" 
                    width="20px" 
                    height="20px" 
                    borderRadius="full" 
                    alignItems="center" 
                    justifyContent="center"
                    mr={2}
                    fontSize="10px"
                    fontWeight="bold"
                  >
                    {getUserInitial(user)}
                  </Flex>
                  
                  {user.name}
                  
                  <Box 
                    ml={2} 
                    bg="blue.100"
                    p={1}
                    borderRadius="full"
                    cursor="pointer" 
                    onClick={() => onRemoveUser(user)}
                    _hover={{ bg: "blue.200" }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width="18px"
                    height="18px"
                    fontSize="10px"
                  >
                    ×
                  </Box>
                </Flex>
              ))}
            </Flex>
          ) : (
            <Box 
              p={4} 
              bg="gray.50" 
              borderRadius="md" 
              textAlign="center"
              border="1px dashed"
              borderColor="gray.200"
            >
              <Text color="gray.500" fontSize="sm">No users selected</Text>
              <Text color="gray.400" fontSize="xs" mt={1}>
                Search for users above or click "Request for Myself"
              </Text>
            </Box>
          )}
        </Box>
      </CardBody>
    </Card>
  );
};

export default React.memo(UserSearch);

// --- Parent Component Reminder ---
// Remember to pass the `currentUserId` prop to this UserSearch component.
// Example: <UserSearch currentUserId={authStoreUser?.id} ... />
// ---------------------------------
