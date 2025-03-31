import React, { createContext, useState, useCallback, useEffect } from "react";
import { fetchData } from '../../utils/ApiUtility'; 

export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [selectedOU, setSelectedOU] = useState("");
  const [selectedSubOU, setSelectedSubOU] = useState("");
  const [groups, setGroups] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [returnedOUs, setReturnedOUs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGroupsByOU = useCallback(async (ouName) => {
    setIsLoading(true);
    try {
      const data = await fetchData(`/api/v1/ad/fetchGroupsByOU?ouName=${ouName}`, "GroupContext");
      console.log("Handle OU Change - Returned data:", data);
      
      console.log("Data structure before setting returnedOUs:", data);
      
      const standardizedData = Array.isArray(data) ? data : [data];
      console.log("Standardized data:", standardizedData);
      setReturnedOUs(standardizedData);
      
      console.log("returnedOUs after setting state:", standardizedData);
    } catch (error) {
      console.error("Error fetching groups by OU:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchGroupsBySubOU = useCallback(async (subOUName, pageNumber = 1) => {
    setIsLoading(true);
    try {
      const data = await fetchData(`/api/v1/ad/fetchGroupsBySubOU?subOUName=${subOUName}&pageNumber=${pageNumber}&pageSize=${itemsPerPage}`, "GroupContext");
      console.log("Fetched groups for Sub OU:", data);
      setGroups(data.groups || []);
      setTotalCount(data.totalCount || 0);
      setCurrentPage(pageNumber);
    } catch (error) {
      console.error("Error fetching groups by Sub OU:", error);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  return (
    <GroupContext.Provider
      value={{
        selectedOU,
        setSelectedOU,
        selectedSubOU,
        setSelectedSubOU,
        groups,
        setGroups,
        totalCount,
        setTotalCount,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        returnedOUs,
        setReturnedOUs,
        isLoading,
        fetchGroupsByOU,
        fetchGroupsBySubOU
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};



