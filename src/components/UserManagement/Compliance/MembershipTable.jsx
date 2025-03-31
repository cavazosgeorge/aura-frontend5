import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  HStack,
  Icon,
  Avatar,
  Box,
  Button,
  Tooltip,
  useColorModeValue
} from "@chakra-ui/react";
import {
  FiUser,
  FiUserCheck,
  FiMail,
  FiTag,
  FiUsers
} from "react-icons/fi";

const MembershipTable = ({ data, isLoading, onViewUserGroups }) => {
  // Color mode variables for consistent styling
  const tableHeaderBg = useColorModeValue("gray.50", "gray.900");
  const tableRowHoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const iconColor = useColorModeValue("blue.500", "blue.300");
  const avatarBg = useColorModeValue("blue.500", "blue.400");

  if (isLoading) {
    return (
      <Box textAlign="center" py={4}>
        <Text color={mutedTextColor}>Loading members...</Text>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Text color={mutedTextColor}>No members found in this group</Text>
      </Box>
    );
  }

  // Get column headers from the first data item
  const columns = Object.keys(data[0]);

  return (
    <Box overflowX="auto">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            {columns.map((column, index) => (
              <Th key={index} bg={tableHeaderBg} color={mutedTextColor}>
                {column}
              </Th>
            ))}
            <Th bg={tableHeaderBg} color={mutedTextColor} textAlign="center">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => (
            <Tr 
              key={index}
              _hover={{ bg: tableRowHoverBg }}
              transition="background-color 0.2s"
            >
              {columns.map((column, colIndex) => (
                <Td key={colIndex}>
                  {column.toLowerCase().includes('name') && colIndex === 0 ? (
                    <HStack spacing={2}>
                      <Avatar 
                        size="sm" 
                        name={item[column]} 
                        icon={<FiUser fontSize="0.8rem" />}
                        bg={avatarBg}
                        color="white"
                      />
                      <Text color={textColor} fontWeight="medium">
                        {item[column] || "N/A"}
                      </Text>
                    </HStack>
                  ) : column.toLowerCase().includes('email') || column.toLowerCase().includes('mail') ? (
                    <HStack spacing={2}>
                      <Icon as={FiMail} color={iconColor} size="sm" />
                      <Text color={textColor}>{item[column] || "N/A"}</Text>
                    </HStack>
                  ) : column.toLowerCase().includes('username') || column.toLowerCase().includes('account') ? (
                    <HStack spacing={2}>
                      <Icon as={FiTag} color={iconColor} size="sm" />
                      <Text color={textColor}>{item[column] || "N/A"}</Text>
                    </HStack>
                  ) : column.toLowerCase().includes('type') ? (
                    <Badge 
                      colorScheme={item[column]?.toLowerCase() === "group" ? "purple" : "blue"}
                      variant={useColorModeValue("subtle", "solid")}
                    >
                      {item[column] || "User"}
                    </Badge>
                  ) : (
                    <Text color={textColor}>{item[column] || "N/A"}</Text>
                  )}
                </Td>
              ))}
              <Td textAlign="center">
                <Tooltip label="View User Groups">
                  <Button
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    leftIcon={<Icon as={FiUsers} />}
                    onClick={() => onViewUserGroups && onViewUserGroups(item)}
                  >
                    View Groups
                  </Button>
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default MembershipTable;