import React, { createContext, useState, useContext } from 'react';

// Create context
const Column1Context = createContext();

// Create provider component
export const Column1Provider = ({ children }) => {
  const [column1Data, setColumn1Data] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch data for column 1
  const fetchColumn1Data = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // This would typically be an API call
      // For now, we'll just simulate data
      const data = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ];
      
      setColumn1Data(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch column 1 data');
    } finally {
      setLoading(false);
    }
  };

  // Function to add item to column 1
  const addColumn1Item = (item) => {
    setColumn1Data(prev => [...prev, item]);
  };

  // Function to remove item from column 1
  const removeColumn1Item = (itemId) => {
    setColumn1Data(prev => prev.filter(item => item.id !== itemId));
  };

  // Create context value
  const value = {
    column1Data,
    loading,
    error,
    fetchColumn1Data,
    addColumn1Item,
    removeColumn1Item
  };

  // Return provider with value
  return (
    <Column1Context.Provider value={value}>
      {children}
    </Column1Context.Provider>
  );
};

// Custom hook to use the context
export const useColumn1 = () => {
  const context = useContext(Column1Context);
  if (context === undefined) {
    throw new Error('useColumn1 must be used within a Column1Provider');
  }
  return context;
};

export default Column1Context;