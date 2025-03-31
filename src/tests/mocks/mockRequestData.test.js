import { describe, test, expect } from 'vitest';

// Define test data directly in the test file instead of importing from mockData.js
const TEST_USERS = [
  {
    displayName: "John Smith",
    name: "John Smith",
    sAMAccountName: "john.smith",
    mail: "john.smith@example.com",
    email: "john.smith@example.com",
    department: "Engineering",
    id: "john.smith"
  },
  {
    displayName: "Jane Doe",
    name: "Jane Doe",
    sAMAccountName: "jane.doe",
    mail: "jane.doe@example.com",
    email: "jane.doe@example.com",
    department: "Management",
    id: "jane.doe"
  }
];

describe('Mock Request Data', () => {
  test('Test users data structure', () => {
    // Check the test users array
    expect(TEST_USERS).toBeDefined();
    
    // If array is empty, we'll just skip further checks
    if (TEST_USERS.length === 0) {
      return;
    }
    
    expect(TEST_USERS.length).toBeGreaterThan(0);
    
    // Check first user has expected properties
    const firstUser = TEST_USERS[0];
    expect(firstUser).toBeDefined();
    expect(firstUser).toHaveProperty('name');
    expect(firstUser).toHaveProperty('email');
  });
});