import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  VStack
} from "@chakra-ui/react";

/**
 * Modal component for adding a new department
 */
const DepartmentModal = ({
  isOpen,
  onClose,
  selectedSystem,
  systemLabel,
  departmentName,
  setDepartmentName,
  departmentCode,
  setDepartmentCode,
  onSave,
  isLoading
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Department</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>System</FormLabel>
              <Input 
                value={systemLabel}
                isReadOnly
                bg="gray.100"
              />
              <FormHelperText>The system this department will belong to</FormHelperText>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Department Name</FormLabel>
              <Input 
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="Enter department name (e.g. Finance Department)"
              />
              <FormHelperText>The full name of the department</FormHelperText>
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Department Code</FormLabel>
              <Input 
                value={departmentCode}
                onChange={(e) => setDepartmentCode(e.target.value)}
                placeholder="Enter department code (e.g. FIN)"
              />
              <FormHelperText>A short code to identify the department</FormHelperText>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="green" 
            onClick={onSave}
            isLoading={isLoading}
          >
            Add Department
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DepartmentModal;