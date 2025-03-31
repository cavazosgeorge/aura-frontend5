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
  useColorModeValue
} from "@chakra-ui/react";

/**
 * Modal component for displaying a user's group memberships
 */
const UserGroupsModal = ({ isOpen, onClose, user }) => {
  // Color mode variables
  const headerBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg={headerBg}>
          <Heading size="md" color={textColor}>
            Group Memberships
          </Heading>
          <Text color={mutedTextColor} fontSize="sm" mt={1}>
            {user.cn || user.name || user.displayName || user.samAccountName}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {user.groups && user.groups.length > 0 ? (
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Group Name</Th>
                    <Th>Type</Th>
                    <Th>Membership</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {user.groups.map((group, index) => (
                    <Tr key={`${group.name}-${index}`}>
                      <Td>
                        <Text fontWeight="medium">{group.name}</Text>
                      </Td>
                      <Td>
                        <Badge colorScheme="blue">{group.type || "Security"}</Badge>
                      </Td>
                      <Td>
                        <Badge 
                          colorScheme={group.membershipType === "Direct" ? "green" : "purple"}
                        >
                          {group.membershipType || "Direct"}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          ) : (
            <Flex justify="center" align="center" py={8}>
              <Text color={mutedTextColor}>No group memberships found</Text>
            </Flex>
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

export default UserGroupsModal;