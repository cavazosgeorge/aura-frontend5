import React, { useState } from "react";
import { Button, Tooltip, Icon, Tag } from "@chakra-ui/react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import BaseTable from "../BaseTable/BaseTable"; // Refactored

const ProcessedRequestsTable = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState([]);

  const renderExpandedRow = (row, rowIndex) => {
    if (expandedRows && expandedRows[rowIndex]) {
      return <p>Expanded Row for Processed Table!</p>;
    }
    return null;
  };

  const columns = [
    { field: "request_id", label: "Request ID" },
    { field: "requested_for", label: "Requested For" },
    { field: "requested_by", label: "Requested By" },
    {
      field: "request_type",
      label: "Request Type",
      customRender: (row) => {
        const getRequestTypeColor = (type) => {
          switch (type) {
            case "Disable":
              return "red";
            case "Enable":
              return "green";
            case "Add":
              return "blue";
            case "Remove":
              return "orange";
            case "New":
              return "purple";
            default:
              return "gray"; // Fallback color
          }
        };

        return (
          <Tag colorScheme={getRequestTypeColor(row.request_type)}>
            {row.request_type}
          </Tag>
        );
      },
    },
    {
      field: "created_at",
      label: "Date",
      customRender: (row) => {
        const date = new Date(row.created_at);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      },
    },
    {
      field: "approval_status",
      label: "Final Status",
      customRender: (row) => (
        <Tag colorScheme={row.approval_status === "Approved" ? "green" : "red"}>
          {row.approval_status}
        </Tag>
      ),
    },
    {
      field: "actions",
      label: "Actions",
      customRender: (row, rowIndex) => (
        <>
          <Tooltip label="View Details">
            <Button
              variant="ghost"
              onClick={() => {
                const newExpandedRows = [...expandedRows];
                newExpandedRows[rowIndex] = !newExpandedRows[rowIndex];
                setExpandedRows(newExpandedRows);
              }}
            >
              <Icon as={expandedRows[rowIndex] ? FiChevronUp : FiChevronDown} />
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <BaseTable
      columns={columns}
      data={data}
      isApprovalsTable={true}
      expandedRows={expandedRows}
      renderExpandedRow={renderExpandedRow}
    />
  );
};

export default ProcessedRequestsTable;
