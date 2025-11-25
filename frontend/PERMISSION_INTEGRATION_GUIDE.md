# Permission Storage & Usage Integration Guide

## Overview

This guide shows how to integrate the global permission management system into your authentication flow and components.

---

## 1. Wrap Your App with PermissionProvider

### In your main App.tsx or index.tsx:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PermissionProvider } from './context/PermissionContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PermissionProvider>
      <App />
    </PermissionProvider>
  </React.StrictMode>
);
```

---

## 2. Store Permissions After Login

### Method 1: Using PermissionContext (Recommended)

```typescript
// In your Login component
import { usePermissionContext } from '../context/PermissionContext';
import axios from 'axios';

const Login = () => {
  const { setPermissions } = usePermissionContext();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      const { token, user } = response.data.data;
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      
      // Extract and store permissions
      const permissions = user.role?.permissions || [];
      setPermissions(permissions); // Stores in context AND localStorage
      
      // Navigate to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin(email, password);
    }}>
      {/* Login form fields */}
    </form>
  );
};
```

### Method 2: Using Permission Helpers

```typescript
// In your Login component
import { extractPermissionsFromToken, storePermissions } from '../utils/permissionHelpers';
import axios from 'axios';

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post('/api/auth/login', { email, password });
    
    const { token, user } = response.data.data;
    
    // Store token
    localStorage.setItem('authToken', token);
    
    // Method A: Extract from token
    extractPermissionsFromToken(token);
    
    // OR Method B: Store directly from response
    const permissions = user.role?.permissions || [];
    storePermissions(permissions);
    
    // Navigate to dashboard
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

---

## 3. Clear Permissions on Logout

### Using PermissionContext:

```typescript
import { usePermissionContext } from '../context/PermissionContext';

const Logout = () => {
  const { clearPermissions } = usePermissionContext();

  const handleLogout = () => {
    // Clear permissions from context and localStorage
    clearPermissions();
    
    // Clear token
    localStorage.removeItem('authToken');
    
    // Redirect to login
    window.location.href = '/login';
  };

  return <button onClick={handleLogout}>Logout</button>;
};
```

### Using Permission Helpers:

```typescript
import { clearPermissions } from '../utils/permissionHelpers';

const handleLogout = () => {
  clearPermissions();
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};
```

---

## 4. Using Permissions in Components

### Option 1: Using PermissionContext (Global State)

```typescript
import { usePermissionContext } from '../context/PermissionContext';
import { PERMISSIONS } from '../constants/permissions';

const UserManagement = () => {
  const { hasPermission, hasAnyPermission, isLoading } = usePermissionContext();

  if (isLoading) {
    return <div>Loading permissions...</div>;
  }

  return (
    <div>
      <h1>User Management</h1>
      
      {hasPermission(PERMISSIONS.USER_CREATE) && (
        <button onClick={handleCreateUser}>Create User</button>
      )}
      
      {hasAnyPermission([PERMISSIONS.USER_EDIT, PERMISSIONS.USER_DELETE]) && (
        <div>Edit/Delete Options</div>
      )}
    </div>
  );
};
```

### Option 2: Using usePermissions Hook (Local)

```typescript
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../constants/permissions';

const UserManagement = () => {
  const { hasPermission, hasAnyPermission } = usePermissions();

  return (
    <div>
      <h1>User Management</h1>
      
      {hasPermission(PERMISSIONS.USER_CREATE) && (
        <button>Create User</button>
      )}
    </div>
  );
};
```

### Option 3: Using Permission Helpers (Utility Functions)

```typescript
import { hasPermission, hasModuleAccess } from '../utils/permissionHelpers';
import { PERMISSIONS } from '../constants/permissions';

const UserManagement = () => {
  const canCreateUsers = hasPermission(PERMISSIONS.USER_CREATE);
  const canAccessUsers = hasModuleAccess('USER_');

  if (!canAccessUsers) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <h1>User Management</h1>
      {canCreateUsers && <button>Create User</button>}
    </div>
  );
};
```

---

## 5. Example: Complete Login Flow

