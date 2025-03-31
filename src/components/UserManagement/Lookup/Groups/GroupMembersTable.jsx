import React from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  HStack,
  Badge,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Button,
  Icon,
  Flex,
  ButtonGroup,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiUserCheck,
  FiChevronUp,
  FiChevronDown,
  FiChevronsLeft,
  FiChevronsRight,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

/**
 * Component for displaying group members in a table with sorting and pagination
 */
const GroupMembersTable = ({
  allMembers,
  displayedGroupData,
  pageMembers,
  sortField,
  sortDirection,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalPages,
  handleSortChange,
  viewUserGroups,
  borderColor,
}) => {
  // Color mode variables
  const cardBg = useColorModeValue("white", "gray.800");
  const defaultBorderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.900");
  const tableRowHoverBg = useColorModeValue("gray.50", "gray.700");
  const sortableHeaderHoverBg = useColorModeValue("gray.100", "gray.600");
  const paginationActiveBg = useColorModeValue("blue.500", "blue.400");
  const paginationActiveColor = "white";

  // Function to get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <Icon as={FiChevronUp} ml={1} />
    ) : (
      <Icon as={FiChevronDown} ml={1} />
    );
  };

  // Render pagination controls
  const renderPagination = () => {
    if (!displayedGroupData) return null;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, allMembers.length);

    // Pagination functions
    const goToFirstPage = () => setCurrentPage(1);
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const goToLastPage = () => setCurrentPage(totalPages);

    return (
      <Flex justify="space-between" align="center" mt={4} px={2}>
        <Text color={mutedTextColor} fontSize="sm">
          Showing {startItem} to {endItem} of {allMembers.length} members
        </Text>
        <ButtonGroup size="sm" isAttached variant="outline">
          <Tooltip label="First Page">
            <Button
              leftIcon={<FiChevronsLeft />}
              onClick={goToFirstPage}
              isDisabled={currentPage === 1}
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <Button
              leftIcon={<FiChevronLeft />}
              onClick={goToPreviousPage}
              isDisabled={currentPage === 1}
            />
          </Tooltip>
          <Button variant="solid" bg={paginationActiveBg} color={paginationActiveColor}>
            Page {currentPage} of {totalPages}
          </Button>
          <Tooltip label="Next Page">
            <Button
              rightIcon={<FiChevronRight />}
              onClick={goToNextPage}
              isDisabled={currentPage === totalPages}
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <Button
              rightIcon={<FiChevronsRight />}
              onClick={goToLastPage}
              isDisabled={currentPage === totalPages}
            />
          </Tooltip>
        </ButtonGroup>
      </Flex>
    );
  };

  return (
    <Card variant="outline" borderColor={borderColor || defaultBorderColor} boxShadow="none">
      <CardHeader>
        <HStack justifyContent="space-between">
          <Heading size="sm" color={textColor}>
            Group Members
          </Heading>
          {/* Use allMembers.length here since that's the real total in memory */}
          <Badge colorScheme="green">{allMembers.length} members</Badge>
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        <Box overflowX="auto">
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th
                  bg={tableHeaderBg}
                  color={textColor}
                  cursor="pointer"
                  onClick={() => handleSortChange("cn")}
                  _hover={{ bg: sortableHeaderHoverBg }}
                  transition="background-color 0.2s"
                >
                  <HStack spacing={1}>
                    <Text>Name</Text>
                    {getSortIcon("cn")}
                  </HStack>
                </Th>
                <Th
                  bg={tableHeaderBg}
                  color={textColor}
                  cursor="pointer"
                  onClick={() => handleSortChange("samAccountName")}
                  _hover={{ bg: sortableHeaderHoverBg }}
                  transition="background-color 0.2s"
                >
                  <HStack spacing={1}>
                    <Text>Username</Text>
                    {getSortIcon("samAccountName")}
                  </HStack>
                </Th>
                <Th
                  bg={tableHeaderBg}
                  color={textColor}
                  cursor="pointer"
                  onClick={() => handleSortChange("mail")}
                  _hover={{ bg: sortableHeaderHoverBg }}
                  transition="background-color 0.2s"
                >
                  <HStack spacing={1}>
                    <Text>Email</Text>
                    {getSortIcon("mail")}
                  </HStack>
                </Th>
                <Th
                  bg={tableHeaderBg}
                  color={textColor}
                  cursor="pointer"
                  onClick={() => handleSortChange("memberType")}
                  _hover={{ bg: sortableHeaderHoverBg }}
                  transition="background-color 0.2s"
                >
                  <HStack spacing={1}>
                    <Text>Member Type</Text>
                    {getSortIcon("memberType")}
                  </HStack>
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
              {pageMembers.length > 0 ? (
                pageMembers.map((member, index) => (
                  <Tr
                    key={`${member.samAccountName || member.cn}-${index}`}
                    _hover={{ bg: tableRowHoverBg }}
                  >
                    <Td>
                      <Text fontWeight="medium">
                        {member.cn || member.name || member.fullName || member.displayName || "N/A"}
                      </Text>
                    </Td>
                    <Td>
                      <Text>{member.samAccountName || member.sAMAccountName || "N/A"}</Text>
                    </Td>
                    <Td>
                      <Text>{member.mail || member.email || "N/A"}</Text>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={member.memberType === "Group" ? "purple" : "blue"}
                        px={2}
                        py={1}
                        borderRadius="full"
                      >
                        {member.memberType || "User"}
                      </Badge>
                    </Td>
                    <Td textAlign="center">
                      <Tooltip label="View user's groups">
                        <Button
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          leftIcon={<FiUserCheck />}
                          onClick={() => viewUserGroups(member)}
                        >
                          Groups
                        </Button>
                      </Tooltip>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={5} textAlign="center" py={4}>
                    <Text color={mutedTextColor}>No members found</Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
        {renderPagination()}
      </CardBody>
    </Card>
  );
};

export default GroupMembersTable;