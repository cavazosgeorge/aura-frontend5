// // src/api/QueryProvider.jsx
// import React from 'react';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// // Create a client
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//       retry: 1,
//       staleTime: 1000 * 60 * 5, // 5 minutes
//     },
//   },
// });

// /**
//  * Provider component for TanStack Query
//  * Wrap your application with this to enable React Query
//  */
// export function QueryProvider({ children }) {
//   return (
//     <QueryClientProvider client={queryClient}>
//       {children}
//     </QueryClientProvider>
//   );
// }

// export default QueryProvider;


import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

/**
 * Creates a QueryClient with default options
 * This is used to provide React Query functionality to components
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/**
 * QueryProvider component that wraps children with React Query's QueryClientProvider
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} QueryClientProvider with children
 */
export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;