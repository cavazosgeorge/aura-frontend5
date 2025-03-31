import React, { useContext, useEffect, useState, useCallback } from "react";
import { Button, Icon, Box, Tag, Wrap, WrapItem, Tr, Td } from "@chakra-ui/react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import BaseTable from "../BaseTable/BaseTable";
import { GroupMembershipContext } from "../../../contexts/GroupMembershipContext";
import useSearchUsersStore from "../../../stores/searchUsersStore";
import useComplianceStore from "../../../stores/complianceStore";
import { useComplianceDataQuery } from "../../../hooks/useComplianceQuery";

const UsersTable = ({ dataSource, currentPage: propCurrentPage, itemsPerPage: propItemsPerPage, onPageChange }) => {
  const {
    groupMembersByPage,
    totalCount: groupTotalCount,
    currentPage: groupCurrentPage,
    setCurrentPage: setGroupCurrentPage,
    itemsPerPage: groupItemsPerPage,
    setItemsPerPage: setGroupItemsPerPage,
    fetchGroupMembers,
    currentGroupName,
  } = useContext(GroupMembershipContext);

  // Use Zustand stores instead of Context
  const selectedUsers = useSearchUsersStore(state => state.selectedUsers);
  
  // Get the selected department from complianceStore
  const selectedDepartment = useComplianceStore(state => state.selectedDepartment);
  
  // Use TanStack Query for data fetching
  const { data: complianceData = [] } = useComplianceDataQuery(selectedDepartment);

  const [expandedRows, setExpandedRows] = useState({});
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [localItemsPerPage, setLocalItemsPerPage] = useState(10);

  const getCurrentPage = useCallback(() => {
    if (dataSource === "group") return groupCurrentPage;
    if (dataSource === "compliance") return propCurrentPage;
    return localCurrentPage;
  }, [dataSource, groupCurrentPage, propCurrentPage, localCurrentPage]);

  const getItemsPerPage = useCallback(() => {
    if (dataSource === "group") return groupItemsPerPage;
    if (dataSource === "compliance") return propItemsPerPage;
    return localItemsPerPage;
  }, [dataSource, groupItemsPerPage, propItemsPerPage, localItemsPerPage]);

  const getTotalCount = useCallback(() => {
    if (dataSource === "group") return groupTotalCount;
    if (dataSource === "search") return selectedUsers.length;
    if (dataSource === "compliance") return complianceData.length;
    return 0;
  }, [dataSource, groupTotalCount, selectedUsers, complianceData]);

  const getData = useCallback(() => {
    if (dataSource === "group") return groupMembersByPage[getCurrentPage()] || [];
    if (dataSource === "search") return selectedUsers;
    if (dataSource === "compliance") {
      const startIndex = (getCurrentPage() - 1) * getItemsPerPage();
      const endIndex = startIndex + getItemsPerPage();
      return complianceData.slice(startIndex, endIndex);
    }
    return [];
  }, [dataSource, groupMembersByPage, selectedUsers, complianceData, getCurrentPage, getItemsPerPage]);

  useEffect(() => {
    if (dataSource === "group" && currentGroupName) {
      console.log(`Fetching group members for ${currentGroupName}, page ${getCurrentPage()}`);
      fetchGroupMembers(currentGroupName, getCurrentPage());
      if (!groupMembersByPage[getCurrentPage() + 1]) {
        fetchGroupMembers(currentGroupName, getCurrentPage() + 1); // Pre-fetch next page
      }
    }
  }, [dataSource, currentGroupName, getCurrentPage, fetchGroupMembers, groupMembersByPage]);

  const handleRowExpandToggle = (rowIndex) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowIndex]: !prev[rowIndex]
    }));
  };

  const extractGroupName = (groupString) => {
    const match = groupString.match(/CN=([^,]+)/);
    return match ? match[1] : groupString;
  };

  const renderExpandedContent = (row) => {
    const groups = row.memberOf || [];
    const sortedGroups = groups
      .map(extractGroupName)
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  
    return (
      <Box width="100%" px={4} py={4} bg="gray.50">
        <Wrap spacing={2}>
          {sortedGroups.map((group, index) => (
            <WrapItem key={index}>
              <Tag colorScheme="blue">{extractGroupName(group)}</Tag>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    );
  };

  const columns = dataSource === "compliance"
  ? [
      { field: "groupName", label: "Group Name", width: "20%" },
      { field: "cn", label: "CN", width: "15%" },
      { field: "sn", label: "Surname", width: "15%" },
      { field: "mail", label: "Email", width: "20%" },
      { field: "samAccountName", label: "User ID", width: "15%" },
      { field: "accountStatus", label: "Account Status", width: "15%" },
    ]
  : [
      { field: "cn", label: "Name", width: "25%" },
      { field: "sAMAccountName", label: "User ID", width: "20%" },
      { field: "mail", label: "Email", width: "25%" },
      { field: "accountStatus", label: "Account Status", width: "20%" },
      {
        field: "Actions",
        label: "Actions",
        width: "10%",
        customRender: (row, rowIndex) => (
          <Button
            variant="ghost"
            onClick={() => handleRowExpandToggle(rowIndex)}
          >
            <Icon as={expandedRows[rowIndex] ? FiChevronUp : FiChevronDown} />
          </Button>
        ),
      },
    ];

  const renderCell = (row, col) => {
    if (col.field === "mail") {
      return <a href={`mailto:${row.mail}`}>{row.mail}</a>;
    }
    if (col.customRender) {
      return col.customRender(row, getData().indexOf(row));
    }

    if (col.field === "sAMAccountName" && dataSource === "group") {
      return row.sAMAccountName || row.samAccountName || "N/A";
    }
      // Handle accountStatus
    if (col.field === "accountStatus") {
      if (dataSource === "search") {
        return "Enabled"
      }
    }
    return row[col.field];
  };

  const renderRow = (row, rowIndex) => {
    return (
      <React.Fragment key={rowIndex}>
        <Tr minHeight="48px">
          {columns.map((col, colIndex) => (
            <Td key={colIndex} py={3} px={4}>
              <Box minHeight="24px" display="flex" alignItems="center">
                {renderCell(row, col)}
              </Box>
            </Td>
          ))}
        </Tr>
        {expandedRows[rowIndex] && dataSource !== "compliance" && (
          <Tr>
            <Td colSpan={columns.length} p={0}>
              {renderExpandedContent(row)}
            </Td>
          </Tr>
        )}
      </React.Fragment>
    );
  };

  const handlePageChange = (pageNumber) => {
    if (dataSource === "group") {
      setGroupCurrentPage(pageNumber);
    } else if (dataSource === "compliance") {
      onPageChange(pageNumber);
    } else {
      setLocalCurrentPage(pageNumber);
    }
  };

  return (
    <BaseTable
      columns={columns}
      data={getData()}
      renderCell={renderCell}
      renderRow={renderRow}
      currentPage={getCurrentPage()}
      itemsPerPage={getItemsPerPage()}
      totalItems={getTotalCount()}
      onPageChange={handlePageChange}
    />
  );
};

export default UsersTable;