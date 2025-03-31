import { expect, afterEach, vi } from 'vitest';

try {
  const { cleanup } = require('@testing-library/react');
  const matchers = require('@testing-library/jest-dom/matchers');
  
  // Add testing-library matchers to vitest expectations if available
  expect.extend(matchers);
  
  // Clean up after each test
  afterEach(() => {
    cleanup();
  });
  
  console.log('React Testing Library setup successful');
} catch (e) {
  console.log('React Testing Library not available or error occurred:', e.message);
  
  // Provide empty cleanup function
  afterEach(() => {});
}

// Check if window is defined (needed for jsdom environment)
if (typeof window !== 'undefined') {
  // Mock IntersectionObserver which is used by some Chakra UI components
  class MockIntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
  }

  window.IntersectionObserver = MockIntersectionObserver;

  // Mock window.matchMedia which is used by Chakra UI for responsive design
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}