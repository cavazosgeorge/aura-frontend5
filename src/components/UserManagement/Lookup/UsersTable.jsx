import React from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Badge,
  Flex,
  HStack,
  VStack,
  Icon,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  Checkbox,
  useColorModeValue
} from "@chakra-ui/react";
import {
  FiUsers,
  FiSearch,
  FiUserCheck,
  FiX
} from "react-icons/fi";
import CommonTabSearch from "../../Common/CommonTabSearch";

const UsersTable = ({
  lookupSearch,
  selectedUsersForComparison,
  toggleUserForComparison,
  compareSelectedUsers,
  viewUserGroups
}) => {
  // Color mode variables
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.900");
  const tableRowHoverBg = useColorModeValue("gray.50", "gray.700");
  const comparisonCardBg = useColorModeValue("blue.50", "blue.900");

  return (
    <>
      {/* Comparison Feature Card */}
      <Card
        mb={4}
        bg={
          selectedUsersForComparison.length > 0
            ? comparisonCardBg
            : cardBg
        }
        variant="outline"
        borderColor={borderColor}
        boxShadow="none"
      >
        <CardBody>
          <Flex justifyContent="space-between" alignItems="center">
            <HStack>
              <Icon as={FiUsers} color="blue.500" />
              <Text fontWeight="medium">Compare User Groups</Text>
              <Text color={mutedTextColor} fontSize="sm">
                (Select up to 2 users)
              </Text>
            </HStack>

            <HStack>
              <Button
                colorScheme="blue"
                size="sm"
                leftIcon={<Icon as={FiUsers} />}
                onClick={compareSelectedUsers}
                isDisabled={selectedUsersForComparison.length === 0}
              >
                Compare Groups
              </Button>
            </HStack>
          </Flex>

          {selectedUsersForComparison.length > 0 && (
            <Flex mt={4} gap={2}>
              {selectedUsersForComparison.map((user, index) => (
                <Tag
                  key={index}
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="blue"
                >
                  <HStack>
                    <Text>{user.name || user.cn}</Text>
                    <Tag
                      size="sm"
                      colorScheme="blue"
                      variant="solid"
                      ml={1}
                      onClick={() => toggleUserForComparison(user)}
                      cursor="pointer"
                    >
                      <Icon as={FiX} />
                    </Tag>
                  </HStack>
                </Tag>
              ))}
            </Flex>
          )}
        </CardBody>
      </Card>

      {/* User Search */}
      <Card variant="outline" mb={6} borderColor={borderColor} boxShadow="none">
        <CardBody>
          <CommonTabSearch
            placeholder="Search for users by name or ID"
            contextName="lookup"
            searchQuery={lookupSearch.searchQuery}
            setSearchQuery={lookupSearch.setSearchQuery}
            fetchedUsers={lookupSearch.fetchedUsers}
            isLoading={lookupSearch.isLoading}
            isMenuOpen={lookupSearch.isMenuOpen}
            setMenuOpen={lookupSearch.setMenuOpen}
            inputRef={lookupSearch.inputRef}
            onSelectUser={lookupSearch.onSelectUser}
            onDeselectUser={lookupSearch.onDeselectUser}
            selectedUsers={lookupSearch.selectedUsers}
          />
        </CardBody>
      </Card>

      {/* Users Table */}
      {lookupSearch.selectedUsers.length > 0 ? (
        <Card variant="outline" borderColor={borderColor} boxShadow="none">
          <CardHeader>
            <HStack justifyContent="space-between">
              <Heading size="sm" color={textColor}>
                User Search Results
              </Heading>
              <Badge colorScheme="blue">
                {lookupSearch.selectedUsers.length} users
              </Badge>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th
                    bg={tableHeaderBg}
                    color={mutedTextColor}
                    width="40px"
                  ></Th>
                  <Th bg={tableHeaderBg} color={mutedTextColor}>
                    Name
                  </Th>
                  <Th bg={tableHeaderBg} color={mutedTextColor}>
                    Username
                  </Th>
                  <Th bg={tableHeaderBg} color={mutedTextColor}>
                    Email
                  </Th>
                  <Th
                    bg={tableHeaderBg}
                    color={mutedTextColor}
                    textAlign="center"
                  >
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {lookupSearch.selectedUsers.map((user, index) => (
                  <Tr
                    key={index}
                    _hover={{ bg: tableRowHoverBg }}
                    transition="background-color 0.2s"
                    bg={
                      selectedUsersForComparison.some(
                        (u) =>
                          u.sAMAccountName === user.sAMAccountName
                      )
                        ? comparisonCardBg
                        : "transparent"
                    }
                  >
                    <Td>
                      <Checkbox
                        isChecked={selectedUsersForComparison.some(
                          (u) =>
                            u.sAMAccountName === user.sAMAccountName
                        )}
                        onChange={() => toggleUserForComparison(user)}
                        colorScheme="blue"
                        size="lg"
                      />
                    </Td>
                    <Td color={textColor}>{user.cn}</Td>
                    <Td color={textColor}>{user.sAMAccountName}</Td>
                    <Td color={textColor}>{user.mail || "N/A"}</Td>
                    <Td textAlign="center">
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        leftIcon={<Icon as={FiUserCheck} />}
                        onClick={() => viewUserGroups(user)}
                      >
                        View Groups
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      ) : (
        <Card variant="outline" borderColor={borderColor} boxShadow="none">
          <CardHeader>
            {/* Empty header to match structure with other empty states */}
          </CardHeader>
          <CardBody pt={0}>
            <Flex 
              direction="column" 
              align="center" 
              justify="center" 
              p={8}
            >
              <Icon
                as={FiSearch}
                boxSize="2em"
                mb={4}
                color={useColorModeValue("gray.400", "gray.600")}
              />
              <Text fontSize="lg" mb={2} color={textColor}>
                No Users Selected
              </Text>
              <Text textAlign="center" color={mutedTextColor}>
                Search for users above to view their details
              </Text>
            </Flex>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default UsersTable;