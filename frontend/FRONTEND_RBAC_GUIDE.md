# Frontend RBAC Permission Usage Guide

This guide explains how to implement permission-based UI rendering in the frontend using the `usePermissions` hook.

## Table of Contents
1. [Basic Usage](#basic-usage)
2. [Permission Hook](#permission-hook)
3. [Protected Components](#protected-components)
4. [Button Visibility](#button-visibility)
5. [Form Field Protection](#form-field-protection)
6. [Route Protection](#route-protection)
7. [Menu Item Filtering](#menu-item-filtering)
8. [Best Practices](#best-practices)

---

## Basic Usage

### Import the Hook

```typescript
import { usePermissions, ProtectedComponent } from '../hooks/usePermissions';
```

### Check Single Permission

```typescript
const { hasPermission } = usePermissions();

// In your component
{hasPermission('USER_CREATE') && (
  <button onClick={handleCreateUser}>Create User</button>
)}
```

### Check Multiple Permissions (OR Logic)

```typescript
const { hasAnyPermission } = usePermissions();

// Show if user has ANY of these permissions
{hasAnyPermission(['USER_CREATE', 'USER_EDIT']) && (
  <button>Manage Users</button>
)}
```

### Check Multiple Permissions (AND Logic)

```typescript
const { hasAllPermissions } = usePermissions();

// Show only if user has ALL permissions
{hasAllPermissions(['USER_CREATE', 'PROJECT_ASSIGN_USERS']) && (
  <button>Create & Assign User</button>
)}
```

---

## Permission Hook

### Available Methods

```typescript
const {
  permissions,          // Array of all permission codes
  hasPermission,        // Check single permission
  hasAnyPermission,     // Check OR logic (any of multiple)
  hasAllPermissions,    // Check AND logic (all of multiple)
  hasModuleAccess,      // Check if user has any permission with prefix
  getAllPermissions,    // Get all permission codes
} = usePermissions();
```

### Module Access Check

```typescript
// Check if user has any TICKET_* permission
const canAccessTickets = hasModuleAccess('TICKET_');

// Check if user has any USER_* permission
const canAccessUsers = hasModuleAccess('USER_');

// Check if user has any RBAC_* permission
const canAccessRBAC = hasModuleAccess('RBAC_');
```

---

## Protected Components

### Using ProtectedComponent Wrapper

```typescript
import { ProtectedComponent } from '../hooks/usePermissions';

// Single permission
<ProtectedComponent permission="USER_CREATE">
  <button onClick={handleCreateUser}>Create User</button>
</ProtectedComponent>

// Multiple permissions (OR logic - default)
<ProtectedComponent permissions={['USER_CREATE', 'USER_EDIT']}>
  <button>Manage Users</button>
</ProtectedComponent>

// Multiple permissions (AND logic)
<ProtectedComponent permissions={['USER_CREATE', 'PROJECT_ASSIGN_USERS']} requireAll>
  <button>Create & Assign</button>
</ProtectedComponent>

// With fallback content
<ProtectedComponent 
  permission="USER_CREATE"
  fallback={<p>You need USER_CREATE permission to see this.</p>}
>
  <button>Create User</button>
</ProtectedComponent>
```

---

## Button Visibility

### Create Button

```typescript
{hasPermission('USER_CREATE') && (
  <button 
    onClick={handleCreateUser}
    style={{ background: '#3b82f6', color: 'white' }}
  >
    Create New User
  </button>
)}
```

### Edit Button

```typescript
{hasPermission('USER_EDIT') && (
  <button onClick={() => handleEditUser(user.id)}>
    Edit
  </button>
)}
```

### Delete Button

```typescript
{hasPermission('USER_DELETE') && (
  <button 
    onClick={() => handleDeleteUser(user.id)}
    style={{ background: '#ef4444', color: 'white' }}
  >
    Delete
  </button>
)}
```

### Action Buttons with Multiple Permissions

```typescript
<div className="action-buttons">
  {hasAnyPermission(['USER_EDIT', 'USER_TOGGLE_STATUS']) && (
    <button onClick={() => setShowActions(true)}>
      Actions ▼
    </button>
  )}
  
  {showActions && (
    <div className="dropdown">
      {hasPermission('USER_EDIT') && (
        <div onClick={handleEdit}>Edit</div>
      )}
      {hasPermission('USER_TOGGLE_STATUS') && (
        <div onClick={handleToggleStatus}>
          {user.isActive ? 'Deactivate' : 'Activate'}
        </div>
      )}
      {hasPermission('USER_RESET_PASSWORD') && (
        <div onClick={handleResetPassword}>Reset Password</div>
      )}
      {hasPermission('USER_DELETE') && (
        <div onClick={handleDelete} style={{ color: 'red' }}>
          Delete
        </div>
      )}
    </div>
  )}
</div>
```

---

## Form Field Protection

### Conditional Form Fields

```typescript
const UserForm = () => {
  const { hasPermission, hasAnyPermission } = usePermissions();

  return (
    <form>
      {/* Everyone can see basic fields */}
      <input name="firstName" placeholder="First Name" />
      <input name="lastName" placeholder="Last Name" />
      <input name="email" placeholder="Email" />
      
      {/* Only users with USER_ASSIGN_ROLE can assign roles */}
      {hasPermission('USER_ASSIGN_ROLE') && (
        <select name="role">
          <option value="">Select Role</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
      )}
      
      {/* Only users with PROJECT_ASSIGN_USERS can assign projects */}
      {hasPermission('PROJECT_ASSIGN_USERS') && (
        <select name="projects" multiple>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      )}
      
      {/* Submit button only if user can create or edit */}
      {hasAnyPermission(['USER_CREATE', 'USER_EDIT']) && (
        <button type="submit">
          {isEditMode ? 'Update User' : 'Create User'}
        </button>
      )}
    </form>
  );
};
```

### Disabled vs Hidden Fields

```typescript
// Option 1: Hide field completely if no permission
{hasPermission('USER_ASSIGN_ROLE') && (
  <select name="role">...</select>
)}

// Option 2: Show field but disable it
<select 
  name="role"
  disabled={!hasPermission('USER_ASSIGN_ROLE')}
  title={!hasPermission('USER_ASSIGN_ROLE') ? 'You need USER_ASSIGN_ROLE permission' : ''}
>
  ...
</select>
```

---

## Route Protection

### Using Higher-Order Component

```typescript
import { withPermission } from '../hooks/usePermissions';
import UserManagement from './UserManagement';

// Protect entire route
export default withPermission(UserManagement, 'USER_VIEW_ALL');

// Protect with multiple permissions (OR logic)
export default withPermission(
  UserManagement, 
  ['USER_VIEW_ALL', 'USER_MANAGE'],
  false // requireAll = false (default)
);

// Protect with multiple permissions (AND logic)
export default withPermission(
  UserManagement,
  ['USER_VIEW_ALL', 'USER_EDIT'],
  true // requireAll = true
);
```

### Manual Route Protection

```typescript
const UserManagement = () => {
  const { hasPermission } = usePermissions();

  if (!hasPermission('USER_VIEW_ALL')) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You need USER_VIEW_ALL permission to access this page.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Your component content */}
    </div>
  );
};
```

---

## Menu Item Filtering

### Sidebar Navigation

```typescript
const DashboardSidebar = () => {
  const { hasModuleAccess, hasPermission } = usePermissions();

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
      visible: true, // Everyone can see dashboard
    },
    {
      label: 'Tickets',
      path: '/tickets',
      icon: <TicketIcon />,
      visible: hasModuleAccess('TICKET_'),
    },
    {
      label: 'Users',
      path: '/users',
      icon: <UserIcon />,
      visible: hasModuleAccess('USER_'),
    },
    {
      label: 'Projects',
      path: '/projects',
      icon: <ProjectIcon />,
      visible: hasModuleAccess('PROJECT_'),
    },
    {
      label: 'Knowledge Base',
      path: '/knowledge-base',
      icon: <KBIcon />,
      visible: hasModuleAccess('KB_'),
    },
    {
      label: 'RBAC Setup',
      path: '/rbac',
      icon: <RBACIcon />,
      visible: hasModuleAccess('RBAC_'),
    },
    {
      label: 'Audit Logs',
      path: '/audit',
      icon: <AuditIcon />,
      visible: hasPermission('AUDIT_VIEW_ACTIVITY') || hasPermission('AUDIT_VIEW_ACCESS'),
    },
    {
      label: 'Offline Module',
      path: '/offline',
      icon: <OfflineIcon />,
      visible: hasModuleAccess('OFFLINE_'),
    },
  ];

  return (
    <nav>
      {menuItems.filter(item => item.visible).map(item => (
        <a key={item.path} href={item.path}>
          {item.icon}
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
};
```

### Dynamic Menu with Submenus

```typescript
const NavigationMenu = () => {
  const { hasPermission, hasAnyPermission } = usePermissions();

  return (
    <ul className="menu">
      {/* Dashboard - visible to all */}
      <li><a href="/dashboard">Dashboard</a></li>

      {/* Tickets - show if has any ticket permission */}
      {hasAnyPermission(['TICKET_VIEW_ALL', 'TICKET_VIEW_OWN', 'TICKET_CREATE']) && (
        <li>
          <a href="/tickets">Tickets</a>
          <ul className="submenu">
            {hasPermission('TICKET_VIEW_ALL') && (
              <li><a href="/tickets/all">All Tickets</a></li>
            )}
            {hasPermission('TICKET_VIEW_OWN') && (
              <li><a href="/tickets/my-tickets">My Tickets</a></li>
            )}
            {hasPermission('TICKET_CREATE') && (
              <li><a href="/tickets/create">Create Ticket</a></li>
            )}
          </ul>
        </li>
      )}

      {/* Users - show if has any user permission */}
      {hasAnyPermission(['USER_VIEW_ALL', 'USER_CREATE']) && (
        <li>
          <a href="/users">Users</a>
          <ul className="submenu">
            {hasPermission('USER_VIEW_ALL') && (
              <li><a href="/users">All Users</a></li>
            )}
            {hasPermission('USER_CREATE') && (
              <li><a href="/users/create">Create User</a></li>
            )}
          </ul>
        </li>
      )}

      {/* RBAC - only for users with RBAC permissions */}
      {hasAnyPermission(['RBAC_VIEW_ROLES', 'RBAC_CREATE_ROLE']) && (
        <li>
          <a href="/rbac">RBAC Setup</a>
        </li>
      )}
    </ul>
  );
};
```

---

## Best Practices

### 1. Always Check Permissions Before Actions

```typescript
// ✅ Good
const handleDeleteUser = (userId: string) => {
  if (!hasPermission('USER_DELETE')) {
    alert('You do not have permission to delete users');
    return;
  }
  // Proceed with deletion
};

// ❌ Bad - no permission check
const handleDeleteUser = (userId: string) => {
  // Directly proceed without checking
};
```

### 2. Use Permission Constants

```typescript
// Create a constants file
// frontend/src/constants/permissions.ts
export const PERMISSIONS = {
  USER_CREATE: 'USER_CREATE',
  USER_EDIT: 'USER_EDIT',
  USER_DELETE: 'USER_DELETE',
  USER_VIEW_ALL: 'USER_VIEW_ALL',
  TICKET_CREATE: 'TICKET_CREATE',
  // ... all other permissions
};

// Use in components
import { PERMISSIONS } from '../constants/permissions';

{hasPermission(PERMISSIONS.USER_CREATE) && (
  <button>Create User</button>
)}
```

### 3. Combine Backend and Frontend Protection

```typescript
// Frontend check (UI)
{hasPermission('USER_DELETE') && (
  <button onClick={handleDelete}>Delete</button>
)}

// Backend call (API) - with try-catch for 403 errors
const handleDelete = async (userId: string) => {
  try {
    await axios.delete(`/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Success
  } catch (error: any) {
    if (error.response?.status === 403) {
      alert('Permission denied: You do not have permission to delete users');
    }
  }
};
```

### 4. Use Descriptive Permission Checks

```typescript
// ✅ Good - clear what's being checked
const canCreateUsers = hasPermission('USER_CREATE');
const canEditUsers = hasPermission('USER_EDIT');
const canManageUsers = hasAnyPermission(['USER_CREATE', 'USER_EDIT', 'USER_DELETE']);

// Use the descriptive variables
{canCreateUsers && <button>Create User</button>}
{canEditUsers && <button>Edit User</button>}
{canManageUsers && <div>User Management Panel</div>}
```

### 5. Handle Loading States

```typescript
const UserList = () => {
  const { permissions } = usePermissions();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (permissions.length === 0) {
      // Wait for permissions to load
      return;
    }

    if (!hasPermission('USER_VIEW_ALL')) {
      setLoading(false);
      return;
    }

    fetchUsers();
  }, [permissions]);

  if (loading) return <div>Loading...</div>;
  if (!hasPermission('USER_VIEW_ALL')) return <div>Access Denied</div>;

  return <div>{/* User list */}</div>;
};
```

### 6. Provide User Feedback

```typescript
// Show informative messages
{!hasPermission('USER_CREATE') ? (
  <div className="info-banner">
    <p>You need USER_CREATE permission to create new users.</p>
    <p>Contact your administrator to request access.</p>
  </div>
) : (
  <button onClick={handleCreateUser}>Create User</button>
)}
```

---

## Permission Code Reference

### User Management
- `USER_VIEW_ALL` - View all users
- `USER_CREATE` - Create new users
- `USER_EDIT` - Edit user details
- `USER_DELETE` - Delete users
- `USER_TOGGLE_STATUS` - Activate/deactivate users
- `USER_ASSIGN_ROLE` - Assign roles to users
- `USER_RESET_PASSWORD` - Reset user passwords

### Ticket Management
- `TICKET_VIEW_ALL` - View all tickets
- `TICKET_VIEW_OWN` - View own tickets
- `TICKET_CREATE` - Create tickets
- `TICKET_EDIT` - Edit ticket details
- `TICKET_DELETE` - Delete tickets
- `TICKET_ASSIGN` - Assign tickets to agents
- `TICKET_CHANGE_STATUS` - Change ticket status
- `TICKET_CHANGE_PRIORITY` - Change ticket priority
- `TICKET_ADD_COMMENT` - Add comments/replies
- `TICKET_EDIT_COMMENT` - Edit comments
- `TICKET_DELETE_COMMENT` - Delete comments
- `TICKET_ADD_ATTACHMENT` - Upload attachments
- `TICKET_DELETE_ATTACHMENT` - Delete attachments
- `TICKET_MERGE` - Merge tickets
- `TICKET_BULK_UPDATE` - Bulk update tickets
- `TICKET_EXPORT` - Export tickets

### Project Management
- `PROJECT_VIEW_ALL` - View all projects
- `PROJECT_CREATE` - Create new projects
- `PROJECT_EDIT` - Edit project settings
- `PROJECT_DELETE` - Delete projects
- `PROJECT_TOGGLE_STATUS` - Activate/deactivate projects
- `PROJECT_MANAGE_SETTINGS` - Manage project configurations
- `PROJECT_MANAGE_BRANDING` - Customize project branding
- `PROJECT_ASSIGN_USERS` - Assign users to projects

### RBAC Management
- `RBAC_VIEW_ROLES` - View roles
- `RBAC_CREATE_ROLE` - Create new roles
- `RBAC_EDIT_ROLE` - Edit role details
- `RBAC_DELETE_ROLE` - Delete roles
- `RBAC_ASSIGN_PERMISSIONS` - Assign permissions to roles
- `RBAC_VIEW_PERMISSIONS` - View all permissions

### Audit & Logs
- `AUDIT_VIEW_ACTIVITY` - View activity logs
- `AUDIT_VIEW_ACCESS` - View access logs
- `AUDIT_EXPORT` - Export audit logs

### Knowledge Base
- `KB_VIEW` - View KB articles
- `KB_CREATE` - Create KB articles
- `KB_EDIT` - Edit KB articles
- `KB_DELETE` - Delete KB articles
- `KB_PUBLISH` - Publish KB articles
- `KB_MANAGE_CATEGORIES` - Manage KB categories

### Offline Module
- `OFFLINE_MODULE_ACCESS` - Access offline module
- `OFFLINE_STUDENT_REGISTER` - Register students
- `OFFLINE_TICKET_CREATE` - Create offline tickets
- `OFFLINE_STUDENT_VIEW` - View student records
- `OFFLINE_STUDENT_EDIT` - Edit student records

---

## Testing Permissions

### Console Debug

```typescript
const { getAllPermissions } = usePermissions();

useEffect(() => {
  console.log('Current user permissions:', getAllPermissions());
}, []);
```

### Permission Checker Component

```typescript
const PermissionChecker = () => {
  const { getAllPermissions, hasPermission } = usePermissions();
  const [testPermission, setTestPermission] = useState('');

  return (
    <div style={{ padding: '20px', background: '#f0f0f0' }}>
      <h3>Permission Checker (Dev Tool)</h3>
      <p>All Permissions: {getAllPermissions().join(', ')}</p>
      <input 
        placeholder="Enter permission code to test"
        value={testPermission}
        onChange={(e) => setTestPermission(e.target.value)}
      />
      <p>
        Has Permission: {hasPermission(testPermission) ? '✅ Yes' : '❌ No'}
      </p>
    </div>
  );
};
```

---

## Migration Checklist

When migrating from hardcoded roles to permission-based system:

- [ ] Replace all `roleCode === 'SUPER_ADMIN'` checks with `hasPermission('...')`
- [ ] Replace all `role.name === 'Agent'` checks with appropriate permission checks
- [ ] Update sidebar/menu to use `hasModuleAccess()`
- [ ] Add permission checks to all action buttons (Create, Edit, Delete, etc.)
- [ ] Protect form fields based on permissions
- [ ] Add permission-based route protection
- [ ] Update API calls to handle 403 Forbidden responses
- [ ] Test with different role types (Super Admin, Manager, Agent, Student)
- [ ] Verify that UI elements hide/show correctly based on permissions
- [ ] Ensure backend routes have corresponding permission middleware

---

**Last Updated:** November 21, 2025
