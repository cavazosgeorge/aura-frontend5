import React, { createContext, useState, useCallback, useEffect } from 'react';
import { fetchData } from '../../utils/ApiUtility';

export const GroupMembershipContext = createContext();

export const GroupMembershipProvider = ({ children }) => {
  const [groupMembersByPage, setGroupMembersByPage] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentGroupName, setCurrentGroupName] = useState('');

  const fetchGroupMembers = useCallback(async (groupName, pageNumber = 1) => {
    if (!groupName) {
      console.error('Group name is undefined');
      return;
    }
    if (groupName !== currentGroupName) {
      // Clear cache if groupName changes
      setGroupMembersByPage({});
      setTotalCount(0);
      setCurrentPage(1);
      pageNumber = 1;
    }
    if (groupMembersByPage[pageNumber]) {
      console.log(`Data for page ${pageNumber} already cached`);
      return;
    }
    try {
      const data = await fetchData(`/api/v1/ad/fetchGroupMembersPaginated?groupName=${groupName}&pageNumber=${pageNumber}&pageSize=${itemsPerPage}`, "GroupMembershipContext");
      console.log(`Fetched group members for ${groupName}, page ${pageNumber}:`, data);
      setGroupMembersByPage((prev) => ({ ...prev, [pageNumber]: data.members }));
      setTotalCount(data.totalCount);
      setCurrentGroupName(groupName); // Set the current group name
    } catch (error) {
      console.error("Error fetching group members:", error);
    }
  }, [currentGroupName, groupMembersByPage, itemsPerPage]);

  const resetGroupMembershipState = () => {
    setGroupMembersByPage({});
    setTotalCount(0);
    setCurrentPage(1);
    setCurrentGroupName('');
  };

  useEffect(() => {
    if (currentGroupName) {
      // Fetch members for the current group and current page
      fetchGroupMembers(currentGroupName, currentPage);
      // Check if the data for the next page is already cached
      if (!groupMembersByPage[currentPage + 1]) {
        // If not cached, pre-fetch the next page's data
        fetchGroupMembers(currentGroupName, currentPage + 1); // Pre-fetch next page
      }
    }
  }, [currentGroupName, currentPage, fetchGroupMembers, groupMembersByPage]);

  return (
    <GroupMembershipContext.Provider
      value={{
        groupMembersByPage,
        totalCount,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        fetchGroupMembers,
        setCurrentGroupName,
        currentGroupName,
        resetGroupMembershipState, // Expose the reset function
      }}
    >
      {children}
    </GroupMembershipContext.Provider>
  );
};