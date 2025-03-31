# Testing Structure for User Account App

This document explains the testing structure and patterns used in this project.

## Directory Structure

We use a hybrid approach to test organization:

1. **Component Tests** - Co-located with components:
   ```
   /src/components/UserManagement/Requests/Form/tests/RequestAccessForm.test.jsx
   ```

2. **Store Tests** - Located in a tests directory within the stores folder:
   ```
   /src/stores/tests/requestsStore.test.js
   ```

3. **Unit Tests** - Located in a central unit test directory:
   ```
   /src/tests/unit/getUserId.test.js
   ```

4. **Integration Tests** - Located in a central integration test directory:
   ```
   /src/tests/integration/RequestFlow.test.jsx
   ```

5. **Test Utilities** - Centralized in the setup directory:
   ```
   /src/tests/setup/test-utils.js
   /src/tests/setup/TestWrapper.jsx
   ```

## Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm test src/tests/unit/getUserId.test.js` | Run a specific test file |
| `npm test -- --watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |

## Testing Patterns

### Component Tests

Component tests verify individual component behavior:

```javascript
import { renderWithProviders } from '../../../../../tests/setup/test-utils';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

### Store Tests

Store tests verify Zustand store functionality:

```javascript
import useMyStore from '../../stores/myStore';

describe('MyStore', () => {
  test('has correct initial state', () => {
    const store = useMyStore.getState();
    expect(store.items).toEqual([]);
  });
  
  test('actions modify state correctly', () => {
    const { addItem, items } = useMyStore.getState();
    addItem('test');
    expect(useMyStore.getState().items).toContain('test');
  });
});
```

### Integration Tests

Integration tests verify interactions between components:

```javascript
import { renderWithProviders } from '../setup/test-utils';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import ParentComponent from '../../components/ParentComponent';

describe('Integration', () => {
  test('child component updates when parent state changes', async () => {
    renderWithProviders(<ParentComponent />);
    fireEvent.click(screen.getByText('Update'));
    await waitFor(() => {
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });
  });
});
```

## Test Utilities

We provide several test utilities to simplify testing:

1. **renderWithProviders** - Wraps components with all necessary providers (from `test-utils.jsx`)
2. **TestWrapper** - Component wrapper for manual rendering (from `TestWrapper.jsx`)
3. **Custom matchers** - Additional Jest matchers for common assertions

## Mocking

```javascript
// Mock a function
const mockFunction = vi.fn();

// Mock a module
vi.mock('../../path/to/module', () => ({
  default: vi.fn(() => ({
    property: 'value',
    method: vi.fn()
  }))
}));
```

## Best Practices

1. **Test Isolation** - Each test should run independently
2. **Meaningful Assertions** - Test behavior, not implementation details
3. **Test Organization** - Use describe/test blocks to organize tests
4. **Naming Conventions** - Use descriptive test names
   - ✅ "displays error message when validation fails"
   - ❌ "test validation"
5. **Co-location** - Keep component tests close to the components
6. **Use Testing Library** - Prefer user-centric queries (getByRole, getByText)