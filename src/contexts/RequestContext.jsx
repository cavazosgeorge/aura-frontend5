import React, { createContext, useContext, useState } from "react";

export const RequestContext = createContext();

export const useRequest = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error("useRequest must be used within a RequestProvider");
  }
  return context;
};

export const RequestProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userId, setUserId] = useState("");
  const [workArea, setWorkArea] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [role, setRole] = useState([]);

  const addRequest = (newRequest) => {
    setRequests([...requests, newRequest]);
    console.log("Updated Requests:", [...requests, newRequest]);
  };
  

  const removeRequest = (request_id) => {
    setRequests(
      requests.filter((request) => request.request_id !== request_id),
    );
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        setRequests,
        addRequest,
        removeRequest,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        userId,
        setUserId,
        workArea,
        setWorkArea,
        equipment,
        setEquipment,
        role,
        setRole,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};
