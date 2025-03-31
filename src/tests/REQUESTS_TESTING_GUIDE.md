# Requests Feature Testing Guide

This guide provides specific information for testing the Requests feature of the User Account App.

## Current Test Coverage

The Requests feature currently has basic tests for:

- Mock user data validation
- User ID resolution utility
- Store initialization and methods

## Expected Test Outcomes

When running `npm test`, you should see:

- ✅ MOCK_USERS contains properly structured test users
- ✅ getUserId utility correctly handles different user object structures
- ✅ RequestsStore has expected initial state and methods

## Extending the Tests

### 1. User Search Functionality

To test user search functionality:

```javascript
test('searchUsers filters correctly by name', () => {
  // Test searching for a specific name fragment
  const results = filterMockUsers('John', MOCK_USERS);
  expect(results.length).toBeGreaterThan(0);
  expect(results[0].name).toContain('John');
});
```

### 2. Request Cart Operations

To test request cart operations:

```javascript
test('adding items to request cart works', () => {
  const { addRequestToCart, requestsCart } = useRequestsStore.getState();
  
  // Add a test request
  const testRequest = {
    user: 'Test User',
    userId: 'test-user',
    system: 'System A',
    department: 'Department B',
    role: 'Role C'
  };
  
  addRequestToCart(testRequest);
  
  // Get updated state
  const { requestsCart: updatedCart } = useRequestsStore.getState();
  
  // Verify request was added
  expect(updatedCart.length).toBe(1);
  expect(updatedCart[0].user).toBe('Test User');
});
```

### 3. User Selection

To test user selection:

```javascript
test('selecting and deselecting users works', () => {
  const store = useRequestsStore.getState();
  const { addSelectedUser, removeSelectedUser, clearSelectedUsers } = store;
  
  // Test user
  const testUser = { id: 'test-id', name: 'Test User' };
  
  // Add user
  addSelectedUser(testUser);
  let state = useRequestsStore.getState();
  expect(state.selectedUsers.length).toBe(1);
  expect(state.selectedUsers[0].id).toBe('test-id');
  
  // Remove user
  removeSelectedUser(testUser);
  state = useRequestsStore.getState();
  expect(state.selectedUsers.length).toBe(0);
});
```

### 4. Template Usage

To test template functionality:

```javascript
test('template can be created and used', () => {
  const store = useRequestsStore.getState();
  const { saveTemplate, templates } = store;
  
  // Create a template
  const templateName = 'Test Template';
  const templateAccesses = [
    { id: '1', system: 'System A', area: 'Area X', role: 'Role Y' }
  ];
  
  saveTemplate(templateName, templateAccesses);
  
  // Check template was saved
  const updatedStore = useRequestsStore.getState();
  expect(updatedStore.templates.length).toBeGreaterThan(0);
  expect(updatedStore.templates[0].name).toBe('Test Template');
});
```

## Component Testing (Future)

Once the required dependencies are installed, here's how to test key components:

### 1. UserSearch Component

```javascript
test('UserSearch renders and handles input', async () => {
  // Render component with test wrapper
  render(
    <TestWrapper>
      <UserSearch 
        handleRequestForMyself={vi.fn()} 
        handleSelectUser={vi.fn()} 
        authUser={{ id: 'test-user' }} 
      />
    </TestWrapper>
  );
  
  // Find and interact with the search input
  const searchInput = screen.getByPlaceholderText('Search for users...');
  expect(searchInput).toBeInTheDocument();
  
  // Type in search box
  await userEvent.type(searchInput, 'John');
  
  // Check results appear after typing
  await waitFor(() => {
    expect(screen.getByText('Please type 2 more characters')).toBeInTheDocument();
  });
});
```

### 2. RequestCart Component

```javascript
test('RequestCart shows correct number of items', () => {
  // Mock the store with pre-populated cart
  vi.mock('../stores/requestsStore', () => ({
    default: vi.fn(() => ({
      requestsCart: [
        { id: 'req1', user: 'User One', system: 'System A', department: 'Dept B', role: 'Role C' },
        { id: 'req2', user: 'User Two', system: 'System D', department: 'Dept E', role: 'Role F' }
      ],
      removeRequestFromCart: vi.fn(),
      clearRequestsCart: vi.fn(),
      isSubmitting: false,
      submitRequests: vi.fn()
    }))
  }));
  
  // Render the component
  render(
    <TestWrapper>
      <RequestCart />
    </TestWrapper>
  );
  
  // Verify cart items are shown
  expect(screen.getByText('User One')).toBeInTheDocument();
  expect(screen.getByText('User Two')).toBeInTheDocument();
});
```

## Testing Tips for Requests Feature

1. Always test the happy path first, then edge cases
2. When testing search, include tests for minimum character requirements
3. For template tests, verify both creation and usage
4. When testing the cart, check for duplicate prevention
5. Test user selection with various user object structures

## Common Challenges

- **Store State Persistence**: Reset the store between tests using `beforeEach`
- **Mock User Data**: Use consistent mock data across tests
- **Asynchronous Operations**: Use `async/await` and `waitFor` for async tests
- **Context Dependencies**: Always wrap components in appropriate providers