import { render } from '@testing-library/react';
import { expect, vi } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import theme from '../../themes/chakra-theme';

// Create a custom render method that includes providers
export function renderWithProviders(ui, options = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function AllProviders({ children }) {
    return (
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ChakraProvider>
    );
  }

  return render(ui, { wrapper: AllProviders, ...options });
}

// Add any custom matchers we want to use in tests
expect.extend({
  toBeValidUser(received) {
    const pass = Boolean(
      received && 
      typeof received === 'object' &&
      received.id && 
      received.name
    );
    
    return {
      pass,
      message: () => `expected ${received} to be a valid user object with id and name properties`,
    };
  },
});

// Common mock functions
export const mockFunctions = {
  handleSelect: vi.fn(),
  handleRemove: vi.fn(),
  handleSubmit: vi.fn(),
};

// Export everything from testing-library/react for convenience
export * from '@testing-library/react';