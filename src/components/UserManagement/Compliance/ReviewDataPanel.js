import React from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Flex,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Icon,
  Badge,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { 
  FiDownload, 
  FiFileText, 
  FiCalendar, 
  FiCheckCircle,
} from "react-icons/fi";

/**
 * Component for displaying compliance data in a table
 * Used by the UserAccountReviewPanel
 */
const ReviewDataPanel = ({ 
  selectedDepartment, 
  dataFetchTimestamp, 
  isDownloading, 
  handleDownload 
}) => {
  // Color mode variables for consistent styling
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.900");
  const tableRowHoverBg = useColorModeValue("gray.50", "gray.700");
  const iconColor = useColorModeValue("blue.500", "blue.300");
  
  return (
    <Card variant="outline" borderColor={borderColor}>
      <CardHeader>
        <Flex justifyContent="space-between" alignItems="center">
          {selectedDepartment && dataFetchTimestamp && (
            <HStack>
              <Icon as={FiCalendar} color={iconColor} />
              <Text fontSize="sm" color={mutedTextColor}>
                Last Updated: {dataFetchTimestamp}
              </Text>
            </HStack>
          )}
        </Flex>
      </CardHeader>
      
      <CardBody pt={0}>
        {selectedDepartment ? (
          <Box>
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th bg={tableHeaderBg} color={mutedTextColor}>Department</Th>
                  <Th bg={tableHeaderBg} color={mutedTextColor}>Status</Th>
                  <Th bg={tableHeaderBg} color={mutedTextColor} textAlign="center">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr _hover={{ bg: tableRowHoverBg }} transition="background-color 0.2s">
                  <Td>
                    <HStack>
                      <Icon as={FiFileText} color={iconColor} />
                      <Text color={textColor}>{selectedDepartment}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Badge 
                      colorScheme="green" 
                      variant={useColorModeValue("subtle", "solid")}
                    >
                      <HStack spacing={1}>
                        <Icon as={FiCheckCircle} />
                        <Text>Data Available</Text>
                      </HStack>
                    </Badge>
                  </Td>
                  <Td textAlign="center">
                    <Tooltip label={isDownloading ? "Downloading..." : "Download CSV"}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        leftIcon={<FiDownload />}
                        onClick={handleDownload}
                        isLoading={isDownloading}
                        loadingText="Downloading..."
                      >
                        Download
                      </Button>
                    </Tooltip>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            p={8} 
          >
            <Icon 
              as={FiFileText} 
              boxSize="2em" 
              mb={4} 
              color={useColorModeValue("gray.400", "gray.600")}
            />
            <Text fontSize="lg" mb={2} color={textColor}>No Department Selected</Text>
            <Text textAlign="center" color={mutedTextColor}>
              Select a review type and department to view compliance data
            </Text>
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};

export default ReviewDataPanel;