import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import theme from '../../themes/chakra-theme';
import { MemoryRouter } from 'react-router-dom';

// Create a new QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
      staleTime: 0,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => {},
  },
});

// Test wrapper component that provides all necessary context providers
export function TestWrapper({ children, initialRoutes = ['/'] }) {
  const queryClient = createTestQueryClient();

  return (
    <MemoryRouter initialEntries={initialRoutes}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

export default TestWrapper;