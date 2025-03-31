# Testing Guide for User Account App

This directory contains tests for the User Account App application. The tests are written using [Vitest](https://vitest.dev/), a fast test runner for Vite-based projects.

## Available Test Commands

You can run tests using any of the following npm commands:

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests in standard mode |
| `npm run test:watch` | Run tests in watch mode (tests re-run when files change) |
| `npm run test:ui` | Run tests with the Vitest UI (visual test explorer) |

> **Note about test coverage**: The `npm run test:coverage` command requires additional configuration due to version compatibility issues between Vitest 0.34.6 and the coverage package. See the "Test Coverage" section below for details.

## Current Tests

### Utility Functions and Store Tests

The current test suite (`Requests.test.jsx`) focuses on the core building blocks of the Requests feature:

1. **MOCK_USERS Test**
   - Verifies mock data exists
   - Confirms data structure has expected properties
   - Expected outcome: All users have name, email, and ID properties

2. **getUserId Utility Function Test**
   - Tests the function that extracts user identifiers from different object structures
   - Tests various scenarios (id property, sAMAccountName, email, null)
   - Expected outcome: Function correctly extracts identifiers regardless of format

3. **Zustand Store Test**
   - Verifies the store has the expected initial state
   - Confirms store methods are present and correctly typed
   - Expected outcome: Store initializes with empty arrays and contains required methods

## Adding New Tests

To add new tests, follow these guidelines:

1. Create test files with the `.test.js` or `.test.jsx` extension
2. For unit tests, focus on testing one function or component at a time
3. Import the required dependencies:
   ```javascript
   import { describe, test, expect, vi } from 'vitest';
   import { componentToTest } from '../path/to/component';
   ```
4. Structure tests using `describe` and `test` blocks
5. Use assertions with `expect()`

## Component Testing (Future)

To test React components, additional dependencies are required:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jsdom
```

After installing these dependencies, update `vitest.config.js` to use the 'jsdom' environment and uncomment the related configurations.

## Mocking

For tests requiring mocks, use Vitest's mocking capabilities:

```javascript
// Mock a function
const mockFunction = vi.fn();

// Mock a module
vi.mock('../path/to/module', () => ({
  default: vi.fn(() => ({
    property: 'value',
    method: vi.fn()
  }))
}));
```

## Troubleshooting

If you encounter issues:

1. **Missing Dependencies**: Ensure all required dependencies are installed
2. **JSX/DOM Testing Issues**: Make sure the environment is set to 'jsdom' in the config
3. **Mock Issues**: Verify that mocks are set up before test execution
4. **Path Issues**: Double-check import paths are correct

## Test Coverage

### Compatibility Issue

There's a version compatibility issue between the project's Vitest version (0.34.6) and the coverage package (@vitest/coverage-v8) which requires Vitest 3.0.8. You have a few options to resolve this:

#### Option 1: Upgrade Vitest (Recommended)

Upgrade Vitest to the latest version:

```bash
npm install --save-dev vitest@latest @vitest/coverage-v8
```

#### Option 2: Use Legacy Peer Dependencies Flag

Install the coverage package with the legacy peer dependencies flag:

```bash
npm install --save-dev @vitest/coverage-v8 --legacy-peer-deps
```

#### Option 3: Use C8 Coverage Provider (Alternative)

Install and use the c8 coverage provider which may have better compatibility:

```bash
npm install --save-dev @vitest/coverage-c8
```

Then update your package.json script:

```json
"test:coverage": "vitest run --coverage --provider=c8"
```

### Running Coverage

After resolving the compatibility issue, you can run coverage with:

```bash
npm run test:coverage
```

This will generate a coverage report showing which parts of your code are covered by tests.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Zustand Testing Guide](https://docs.pmnd.rs/zustand/guides/testing)
- [Vitest Coverage Documentation](https://vitest.dev/guide/coverage.html)