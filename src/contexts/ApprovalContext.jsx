// import React, { createContext, useContext, useState, useEffect } from "react";
// import { fetchData } from "../../utils/ApiUtility";

// export const ApprovalContext = createContext();

// export const useApproval = () => {
//   const context = useContext(ApprovalContext);
//   if (!context) {
//     throw new Error("useApproval must be used within a ApprovalProvider");
//   }
//   return context;
// };

// export const ApprovalProvider = ({ children }) => {
//   const [approvals, setApprovals] = useState([]);
//   const [processed, setProcessed] = useState([]);

//   const fetchPending = () => {
//     const url = "http://localhost:3000/approvalStatus/fetchApprovalStatus?status=Pending";
//     fetchData(url, "Approvals")
//       .then((data) => {
//         setApprovals(data);
//       })
//       .catch((error) => {
//         console.error("Fetch error for Pending:", error);
//       });
//   };

//   const fetchProcessed = () => {
//     const approvedUrl = "http://localhost:3000/approvalStatus/fetchApprovalStatus?status=Approved";
//     const deniedUrl = "http://localhost:3000/approvalStatus/fetchApprovalStatus?status=Denied";
//     Promise.all([fetchData(approvedUrl, "Approvals"), fetchData(deniedUrl, "Approvals")])
//       .then(([approvedData, deniedData]) => {
//         const combinedData = [...approvedData, ...deniedData];
//         setProcessed(combinedData);
//       })
//       .catch((error) => {
//         console.error("Fetch error for Processed:", error);
//       });
//   };

//   const fetchApprovals = () => {
//     fetchPending();
//     fetchProcessed();
//   };

//   const approveRequest = async (request_id) => {
//     const url = "http://localhost:3000/approvals/approveRequest";
//     const body = { request_id };
//     try {
//       await fetchData(url, "ApprovalContext", "POST", body);
//       fetchApprovals(); // Refresh data
//     } catch (error) {
//       console.error("Approval error:", error);
//     }
//   };

//   const denyRequest = async (request_id) => {
//     const url = "http://localhost:3000/approvals/denyRequest";
//     const body = { request_id };
//     try {
//       await fetchData(url, "ApprovalContext", "POST", body);
//       fetchApprovals(); // Refresh data
//     } catch (error) {
//       console.error("Denial error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchApprovals();
//   }, []);

//   return (
//     <ApprovalContext.Provider value={{ approvals, processed, fetchApprovals, approveRequest, denyRequest }}>
//       {children}
//     </ApprovalContext.Provider>
//   );
// };
