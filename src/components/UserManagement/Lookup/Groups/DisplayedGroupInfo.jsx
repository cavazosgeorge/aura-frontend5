import React from "react";
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  VStack,
  Heading,
  Text,
  Badge,
  Button,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiRefreshCw } from "react-icons/fi";

/**
 * Component for displaying information about the currently selected group
 */
const DisplayedGroupInfo = ({ 
  displayedGroupData, 
  clearGroupData,
  borderColor 
}) => {
  // Color mode variables
  const displayedBgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");

  if (!displayedGroupData) return null;

  return (
    <Card
      mb={4}
      bg={displayedBgColor}
      variant="outline"
      borderColor={borderColor}
      boxShadow="none"
    >
      <CardBody>
        <Grid templateColumns="3fr 1fr" gap={4}>
          <GridItem>
            <VStack align="start" spacing={2}>
              <Heading size="sm" color={textColor}>
                Currently Displaying Data For:
              </Heading>
              <Text color={textColor}>
                Group:{" "}
                <Text as="span" fontWeight="medium">
                  {displayedGroupData.groupName || "N/A"}
                </Text>
              </Text>
              <Text color={textColor}>
                Total Members:{" "}
                <Badge colorScheme="green">
                  {displayedGroupData.totalCount}
                </Badge>
              </Text>
            </VStack>
          </GridItem>
          <GridItem
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
              colorScheme="red"
              variant="outline"
              leftIcon={<Icon as={FiRefreshCw} />}
              onClick={clearGroupData}
              size="md"
            >
              Clear Data
            </Button>
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  );
};

export default DisplayedGroupInfo;