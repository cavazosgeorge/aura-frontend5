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
import { FiCheckCircle } from "react-icons/fi";

/**
 * Component for displaying pending group selection before finalization
 */
const PendingGroupSelection = ({ 
  pendingGroupData, 
  finalizeSelection, 
  isGroupStableLoading,
  borderColor 
}) => {
  // Color mode variables
  const pendingBgColor = useColorModeValue("blue.50", "blue.900");
  const textColor = useColorModeValue("gray.800", "gray.100");

  if (!pendingGroupData) return null;

  return (
    <Card
      mb={4}
      bg={pendingBgColor}
      variant="outline"
      borderColor={borderColor}
      boxShadow="none"
    >
      <CardBody>
        <Grid templateColumns="3fr 1fr" gap={4}>
          <GridItem>
            <VStack align="start" spacing={1}>
              <Heading size="sm" color={textColor}>
                Pending Group Selection
              </Heading>
              <Text color={textColor}>
                Group:{" "}
                <Text as="span" fontWeight="medium">
                  {pendingGroupData.groupName ||
                    "No group name returned"}
                </Text>
              </Text>
              <Text color={textColor}>
                Total Members:{" "}
                <Badge colorScheme="blue">
                  {pendingGroupData.totalCount}
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
              colorScheme="blue"
              onClick={finalizeSelection}
              data-testid="finalize-button"
              leftIcon={<Icon as={FiCheckCircle} />}
              isLoading={isGroupStableLoading}
            >
              Use This Group
            </Button>
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  );
};

export default PendingGroupSelection;