# AURA Authentication API Reference

This document provides details on the available API endpoints for the AURA Authentication Service (`amer-auth-service`). These endpoints handle user login, token management, and user lookup.

**Base URL:** The base URL for these endpoints depends on your deployment environment. Typically it might be something like `/api/auth` relative to the main application host.

**Authentication:** Endpoints marked with *Requires Authentication* expect a valid JWT Bearer token in the `Authorization` header: `Authorization: Bearer <your_access_token>`.

---

## User Login

### `POST /login`

Authenticates a user using their corporate username and password via LDAP.

**Request Body:**

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Authentication successful",
  "user": {
    "username": "your_username",
    "dn": "CN=Your Name,OU=Users,DC=example,DC=com",
    "displayName": "Your Name",
    "mail": "your.name@example.com",
    "groups": ["Group1", "Group2"],
    "sAMAccountName": "your_username"
    // ... other LDAP attributes
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

*   `400 Bad Request`: Missing `username` or `password`.
*   `401 Unauthorized`: Invalid `username` or `password`.
*   `500 Internal Server Error`: LDAP connection issues or other server errors.

---

## Client Credentials Grant

### `POST /token`

Authenticates a client application using its client ID and secret to obtain an access token. This is typically used for server-to-server communication.

**Request Body:**

```json
{
  "clientId": "your_client_id",
  "clientSecret": "your_client_secret"
}
```

**Success Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

*   `401 Unauthorized`: Invalid `clientId` or `clientSecret`.

---

## Refresh Access Token

### `POST /refresh`

Obtains a new access token using a valid refresh token.

**Request Body:**

```json
{
  "refreshToken": "your_refresh_token"
}
```

**Success Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

*   `401 Unauthorized`: `refreshToken` not provided.
*   `403 Forbidden`: Invalid or expired `refreshToken`.

---

## Verify Access Token

### `GET /verify`

*Requires Authentication*

Verifies the validity of the provided access token (sent via `Authorization: Bearer` header) and returns the user information embedded within it.

**Request Body:** None

**Success Response (200 OK):**

```json
{
  "user": {
    "username": "your_username",
    "dn": "CN=Your Name,OU=Users,DC=example,DC=com",
    "displayName": "Your Name",
    "mail": "your.name@example.com",
    "groups": ["Group1", "Group2"],
    "sAMAccountName": "your_username"
    // ... other attributes included in the token payload
  }
}
```

**Error Responses:**

*   `401 Unauthorized`: No token provided, or token is invalid/expired.

---

## Logout

### `GET /logout`

Logs the user out. The specific implementation might depend on server-side session management, but this endpoint signals the intent to end the session.

**Request Body:** None

**Success Response (200 OK):**

```json
{
  "message": "Logged out successfully"
}
```

**Error Responses:**

*   `500 Internal Server Error`: If an error occurs during the logout process.

---

## Search Users

### `POST /search-users`

*Requires Authentication*

Searches the Active Directory for users based on a search term. Matches against common attributes like `sAMAccountName`, `cn`, `mail`, and `displayName`.

**Request Body:**

```json
{
  "searchTerm": "search_query",
  "limit": 10 // Optional, default is 10
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "User search successful",
  "users": [
    {
      "cn": "User One Name",
      "sAMAccountName": "userone",
      "mail": "user.one@example.com",
      "displayName": "User One Name",
      "userPrincipalName": "userone@example.com",
      "groups": ["GroupA", "GroupB"]
    },
    {
      "cn": "Another User",
      "sAMAccountName": "another",
      "mail": "another.user@example.com",
      "displayName": "Another User",
      "userPrincipalName": "another@example.com",
      "groups": ["GroupC"]
    }
    // ... other matching users up to the limit
  ]
}
```

**Error Responses:**

*   `400 Bad Request`: `searchTerm` is missing or too short.
*   `401 Unauthorized`: Invalid/expired access token.
*   `500 Internal Server Error`: LDAP connection/search errors or missing service account configuration on the server.

---

## Search Users (Minimal)

### `POST /search-users-minimal`

*Requires Authentication*

Searches the Active Directory for users based on a search term, returning a minimal set of user attributes (no group memberships).

**Request Body:**

```json
{
  "searchTerm": "search_query",
  "limit": 20, // Optional, max results to return, default: 20
  "pageSize": 100, // Optional, internal LDAP page size, default: 100
  "site": "All AMER" // Optional, specify site if needed, default: 'All AMER'
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "users": [
    {
      "cn": "User One Name",
      "sAMAccountName": "userone",
      "mail": "user.one@example.com",
      "displayName": "User One Name",
      "userPrincipalName": "userone@example.com"
      // Note: 'groups' are intentionally omitted
    },
    {
      "cn": "Another User",
      "sAMAccountName": "another",
      "mail": "another.user@example.com",
      "displayName": "Another User",
      "userPrincipalName": "another@example.com"
    }
    // ... other matching users up to the limit
  ]
}
```

**Error Responses:**

*   `400 Bad Request`: `searchTerm` is missing or too short.
*   `401 Unauthorized`: Invalid/expired access token.
*   `500 Internal Server Error`: General server error during search.
*   `503 Service Unavailable`: LDAP Pool exhausted or timeout waiting for connection.

---

## Get User Profile

### `GET /profile`

*Requires Authentication*

Retrieves detailed profile information for the authenticated user (identified by the JWT token) from Active Directory.

**Request Body:** None

**Headers:**

*   `Authorization: Bearer <your_access_token>`

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "profile": {
    "displayName": "John Smith",
    "firstName": "John", // from givenName
    "lastName": "Smith", // from sn
    "email": "john.smith@pfizer.com", // from mail
    "phoneNumber": "+1 (555) 123-4567", // from telephoneNumber
    "jobTitle": "Software Engineer", // from title
    "department": "IT", // from department
    "company": "Pfizer", // from company
    "location": "New York", // from physicalDeliveryOfficeName
    "employeeId": "E12345", // from employeeID
    "profileCreated": "2022-06-15T12:34:56Z" // from whenCreated (ISO format)
  }
}
```

**Error Responses:**

*   `400 Bad Request`: User identifier not found in token.
*   `401 Unauthorized`: Authentication token is missing or invalid.
*   `404 Not Found`: User profile was not found in Active Directory.
*   `500 Internal Server Error`: An error occurred while processing the request (e.g., LDAP connection issue, service account bind failure).
*   `504 Gateway Timeout`: LDAP search operation timed out.