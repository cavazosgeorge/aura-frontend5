import React from "react";
import {
  Box,
  Text,
  VStack,
  Icon,
  Card,
  CardBody,
  CardHeader,
  Flex,
  useColorModeValue
} from "@chakra-ui/react";
import { FiInfo, FiFolder } from "react-icons/fi";

const EmptyStates = ({
  selectedSystem,
  hierarchyChain
}) => {
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  if (selectedSystem && hierarchyChain.length > 0) {
    // If a system is selected, but no group yet
    return (
      <Card variant="outline" borderColor={borderColor} boxShadow="none">
        <CardHeader>
          {/* Empty header to match structure with Compliance */}
        </CardHeader>
        <CardBody pt={0}>
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            p={8}
          >
            <Icon
              as={FiInfo}
              boxSize="2em"
              mb={4}
              color={useColorModeValue("gray.400", "gray.600")}
            />
            <Text fontSize="lg" mb={2} color={textColor}>
              No Group Selected
            </Text>
            <Text textAlign="center" color={mutedTextColor}>
              Select a group from the hierarchy to view its members
            </Text>
          </Flex>
        </CardBody>
      </Card>
    );
  } else {
    // If no system is selected at all
    return (
      <Card variant="outline" borderColor={borderColor} boxShadow="none">
        <CardHeader>
          {/* Empty header to match structure with Compliance */}
        </CardHeader>
        <CardBody pt={0}>
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            p={8}
          >
            <Icon
              as={FiFolder}
              boxSize="2em"
              mb={4}
              color={useColorModeValue("gray.400", "gray.600")}
            />
            <Text fontSize="lg" mb={2} color={textColor}>
              No System Selected
            </Text>
            <Text textAlign="center" color={mutedTextColor}>
              Select a system to begin browsing the group hierarchy
            </Text>
          </Flex>
        </CardBody>
      </Card>
    );
  }
};

export default EmptyStates;