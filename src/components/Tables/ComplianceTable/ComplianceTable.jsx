// import React, { useContext, useState } from "react";
// import { Button, Icon, Tooltip, HStack } from "@chakra-ui/react";
// import { FiUsers, FiDownload } from "react-icons/fi";
// import BaseTable from "../BaseTable/BaseTable";
// import { ComplianceContext } from "../../../contexts/ComplianceContext";
// import GroupMembershipModal from "../../Overlays/Modals/Groups/GroupMembershipModal";

// const ComplianceTable = () => {
//   const { 
//     complianceData, 
//     dataFetchTimestamp,
//     selectedDepartment,
//     downloadCSV
//   } = useContext(ComplianceContext);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedGroupName, setSelectedGroupName] = useState("");
//   const [modalCurrentPage, setModalCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const columns = [
//     { field: "system", label: "System" },
//     { field: "dataFetched", label: "Data Fetched" },
//     { field: "actions", label: "Actions" },
//   ];

//   const renderCell = (row, col) => {
//     if (col.field === "actions") {
//       return (
//         <HStack spacing={2}>
//           <Tooltip label="Show Group Membership">
//             <Button
//               onClick={() => showGroupMembership(row)}
//               aria-label="Show Group Membership"
//               isDisabled={!selectedDepartment}
//             >
//               <Icon as={FiUsers} />
//             </Button>
//           </Tooltip>
//           <Tooltip label="Download CSV">
//             <Button
//               onClick={() => downloadCSV(selectedDepartment)}
//               aria-label="Download CSV"
//               isDisabled={!selectedDepartment}
//             >
//               <Icon as={FiDownload} />
//             </Button>
//           </Tooltip>
//         </HStack>
//       );
//     }
//     return row[col.field];
//   };

//   const showGroupMembership = (row) => {
//     setSelectedGroupName(row.system);
//     setModalCurrentPage(1);
//     setIsModalOpen(true);
//   };

//   const handleModalPageChange = (pageNumber) => {
//     setModalCurrentPage(pageNumber);
//   };

//   const tableData = selectedDepartment ? [{
//     system: selectedDepartment,
//     dataFetched: dataFetchTimestamp,
//     actions: "",
//   }] : [];

//   const totalCount = tableData.length;

//   return (
//     <>
//       <BaseTable
//         columns={columns}
//         data={tableData}
//         renderCell={renderCell}
//         currentPage={1}
//         itemsPerPage={itemsPerPage}
//         totalItems={totalCount}
//         onPageChange={() => {}}
//         emptyStateMessage="Please select a department to view compliance data."
//       />
//       <GroupMembershipModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         groupName={selectedGroupName}
//         dataSource="compliance"
//         currentPage={modalCurrentPage}
//         itemsPerPage={itemsPerPage}
//         onPageChange={handleModalPageChange}
//       />
//     </>
//   );
// };

// export default ComplianceTable;





import React, { useContext, useState } from "react";
import { Button, Icon, Tooltip, HStack, Text } from "@chakra-ui/react";
import { FiUsers, FiDownload } from "react-icons/fi";
import BaseTable from "../BaseTable/BaseTable";
import { ComplianceContext } from "../../../contexts/ComplianceContext";
import GroupMembershipModal from "../../Overlays/Modals/Groups/GroupMembershipModal";

const ComplianceTable = () => {
  const { 
    complianceData, 
    dataFetchTimestamp,
    selectedDepartment,
    downloadCSV
  } = useContext(ComplianceContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const itemsPerPage = 10;

  const columns = [
    { field: "system", label: "System" },
    { field: "dataFetched", label: "Data Fetched" },
    { field: "actions", label: "Actions" },
  ];

  const handleDownload = async () => {
    setIsDownloading(true);
    const startTime = Date.now();
    const MINIMUM_DOWNLOAD_TIME = 10000; // 10 seconds

    try {
      await downloadCSV(selectedDepartment);
      
      // Calculate how long the download took
      const downloadTime = Date.now() - startTime;
      
      // If the download was faster than our minimum time, wait a bit longer
      if (downloadTime < MINIMUM_DOWNLOAD_TIME) {
        await new Promise(resolve => setTimeout(resolve, MINIMUM_DOWNLOAD_TIME - downloadTime));
      }
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderCell = (row, col) => {
    if (col.field === "actions") {
      return (
        <HStack spacing={2}>
          <Tooltip label="Show Group Membership">
            <Button
              onClick={() => showGroupMembership(row)}
              aria-label="Show Group Membership"
              isDisabled={!selectedDepartment}
            >
              <Icon as={FiUsers} />
            </Button>
          </Tooltip>
          <Tooltip label={isDownloading ? "Downloading..." : "Download CSV"}>
            <Button
              onClick={handleDownload}
              aria-label="Download CSV"
              isDisabled={!selectedDepartment || isDownloading}
            >
              {isDownloading ? (
                <Text fontSize="sm">Downloading...</Text>
              ) : (
                <Icon as={FiDownload} />
              )}
            </Button>
          </Tooltip>
        </HStack>
      );
    }
    return row[col.field];
  };

  const showGroupMembership = (row) => {
    setSelectedGroupName(row.system);
    setModalCurrentPage(1);
    setIsModalOpen(true);
  };

  const handleModalPageChange = (pageNumber) => {
    setModalCurrentPage(pageNumber);
  };

  const tableData = selectedDepartment ? [{
    system: selectedDepartment,
    dataFetched: dataFetchTimestamp,
    actions: "",
  }] : [];

  const totalCount = tableData.length;

  return (
    <>
      <BaseTable
        columns={columns}
        data={tableData}
        renderCell={renderCell}
        currentPage={1}
        itemsPerPage={itemsPerPage}
        totalItems={totalCount}
        onPageChange={() => {}}
        emptyStateMessage="Please select a department to view compliance data."
      />
      <GroupMembershipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        groupName={selectedGroupName}
        dataSource="compliance"
        currentPage={modalCurrentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handleModalPageChange}
      />
    </>
  );
};

export default ComplianceTable;