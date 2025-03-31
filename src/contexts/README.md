# GroupMembershipContext

The `GroupMembershipContext` provides the necessary state and functions to manage group memberships within the application. It handles fetching, caching, and resetting the data for group members.

### Overview

This context handles the following:
- Fetching group members from the backend.
- Caching fetched data to minimize API calls.
- Managing pagination for group members.
- Resetting the state when the context is no longer needed.

### State Variables

- `groupMembersByPage`: An object that stores the fetched group members by page number.
- `totalCount`: The total number of group members.
- `currentPage`: The current page number for pagination.
- `itemsPerPage`: The number of items (group members) to be displayed per page.
- `currentGroupName`: The current group name for which the members are being fetched.

### Functions

#### `fetchGroupMembers`

Fetches the group members from the backend API based on the group name and page number.

- **Parameters**:
  - `groupName` (string): The name of the group whose members are to be fetched.
  - `pageNumber` (number, default = 1): The page number to fetch.

- **Behavior**:
  - If `groupName` is not provided, it logs an error and returns.
  - If the `groupName` changes, it resets the cached data, total count, and sets the current page to 1.
  - Checks if the data for the requested page is already cached; if so, it logs a message and returns.
  - Fetches the data from the API and updates the state variables.

#### `resetGroupMembershipState`

Resets the state variables to their initial values. This is useful when the modal or component using the context is closed or unmounted.

### `useEffect` Hook

- Ensures that the data is fetched when `currentGroupName` or `currentPage` changes.
- Prefetches data for the next page to enhance performance.

### Provider

Wraps the children components with `GroupMembershipContext.Provider` and provides the state variables and functions as context values.

### Usage

```jsx
import React, { useContext } from 'react';
import { GroupMembershipContext } from './path/to/GroupMembershipContext';

const SomeComponent = () => {
  const {
    groupMembersByPage,
    totalCount,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    fetchGroupMembers,
    setCurrentGroupName,
    currentGroupName,
    resetGroupMembershipState,
  } = useContext(GroupMembershipContext);

  // Use the context values and functions as needed
};
```

### Summary

The GroupMembershipContext provides a robust solution for managing group memberships in the application. By caching data and prefetching the next page, it ensures a smooth and performant user experience. The state reset functionality ensures that the context can be reused effectively without stale data.

# GroupContext

The `GroupContext` is a React context that manages the state and API interactions related to organizational units (OUs) and groups within a system. It handles the selection of OUs and Sub OUs, fetching groups based on these selections, and managing pagination and loading states.

### Overview

This context handles the following:
- Fetching groups based on the selected OU.
- Fetching groups based on the selected Sub OU.
- Managing pagination for groups.
- Handling loading states to provide feedback during API calls.

### State Variables

- `selectedOU`: Stores the currently selected Organizational Unit (OU).
- `setSelectedOU`: Function to update the `selectedOU`.
- `selectedSubOU`: Stores the currently selected Sub Organizational Unit (Sub OU).
- `setSelectedSubOU`: Function to update the `selectedSubOU`.
- `groups`: Stores the list of groups fetched based on the selected Sub OU.
- `setGroups`: Function to update the `groups`.
- `totalCount`: The total number of groups for pagination.
- `setTotalCount`: Function to update the `totalCount`.
- `currentPage`: The current page number for pagination.
- `setCurrentPage`: Function to update the `currentPage`.
- `itemsPerPage`: The number of items (groups) to be displayed per page.
- `setItemsPerPage`: Function to update the `itemsPerPage`.
- `returnedOUs`: Stores the list of OUs returned from the API based on the selected OU.
- `setReturnedOUs`: Function to update the `returnedOUs`.
- `isLoading`: Boolean indicating whether an API call is in progress.
- `setIsLoading`: Function to update the `isLoading`.

### Functions

#### `fetchGroupsByOU`

Fetches the list of OUs based on the provided OU name.

- **Parameters**:
  - `ouName` (string): The name of the organizational unit to fetch groups for.

- **Behavior**:
  - Sets the `isLoading` state to true.
  - Makes an API call to fetch the groups based on the provided OU name.
  - Logs the returned data and standardizes it to ensure it is always an array.
  - Updates the `returnedOUs` state with the fetched data.
  - Logs the state after setting `returnedOUs`.
  - Sets the `isLoading` state to false.

#### `fetchGroupsBySubOU`

Fetches the list of groups based on the provided Sub OU name and page number.

- **Parameters**:
  - `subOUName` (string): The name of the sub-organizational unit to fetch groups for.
  - `pageNumber` (number, default = 1): The page number to fetch.

- **Behavior**:
  - Sets the `isLoading` state to true.
  - Makes an API call to fetch the groups based on the provided Sub OU name and page number.
  - Logs the returned data and updates the `groups` and `totalCount` states.
  - Sets the current page to the provided page number.
  - Sets the `isLoading` state to false.

### `useEffect` Hook

- Ensures that the data is fetched when `selectedSubOU` or `currentPage` changes.

### Provider

Wraps the children components with `GroupContext.Provider` and provides the state variables and functions as context values.

### Usage

```jsx
import React, { useContext } from 'react';
import { GroupContext } from './path/to/GroupContext';

const SomeComponent = () => {
  const {
    selectedOU,
    setSelectedOU,
    selectedSubOU,
    setSelectedSubOU,
    groups,
    fetchGroupsByOU,
    fetchGroupsBySubOU,
    isLoading,
  } = useContext(GroupContext);

  // Use the context values and functions as needed
};
```
### Summary

The GroupContext provides a robust solution for managing organizational units and groups within the application. By managing state and API interactions in a centralized context, it ensures a smooth and consistent user experience. The context handles pagination, loading states, and data fetching, making it easier to build and maintain complex UIs.