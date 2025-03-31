import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  HStack,
  VStack,
  Icon,
  Badge,
  Flex,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  CardBody,
  Avatar,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
  Checkbox,
  Tooltip
} from "@chakra-ui/react";
import { UserGroupsContext } from "../../../../contexts/UserGroupsContext";
import { 
  FiUsers, 
  FiUser,
  FiCheck, 
  FiX, 
  FiRefreshCw,
  FiArrowRight,
  FiUserCheck
} from "react-icons/fi";

const UserGroupsComparisonModal = ({ isOpen, onClose, users }) => {
  const { userGroups, isLoading: contextLoading, error: contextError, fetchUserGroups } = useContext(UserGroupsContext);
  const [userData, setUserData] = useState([
    { user: null, groups: [], isLoading: false, error: null },
    { user: null, groups: [], isLoading: false, error: null }
  ]);
  const [commonGroups, setCommonGroups] = useState([]);
  const [activeUserIndex, setActiveUserIndex] = useState(null);
  
  // State for group application feature
  const [sourceUserIndex, setSourceUserIndex] = useState(0); // Default source is first user
  const [targetUserIndex, setTargetUserIndex] = useState(1); // Default target is second user
  const [selectedGroupsToApply, setSelectedGroupsToApply] = useState([]);
  const [isApplyingGroups, setIsApplyingGroups] = useState(false);
  
  const toast = useToast();
  
  // Color mode variables
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.900");
  const tableRowHoverBg = useColorModeValue("gray.50", "gray.700");
  const avatarBg = useColorModeValue("blue.500", "blue.400");
  const uniqueBg = useColorModeValue("gray.50", "gray.700");
  const commonBg = useColorModeValue("green.50", "green.900");
  const sourceBg = useColorModeValue("blue.50", "blue.800");
  const targetBg = useColorModeValue("purple.50", "purple.800");
  
  // Initialize the user data structure when users change or modal opens
  useEffect(() => {
    if (!isOpen || !users || users.length < 1) return;
    
    // Reset user data
    const initialUserData = users.map(user => ({
      user,
      groups: [],
      isLoading: true,
      error: null
    }));
    
    // Pad with null users if less than 2 users
    while (initialUserData.length < 2) {
      initialUserData.push({
        user: null,
        groups: [],
        isLoading: false,
        error: null
      });
    }
    
    setUserData(initialUserData);
    setCommonGroups([]);
    setActiveUserIndex(0); // Start with the first user
    setSelectedGroupsToApply([]); // Reset selected groups
    
    // Fetch groups for the first user
    if (users[0]) {
      fetchUserGroups(users[0]);
    }
  }, [isOpen, users, fetchUserGroups]);
  
  // Handle context changes and update user data
  useEffect(() => {
    if (activeUserIndex === null || !userData[activeUserIndex]?.user) return;
    
    // If we have groups data in the context and we're not loading, update for the current user
    if (!contextLoading && userGroups) {
      setUserData(prevData => {
        const newData = [...prevData];
        newData[activeUserIndex] = {
          ...newData[activeUserIndex],
          groups: userGroups,
          isLoading: false,
          error: contextError || null
        };
        return newData;
      });
      
      // Move to next user if there is one
      if (activeUserIndex === 0 && userData[1]?.user) {
        setActiveUserIndex(1);
        fetchUserGroups(userData[1].user);
      } else if (activeUserIndex === 1 || !userData[1]?.user) {
        setActiveUserIndex(null); // We're done fetching
      }
    }
  }, [contextLoading, userGroups, contextError, activeUserIndex, userData, fetchUserGroups]);
  
  // Calculate common groups when both users' data is loaded
  useEffect(() => {
    if (!userData[0]?.groups?.length || !userData[1]?.groups?.length) return;
    
    // Find common groups based on group name
    const user1GroupNames = userData[0].groups.map(g => g.name);
    const common = userData[1].groups.filter(g => user1GroupNames.includes(g.name));
    setCommonGroups(common);
  }, [userData[0]?.groups, userData[1]?.groups]);
  
  // Check if a group is common between users
  const isCommonGroup = (groupName) => {
    return commonGroups.some(g => g.name === groupName);
  };
  
  // Swap source and target users
  const swapSourceAndTarget = () => {
    setSourceUserIndex(prev => prev === 0 ? 1 : 0);
    setTargetUserIndex(prev => prev === 0 ? 1 : 0);
    setSelectedGroupsToApply([]); // Reset selected groups when swapping
  };
  
  // Toggle a group for application
  const toggleGroupForApplication = (group) => {
    setSelectedGroupsToApply(prev => {
      const isAlreadySelected = prev.some(g => g.name === group.name);
      if (isAlreadySelected) {
        return prev.filter(g => g.name !== group.name);
      } else {
        return [...prev, group];
      }
    });
  };
  
  // Check if a group from source user is already in target user's groups
  const isGroupInTargetUser = (groupName) => {
    return userData[targetUserIndex]?.groups?.some(g => g.name === groupName) || false;
  };
  
  // Apply selected groups to target user
  const applyGroupsToTargetUser = () => {
    if (selectedGroupsToApply.length === 0) {
      toast({
        title: "No groups selected",
        description: "Please select at least one group to apply",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsApplyingGroups(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      toast({
        title: "Access request submitted",
        description: `Requested ${selectedGroupsToApply.length} groups for ${
          userData[targetUserIndex]?.user?.cn || "target user"
        }`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setIsApplyingGroups(false);
      setSelectedGroupsToApply([]); // Reset selection after "submission"
    }, 1500);
  };
  
  // Count unique groups (in source but not in target)
  const getUniqueGroupsCount = () => {
    if (!userData[sourceUserIndex]?.groups || !userData[targetUserIndex]?.groups) return 0;
    
    const targetGroupNames = userData[targetUserIndex].groups.map(g => g.name);
    return userData[sourceUserIndex].groups.filter(g => !targetGroupNames.includes(g.name)).length;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.300" />
      <ModalContent bg={cardBg} borderColor={borderColor} boxShadow="xl">
        <ModalHeader borderBottomWidth="1px" borderColor={borderColor} pb={4}>
          <Text fontWeight="bold" color={textColor}>
            Compare User Group Memberships
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pt={4} pb={6}>
          {/* User headers with source/target indicators */}
          <Grid templateColumns="1fr auto 1fr" gap={4} mb={6}>
            {userData.map((data, index) => (
              <React.Fragment key={index}>
                {data.user ? (
                  <GridItem 
                    p={3} 
                    borderRadius="md" 
                    bg={
                      index === sourceUserIndex
                        ? sourceBg
                        : index === targetUserIndex
                        ? targetBg
                        : "transparent"
                    }
                  >
                    <HStack spacing={3} justify="space-between">
                      <HStack>
                        <Avatar 
                          size="md" 
                          name={data.user.name || data.user.cn || data.user.displayName} 
                          bg={avatarBg}
                          icon={<FiUser fontSize="1.2rem" />}
                        />
                        <Box>
                          <Text fontWeight="bold" color={textColor}>
                            {data.user.name || data.user.cn || data.user.displayName}
                          </Text>
                          <Text fontSize="sm" color={mutedTextColor}>
                            {data.user.sAMAccountName}
                          </Text>
                        </Box>
                      </HStack>
                      
                      <Badge 
                        colorScheme={index === sourceUserIndex ? "blue" : "purple"}
                        fontSize="sm"
                        px={2}
                        py={1}
                      >
                        {index === sourceUserIndex ? "Source" : "Target"}
                      </Badge>
                    </HStack>
                  </GridItem>
                ) : (
                  <GridItem>
                    <HStack spacing={3}>
                      <Avatar 
                        size="md" 
                        icon={<FiUser fontSize="1.2rem" />}
                        bg="gray.400"
                      />
                      <Box>
                        <Text fontWeight="bold" color={mutedTextColor}>
                          No user selected
                        </Text>
                      </Box>
                    </HStack>
                  </GridItem>
                )}
                
                {/* Arrow in the middle with swap button */}
                {index === 0 && (
                  <GridItem display="flex" alignItems="center" justifyContent="center">
                    <VStack>
                      <Icon as={FiArrowRight} boxSize="1.5em" color={mutedTextColor} />
                      <Button 
                        size="xs" 
                        leftIcon={<Icon as={FiRefreshCw} />} 
                        onClick={swapSourceAndTarget}
                        colorScheme="gray"
                        variant="outline"
                      >
                        Swap
                      </Button>
                    </VStack>
                  </GridItem>
                )}
              </React.Fragment>
            ))}
          </Grid>
          
          {/* Group application controls - only show when both users have loaded */}
          {userData[0].user && userData[1].user && 
           !userData[0].isLoading && !userData[1].isLoading && (
            <Card mb={6} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Grid templateColumns="1fr auto" gap={4} alignItems="center">
                  <Box>
                    <HStack mb={2}>
                      <Icon
                        as={FiUsers}
                        color={sourceUserIndex === 0 ? "blue.500" : "purple.500"}
                      />
                      <Text fontWeight="medium" color={textColor}>
                        Apply Groups from{" "}
                        {userData[sourceUserIndex]?.user?.cn || "Source User"} to{" "}
                        {userData[targetUserIndex]?.user?.cn || "Target User"}
                      </Text>
                    </HStack>
                    
                    <Text fontSize="sm" color={mutedTextColor}>
                      Select groups from the source user (left) to apply to the target user (right).
                      {getUniqueGroupsCount() > 0 && (
                        <Text as="span" fontWeight="medium">
                          {" "}
                          {getUniqueGroupsCount()} groups are unique to the source user.
                        </Text>
                      )}
                    </Text>
                    
                    {selectedGroupsToApply.length > 0 && (
                      <HStack mt={3} flexWrap="wrap" spacing={2}>
                        <Text fontSize="sm" fontWeight="medium">Selected:</Text>
                        {selectedGroupsToApply.map((group, idx) => (
                          <Tag 
                            key={idx} 
                            size="sm" 
                            colorScheme="blue" 
                            variant="solid"
                            borderRadius="full"
                          >
                            <TagLabel>{group.name}</TagLabel>
                            <TagCloseButton onClick={() => toggleGroupForApplication(group)} />
                          </Tag>
                        ))}
                      </HStack>
                    )}
                  </Box>
                  
                  <Button
                    colorScheme="green"
                    isDisabled={selectedGroupsToApply.length === 0}
                    isLoading={isApplyingGroups}
                    loadingText="Submitting"
                    onClick={applyGroupsToTargetUser}
                    leftIcon={<Icon as={FiUserCheck} />}
                  >
                    Request Access ({selectedGroupsToApply.length})
                  </Button>
                </Grid>
              </CardBody>
            </Card>
          )}
          
          {/* Common groups summary */}
          {userData[0].user && userData[1].user && !userData[0].isLoading && !userData[1].isLoading && (
            <Box mb={6} p={4} borderWidth="1px" borderRadius="md" borderColor={borderColor} bg={commonBg}>
              <HStack mb={2}>
                <Icon as={FiUsers} color="green.500" />
                <Text fontWeight="medium" color={textColor}>
                  Common Groups
                </Text>
              </HStack>
              
              {commonGroups.length > 0 ? (
                <Text>
                  Found <strong>{commonGroups.length}</strong> common groups between these users
                </Text>
              ) : (
                <Text>These users don't share any common groups</Text>
              )}
            </Box>
          )}
          
          {/* Main comparison grid */}
          <Grid templateColumns="1fr 1fr" gap={6}>
            {userData.map((data, index) => (
              <GridItem key={index}>
                {data.isLoading ? (
                  <Flex justify="center" align="center" direction="column" py={10}>
                    <Spinner size="xl" mb={4} color="blue.500" />
                    <Text color={mutedTextColor}>Loading group memberships...</Text>
                  </Flex>
                ) : data.error ? (
                  <Flex justify="center" align="center" direction="column" py={10}>
                    <Icon as={FiX} boxSize="3em" color="red.500" mb={3} />
                    <Text color={textColor} fontWeight="medium">Error loading groups</Text>
                    <Text color={mutedTextColor} mt={1}>
                      {data.error}
                    </Text>
                  </Flex>
                ) : data.user && data.groups.length > 0 ? (
                  <Box>
                    <HStack spacing={2} mb={4}>
                      <Text fontWeight="medium" color={textColor}>
                        {data.groups.length} Groups
                      </Text>
                      <Badge 
                        colorScheme={index === sourceUserIndex ? "blue" : "purple"}
                        variant="outline"
                      >
                        {index === sourceUserIndex ? "Source" : "Target"}
                      </Badge>
                    </HStack>
                    
                    <Table variant="simple" size="md">
                      <Thead>
                        <Tr>
                          {/* Only show checkbox column for the source user */}
                          {index === sourceUserIndex && (
                            <Th width="40px" bg={tableHeaderBg} color={mutedTextColor}></Th>
                          )}
                          <Th bg={tableHeaderBg} color={mutedTextColor}>Group Name</Th>
                          <Th bg={tableHeaderBg} color={mutedTextColor} isNumeric>Members</Th>
                          <Th bg={tableHeaderBg} color={mutedTextColor}>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data.groups.map((group, groupIndex) => {
                          const isCommon = commonGroups.length > 0 && isCommonGroup(group.name);
                          const isSelected = selectedGroupsToApply.some(g => g.name === group.name);
                          const isInTargetUser = index === sourceUserIndex && isGroupInTargetUser(group.name);
                          
                          let rowBg = "transparent";
                          if (isCommon) rowBg = commonBg;
                          else if (index === sourceUserIndex) rowBg = sourceBg;
                          else if (index === targetUserIndex) rowBg = targetBg;
                          if (isSelected) rowBg = "blue.100";

                          return (
                            <Tr
                              key={groupIndex}
                              _hover={{ bg: tableRowHoverBg }}
                              transition="background-color 0.2s"
                              bg={rowBg}
                              opacity={index === sourceUserIndex && isInTargetUser ? 0.5 : 1}
                            >
                              {/* Source user's checkbox column */}
                              {index === sourceUserIndex && (
                                <Td width="40px" px={2}>
                                  {!isInTargetUser && (
                                    <Checkbox
                                      isChecked={isSelected}
                                      onChange={() => toggleGroupForApplication(group)}
                                      colorScheme="blue"
                                      isDisabled={isInTargetUser}
                                    />
                                  )}
                                  {isInTargetUser && (
                                    <Tooltip label="Already in target user's groups">
                                      <span>
                                        <Icon as={FiCheck} color="green.500" />
                                      </span>
                                    </Tooltip>
                                  )}
                                </Td>
                              )}

                              <Td>
                                <HStack>
                                  {isCommon && (
                                    <Icon as={FiCheck} color="green.500" />
                                  )}
                                  <VStack align="start" spacing={1}>
                                    <Text
                                      fontWeight={isCommon || isSelected ? "medium" : "normal"}
                                      color={textColor}
                                    >
                                      {group.name}
                                    </Text>
                                    {group.description && (
                                      <Text fontSize="sm" color={mutedTextColor}>{group.description}</Text>
                                    )}
                                  </VStack>
                                </HStack>
                              </Td>

                              <Td isNumeric>
                                <Badge colorScheme="blue" variant="outline">
                                  {group.memberCount}
                                </Badge>
                              </Td>

                              <Td>
                                <Badge 
                                  colorScheme={group.status === "Active" ? "green" : "yellow"}
                                  variant={useColorModeValue("subtle", "solid")}
                                >
                                  {group.status}
                                </Badge>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </Box>
                ) : data.user ? (
                  <Flex justify="center" align="center" direction="column" py={10}>
                    <Icon as={FiUsers} boxSize="3em" color={mutedTextColor} mb={3} />
                    <Text color={textColor} fontWeight="medium">No group memberships found</Text>
                    <Text color={mutedTextColor} mt={1}>
                      This user is not a member of any groups
                    </Text>
                  </Flex>
                ) : (
                  <Flex justify="center" align="center" direction="column" py={10}>
                    <Icon as={FiUser} boxSize="3em" color={mutedTextColor} mb={3} />
                    <Text color={textColor} fontWeight="medium">No user selected</Text>
                    <Text color={mutedTextColor} mt={1}>
                      Select two users to compare their group memberships
                    </Text>
                  </Flex>
                )}
              </GridItem>
            ))}
          </Grid>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
          <Button onClick={onClose} size="md">Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserGroupsComparisonModal;