import React, { memo } from 'react';
import { QueryProvider } from "../../../api/QueryProvider";
import RequestsContainer from './RequestsContainer';

/**
 * Main Requests component that connects to TanStack Query
 * This is an optimized version of the original Requests component
 * Uses React.memo to prevent unnecessary re-renders
 * 
 * @returns {JSX.Element} Rendered Requests component
 */
const Requests = memo(() => {
  return (
    <QueryProvider>
      <RequestsContainer />
    </QueryProvider>
  );
});

Requests.displayName = 'Requests';

export default Requests;