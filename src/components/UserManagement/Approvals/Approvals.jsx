import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tag,
  Badge,
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Tooltip,
  useColorModeValue,
  useToast,
  VStack,
  Divider,
  Select
} from '@chakra-ui/react';
import { 
  FiCheckSquare, 
  FiSlash, 
  FiEye, 
  FiFilter, 
  FiUser, 
  FiMoreVertical,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiClock as FiHistory,
  FiX, 
} from 'react-icons/fi';
import CommonTabHeader from "../../Common/CommonTabHeader";

// Mock data for pending approvals
const pendingRequests = [
  {
    id: '1001',
    requester: 'John Smith',
    requesterId: 'jsmith',
    // system: 'System1',
    system: 'KZOPA',
    department: 'Dept A',
    role: 'Process Engineer 1',
    requestDate: '2025-03-12T09:30:00',
    status: 'pending'
  },
  {
    id: '1002',
    requester: 'Emily Davis',
    requesterId: 'edavis',
    // system: 'System2',
    system: 'CCMS',
    department: 'Dept B',
    role: 'Supervisor',
    requestDate: '2025-03-11T16:45:00',
    status: 'pending'
  },
  {
    id: '1003',
    requester: 'Michael Johnson',
    requesterId: 'mjohnson',
    // system: 'System1',
    system: 'KZOPA',
    department: 'Dept C',
    role: 'Operator',
    requestDate: '2025-03-10T13:15:00',
    status: 'pending'
  },
  {
    id: '1004',
    requester: 'Sarah Williams',
    requesterId: 'swilliams',
    // system: 'System3',
    system: 'Legacy APN',
    department: 'Dept A',
    role: 'Lead',
    requestDate: '2025-03-10T10:00:00',
    status: 'pending'
  }
];

// Mock data for completed approvals
const completedRequests = [
  {
    id: '995',
    requester: 'James Wilson',
    requesterId: 'jwilson',
    // system: 'System2',
    system: 'CCMS',
    department: 'Dept D',
    role: 'Lead 2',
    requestDate: '2025-03-05T14:30:00',
    completedDate: '2025-03-06T09:45:00',
    status: 'approved',
    approver: 'Admin User'
  },
  {
    id: '996',
    requester: 'Patricia Moore',
    requesterId: 'pmoore',
    // system: 'System1',
    system: 'KZOPA',
    department: 'Dept E',
    role: 'Process Engineer 2',
    requestDate: '2025-03-04T11:20:00',
    completedDate: '2025-03-05T16:30:00',
    status: 'denied',
    approver: 'Admin User',
    reason: 'Insufficient clearance level'
  },
  {
    id: '997',
    requester: 'Robert Taylor',
    requesterId: 'rtaylor',
    // system: 'System3',
    system: 'Legacy APN',
    department: 'Dept B',
    role: 'Operator 2',
    requestDate: '2025-03-03T09:15:00',
    completedDate: '2025-03-04T13:10:00',
    status: 'approved',
    approver: 'Admin User'
  },
  {
    id: '998',
    requester: 'Jennifer Anderson',
    requesterId: 'janderson',
    // system: 'System1',
    system: 'KZOPA',
    department: 'Dept A',
    role: 'Supervisor 2',
    requestDate: '2025-03-02T15:45:00',
    completedDate: '2025-03-03T10:20:00',
    status: 'approved',
    approver: 'Admin User'
  },
  {
    id: '999',
    requester: 'Thomas Martin',
    requesterId: 'tmartin',
    // system: 'System2',
    system: 'CCMS',
    department: 'Dept C',
    role: 'Operator 3',
    requestDate: '2025-03-01T08:30:00',
    completedDate: '2025-03-01T14:15:00',
    status: 'denied',
    approver: 'Admin User',
    reason: 'Duplicate request'
  },
];

