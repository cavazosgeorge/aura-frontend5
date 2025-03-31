# User Account App - Development Environment

This document explains how the development environment is set up to work without requiring authentication or a real backend API. This allows UI development to proceed independently of the backend services.

## Overview

The development environment uses the following key components:

1. **Mock Service Worker (MSW)** - Intercepts API requests and returns mock data
2. **Development Mode Flags** - Controls authentication bypass and mock data usage
3. **Mock User Data** - Provides realistic user data for testing UI components

## How It Works

### 1. Mock Service Worker (MSW)

[Mock Service Worker](https://mswjs.io/) is a library that intercepts outgoing requests and provides mock responses. This allows you to develop and test your frontend without relying on actual backend services.

#### Key Files:

- **`/src/mocks/handlers.js`** - Contains all the request handlers and mock data
- **`/src/mocks/browser.js`** - Sets up the MSW service worker
- **`/src/mocks/index.js`** - Entry point that initializes MSW in development mode

MSW intercepts requests to endpoints like:
- `/api/v1/ad/user-info` - For user search functionality
- `/api/v1/access-requests` - For submitting and retrieving access requests

### 2. Development Mode Flags

Several components use development mode flags to bypass authentication and use mock data:

- **`AuthContext.jsx`** - Uses `DEV_MODE` flag to provide a mock user without authentication
- **`App.jsx`** - Uses `DEV_MODE` flag to control routing and bypass the login page
- **`useUserSearch.js`** - Uses `DEV_MODE` flag to provide fallback mock data if API calls fail

### 3. Mock Data

The application uses several types of mock data:

#### Mock User Data (in AuthContext)

```javascript
// Mock user for development
{
  username: 'dev_user',
  firstName: 'Development',
  lastName: 'User',
  email: 'dev@example.com',
  roles: ['ADMIN', 'USER'],
  _json: {
    sAMAccountName: 'dev_user',
    givenName: 'Development',
    sn: 'User',
    mail: 'dev@example.com',
    memberOf: [
      'CN=ADMIN,OU=Groups,DC=example,DC=com',
      'CN=USER,OU=Groups,DC=example,DC=com'
    ]
  }
}
```

#### Mock AD Users (in handlers.js)

The mock API provides a list of Active Directory users with realistic properties including:
- `displayName`
- `sAMAccountName`
- `mail`
- `department`
- `title`
- `telephoneNumber`
- And other AD-specific attributes

#### Mock Access Requests (in handlers.js)

The mock API also provides access request data with properties like:
- `id`
- `userId`
- `userName`
- `system`
- `department`
- `role`
- `status`
- And timestamps for various actions

## How to Use the Development Environment

### Enabling/Disabling Development Mode

### Toggling Development Mode

Development mode is now controlled through a centralized environment variable. To toggle it:

1. Create or modify the `.env` file in the project root
2. Set the `VITE_DEV_MODE` environment variable:
   ```
   VITE_DEV_MODE=true    # For development with mock data and no authentication
   VITE_DEV_MODE=false   # For production-like behavior with real API calls
   ```

The application reads this environment variable through the centralized configuration in `/src/config/environment.js`, which exposes it as `config.DEV_MODE` to all components.

### Adding New Mock Endpoints

To add new mock endpoints:

1. Open `/src/mocks/handlers.js`
2. Add a new request handler using the MSW syntax:

```javascript
rest.get(`${config.backendUrl}/api/v1/your-endpoint`, (req, res, ctx) => {
  // Extract query parameters if needed
  const param = req.url.searchParams.get('paramName');
  
  // Return mock data
  return res(
    ctx.status(200),
    ctx.json({ 
      // Your mock data here
    })
  );
})
```

### Customizing Mock Data

To modify the mock data:

1. Open `/src/mocks/handlers.js`
2. Update the mock data arrays at the top of the file
3. Restart the development server to see changes

## Troubleshooting

### Mock API Not Working

If the mock API isn't intercepting requests:

1. Check browser console for MSW initialization messages
2. Verify that `DEV_MODE` is set to `true` in all relevant files
3. Make sure the endpoint you're calling matches exactly what's defined in the handlers

### Authentication Issues

If you're still being redirected to the login page:

1. Check that `VITE_DEV_MODE` is set to `true` in your `.env` file
2. Verify that the console shows the correct DEV_MODE setting on startup
3. Try restarting the development server to ensure environment variables are loaded
4. Check browser console for any authentication-related errors

## Best Practices

1. **Keep mock data realistic** - Try to match the structure and types of data that would come from the real API
2. **Document new mock endpoints** - Add comments in the code to explain what each endpoint is for
3. **Test with both mock and real APIs** - Before deploying, test with the real API to catch any integration issues
4. **Use the centralized DEV_MODE** - Always access development mode through `config.DEV_MODE` rather than creating local flags

## Additional Resources

- [MSW Documentation](https://mswjs.io/docs/)
- [React Context API](https://reactjs.org/docs/context.html)
- [Active Directory Attributes Reference](https://docs.microsoft.com/en-us/windows/win32/adschema/attributes-all)