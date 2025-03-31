import React, { useContext, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Heading,
} from "@chakra-ui/react";
import UsersTable from "../../../Tables/UsersTable/UsersTable";
import { GroupMembershipContext } from "../../../../contexts/GroupMembershipContext";
import { ComplianceContext } from "../../../../contexts/ComplianceContext";

const GroupMembershipModal = ({ isOpen, onClose, groupName, dataSource = "group", currentPage, itemsPerPage, onPageChange }) => {
  const { setCurrentGroupName } = useContext(GroupMembershipContext);
  const { complianceData } = useContext(ComplianceContext);

  useEffect(() => {
    if (groupName && isOpen && dataSource === "group") {
      setCurrentGroupName(groupName);
    }
  }, [groupName, isOpen, dataSource, setCurrentGroupName]);

  const handlePageChange = (pageNumber) => {
    if (dataSource === "compliance") {
      onPageChange(pageNumber);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="80vw">
        <ModalHeader>
          <Heading as="h3" size="md">
            {dataSource === "compliance" 
              ? `Compliance Data for ${groupName}`
              : `Group Membership for ${groupName}`}
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <UsersTable 
            dataSource={dataSource} 
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GroupMembershipModal;