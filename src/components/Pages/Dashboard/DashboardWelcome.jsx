import React, { useState, useEffect } from "react";
import { 
  Box, 
  SimpleGrid, 
  Card, 
  CardBody, 
  Heading, 
  Text, 
  Flex, 
  Icon, 
  HStack,
  VStack,
  Badge,
  Avatar,
  useColorModeValue,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import { 
  FiFileText, 
  FiCheckSquare, 
  FiSearch, 
  FiShield,
  FiClock,
  FiList,
  FiAlertCircle,
  FiCalendar,
  FiArrowRight,
  FiEye,
  FiXCircle
} from "react-icons/fi";
import useTabStore from "../../../stores/tabStore";
import RequestStatusTracker from "../../UserManagement/Requests/Status/RequestStatusTracker";
import { getUserRequests } from "../../../api/userApi";
import useAuthStore from "../../../stores/authStore";

/**
 * QuickAccessCard component displays a card with icon, title, and description
 * Used for quick navigation to main application features
 * 
 * @param {string} title - Card title
 * @param {string} description - Card description
 * @param {IconType} icon - React icon component
 * @param {string} color - Base color for the card (used for hover effects and icon)
 * @param {Function} onClick - Click handler function
 * @param {number} tabIndex - Tab index for accessibility
 * @returns {JSX.Element} Rendered QuickAccessCard component
 */
const QuickAccessCard = ({ title, description, icon, color, onClick, tabIndex }) => {
  const cardBg = useColorModeValue("white", "darkMode.card");
  const borderColor = useColorModeValue("gray.200", "darkMode.border");
  const textColor = useColorModeValue("gray.800", "darkMode.text");
  const mutedTextColor = useColorModeValue("gray.600", "darkMode.muted");
  const iconBg = useColorModeValue(`${color}.50`, `${color}.900`);
  const iconColor = useColorModeValue(`${color}.500`, `${color}.200`);

  return (
    <Card 
      bg={cardBg} 
      borderWidth="1px" 
      borderColor={borderColor}
      boxShadow="sm"
      transition="all 0.3s"
      _hover={{ 
        transform: "translateY(-4px)", 
        boxShadow: "md",
        borderColor: useColorModeValue(`${color}.200`, `${color}.700`)
      }}
      onClick={onClick}
      cursor="pointer"
      tabIndex={tabIndex}
      height="100%"
    >
      <CardBody>
        <Flex direction="column" height="100%">
          <Box
            p={2}
            borderRadius="md"
            bg={iconBg}
            color={iconColor}
            alignSelf="flex-start"
            mb={3}
            boxShadow="sm"
          >
            <Icon as={icon} boxSize={6} />
          </Box>
          
          <Heading size="md" mb={2} color={textColor}>
            {title}
          </Heading>
          
          <Text color={mutedTextColor} flex="1">
            {description}
          </Text>
          
          <HStack mt={4} color={iconColor} alignSelf="flex-end">
            <Text fontWeight="medium" fontSize="sm">Get Started</Text>
            <Icon as={FiArrowRight} />
          </HStack>
        </Flex>
      </CardBody>
    </Card>
  );
};

/**
 * RequestItem component displays a single request item with status information
 * Used in the dashboard's request list
 * 
 * @param {Object} request - Request data object
 * @param {Function} onViewDetails - Handler for viewing request details
 * @returns {JSX.Element} Rendered RequestItem component
 */
const RequestItem = ({ request, onViewDetails }) => {
  const borderColor = useColorModeValue("gray.200", "darkMode.border");
  const textColor = useColorModeValue("gray.800", "darkMode.text");
  const mutedTextColor = useColorModeValue("gray.600", "darkMode.muted");
  
  // Status badge properties
  const getStatusProps = (status) => {
    switch(status) {
      case "submitted":
        return { 
          colorScheme: "blue", 
          children: "Submitted" 
        };
      case "approved":
        return { 
          colorScheme: "green", 
          children: "Approved" 
        };
      case "rejected":
        return { 
          colorScheme: "red", 
          children: "Rejected" 
        };
      case "in-review":
        return { 
          colorScheme: "yellow", 
          children: "In Review" 
        };
      case "completed":
        return { 
          colorScheme: "green", 
          children: "Completed" 
        };
      default:
        return { 
          colorScheme: "gray", 
          children: status 
        };
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case "submitted":
        return FiFileText;
      case "in-review":
        return FiClock;
      case "approved":
        return FiCheckSquare;
      case "rejected":
        return FiXCircle;
      case "completed":
        return FiCheckSquare;
      default:
        return FiFileText;
    }
  };

  const StatusIcon = getStatusIcon(request.status);

  return (
    <Flex 
      p={2} 
      borderBottomWidth="1px" 
      borderColor={borderColor}
      _hover={{ bg: useColorModeValue("gray.50", "darkMode.hover") }}
      transition="background 0.2s"
      cursor="pointer"
      onClick={() => onViewDetails(request)}
    >
      <Box 
        p={2}
        borderRadius="md"
        bg={useColorModeValue("blue.50", "blue.900")}
        color={useColorModeValue("blue.500", "blue.200")}
        alignSelf="flex-start"
      >
        <Icon as={StatusIcon} boxSize={4} />
      </Box>
      
      <Box flex="1" pl={3}>
        <Flex justify="space-between" align="center">
          <Text fontWeight="medium" color={textColor} isTruncated>
            {request.system} - {request.role}
          </Text>
          <HStack spacing={2} align="center">
            <Text fontSize="xs" color={mutedTextColor} whiteSpace="nowrap">
              Sub: {request.submittedDate}
            </Text>
            <Badge {...getStatusProps(request.status)} size="sm" />
          </HStack>
        </Flex>
      </Box>
    </Flex>
  );
};

/**
 * TaskItem component displays a single task with type, due date, and priority
 * Used in the dashboard's task list
 * 
 * @param {string} title - Task title
 * @param {string} type - Task type (approval, review, compliance)
 * @param {string} dueDate - Due date for the task
 * @param {string} priority - Priority level (high, medium, low)
 * @returns {JSX.Element} Rendered TaskItem component
 */
const TaskItem = ({ title, type, dueDate, priority }) => {
  const borderColor = useColorModeValue("gray.200", "darkMode.border");
  const textColor = useColorModeValue("gray.800", "darkMode.text");
  const mutedTextColor = useColorModeValue("gray.600", "darkMode.muted");
  
  // Task type icon and color
  const getTaskIcon = (type) => {
    switch(type) {
      case "approval":
        return { 
          icon: FiCheckSquare,
          bg: useColorModeValue("blue.50", "blue.900"),
          color: useColorModeValue("blue.500", "blue.200")
        };
      case "review":
        return { 
          icon: FiShield,
          bg: useColorModeValue("blue.50", "blue.900"),
          color: useColorModeValue("blue.500", "blue.200")
        };
      case "compliance":
        return { 
          icon: FiSearch,
          bg: useColorModeValue("blue.50", "blue.900"),
          color: useColorModeValue("blue.500", "blue.200")
        };
      default:
        return { 
          icon: FiList,
          bg: useColorModeValue("blue.50", "blue.900"),
          color: useColorModeValue("blue.500", "blue.200")
        };
    }
  };

  // Priority badge
  const getPriorityProps = (priority) => {
    switch(priority) {
      case "high":
        return { 
          colorScheme: "red", 
          children: "High" 
        };
      case "medium":
        return { 
          colorScheme: "yellow", 
          children: "Medium" 
        };
      case "low":
        return { 
          colorScheme: "green", 
          children: "Low" 
        };
      default:
        return { 
          colorScheme: "gray", 
          children: priority 
        };
    }
  };

  const taskProps = getTaskIcon(type);

  return (
    <Flex 
      p={2} 
      borderBottomWidth="1px" 
      borderColor={borderColor}
      _hover={{ bg: useColorModeValue("gray.50", "darkMode.hover") }}
      transition="background 0.2s"
      cursor="pointer"
    >
      <Box 
        p={2}
        borderRadius="md"
        bg={taskProps.bg}
        color={taskProps.color}
        alignSelf="flex-start"
      >
        <Icon as={taskProps.icon} boxSize={4} />
      </Box>
      
      <Box flex="1" pl={3}>
        <Flex justify="space-between" align="center">
          <Text fontWeight="medium" color={textColor} isTruncated>
            {title}
          </Text>
          <HStack spacing={2} align="center">
            <HStack spacing={1} align="center">
              <Icon as={FiCalendar} fontSize="xs" color={mutedTextColor} />
              <Text fontSize="xs" color={mutedTextColor} whiteSpace="nowrap">
                Due: {dueDate}
              </Text>
            </HStack>
            <Badge {...getPriorityProps(priority)} size="sm" />
          </HStack>
        </Flex>
      </Box>
    </Flex>
  );
};

/**
 * DashboardWelcome component serves as the main dashboard landing page
 * Displays quick access cards, recent requests, and pending tasks
 * 
 * Features:
 * - Quick access navigation cards to main application features
 * - Recent requests list with status indicators
 * - Pending tasks with priority levels
 * - Modal for detailed request status viewing
 * 
 * @returns {JSX.Element} Rendered DashboardWelcome component
 */
const DashboardWelcome = () => {
  const setActiveTab = useTabStore(state => state.setActiveTab);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const user = useAuthStore(state => state.user);
  
  const cardBg = useColorModeValue("white", "darkMode.card");
  const borderColor = useColorModeValue("gray.200", "darkMode.border");
  const textColor = useColorModeValue("gray.800", "darkMode.text");
  const mutedTextColor = useColorModeValue("gray.600", "darkMode.muted");
  const headingColor = useColorModeValue("brand.700", "brand.200");
  
  // --- Layout & Mock Data Toggles ---
  const [layoutVariant, setLayoutVariant] = useState(() => {
    // Get saved layout from localStorage or default to 'twoColumn'
    const savedLayout = localStorage.getItem('dashboardLayoutVariant');
    return savedLayout || 'twoColumn';
  });
  const [showMockTasks, setShowMockTasks] = useState(true); // Toggle mock task visibility
  const [showMockRequests, setShowMockRequests] = useState(true); // Toggle mock request visibility
  // ----------------------------------

  // Save layout preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dashboardLayoutVariant', layoutVariant);
  }, [layoutVariant]);

  // Original Mock Tasks Data
  const mockTaskData = [
    {
      title: "Review John's Access Request",
      type: "approval",
      dueDate: "Mar 8, 2025",
      priority: "high"
    },
    {
      title: "Complete Quarterly Access Review",
      type: "compliance",
      dueDate: "Mar 15, 2025",
      priority: "medium"
    }
  ];

  // Conditionally set tasks based on the toggle state
  const myTasks = showMockTasks ? mockTaskData : [];

  // Mock data for My Requests (defined as constant)
  const mockMyRequestsData = [
    { 
      id: 'REQ-001', 
      system: 'Marketing Drive', 
      role: 'Contributor',
      status: 'approved', 
      requestedBy: 'Alice Johnson', 
      submittedDate: '2025-03-28',
      stages: [
        { name: 'Submitted', status: 'complete', date: '2025-03-28' },
        { name: 'Manager Approval', status: 'complete', date: '2025-03-29' },
        { name: 'IT Fulfillment', status: 'complete', date: '2025-03-30' },
        { name: 'Completed', status: 'complete', date: '2025-03-30' },
      ]
    },
    { 
      id: 'REQ-002', 
      system: 'Project Zeta', 
      role: 'Developer License', 
      status: 'in-review', 
      requestedBy: 'Bob Williams', 
      submittedDate: '2025-03-29',
      stages: [
        { name: 'Submitted', status: 'complete', date: '2025-03-29' },
        { name: 'Budget Review', status: 'active', date: null },
        { name: 'Purchase Order', status: 'pending', date: null },
        { name: 'License Assigned', status: 'pending', date: null },
      ]
    },
    { 
      id: 'REQ-003', 
      system: 'Corporate VPN', 
      role: 'Remote Access',
      status: 'rejected', 
      requestedBy: 'Charlie Brown', 
      submittedDate: '2025-03-25',
      rejectionReason: 'Duplicate request. Existing VPN access confirmed.',
      stages: [
        { name: 'Submitted', status: 'complete', date: '2025-03-25' },
        { name: 'Security Check', status: 'complete', date: '2025-03-26' },
        { name: 'Rejected', status: 'error', date: '2025-03-26' },
      ]
    },
    { 
      id: 'REQ-004', 
      system: 'Internal Wiki', 
      role: 'Administrator',
      status: 'submitted', 
      requestedBy: 'Diana Prince', 
      submittedDate: '2025-03-30',
      stages: [
        { name: 'Submitted', status: 'active', date: '2025-03-30' },
        { name: 'Department Head Approval', status: 'pending', date: null },
        { name: 'Permissions Granted', status: 'pending', date: null },
      ]
    },
  ];

  // Conditionally set requests based on the toggle state
  const myRequests = showMockRequests ? mockMyRequestsData : [];

  const handleViewRequestDetails = (request) => {
    setSelectedRequest(request);
    onOpen();
  };
  
  // Quick access cards data - tab indices match the MainTabs component (1=Requests, 2=Approvals, etc.)
  const quickAccessCards = [
    {
      title: "Submit Request",
      description: "Create a new access request for yourself or on behalf of another user",
      icon: FiFileText,
      color: "blue",
      onClick: () => setActiveTab(1) // Requests tab
    },
    {
      title: "Review Approvals",
      description: "View and manage pending approvals that require your attention",
      icon: FiCheckSquare,
      color: "blue",
      onClick: () => setActiveTab(2) // Approvals tab
    },
    {
      title: "User Lookup",
      description: "Search for users and view their access permissions and group memberships",
      icon: FiSearch,
      color: "blue",
      onClick: () => setActiveTab(3) // Lookup tab
    },
    {
      title: "Compliance Reports",
      description: "Access compliance reports and audit logs for your organization",
      icon: FiShield,
      color: "blue",
      onClick: () => setActiveTab(4) // Compliance tab
    }
  ];

  return (
    <Box> {/* Main dashboard container */}
      {/* TEMPORARY TOGGLE BUTTONS - REMOVE LATER */}
      <HStack mb={4} spacing={4}>
        <Button size="xs" onClick={() => setLayoutVariant(v => v === 'twoColumn' ? 'fullWidth' : 'twoColumn')}>Toggle Layout ({layoutVariant})</Button>
        <Button size="xs" onClick={() => setShowMockTasks(s => !s)}>Toggle Tasks ({showMockTasks ? 'Showing' : 'Hidden'})</Button>
        <Button size="xs" onClick={() => setShowMockRequests(s => !s)}>Toggle Requests ({showMockRequests ? 'Showing' : 'Hidden'})</Button>
      </HStack>

      {/* === Render Layout based on state === */}
      {layoutVariant === 'twoColumn' ? (
        <> 
          {/* LAYOUT A: 2-Column Top */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
            {/* Column 1: Quick Access Cards */}
            <Box>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                {quickAccessCards.map((card, index) => (
                  <QuickAccessCard key={index} {...card} />
                ))}
              </SimpleGrid>
            </Box>

            {/* Column 2: My Tasks */}
            <Box>
              <Card 
                bg={cardBg} 
                borderWidth="1px" 
                borderColor={borderColor}
                boxShadow="sm"
                overflow="hidden"
                height="100%" 
              >
                <CardBody p={0} display="flex" flexDirection="column">
                  <Box p={4} borderBottomWidth="1px" borderColor={borderColor}>
                    <HStack>
                      <Icon as={FiAlertCircle} color={headingColor} />
                      <Heading size="md" color={textColor}>My Tasks</Heading>
                    </HStack>
                  </Box>
                  
                  <VStack spacing={0} align="stretch" flex="1" overflowY="auto" maxH={{ md: "calc(100% - 90px)" }}>
                    {myTasks.length > 0 ? (
                      myTasks.map((task, index) => (
                        <TaskItem key={index} {...task} />
                      ))
                    ) : (
                      <Flex justify="center" align="center" p={4} height="100%">
                        <Text color={mutedTextColor}>No pending tasks</Text>
                      </Flex>
                    )}
                  </VStack>
                  
                  {myTasks.length > 0 && (
                    <Flex justify="center" p={3} borderTopWidth="1px" borderColor={borderColor} mt="auto">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        rightIcon={<FiArrowRight />}
                        color={useColorModeValue("brand.600", "brand.200")}
                        _hover={{ bg: useColorModeValue("brand.50", "brand.900") }}
                        onClick={() => setActiveTab(2)} 
                      >
                        View All Tasks
                      </Button>
                    </Flex>
                  )}
                </CardBody>
              </Card>
            </Box>

          </SimpleGrid>

          {/* My Requests card - full width below grid */}
          <Card 
            bg={cardBg} 
            borderWidth="1px" 
            borderColor={borderColor}
            boxShadow="sm"
            overflow="hidden"
          >
            <CardBody p={0}>
              <Box p={4} borderBottomWidth="1px" borderColor={borderColor}>
                <HStack>
                  <Icon as={FiFileText} color={headingColor} />
                  <Heading size="md" color={textColor}>My Requests</Heading>
                </HStack>
              </Box>
              
              <VStack spacing={0} align="stretch" maxH="212px" overflowY="auto">
                {myRequests.length > 0 ? (
                  myRequests.map((request, index) => (
                    <RequestItem 
                      key={index} 
                      request={request} 
                      onViewDetails={handleViewRequestDetails}
                    />
                  ))
                ) : (
                  <Flex justify="center" align="center" p={4}>
                    <Text color={mutedTextColor}>No requests found</Text>
                  </Flex>
                )}
              </VStack>
              
              {myRequests.length > 0 && (
                <Flex justify="center" p={3} borderTopWidth="1px" borderColor={borderColor}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    rightIcon={<FiArrowRight />}
                    color={useColorModeValue("brand.600", "brand.200")}
                    _hover={{ bg: useColorModeValue("brand.50", "brand.900") }}
                    onClick={() => setActiveTab(1)} // Navigate to Requests tab
                  >
                    View All Requests
                  </Button>
                </Flex>
              )}
            </CardBody>
          </Card>
        </>
      ) : (
        <> 
          {/* LAYOUT B: Full-Width Sections */}
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} mb={6}>
            {quickAccessCards.map((card, index) => (
              <QuickAccessCard key={index} {...card} />
            ))}
          </SimpleGrid>

          <Card 
            mb={6} 
            bg={cardBg} 
            borderWidth="1px" 
            borderColor={borderColor}
            boxShadow="sm"
            overflow="hidden"
          >
             <CardBody p={0}>
              <Box p={4} borderBottomWidth="1px" borderColor={borderColor}>
                <HStack>
                  <Icon as={FiAlertCircle} color={headingColor} />
                  <Heading size="md" color={textColor}>My Tasks</Heading>
                </HStack>
              </Box>
              
              <VStack spacing={0} align="stretch" maxH="212px" overflowY="auto">
                {myTasks.length > 0 ? (
                  myTasks.map((task, index) => (
                    <TaskItem key={index} {...task} />
                  ))
                  ) : (
                  <Flex justify="center" align="center" p={4} minHeight="80px">
                    <Text color={mutedTextColor}>No pending tasks</Text>
                  </Flex>
                )}
              </VStack>
              
              {myTasks.length > 0 && (
                <Flex justify="center" p={3} borderTopWidth="1px" borderColor={borderColor}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    rightIcon={<FiArrowRight />}
                    color={useColorModeValue("brand.600", "brand.200")}
                    _hover={{ bg: useColorModeValue("brand.50", "brand.900") }}
                    onClick={() => setActiveTab(2)} 
                  >
                    View All Tasks
                  </Button>
                </Flex>
              )}
            </CardBody>
          </Card>

          {/* My Requests card - full width below Tasks */}
           <Card 
            bg={cardBg} 
            borderWidth="1px" 
            borderColor={borderColor}
            boxShadow="sm"
            overflow="hidden"
          >
            <CardBody p={0}>
              <Box p={4} borderBottomWidth="1px" borderColor={borderColor}>
                <HStack>
                  <Icon as={FiFileText} color={headingColor} />
                  <Heading size="md" color={textColor}>My Requests</Heading>
                </HStack>
              </Box>
              
              <VStack spacing={0} align="stretch" maxH="212px" overflowY="auto">
                {myRequests.length > 0 ? (
                  myRequests.map((request, index) => (
                    <RequestItem 
                      key={index} 
                      request={request} 
                      onViewDetails={handleViewRequestDetails}
                    />
                  ))
                ) : (
                  <Flex justify="center" align="center" p={4}>
                    <Text color={mutedTextColor}>No requests found</Text>
                  </Flex>
                )}
              </VStack>
              
              {myRequests.length > 0 && (
                <Flex justify="center" p={3} borderTopWidth="1px" borderColor={borderColor}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    rightIcon={<FiArrowRight />}
                    color={useColorModeValue("brand.600", "brand.200")}
                    _hover={{ bg: useColorModeValue("brand.50", "brand.900") }}
                    onClick={() => setActiveTab(1)} // Navigate to Requests tab
                  >
                    View All Requests
                  </Button>
                </Flex>
              )}
            </CardBody>
          </Card>
        </>
      )}
      
      {/* Modal for detailed request status viewing */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedRequest && <RequestStatusTracker request={selectedRequest} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DashboardWelcome;