```typescript
// Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissionContext } from '../context/PermissionContext';
import { extractPermissionsFromToken } from '../utils/permissionHelpers';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setPermissions } = usePermissionContext();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data.data;

      // Store token
      localStorage.setItem('authToken', token);

      // Store user info
      localStorage.setItem('user', JSON.stringify(user));

      // Store permissions globally
      const permissions = user.role?.permissions || [];
      setPermissions(permissions);

      // Also extract from token as backup
      extractPermissionsFromToken(token);

      console.log('✅ Login successful. Permissions loaded:', permissions.length);

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
```

---

## 6. Example: Complete Logout Flow

```typescript
// Logout.tsx or in Header/Navbar component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissionContext } from '../context/PermissionContext';

const LogoutButton = () => {
  const { clearPermissions } = usePermissionContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all stored data
    clearPermissions();
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('moduleAccess');

    console.log('✅ Logged out successfully');

    // Redirect to login
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
};

export default LogoutButton;
```

---

## 7. Example: Protected Route Component

```typescript
// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissionContext } from '../context/PermissionContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[]; // OR logic - needs any one
  requireAll?: boolean; // AND logic - needs all
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredPermissions,
  requireAll = false,
  fallback,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isLoading } = usePermissionContext();

  // Check if user is authenticated
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Wait for permissions to load
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Check permissions
  let hasAccess = true;

  if (requiredPermission) {
    hasAccess = hasPermission(requiredPermission);
  } else if (requiredPermissions && requiredPermissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
  }

  if (!hasAccess) {
    return fallback || (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### Usage in Routes:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { PERMISSIONS } from './constants/permissions';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/users" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.USER_VIEW_ALL}>
            <UserManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/rbac" element={
          <ProtectedRoute requiredPermissions={[
            PERMISSIONS.RBAC_VIEW_ROLES,
            PERMISSIONS.RBAC_CREATE_ROLE
          ]}>
            <RBACSetup />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 8. Quick Reference

### When to Use What:

**PermissionContext (usePermissionContext):**
- ✅ When you need reactive updates across components
- ✅ In components that may mount before permissions are loaded
- ✅ When building permission-dependent navigation
- ✅ For loading states while permissions are being fetched

**usePermissions Hook:**
- ✅ Simple local permission checks
- ✅ When permissions are already loaded
- ✅ Lightweight components
- ✅ Quick inline checks

**Permission Helpers (utils/permissionHelpers):**
- ✅ Outside React components (utilities, services)
- ✅ In API interceptors
- ✅ In middleware functions
- ✅ For pure JavaScript logic

### Storage Locations:

| Location | Purpose | Auto-updated |
|----------|---------|--------------|
| `localStorage.userPermissions` | Persistent cache | ✅ Yes |
| `PermissionContext` | Global React state | ✅ Yes |
| JWT Token | Source of truth | ❌ No (refresh on login) |

---

## 9. Best Practices

✅ **DO:**
- Always call `setPermissions()` or `storePermissions()` after successful login
- Clear permissions on logout
- Use global context for permission-driven navigation
- Check permissions both on frontend (UI) and backend (API)
- Handle loading states while permissions are being fetched

❌ **DON'T:**
- Don't rely solely on frontend permission checks for security
- Don't forget to clear permissions on logout
- Don't store sensitive data in permissions array
- Don't bypass permission checks in development

---

## 10. Debugging

### Check Permissions in Console:

```javascript
// Check stored permissions
JSON.parse(localStorage.getItem('userPermissions'))

// Check JWT token payload
const token = localStorage.getItem('authToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload.role.permissions);
```

### Permission Checker Component:

```typescript
const PermissionDebugger = () => {
  const { permissions } = usePermissionContext();
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      right: 0, 
      background: '#333', 
      color: '#fff', 
      padding: '10px',
      maxWidth: '300px',
      fontSize: '12px'
    }}>
      <strong>Current Permissions ({permissions.length}):</strong>
      <div style={{ maxHeight: '200px', overflow: 'auto' }}>
        {permissions.map((p, i) => (
          <div key={i}>{p}</div>
        ))}
      </div>
    </div>
  );
};

// Add to your app in development mode
{process.env.NODE_ENV === 'development' && <PermissionDebugger />}
```

---

**Implementation Date:** November 21, 2025  
**Status:** ✅ Ready for Integration
