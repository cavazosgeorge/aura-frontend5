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
  Input,
  Icon
} from "@chakra-ui/react";
import { FiSave, FiPlus } from "react-icons/fi";

/**
 * Modal component for adding or editing an Organizational Unit
 */
const OrganizationalUnitModal = ({
  isOpen,
  onClose,
  editingOU,
  ouName,
  setOUName,
  onSave
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{editingOU ? "Edit Organizational Unit" : "Add Organizational Unit"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>OU Name</FormLabel>
            <Input 
              value={ouName}
              onChange={(e) => setOUName(e.target.value)}
              placeholder="Enter OU name"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            leftIcon={<Icon as={editingOU ? FiSave : FiPlus} />}
            onClick={onSave}
          >
            {editingOU ? "Save" : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrganizationalUnitModal;