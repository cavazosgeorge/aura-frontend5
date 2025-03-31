import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Icon,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { 
  FiFileText, 
  FiLogIn,
  FiUserPlus,
  FiUserX,
  FiEdit,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";

import CommonTabSearch from "../../Common/CommonTabSearch";
import useComplianceStore from "../../../stores/complianceStore";

// Mock audit data - would come from API in real implementation
const mockAuditData = [
  {
    id: 'audit001',
    actionType: 'login',
    description: 'User login successful',
    timestamp: '2025-03-15T09:30:22',
    ipAddress: '192.168.1.105',
    location: 'Kalamazoo',
    system: 'KZOPA Domain',
    success: true
  },
  {
    id: 'audit002',
    actionType: 'permission_change',
    description: 'Access granted to Operators level 1',
    timestamp: '2025-03-14T15:22:10',
    ipAddress: '10.54.112.88',
    location: 'VPN Connection',
    system: 'Legacy APN',
    success: true,
    approvedBy: 'Sarah Johnson'
  },
  {
    id: 'audit003',
    actionType: 'password_change',
    description: 'Password changed successfully',
    timestamp: '2025-02-26T11:42:56',
    ipAddress: '192.168.1.105',
    location: 'Kalamazoo',
    system: 'KZOPA Domain',
    success: true
  },
  {
    id: 'audit004',
    actionType: 'permission_request',
    description: 'Requested access to Operators level 2',
    timestamp: '2025-02-19T14:07:31',
    ipAddress: '10.54.112.88',
    location: 'VPN Connection',
    system: 'Legacy APN',
    success: true,
    status: 'Pending approval'
  },
  {
    id: 'audit005',
    actionType: 'login_failed',
    description: 'Failed login attempt',
    timestamp: '2025-02-12T08:15:44',
    ipAddress: '10.54.210.15',
    location: 'Unknown',
    system: 'CCMS',
    success: false,
    failureReason: 'Incorrect password'
  },
  {
    id: 'audit006',
    actionType: 'account_locked',
    description: 'Account temporarily locked',
    timestamp: '2025-02-07T08:20:12',
    ipAddress: '10.54.210.15',
    location: 'Unknown',
    system: 'CCMS',
    success: false,
    failureReason: 'Multiple failed login attempts'
  },
  {
    id: 'audit007',
    actionType: 'permission_change',
    description: 'Access revoked from Legacy System',
    timestamp: '2025-02-01T10:22:45',
    ipAddress: '192.168.1.105',
    location: 'Kalamazoo',
    system: 'Legacy APN',
    success: true,
    approvedBy: 'Sarah Johnson',
    reason: 'No longer required for current role'
  }
];

/**
 * Component for the Audit Trail tab
 * Displays system activity logs and allows searching/filtering
 */
const AuditTrailPanel = () => {
  // Use Zustand store for Audit Trail state
  const searchQuery = useComplianceStore(state => state.auditTrailSearchQuery);
  const setSearchQuery = useComplianceStore(state => state.setAuditTrailSearchQuery);
  const isMenuOpen = useComplianceStore(state => state.auditTrailIsMenuOpen);
  const setMenuOpen = useComplianceStore(state => state.setAuditTrailIsMenuOpen);
  const selectedUsers = useComplianceStore(state => state.auditTrailSelectedUsers);
  const addSelectedUser = useComplianceStore(state => state.addAuditTrailSelectedUser);
  const removeSelectedUser = useComplianceStore(state => state.removeAuditTrailSelectedUser);
  const clearSelectedUsers = useComplianceStore(state => state.clearAuditTrailSelectedUsers);
  
  // Mock search results - would come from API in real implementation
  const searchResults = searchQuery ? mockAuditData.filter(item => 
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.system.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];
  
  // Loading state from Zustand store
  const isLoading = useComplianceStore(state => state.isLoading);
  
  // Color mode variables for consistent styling
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.900");
  const tableRowHoverBg = useColorModeValue("gray.50", "gray.700");
  const iconColor = useColorModeValue("blue.500", "blue.300");

  // Automatically open/close the menu based on search query length
  useEffect(() => {
    if (searchQuery && searchQuery.length > 0) {
      setMenuOpen(true);
    } else {
      setMenuOpen(false);
    }
  }, [searchQuery, setMenuOpen]);

  // Format date function for audit trail
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Get appropriate icon for action type
  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'login':
        return FiLogIn;
      case 'permission_change':
        return FiShield;
      case 'password_change':
        return FiEdit;
      case 'permission_request':
        return FiUserPlus;
      case 'login_failed':
        return FiAlertCircle;
      case 'account_locked':
        return FiUserX;
      case 'profile_update':
        return FiEdit;
      default:
        return FiFileText;
    }
  };

  // Get appropriate tag color for action status
  const getStatusColor = (item) => {
    if (!item.success) return "red";
    if (item.actionType === 'permission_request' && item.status === 'Pending approval') return "yellow";
    return "green";
  };

  return (
    <>
      {/* Search Box */}
      <Card 
        variant="outline" 
        mb={6} 
        borderColor={borderColor}
      >
        <CardBody>
          <CommonTabSearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isMenuOpen={isMenuOpen}
            setMenuOpen={setMenuOpen}
            searchResults={searchResults}
            selectedUsers={selectedUsers}
            onSelectUser={(user) => addSelectedUser(user)}
            isLoading={isLoading}
            placeholder="Search audit logs by user, action, or system..."
          />
        </CardBody>
      </Card>
      
      {/* Audit Trail Table */}
      <Card variant="outline" borderColor={borderColor}>
        <CardHeader>
          <Heading size="sm" color={textColor}>System Activity Logs</Heading>
        </CardHeader>
        
        <CardBody pt={0}>
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th bg={tableHeaderBg} color={mutedTextColor}>Action</Th>
                <Th bg={tableHeaderBg} color={mutedTextColor}>Description</Th>
                <Th bg={tableHeaderBg} color={mutedTextColor}>Timestamp</Th>
                <Th bg={tableHeaderBg} color={mutedTextColor}>System</Th>
                <Th bg={tableHeaderBg} color={mutedTextColor}>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockAuditData.map((item) => (
                <Tr 
                  key={item.id} 
                  _hover={{ bg: tableRowHoverBg }} 
                  transition="background-color 0.2s"
                >
                  <Td>
                    <HStack>
                      <Icon as={getActionIcon(item.actionType)} color={iconColor} />
                      <Text color={textColor}>
                        {item.actionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Text>
                    </HStack>
                  </Td>
                  <Td color={textColor}>{item.description}</Td>
                  <Td color={mutedTextColor}>{formatDateTime(item.timestamp)}</Td>
                  <Td color={textColor}>{item.system}</Td>
                  <Td>
                    <Badge 
                      colorScheme={getStatusColor(item)} 
                      variant={useColorModeValue("subtle", "solid")}
                    >
                      {item.success ? 'Success' : 'Failed'}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
};

export default AuditTrailPanel;