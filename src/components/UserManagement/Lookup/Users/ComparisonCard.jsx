import React from "react";
import {
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  Icon,
  Flex,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiUsers } from "react-icons/fi";

/**
 * Card component for user comparison functionality
 */
const ComparisonCard = ({ selectedUsers, compareUsers, borderColor }) => {
  // Color mode variables
  const cardBg = useColorModeValue("white", "gray.800");
  const defaultBorderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  
  // Calculate if compare button should be enabled
  const canCompare = selectedUsers && selectedUsers.length === 2;
  
  return (
    <Card 
      variant="outline" 
      borderColor={borderColor || defaultBorderColor} 
      boxShadow="none"
      mb={4}
    >
      <CardBody>
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Heading size="sm" color={textColor} mb={1}>
              Compare Users
            </Heading>
            <Text color={mutedTextColor} fontSize="sm">
              {canCompare 
                ? "You've selected 2 users. Click 'Compare' to see a side-by-side comparison." 
                : selectedUsers?.length === 1 
                  ? "Select one more user to enable comparison." 
                  : "Select exactly 2 users to compare their details side by side."}
            </Text>
          </Box>
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<Icon as={FiUsers} />}
            onClick={compareUsers}
            isDisabled={!canCompare}
          >
            Compare
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default ComparisonCard;