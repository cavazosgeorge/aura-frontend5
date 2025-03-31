import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import useAuthStore from "../../../stores/authStore";
import useProfileStore from "../../../stores/profileStore";
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Avatar,
  VStack,
  HStack,
  Divider,
  Badge,
  List,
  ListItem,
  ListIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  useToast,
  Spinner,
  SimpleGrid,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spacer
} from "@chakra-ui/react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaIdBadge,
  FaUsersCog,
  FaKey,
  FaClipboardList,
  FaHistory,
  FaUserShield,
  FaEdit,
  FaUserClock,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaUserCheck,
  FaUserTimes,
  FaCalendarAlt,
  FaLock,
  FaEye,
  FaSync,
  FaSignInAlt
} from "react-icons/fa";

import PasswordManagement from "./PasswordManagement";
import StatsCards from "../Dashboard/StatsCards";

/**
 * ProfilePage component displays user profile information and settings
 */
const ProfilePage = () => {
  // Use Zustand store for authentication
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const toast = useToast();
  const navigate = useNavigate();
  
  // Use profile store instead of local loading state
  const profileData = useProfileStore((state) => state.profileData);
  const profileLoading = useProfileStore((state) => state.loading);
  const profileError = useProfileStore((state) => state.error);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  
  // Data ready state for conditional rendering
  const [dataReady, setDataReady] = useState(false);
  
  // Color mode variables for consistent styling
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const highlightColor = useColorModeValue("blue.50", "blue.900");
  const avatarBg = useColorModeValue("blue.500", "blue.400");
  const iconColor = useColorModeValue("blue.500", "blue.300");
  const warningBg = useColorModeValue("orange.50", "orange.900");
  const criticalBg = useColorModeValue("red.50", "red.900");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.900");
  
  // Initial user details with placeholder data
  const [userDetails, setUserDetails] = useState({
    displayName: "Loading...",
    title: "",
    department: "",
    email: "",
    phone: "",
    location: "",
    employeeId: "",
    joinDate: new Date().toISOString(),
    manager: "",
    isAdmin: false,
    // Access information
    accessGroups: [
      { name: "KZOPA - Cisco Switches Enable", status: "Active" },
      { name: "KZOPA - Infrastructure Admins", status: "Active" },
      { name: "KZOPA - Enterprise Admins", status: "Pending" }
    ],
    // Recent activity
    recentActivity: [
      { type: "login", date: "2023-04-15T09:30:00", details: "Login from AMER Network" },
      { type: "request", date: "2023-04-12T14:45:00", details: "Requested access to CCMS" },
      { type: "access_granted", date: "2023-04-10T11:20:00", details: "Access granted to Legacy APN" },
      { type: "profile_update", date: "2023-04-05T16:10:00", details: "Updated contact information" }
    ],
    // Admin dashboard data
    adminData: {
      // Security metrics for admin dashboard
      securityStats: [
        { 
          label: "Access Reviews", 
          value: 42, 
          change: "12 due this week", 
          icon: FaUserCheck,
          color: "blue" 
        },
        { 
          label: "Pending Approvals", 
          value: 17, 
          change: "5 high priority", 
          icon: FaClock,
          color: "orange" 
        },
        { 
          label: "Compliance Rate", 
          value: "94%", 
          change: "+2% from last month", 
          icon: FaShieldAlt,
          color: "green" 
        },
        { 
          label: "Security Alerts", 
          value: 8, 
          change: "3 critical", 
          icon: FaExclamationTriangle,
          color: "red" 
        }
      ],
      // Admin-specific recent activity
      adminActivity: [
        {
          id: "act1",
          type: "review_complete",
          user: "Chris Bassler",
          department: "Automation Engineering",
          system: "KZO",
          time: "2 hours ago",
          details: "Completed quarterly access review for VFF department"
        },
        {
          id: "act2",
          type: "access_granted",
          user: "Sarah Johnson",
          department: "Manufacturing Operations",
          system: "KZO",
          time: "4 hours ago",
          details: "Granted access to ATGAM Bio Ops for 3 users"
        },
        {
          id: "act3",
          type: "access_revoked",
          user: "Michael Chen",
          department: "IT",
          system: "CZO",
          time: "Yesterday",
          details: "Revoked expired access for 5 contractor accounts"
        },
        {
          id: "act4",
          type: "policy_update",
          user: "George Cavazos",
          department: "Automation Engineering",
          system: "KZO",
          time: "2 days ago",
          details: "Updated access policy for KZOPA domain"
        }
      ],
      // Upcoming access reviews
      upcomingReviews: [
        {
          id: "rev1",
          department: "VFF",
          system: "KZO",
          dueDate: "Mar 10, 2025",
          status: "Due Soon",
          progress: 0,
          assignedTo: "George Cavazos"
        },
        {
          id: "rev2",
          department: "Finance Department",
          system: "CZO",
          dueDate: "Mar 15, 2025",
          status: "In Progress",
          progress: 35,
          assignedTo: "Chris Bassler"
        },
        {
          id: "rev3",
          department: "LSS Manufacturing",
          system: "KZO",
          dueDate: "Mar 20, 2025",
          status: "Not Started",
          progress: 0,
          assignedTo: "George Cavazos"
        }
      ],
      // Security alerts
      securityAlerts: [
        {
          id: "alert1",
          severity: "Critical",
          system: "KZO",
          department: "KZOPA Domain",
          description: "Multiple failed login attempts detected",
          time: "1 hour ago"
        },
        {
          id: "alert2",
          severity: "High",
          system: "CZO",
          department: "Finance Department",
          description: "Unusual access pattern detected",
          time: "3 hours ago"
        },
        {
          id: "alert3",
          severity: "Medium",
          system: "KZO",
          department: "VFF",
          description: "Account inactive but still has active permissions",
          time: "Yesterday"
        }
      ]
    }
  });
  
  // Check authentication and redirect if not logged in
  // Check authentication and redirect if not logged in
  useEffect(() => {
    // If auth is done loading and user is null, redirect to login
    if (!loading && !user) {
      console.log("User not authenticated, redirecting to login");
      toast({
        title: "Authentication Required",
        description: "Please log in to view your profile",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login");
    }
  }, [user, loading, navigate, toast]);
  
  // Update userDetails when profile data changes
  useEffect(() => {
    // Set data ready to false whenever profile loading state changes
    if (profileLoading) {
      setDataReady(false);
      return;
    }
    
    if (profileData) {
      console.log("ProfilePage: Using pre-loaded profile data from store");
      setUserDetails(prevDetails => ({
        ...prevDetails,
        displayName: profileData.displayName || "No Name",
        title: profileData.jobTitle || "No Title",
        department: profileData.department || "No Department",
        email: profileData.email || "No Email",
        phone: profileData.phoneNumber || "No Phone",
        location: profileData.location || "No Location",
        employeeId: profileData.employeeId || "No ID",
        joinDate: profileData.profileCreated || new Date().toISOString(),
        // Assume admin status from job title or department for now
        isAdmin: profileData.jobTitle?.includes("Analyst") || false
      }));
      
      // Set data ready to true after updating
      setDataReady(true);
    } else if (user && !profileLoading) {
      // If we have a user but no profile data and we're not currently loading,
      // then try to fetch the profile data
      console.log("ProfilePage: No profile data in store, fetching...");
      fetchProfile().catch(err => {
        toast({
          title: "Profile Error",
          description: err.message || "Could not load your profile data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    }
  }, [user, profileData, profileLoading, fetchProfile, toast]);
  
  /**
   * Formats a date string to a readable format
   * @param {string} dateString - ISO date string to format
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };
  
  /**
   * Formats a date string to a readable date and time format
   * @param {string} dateString - ISO date string to format
   * @returns {string} Formatted date and time string
   */
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };
  
  /**
   * Gets the appropriate color scheme based on alert severity
   * @param {string} severity - Severity level (Critical, High, Medium, Low)
   * @returns {string} Chakra UI color scheme name
   */
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "red";
      case "High":
        return "orange";
      case "Medium":
        return "yellow";
      case "Low":
        return "green";
      default:
        return "gray";
    }
  };
  
  /**
   * Gets the appropriate icon based on activity type
   * @param {string} type - Activity type (review_complete, access_granted, etc.)
   * @returns {IconType} React icon component
   */
  const getActivityIcon = (type) => {
    switch (type) {
      case "review_complete":
        return FaCheckCircle;
      case "access_granted":
        return FaUserCheck;
      case "access_revoked":
        return FaUserTimes;
      case "policy_update":
        return FaShieldAlt;
      default:
        return FaHistory;
    }
  };
  
  /**
   * Gets the appropriate color scheme based on status
   * @param {string} status - Status value (Due Soon, In Progress, etc.)
   * @returns {string} Chakra UI color scheme name
   */
  const getStatusColor = (status) => {
    switch (status) {
      case "Due Soon":
        return "yellow";
      case "In Progress":
        return "blue";
      case "Not Started":
        return "gray";
      case "Completed":
        return "green";
      default:
        return "gray";
    }
  };
  
  // Show loading state while checking authentication
  // if (loading) {
  //   return (
  //     <Flex align="center" justify="center" height="50vh">
  //       <Spinner size="xl" />
  //       <Text ml={4}>Checking authentication...</Text>
  //     </Flex>
  //   );
  // }
  
  // Show login prompt if not authenticated
  if (!user) {
    return (
      <Flex align="center" justify="center" direction="column" height="50vh" gap={4}>
        <Heading size="lg">Authentication Required</Heading>
        <Text>Please log in to view your profile</Text>
        <Button 
          leftIcon={<FaSignInAlt />} 
          colorScheme="blue" 
          onClick={() => navigate("/login")}
        >
          Go to Login
        </Button>
      </Flex>
    );
  }

  // // Show loading state while profile data is loading
  // if (profileLoading || !dataReady) {
  //   return (
  //     <Flex align="center" justify="center" height="50vh">
  //       {/* <Spinner size="xl" color="blue.500" thickness="4px" /> */}
  //       <Text ml={4} fontSize="lg">Loading profile data...</Text>
  //     </Flex>
  //   );
  // }
  
  // Show error state if there was an error
  // if (profileError && !dataReady) {
  //   return (
  //     <Flex align="center" justify="center" direction="column" height="50vh" gap={4}>
  //       <Heading size="md" color="red.500">Error Loading Profile</Heading>
  //       <Text>{profileError}</Text>
  //       <Button 
  //         colorScheme="blue" 
  //         onClick={() => fetchProfile()}
  //       >
  //         Retry
  //       </Button>
  //     </Flex>
  //   );
  // }
  
  return (
    <Box as="section" width="100%" pt={4} pb={6}> {/* Main container */}
      <Box 
        bg={highlightColor} 
        pt={{ base: 6, md: 8 }} 
        pb={{ base: 6, md: 8 }}
        px={{ base: 4, md: 8 }}
        mb={6}
      >
        <Flex 
          direction={{ base: "column", md: "row" }}
          maxW="container.xl" 
          mx="auto"
          align="center"
        >
          <Heading size="lg" color={textColor}>User Profile</Heading>
          <Text 
            ml={{ base: 0, md: 4 }} 
            mt={{ base: 2, md: 0 }} 
            color={mutedTextColor}
          >
            View and manage your profile information
          </Text>
        </Flex>
      </Box>
      
      {/* Main content grid - sidebar layout on large screens */}
      <Grid 
        templateColumns={{ base: "1fr", lg: "300px 1fr" }}
        gap={6}
        maxW="container.xl" 
        mx="auto"
        px={{ base: 4, md: 6 }}
      >
        {/* Left sidebar - Profile Summary Card */}
        <GridItem>
          <Card 
            bg={cardBg}
            borderWidth="1px" 
            borderColor={borderColor}
            boxShadow="sm"
            height="fit-content"
          >
            <CardBody>
              {profileLoading ? (
                <VStack spacing={4} py={6}>
                  {/* <Spinner size="xl" /> */}
                  {/* <Text>Loading profile...</Text> */}
                </VStack>
              ) : profileError ? (
                <VStack spacing={4} py={6}>
                  <Text color="red.500">{profileError}</Text>
                  <Button 
                    colorScheme="blue" 
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={4} align="center">
                  <Avatar 
                    size="2xl" 
                    name={userDetails.displayName}
                    bg={avatarBg}
                    color="white"
                    icon={<FaUser fontSize="2rem" />}
                  />
                  <VStack spacing={1}>
                    <Heading size="md" color={textColor}>{userDetails.displayName}</Heading>
                    <Text color={mutedTextColor}>{userDetails.title}</Text>
                    <Badge 
                      colorScheme="blue" 
                      variant={useColorModeValue("subtle", "solid")}
                      mt={1}
                    >
                      {userDetails.department}
                    </Badge>
                  </VStack>
                  
                  <Divider />
                  
                  <VStack spacing={3} align="start" width="100%">
                    <HStack>
                      <Box color={mutedTextColor} width="24px">
                        <FaEnvelope />
                      </Box>
                      <Text color={textColor}>{userDetails.email}</Text>
                    </HStack>
                    
                    <HStack>
                      <Box color={mutedTextColor} width="24px">
                        <FaPhone />
                      </Box>
                      <Text color={textColor}>{userDetails.phone || "Not provided"}</Text>
                    </HStack>
                    
                    <HStack>
                      <Box color={mutedTextColor} width="24px">
                        <FaBuilding />
                      </Box>
                      <Text color={textColor}>{userDetails.location}</Text>
                    </HStack>
                    
                    <HStack>
                      <Box color={mutedTextColor} width="24px">
                        <FaIdBadge />
                      </Box>
                      <Text color={textColor}>ID: {userDetails.employeeId}</Text>
                    </HStack>
                    
                    <HStack>
                      <Box color={mutedTextColor} width="24px">
                        <FaUserClock />
                      </Box>
                      <Text color={textColor}>Joined: {formatDate(userDetails.joinDate)}</Text>
                    </HStack>
                  </VStack>
                </VStack>
              )}
            </CardBody>
          </Card>
        </GridItem>
        
        {/* Right content area - Detailed Information Tabs */}
        <GridItem>
          <Card 
            bg={cardBg}
            borderWidth="1px" 
            borderColor={borderColor}
            boxShadow="sm"
          >
            <Tabs variant="enclosed">
              {/* Main navigation tabs */}
              <TabList px={4} pt={4}>
                <Tab>Access Information</Tab>
                <Tab>Recent Activity</Tab>
                <Tab>Security</Tab>
                {userDetails.isAdmin && <Tab>Admin Dashboard</Tab>}
              </TabList>
              
              {/* Tab content panels */}
              <TabPanels>
                {/* Access Information Tab */}
                <TabPanel p={4}>
                  <VStack spacing={4} align="stretch">
                    <HStack>
                      <FaUsersCog size="1.2em" color={useColorModeValue("blue.500", "blue.300")} />
                      <Heading size="sm" color={textColor}>System Access & Permissions</Heading>
                    </HStack>
                    
                    <Divider />
                    
                    <List spacing={3}>
                      {userDetails.accessGroups.map((group, index) => (
                        <ListItem key={index}>
                          <HStack>
                            <ListIcon as={FaKey} color={useColorModeValue("blue.500", "blue.300")} />
                            <Text color={textColor}>{group.name}</Text>
                            <Spacer />
                            <Badge 
                              colorScheme={group.status === "Active" ? "green" : "yellow"}
                              variant={useColorModeValue("subtle", "solid")}
                            >
                              {group.status}
                            </Badge>
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                    
                    <Button 
                      leftIcon={<FaKey />} 
                      colorScheme="blue" 
                      variant="outline"
                      size="sm"
                      alignSelf="flex-start"
                      mt={2}
                    >
                      Request New Access
                    </Button>
                  </VStack>
                </TabPanel>
                
                {/* Recent Activity Tab */}
                <TabPanel p={4}>
                  <VStack spacing={4} align="stretch">
                    <HStack>
                      <FaHistory size="1.2em" color={useColorModeValue("blue.500", "blue.300")} />
                      <Heading size="sm" color={textColor}>Recent Activity</Heading>
                    </HStack>
                    
                    <Divider />
                    
                    <List spacing={4}>
                      {userDetails.recentActivity.map((activity, index) => (
                        <ListItem key={index}>
                          <HStack align="start">
                            <Box 
                              mt={1} 
                              mr={2}
                              color={useColorModeValue("blue.500", "blue.300")}
                            >
                              {activity.type === "login" && <FaUser />}
                              {activity.type === "request" && <FaClipboardList />}
                              {activity.type === "access_granted" && <FaUserShield />}
                              {activity.type === "profile_update" && <FaEdit />}
                            </Box>
                            <VStack align="start" spacing={0}>
                              <Text color={textColor}>{activity.details}</Text>
                              <Text fontSize="sm" color={mutedTextColor}>
                                {formatDateTime(activity.date)}
                              </Text>
                            </VStack>
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                    
                    <Button 
                      leftIcon={<FaHistory />} 
                      colorScheme="blue" 
                      variant="outline"
                      size="sm"
                      alignSelf="flex-start"
                      mt={2}
                    >
                      View All Activity
                    </Button>
                  </VStack>
                </TabPanel>
                
                {/* Security Tab */}
                <TabPanel p={4}>
                  <VStack spacing={4} align="stretch">
                    <HStack>
                      <FaUserShield size="1.2em" color={useColorModeValue("blue.500", "blue.300")} />
                      <Heading size="sm" color={textColor}>Security Settings</Heading>
                    </HStack>
                    
                    <Divider />
                    
                    {/* Password Management Component */}
                    <PasswordManagement formatDate={formatDate} />
                    
                    <Card variant="outline" p={4}>
                      <VStack align="start" spacing={2}>
                        <Heading size="xs" color={textColor}>Login Sessions</Heading>
                        <Text color={mutedTextColor}>
                          You are currently logged in from 1 device.
                        </Text>
                        <Button 
                          mt={2} 
                          colorScheme="red" 
                          variant="outline" 
                          size="sm"
                        >
                          Log Out All Sessions
                        </Button>
                      </VStack>
                    </Card>
                  </VStack>
                </TabPanel>
                
                {/* Admin Dashboard Tab - Only visible for admin users */}
                {userDetails.isAdmin && (
                  <TabPanel p={4}>
                    <VStack spacing={6} align="stretch">
                      {/* Admin Dashboard Header */}
                      <HStack>
                        <FaShieldAlt size="1.2em" color={useColorModeValue("blue.500", "blue.300")} />
                        <Heading size="sm" color={textColor}>Admin Dashboard</Heading>
                      </HStack>
                      
                      <Divider />
                      
                      {/* Request Statistics */}
                      <StatsCards spacingSize={4} />
                      
                      {/* Upcoming Access Reviews */}
                      <Box mt={4}>
                        <HStack mb={3}>
                          <FaCalendarAlt size="1em" color={useColorModeValue("blue.500", "blue.300")} />
                          <Heading size="xs" color={textColor}>Recent Access Requests</Heading>
                        </HStack>
                        
                        <Card bg={cardBg} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                          <Table size="sm" variant="simple">
                            <Thead bg={tableHeaderBg}>
                              <Tr>
                                <Th>Department</Th>
                                <Th>System</Th>
                                <Th>Due Date</Th>
                                <Th>Status</Th>
                                <Th>Progress</Th>
                                <Th>Assigned To</Th>
                                <Th></Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {userDetails.adminData.upcomingReviews.map((review) => (
                                <Tr key={review.id}>
                                  <Td>{review.department}</Td>
                                  <Td>{review.system}</Td>
                                  <Td>{review.dueDate}</Td>
                                  <Td>
                                    <Badge colorScheme={getStatusColor(review.status)}>
                                      {review.status}
                                    </Badge>
                                  </Td>
                                  <Td width="150px">
                                    <Progress 
                                      value={review.progress} 
                                      size="xs" 
                                      colorScheme={getStatusColor(review.status)}
                                      borderRadius="full"
                                    />
                                  </Td>
                                  <Td>{review.assignedTo}</Td>
                                  <Td>
                                    <Button size="xs" leftIcon={<FaEye />} variant="ghost" colorScheme="blue">
                                      View
                                    </Button>
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </Card>
                      </Box>
                      
                      {/* Two-column layout for Security Alerts and Recent Activity */}
                      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mt={4}>
                        {/* Security Alerts */}
                        <GridItem>
                          <HStack mb={3}>
                            <FaExclamationTriangle size="1em" color={useColorModeValue("red.500", "red.300")} />
                            <Heading size="xs" color={textColor}>Security Alerts</Heading>
                          </HStack>
                          
                          <Card bg={cardBg} boxShadow="sm" borderWidth="1px" borderColor={borderColor} height="100%">
                            <CardBody p={3}>
                              <List spacing={3}>
                                {userDetails.adminData.securityAlerts.map((alert) => (
                                  <ListItem key={alert.id}>
                                    <HStack>
                                      <Badge colorScheme={getSeverityColor(alert.severity)} variant="solid">
                                        {alert.severity}
                                      </Badge>
                                      <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                        {alert.description}
                                      </Text>
                                    </HStack>
                                    <HStack mt={1} fontSize="xs" color={mutedTextColor}>
                                      <Text>{alert.system} - {alert.department}</Text>
                                      <Text>•</Text>
                                      <Text>{alert.time}</Text>
                                    </HStack>
                                  </ListItem>
                                ))}
                              </List>
                              
                              <Button 
                                size="sm" 
                                variant="outline" 
                                colorScheme="blue" 
                                leftIcon={<FaEye />}
                                mt={4}
                                width="full"
                              >
                                View All Alerts
                              </Button>
                            </CardBody>
                          </Card>
                        </GridItem>
                        
                        {/* Recent Admin Activity */}
                        <GridItem>
                          <HStack mb={3}>
                            <FaHistory size="1em" color={useColorModeValue("blue.500", "blue.300")} />
                            <Heading size="xs" color={textColor}>Recent Admin Activity</Heading>
                          </HStack>
                          
                          <Card bg={cardBg} boxShadow="sm" borderWidth="1px" borderColor={borderColor} height="100%">
                            <CardBody p={3}>
                              <List spacing={3}>
                                {userDetails.adminData.adminActivity.map((activity) => {
                                  const ActivityIcon = getActivityIcon(activity.type);
                                  return (
                                    <ListItem key={activity.id}>
                                      <HStack align="start">
                                        <Box mt={1} color={iconColor}>
                                          <ActivityIcon size="0.9em" />
                                        </Box>
                                        <Box>
                                          <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                            {activity.details}
                                          </Text>
                                            <HStack mt={1} fontSize="xs" color={mutedTextColor}>
                                              <Text>{activity.user}</Text>
                                              <Text>•</Text>
                                              <Text>{activity.system}</Text>
                                              <Text>•</Text>
                                              <Text>{activity.time}</Text>
                                          </HStack>
                                        </Box>
                                      </HStack>
                                    </ListItem>
                                  );
                                })}
                              </List>
                              
                              <Button 
                                size="sm" 
                                variant="outline" 
                                colorScheme="blue" 
                                leftIcon={<FaHistory />}
                                mt={4}
                                width="full"
                              >
                                View All Activity
                              </Button>
                            </CardBody>
                          </Card>
                        </GridItem>
                      </Grid>
                      
                      {/* Quick Actions */}
                      <Box mt={4}>
                        <HStack mb={3}>
                          <FaLock size="1em" color={useColorModeValue("blue.500", "blue.300")} />
                          <Heading size="xs" color={textColor}>Quick Actions</Heading>
                        </HStack>
                        
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                          <Button 
                            leftIcon={<FaSync />} 
                            colorScheme="blue" 
                            variant="outline"
                            size="sm"
                          >
                            Run Access Review
                          </Button>
                          <Button 
                            leftIcon={<FaUserCheck />} 
                            colorScheme="green" 
                            variant="outline"
                            size="sm"
                          >
                            Approve Pending Requests
                          </Button>
                          <Button 
                            leftIcon={<FaShieldAlt />} 
                            colorScheme="purple" 
                            variant="outline"
                            size="sm"
                          >
                            Security Policy Settings
                          </Button>
                        </SimpleGrid>
                      </Box>
                    </VStack>
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ProfilePage;