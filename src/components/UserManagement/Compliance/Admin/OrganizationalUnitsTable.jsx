import React from "react";
import {
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
  VStack,
  Icon,
  useColorModeValue
} from "@chakra-ui/react";
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiFolder,
  FiSettings
} from "react-icons/fi";

/**
 * Component for displaying and managing Organizational Units
 */
const OrganizationalUnitsTable = ({ 
  selectedDepartment,
  departmentConfig,
  onAddClick,
  onEditClick,
  onDeleteClick
}) => {
  // Color mode variables for consistent styling
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.900");
  const tableRowHoverBg = useColorModeValue("gray.50", "gray.700");
  const iconColor = useColorModeValue("blue.500", "blue.300");
  
  return (
    <Card variant="outline" borderColor={borderColor} mb={6}>
      <CardHeader>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="sm" color={textColor}>Organizational Units (OUs)</Heading>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            size="sm"
            onClick={onAddClick}
            isDisabled={!selectedDepartment}
          >
            Add OU
          </Button>
        </Flex>
      </CardHeader>
      <CardBody pt={0}>
        {selectedDepartment ? (
          departmentConfig.organizationalUnits.length > 0 ? (
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th bg={tableHeaderBg} color={mutedTextColor}>Name</Th>
                  <Th bg={tableHeaderBg} color={mutedTextColor} textAlign="center">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {departmentConfig.organizationalUnits.map(ou => (
                  <Tr key={ou.id} _hover={{ bg: tableRowHoverBg }} transition="background-color 0.2s">
                    <Td>
                      <HStack>
                        <Icon as={FiFolder} color={iconColor} />
                        <Text color={textColor}>{ou.name}</Text>
                      </HStack>
                    </Td>
                    <Td textAlign="center">
                      <HStack spacing={2} justifyContent="center">
                        <Button
                          leftIcon={<Icon as={FiEdit} />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => onEditClick(ou)}
                        >
                          Edit
                        </Button>
                        <Button
                          leftIcon={<Icon as={FiTrash2} />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => onDeleteClick(ou.id)}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <VStack py={10} spacing={4}>
              <Icon as={FiFolder} boxSize="2em" color={useColorModeValue("gray.400", "gray.600")} />
              <Text color={mutedTextColor}>No Organizational Units configured</Text>
              <Text fontSize="sm" color={mutedTextColor}>
                Click "Add OU" to create a new Organizational Unit
              </Text>
            </VStack>
          )
        ) : (
          <VStack py={10} spacing={4}>
            <Icon as={FiSettings} boxSize="2em" color={useColorModeValue("gray.400", "gray.600")} />
            <Text color={mutedTextColor}>Select a department to manage Organizational Units</Text>
          </VStack>
        )}
      </CardBody>
    </Card>
  );
};

export default OrganizationalUnitsTable;