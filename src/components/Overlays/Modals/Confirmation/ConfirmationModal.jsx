import React from 'react';
import { useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from '@chakra-ui/react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  modalAction = "Confirm",
  modalTitle = 'Confirm Action',
  modalBody = 'Are you sure you want to perform this action?',
  toastTitle,
  toastDescription,
  toastStatus = 'info',
  colorScheme = 'blue',
  onAction
}) => {
  const toast = useToast();

  const handleCloseModal = () => {
    onClose();
  };

  const handleAction = () => {
    if (toastTitle && toastDescription) {
      toast({
        position: 'bottom',
        title: toastTitle,
        description: toastDescription,
        status: toastStatus,
        duration: 3000,
        isClosable: true,
      });
    }

    if (onAction) {
      onAction();
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {modalBody}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={handleCloseModal} mr={3}>
            Cancel
          </Button>
          <Button
            colorScheme={colorScheme}
            onClick={handleAction}
          >
            {modalAction}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
