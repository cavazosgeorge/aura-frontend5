import React, { useState } from "react";
import { Button, Tooltip, Icon, Tag } from "@chakra-ui/react";
import { FiCheck, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";


import BaseTable from "../BaseTable/BaseTable"; // Refactored
import ConfirmationModal from "../../Overlays/Modals/Confirmation/ConfirmationModal";


import { useTooltipState } from "../../custom_hooks/useToolTipState";
import { useApproval } from "../../../contexts/ApprovalContext";

const PendingRequestsTable = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const { approveRequest, denyRequest } = useApproval();

  const [tooltipStates, handleEnter, handleLeave, handleClick] =
    useTooltipState({
      approve: {},
      deny: {},
    });

  const closeModal = () => setModalOpen(false);

  const openModal = (config) => {
    setModalConfig(config);
    setModalOpen(true);
  };

  const renderExpandedRow = (row, rowIndex) => {
    if (expandedRows && expandedRows[rowIndex]) {
      return <p>Expanded Row for Pending Table!</p>;
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
      field: "Actions",
      label: "Actions",
      customRender: (row, rowIndex) => (
        <>
          <Tooltip
            label="Approve"
            isOpen={tooltipStates.approve[rowIndex]}
            closeOnClick={true}
          >
            <Button
              _hover={{ color: "green.500" }}
              variant="ghost"
              onMouseEnter={() => handleEnter("approve", rowIndex)}
              onMouseLeave={() => handleLeave("approve", rowIndex)}
              onClick={async () => {
                handleClick("approve", rowIndex);
                openModal({
                  modalAction: "Approve",
                  modalTitle: "Confirm Approval",
                  modalBody: "Are you sure you want to approve this request?",
                  toastTitle: "Request Approved",
                  toastDescription:
                    "You've successfully approved this request.",
                  toastStatus: "success",
                  colorScheme: "green",
                });
                await approveRequest(row.request_id); // Call context function
              }}
            >
              <Icon as={FiCheck} />
            </Button>
          </Tooltip>

          <Tooltip
            label="Deny"
            isOpen={tooltipStates.deny[rowIndex]}
            closeOnClick={true}
          >
            <Button
              _hover={{ color: "red.500" }}
              variant="ghost"
              onMouseEnter={() => handleEnter("deny", rowIndex)}
              onMouseLeave={() => handleLeave("deny", rowIndex)}
              onClick={async () => {
                handleClick("deny", rowIndex);
                openModal({
                  modalAction: "Deny",
                  modalTitle: "Confirm Denial",
                  modalBody: "Are you sure you want to deny this request?",
                  toastTitle: "Request Denied",
                  toastDescription: "You've successfully denied this request.",
                  toastStatus: "error",
                  colorScheme: "red",
                });
                await denyRequest(row.request_id); // Call the context function
              }}
            >
              <Icon as={FiX} />
            </Button>
          </Tooltip>

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
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        {...modalConfig}
      />

      <BaseTable
        columns={columns}
        data={data}
        isApprovalsTable={true}
        expandedRows={expandedRows}
        renderExpandedRow={renderExpandedRow}
        isMultiSelectable={true}
      />
    </>
  );
};

export default PendingRequestsTable;
