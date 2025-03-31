import React, { useState, useContext, useEffect } from "react";
import { Button, Icon } from "@chakra-ui/react";
import { FiUsers, FiDownload } from "react-icons/fi";
import BaseTable from "../BaseTable/BaseTable";
import GroupMembershipModal from "../../Overlays/Modals/Groups/GroupMembershipModal";
import { GroupContext } from "../../../contexts/GroupContext";
import { GroupMembershipContext } from "../../../contexts/GroupMembershipContext";

const GroupsTable = () => {
  const {
    groups,
    totalCount,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    selectedSubOU,
    fetchGroupsBySubOU,
  } = useContext(GroupContext);
  const { resetGroupMembershipState, fetchGroupMembers } = useContext(GroupMembershipContext);
  const [isOpen, setIsOpen] = useState(false);
  const [currentGroupName, setCurrentGroupName] = useState("");

  useEffect(() => {
    if (selectedSubOU) {
      fetchGroupsBySubOU(selectedSubOU, currentPage);
    }
  }, [selectedSubOU, currentPage, fetchGroupsBySubOU]);

  const columns = [
    { field: "name", label: "Name" },
    {
      field: "Actions",
      label: "Actions",
      customRender: (row) => (
        <>
          <Button
            aria-label="Show Group Membership"
            variant="ghost"
            onClick={() => showGroupMembership(row.name)}
          >
            <Icon as={FiUsers} />
          </Button>
          <Button aria-label="Download Group Membership CSV" variant="ghost">
            <Icon as={FiDownload} />
          </Button>
        </>
      ),
    },
  ];

  const showGroupMembership = (groupName) => {
    console.log("Clicked group name:", groupName);
    setCurrentGroupName(groupName);
    fetchGroupMembers(groupName, currentPage); // Ensure group members are fetched for the modal
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    resetGroupMembershipState(); // Reset the state when modal closes
  };

  const renderCell = (row, col) => {
    if (col.field === "Actions") {
      return col.customRender(row);
    }
    return row[col.field];
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <BaseTable
        columns={columns}
        data={groups}
        renderCell={renderCell}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalCount}
        onPageChange={handlePageChange}
      />
      <GroupMembershipModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        groupName={currentGroupName}
      />
    </>
  );
};

export default GroupsTable;