const Approvals = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [filterSystem, setFilterSystem] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const toast = useToast();
  
  // Color mode variables for consistent styling
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const highlightColor = useColorModeValue("blue.50", "blue.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.900");
  const tableRowHoverBg = useColorModeValue("gray.50", "gray.700");
  const avatarBg = useColorModeValue("blue.500", "blue.400");
  
  // Status badge colors
  const statusColors = {
    pending: "yellow",
    approved: "green",
    denied: "red"
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const approveRequest = (requestId) => {
    // In a real app, this would call an API
    toast({
      title: "Request Approved",
      description: `Request #${requestId} has been approved`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const denyRequest = (requestId) => {
    // In a real app, this would call an API
    toast({
      title: "Request Denied",
      description: `Request #${requestId} has been denied`,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };
  
  const viewRequestDetails = (request) => {
    setSelectedRequest(request);
    setDetailModalOpen(true);
    
    // In a real implementation, you would open a modal
    // For now, we'll just show a toast
    toast({
      title: "Request Details",
      description: `Viewing details for request #${request.id}`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Filter requests based on current filters
  const filteredPendingRequests = pendingRequests.filter(request => {
    if (filterSystem && request.system !== filterSystem) return false;
    if (filterDepartment && request.department !== filterDepartment) return false;
    return true;
  });
  
  const filteredCompletedRequests = completedRequests.filter(request => {
    if (filterSystem && request.system !== filterSystem) return false;
    if (filterDepartment && request.department !== filterDepartment) return false;
    return true;
  });
  
  // Get unique systems and departments for filters
  const systems = [...new Set([...pendingRequests, ...completedRequests].map(r => r.system))];
  const departments = [...new Set([...pendingRequests, ...completedRequests].map(r => r.department))];

  return (
    <Box as="section" width="100%" pt={4} pb={6}>
      <CommonTabHeader
        title="Access Approvals"
        description="Review and manage pending and completed access requests"
      />
      
      {/* Filters */}
      <Card 
        mt={4} 
        bg={cardBg}
        borderWidth="1px" 
        borderColor={borderColor}
        boxShadow="sm"
      >
        <CardBody>
          <Flex justifyContent="space-between" alignItems="center">
            <HStack spacing={4}>
              <Text fontWeight="medium" color={textColor}>Filter By:</Text>
              <Select 
                placeholder="All Systems" 
                value={filterSystem} 
                onChange={(e) => setFilterSystem(e.target.value)}
                maxW="200px"
              >
                {systems.map(system => (
                  <option key={system} value={system}>{system}</option>
                ))}
              </Select>
              <Select 
                placeholder="All Departments" 
                value={filterDepartment} 
                onChange={(e) => setFilterDepartment(e.target.value)}
                maxW="200px"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </Select>
            </HStack>
            <Button 
              leftIcon={<FiFilter />} 
              variant="outline"
              onClick={() => {
                setFilterSystem('');
                setFilterDepartment('');
              }}
              size="sm"
            >
              Clear Filters
            </Button>
          </Flex>
        </CardBody>
      </Card>
      
      {/* Main Content */}
      <Card 
        mt={4} 
        bg={cardBg}
        borderWidth="1px" 
        borderColor={borderColor}
        boxShadow="sm"
      >
        <Tabs variant="enclosed" onChange={(index) => setActiveTab(index)}>
          <TabList px={4} pt={4}>
            <Tab>
              <HStack spacing={2}>
                <Icon as={FiClock} color={activeTab === 0 ? "blue.500" : mutedTextColor} />
                <Text>Pending Approvals</Text>
                {pendingRequests.length > 0 && (
                  <Badge 
                    colorScheme="red"
                    variant={useColorModeValue("subtle", "solid")}
                  >
                    {filteredPendingRequests.length}
                  </Badge>
                )}
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <Icon as={FiCheckCircle} color={activeTab === 1 ? "blue.500" : mutedTextColor} />
                <Text>Completed Requests</Text>
                <Badge 
                  colorScheme="gray"
                  variant={useColorModeValue("subtle", "solid")}
                >
                  {filteredCompletedRequests.length}
                </Badge>
              </HStack>
            </Tab>
          </TabList>
          
          <TabPanels>
            {/* Pending Approvals Tab */}
            <TabPanel p={0}>
              <Box p={4}>
                {filteredPendingRequests.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <VStack spacing={3}>
                      <FiCheckCircle size="2em" color={useColorModeValue("gray.400", "gray.600")} />
                      <Text color={mutedTextColor}>No pending approvals</Text>
                      {(filterSystem || filterDepartment) && (
                        <Text fontSize="sm" color={mutedTextColor}>
                          Try clearing your filters to see more results
                        </Text>
                      )}
                    </VStack>
                  </Box>
                ) : (
                  <Table variant="simple" size="md">
                    <Thead>
                      <Tr>
                        <Th bg={tableHeaderBg} color={mutedTextColor}>Request ID</Th>
                        <Th bg={tableHeaderBg} color={mutedTextColor}>Requester</Th>
                        <Th bg={tableHeaderBg} color={mutedTextColor}>System</Th>
                        <Th bg={tableHeaderBg} color={mutedTextColor}>Department</Th>
                        <Th bg={tableHeaderBg} color={mutedTextColor}>Role</Th>
                        <Th bg={tableHeaderBg} color={mutedTextColor}>Request Date</Th>
                        <Th bg={tableHeaderBg} color={mutedTextColor} textAlign="center">Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredPendingRequests.map((request) => (
                        <Tr 
                          key={request.id}
                          _hover={{ bg: tableRowHoverBg }}
                          transition="background-color 0.2s"
                        >
                          <Td color={textColor}>{request.id}</Td>
                          <Td>
                            <HStack>
                              <Avatar 
                                size="xs" 
                                name={request.requester} 
                                icon={<FiUser fontSize="0.6rem" />} 
                                bg={avatarBg}
                                color="white"
                              />
                              <Text color={textColor}>{request.requester}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <Tag 
                              size="sm" 
                              variant={useColorModeValue("subtle", "solid")} 
                              colorScheme="blue"
                              fontWeight={useColorModeValue("normal", "medium")}
                            >
                              {request.system}
                            </Tag>
                          </Td>
                          <Td color={textColor}>{request.department}</Td>
                          <Td color={textColor}>{request.role}</Td>
                          <Td>
                            <HStack spacing={1}>
                              <FiCalendar size="0.75rem" color={useColorModeValue("gray.500", "gray.400")} />
                              <Text color={textColor}>{formatDate(request.requestDate)}</Text>
                            </HStack>
                            <HStack spacing={1} mt={1}>
                              <FiClock size="0.75rem" color={useColorModeValue("gray.500", "gray.400")} />
                              <Text fontSize="sm" color={mutedTextColor}>{formatTime(request.requestDate)}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack spacing={2} justifyContent="center">
                              <Tooltip label="View Details">
                                <IconButton
                                  aria-label="View Details"
                                  icon={<FiEye />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="blue"
                                  onClick={() => viewRequestDetails(request)}
                                />
                              </Tooltip>
                              <Tooltip label="Approve">
                                <IconButton
                                  aria-label="Approve"
                                  icon={<FiCheckCircle />}
                                  size="sm"
                                  colorScheme="green"
                                  isRound="true"
                                  onClick={() => approveRequest(request.id)}
                                />
                              </Tooltip>
                              <Tooltip label="Deny">
                                <IconButton
                                  aria-label="Deny"
                                  icon={<FiX />}
                                  size="sm"
                                  colorScheme="red"
                                  isRound="true"
                                  onClick={() => denyRequest(request.id)}
                                />
                              </Tooltip>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </Box>
            </TabPanel>
            
            {/* Completed Requests Tab */}
            <TabPanel p={0}>
              <Box p={4}>
                {filteredCompletedRequests.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <VStack spacing={3}>
                      <FiHistory size="2em" color={useColorModeValue("gray.400", "gray.600")} />
                      <Text color={mutedTextColor}>No completed requests</Text>
                      {(filterSystem || filterDepartment) && (
                        <Text fontSize="sm" color={mutedTextColor}>
                          Try clearing your filters to see more results
                        </Text>
                      )}
                    </VStack>
                  </Box>
                ) : (
                  <Table variant="simple" size="md">
                    <Thead>
                      <Tr>
                        <Th bg={tableHeaderBg} color={mutedTextColor}>Request ID</Th>
                        <Th bg={tableHeaderBg} color={mutedTextColor}>Requester</Th>
                        <Th bg={tableHeaderBg} color={mutedTextColor}>System</Th>
                        <Th bg={tableHeaderBg} color={mutedTextColor}>Role</Th>
                        <Th bg={tableHeaderBg} color={mutedTextColor}>Status</Th>
                        <Th bg={tableHeaderBg} color={mutedTextColor}>Completed Date</Th>
                        <Th bg={tableHeaderBg} color={mutedTextColor} textAlign="center">Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredCompletedRequests.map((request) => (
                        <Tr 
                          key={request.id}
                          _hover={{ bg: tableRowHoverBg }}
                          transition="background-color 0.2s"
                        >
                          <Td color={textColor}>{request.id}</Td>
                          <Td>
                            <HStack>
                              <Avatar 
                                size="xs" 
                                name={request.requester} 
                                icon={<FiUser fontSize="0.6rem" />} 
                                bg={avatarBg}
                                color="white"
                              />
                              <Text color={textColor}>{request.requester}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <Tag 
                              size="sm" 
                              variant={useColorModeValue("subtle", "solid")} 
                              colorScheme="blue"
                              fontWeight={useColorModeValue("normal", "medium")}
                            >
                              {request.system}
                            </Tag>
                          </Td>
                          <Td color={textColor}>{request.role}</Td>
                          <Td>
                            <Badge 
                              colorScheme={statusColors[request.status]}
                              variant={useColorModeValue("subtle", "solid")}
                            >
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={1}>
                              <FiCalendar size="0.75rem" color={useColorModeValue("gray.500", "gray.400")} />
                              <Text color={textColor}>{formatDate(request.completedDate)}</Text>
                            </HStack>
                            <HStack spacing={1} mt={1}>
                              <FiClock size="0.75rem" color={useColorModeValue("gray.500", "gray.400")} />
                              <Text fontSize="sm" color={mutedTextColor}>{formatTime(request.completedDate)}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack spacing={2} justifyContent="center">
                              <Tooltip label="View Details">
                                <IconButton
                                  aria-label="View Details"
                                  icon={<FiEye />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="blue"
                                  onClick={() => viewRequestDetails(request)}
                                />
                              </Tooltip>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>
      
      {/* In a real app, you would add a modal for request details here */}
    </Box>
  );
};

export default Approvals;