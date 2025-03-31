import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  Divider,
  useColorModeValue
} from "@chakra-ui/react";

/**
 * Modal component for comparing group memberships between users
 */
const ComparisonModal = ({ isOpen, onClose, users }) => {
  // Color mode variables
  const headerBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const highlightBg = useColorModeValue("yellow.50", "yellow.900");

  if (!users || users.length < 2) return null;

  // Find common and unique groups
  const findCommonAndUniqueGroups = () => {
    const user1Groups = users[0].groups || [];
    const user2Groups = users[1].groups || [];
    
    const user1GroupNames = user1Groups.map(g => g.name);
    const user2GroupNames = user2Groups.map(g => g.name);
    
    const commonGroups = user1Groups.filter(g => user2GroupNames.includes(g.name));
    const uniqueToUser1 = user1Groups.filter(g => !user2GroupNames.includes(g.name));
    const uniqueToUser2 = user2Groups.filter(g => !user1GroupNames.includes(g.name));
    
    return { commonGroups, uniqueToUser1, uniqueToUser2 };
  };
  
  const { commonGroups, uniqueToUser1, uniqueToUser2 } = findCommonAndUniqueGroups();

  // Render group table
  const renderGroupTable = (groups, title, emptyMessage) => {
    return (
      <Box mb={6}>
        <Heading size="sm" mb={3} color={textColor}>
          {title}
        </Heading>
        {groups.length > 0 ? (
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Group Name</Th>
                  <Th>Type</Th>
                </Tr>
              </Thead>
              <Tbody>
                {groups.map((group, index) => (
                  <Tr key={`${group.name}-${index}`}>
                    <Td>
                      <Text fontWeight="medium">{group.name}</Text>
                    </Td>
                    <Td>
                      <Badge colorScheme="blue">{group.type || "Security"}</Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Flex justify="center" align="center" py={4}>
            <Text color={mutedTextColor}>{emptyMessage}</Text>
          </Flex>
        )}
      </Box>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg={headerBg}>
          <Heading size="md" color={textColor}>
            Group Membership Comparison
          </Heading>
          <Text color={mutedTextColor} fontSize="sm" mt={1}>
            Comparing {users[0].cn || users[0].name || users[0].samAccountName} and {users[1].cn || users[1].name || users[1].samAccountName}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4} p={3} bg={highlightBg} borderRadius="md">
            <Text fontWeight="medium">Summary:</Text>
            <Text>Common Groups: {commonGroups.length}</Text>
            <Text>Unique to {users[0].cn || users[0].name || users[0].samAccountName}: {uniqueToUser1.length}</Text>
            <Text>Unique to {users[1].cn || users[1].name || users[1].samAccountName}: {uniqueToUser2.length}</Text>
          </Box>
          
          {renderGroupTable(
            commonGroups, 
            "Common Groups", 
            "No common groups found"
          )}
          
          <Divider my={4} />
          
          {renderGroupTable(
            uniqueToUser1, 
            `Groups Unique to ${users[0].cn || users[0].name || users[0].samAccountName}`, 
            "No unique groups found"
          )}
          
          <Divider my={4} />
          
          {renderGroupTable(
            uniqueToUser2, 
            `Groups Unique to ${users[1].cn || users[1].name || users[1].samAccountName}`, 
            "No unique groups found"
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ComparisonModal;