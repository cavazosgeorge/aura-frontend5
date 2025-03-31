import React from "react";
import {
  Box,
  Text,
  VStack,
  Icon,
  Card,
  CardBody,
  Flex,
  useColorModeValue
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

/**
 * Empty state component for the Users tab when no users are selected
 */
const UserEmptyState = ({ borderColor }) => {
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const defaultBorderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Card variant="outline" borderColor={borderColor || defaultBorderColor} boxShadow="none">
      <CardBody>
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
            No Users Found
          </Text>
          <Text textAlign="center" color={mutedTextColor}>
            Search for users using the search box above
          </Text>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default UserEmptyState;