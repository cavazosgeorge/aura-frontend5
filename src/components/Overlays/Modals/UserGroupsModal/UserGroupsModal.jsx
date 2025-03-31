import React, { useContext, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  HStack,
  VStack,
  Icon,
  Badge,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorModeValue
} from "@chakra-ui/react";
import { UserGroupsContext } from "../../../../contexts/UserGroupsContext";
import { 
  FiUser,
  FiUsers,
  FiLayers,
  FiX
} from "react-icons/fi";

const UserGroupsModal = ({ isOpen, onClose, user }) => {
  const { userGroups, isLoading, error, fetchUserGroups } = useContext(UserGroupsContext);
  
  // Color mode variables for consistent styling
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.900");
  const tableRowHoverBg = useColorModeValue("gray.50", "gray.700");
  const avatarBg = useColorModeValue("blue.500", "blue.400");

  useEffect(() => {
    if (isOpen && user) {
      fetchUserGroups(user);
    }
  }, [isOpen, user, fetchUserGroups]);

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside" isCentered>
      <ModalOverlay bg="blackAlpha.300" />
      <ModalContent bg={cardBg} borderColor={borderColor} boxShadow="xl">
        <ModalHeader borderBottomWidth="1px" borderColor={borderColor} pb={4}>
          <HStack spacing={3}>
            <Avatar 
              size="sm" 
              name={user.name || user.fullName || user.displayName || user.cn} 
              bg={avatarBg}
              icon={<FiUser fontSize="1rem" />}
            />
            <Box>
              <Text fontWeight="bold" color={textColor}>
                Group Memberships
              </Text>
              <Text fontSize="sm" color={mutedTextColor}>
                {user.name || user.fullName || user.displayName || user.cn} ({user.sAMAccountName})
              </Text>
            </Box>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pt={4} pb={6}>
          {error && (
            <Flex justify="center" align="center" direction="column" py={10}>
              <Icon as={FiUsers} boxSize="3em" color="red.500" mb={3} />
              <Text color={textColor} fontWeight="medium">Error loading groups</Text>
              <Text color={mutedTextColor} mt={1}>
                {error}
              </Text>
            </Flex>
          )}
          
          {isLoading ? (
            <Flex justify="center" align="center" direction="column" py={10}>
              <Spinner size="xl" mb={4} color="blue.500" />
              <Text color={mutedTextColor}>Loading group memberships...</Text>
            </Flex>
          ) : userGroups.length === 0 && !error ? (
            <Flex justify="center" align="center" direction="column" py={10}>
              <Icon as={FiUsers} boxSize="3em" color={mutedTextColor} mb={3} />
              <Text color={textColor} fontWeight="medium">No group memberships found</Text>
              <Text color={mutedTextColor} mt={1}>
                This user is not a member of any groups
              </Text>
            </Flex>
          ) : (
            <Box>
              <HStack spacing={2} mb={4}>
                <Icon as={FiLayers} color="blue.500" />
                <Text fontWeight="medium" color={textColor}>
                  Found {userGroups.length} group memberships
                </Text>
              </HStack>
              
              <Table variant="simple" size="md">
                <Thead>
                  <Tr>
                    <Th bg={tableHeaderBg} color={mutedTextColor}>Group Name</Th>
                    <Th bg={tableHeaderBg} color={mutedTextColor} isNumeric>Members</Th>
                    <Th bg={tableHeaderBg} color={mutedTextColor}>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {userGroups.map((group) => (
                    <Tr 
                      key={group.id}
                      _hover={{ bg: tableRowHoverBg }}
                      transition="background-color 0.2s"
                    >
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium" color={textColor}>{group.name}</Text>
                          {group.description && (
                            <Text fontSize="sm" color={mutedTextColor}>{group.description}</Text>
                          )}
                        </VStack>
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
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
          <Button onClick={onClose} size="md">Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserGroupsModal;