# Hardcoded Role Check Removal Checklist

## Overview
This document tracks all hardcoded role checks found in the frontend codebase that need to be replaced with permission-based checks.

## Search Results
Found 11 instances of hardcoded role checks using pattern: `if.*role.*===|roleCode.*===|role\.name.*===`

---

## Files to Update

### ✅ COMPLETED

#### 1. DashboardLayout.tsx
- **Status:** ✅ COMPLETED
- **Changes Made:**
  - Removed `moduleAccess` localStorage dependency
  - Replaced with permission-based menu filtering
  - Integrated `usePermissions()` hook
  - Now uses `menuConfig.tsx` for centralized menu configuration

---

## ⏳ PENDING FIXES

### 2. ProjectAgentLogin.tsx
**Location:** `frontend/src/components/ProjectAgentLogin.tsx:71`

**Current Code:**
```typescript
if (user.role.code === 'STUDENT')
```

**Suggested Fix:**
```typescript
// Replace role check with permission check
if (hasPermission('STUDENT_ACCESS') || !hasModuleAccess('AGENT_')) {
  // Student logic
}
```

**Context:** Likely checking if user is a student to restrict agent portal access

**Priority:** HIGH (login flow)

---

### 3. AgentDashboard.tsx
**Location:** `frontend/src/components/AgentDashboard.tsx:170`

**Current Code:**
```typescript
if (userData.role.code === 'STUDENT')
```

**Suggested Fix:**
```typescript
// Import usePermissions
const { hasPermission, hasModuleAccess } = usePermissions();

// Replace with permission check
if (!hasModuleAccess('AGENT_')) {
  // Redirect or show limited view
}
```

**Context:** Dashboard rendering based on user role

**Priority:** HIGH (core dashboard)

---

### 4. ProjectPortalDashboard.tsx
**Location:** `frontend/src/components/ProjectPortalDashboard.tsx:1049`

**Current Code:**
```typescript
if (userData.role.code === 'STUDENT')
```

**Suggested Fix:**
```typescript
const { hasPermission } = usePermissions();

// Replace with permission check
const isStudentView = !hasAnyPermission([
  'TICKET_VIEW_ALL',
  'TICKET_ASSIGN',
  'USER_VIEW_ALL'
]);

if (isStudentView) {
  // Show student-specific dashboard
}
```

**Context:** Portal dashboard view customization

**Priority:** HIGH (portal experience)

---

### 5. ApprovalWorkflows.tsx
**Location:** `frontend/src/components/ApprovalWorkflows.tsx:153`

**Current Code:**
```typescript
if (roleCode === 'SUPER_ADMIN' || roleCode === 'superadmin')
```

**Suggested Fix:**
```typescript
const { hasPermission } = usePermissions();

// Replace with permission check
if (hasPermission('APPROVAL_WORKFLOWS_DELETE') || hasPermission('APPROVAL_WORKFLOWS_MANAGE')) {
  // Show delete button or admin features
}
```

**Context:** Approval workflow management permissions

**Priority:** MEDIUM (admin feature)

---

### 6. AgentLogin.tsx
**Location:** `frontend/src/components/AgentLogin.tsx:91`

**Current Code:**
```typescript
if (user.role.code === 'STUDENT')
```

**Suggested Fix:**
```typescript
const { hasModuleAccess } = usePermissions();

// Replace with permission check
if (!hasModuleAccess('AGENT_')) {
  // Redirect to student portal
  navigate(`/${customUrlPath}/student-portal`);
  return;
}
```

**Context:** Login routing based on user type

**Priority:** HIGH (login flow)

---

### 7. AddProjectForm.tsx
**Location:** `frontend/src/components/AddProjectForm.tsx` (Multiple instances)

**Note:** Need to read this file to identify specific line numbers and context

**Suggested Approach:**
```typescript
// Import permission hook
const { hasPermission } = usePermissions();

// Replace role-based form field visibility
const canAssignRoles = hasPermission('PROJECT_ASSIGN_ROLES');
const canConfigureModules = hasPermission('PROJECT_CONFIGURE_MODULES');
```

**Priority:** MEDIUM (project configuration)

---

## Implementation Plan

### Phase 1: Login & Authentication (HIGH Priority)
1. [ ] Fix `ProjectAgentLogin.tsx` - Student role check
2. [ ] Fix `AgentLogin.tsx` - Student role check  
3. [ ] Test login flows with different user types

### Phase 2: Dashboard Views (HIGH Priority)
4. [ ] Fix `AgentDashboard.tsx` - Dashboard rendering
5. [ ] Fix `ProjectPortalDashboard.tsx` - Portal view
6. [ ] Test dashboard visibility with different permissions

### Phase 3: Admin Features (MEDIUM Priority)
7. [ ] Fix `ApprovalWorkflows.tsx` - Admin actions
8. [ ] Fix `AddProjectForm.tsx` - Form field visibility
9. [ ] Test admin feature access

### Phase 4: Comprehensive Testing
10. [ ] Test with Super Admin role (all permissions)
11. [ ] Test with Manager role (limited permissions)
12. [ ] Test with Agent role (ticket permissions)
13. [ ] Test with Student role (view-only)

---

## Testing Strategy

### Test Cases

#### Super Admin
- ✅ Should see all menu items
- ✅ Should see all dashboard widgets
- ✅ Should see delete buttons in approval workflows
- ✅ Should access all forms and fields

#### Manager
- ✅ Should see user management, tickets, reports
- ✅ Should NOT see master data, RBAC setup
- ✅ Should see approval workflow management
- ✅ Should NOT see system configuration

#### Agent
- ✅ Should see tickets, knowledge base
- ✅ Should NOT see user management
- ✅ Should NOT see approval workflows
- ✅ Should NOT see reports

#### Student
- ✅ Should see only own tickets
- ✅ Should NOT see agent dashboard
- ✅ Should NOT see any admin features
- ✅ Should redirect to student portal on login

---

## Code Pattern References

### ❌ BAD: Hardcoded Role Check
```typescript
// DON'T DO THIS
if (user.role.code === 'SUPER_ADMIN') {
  // Admin feature
}

if (roleCode === 'STUDENT') {
  // Student view
}
```

### ✅ GOOD: Permission-Based Check
```typescript
// DO THIS INSTEAD
import { usePermissions } from '../hooks/usePermissions';

function MyComponent() {
  const { hasPermission, hasAnyPermission, hasModuleAccess } = usePermissions();
  
  // Single permission
  if (hasPermission('ADMIN_ACCESS')) {
    // Admin feature
  }
  
  // Multiple permissions (OR logic)
  if (hasAnyPermission(['TICKET_VIEW_ALL', 'TICKET_VIEW_OWN'])) {
    // Ticket access
  }
  
  // Module-level check
  if (hasModuleAccess('AGENT_')) {
    // Agent features
  }
  
  // Inverse check for students
  if (!hasModuleAccess('AGENT_')) {
    // Student-specific view
  }
}
```

### ✅ GOOD: Conditional Rendering
```typescript
import { ProtectedComponent } from '../hooks/usePermissions';

function Dashboard() {
  return (
    <>
      {/* Always visible */}
      <h1>Dashboard</h1>
      
      {/* Conditional with permission */}
      <ProtectedComponent permission="USER_DELETE">
        <button>Delete User</button>
      </ProtectedComponent>
      
      {/* Conditional with multiple permissions (OR) */}
      <ProtectedComponent permission={['REPORT_VIEW_ALL', 'REPORT_VIEW_OWN']}>
        <ReportsSection />
      </ProtectedComponent>
    </>
  );
}
```

---

## Migration Steps (Per File)

### Standard Process

1. **Read the file** to understand context
   ```bash
   # Search for role checks
   grep -n "role.*===" frontend/src/components/FileName.tsx
   ```

2. **Identify the logic**
   - What is being shown/hidden?
   - What permissions should control this?
   - Is it a boolean check or complex logic?

3. **Import permission hook**
   ```typescript
   import { usePermissions } from '../hooks/usePermissions';
   ```

4. **Replace role check with permission check**
   ```typescript
   // OLD
   if (user.role.code === 'SUPER_ADMIN') { ... }
   
   // NEW
   const { hasPermission } = usePermissions();
   if (hasPermission('ADMIN_FEATURE_ACCESS')) { ... }
   ```

5. **Test the change**
   - Test with user who HAS the permission
   - Test with user who DOESN'T have the permission
   - Verify behavior matches original intent

6. **Update checklist** - Mark as completed ✅

---

## Permission Mapping Reference

Common role checks and their permission equivalents:

| Old Role Check | New Permission Check |
|----------------|---------------------|
| `role === 'SUPER_ADMIN'` | `hasPermission('SYSTEM_ADMIN')` or check specific permission |
| `role === 'STUDENT'` | `!hasModuleAccess('AGENT_')` or `hasPermission('STUDENT_ACCESS')` |
| `role === 'MANAGER'` | `hasAnyPermission(['USER_VIEW_ALL', 'TICKET_ASSIGN'])` |
| `role === 'AGENT'` | `hasModuleAccess('TICKET_')` |
| `role === 'CENTER_MANAGER'` | `hasPermission('CENTER_MANAGE')` |

**Note:** The exact permission depends on what feature is being controlled!

---

## Verification Commands

### Find All Role Checks
```bash
# Search in all TypeScript files
grep -r "role.*===" frontend/src/ --include="*.tsx" --include="*.ts"

# Search for roleCode checks
grep -r "roleCode.*===" frontend/src/ --include="*.tsx" --include="*.ts"

# Search for role.name checks
grep -r "role\.name.*===" frontend/src/ --include="*.tsx" --include="*.ts"
```

### Count Remaining Issues
```bash
grep -r "role.*===" frontend/src/ --include="*.tsx" --include="*.ts" | wc -l
```

---

## Progress Tracking

- **Total Files with Hardcoded Roles:** 7 (including AddProjectForm which has multiple)
- **Files Fixed:** 1 ✅
- **Files Remaining:** 6 ⏳
- **Completion:** 14% (1/7)

---

## Notes

### Special Cases

#### Student Role Detection
Since "STUDENT" might not have explicit permissions, we use inverse logic:
```typescript
// Student = user WITHOUT agent/admin permissions
const isStudent = !hasAnyPermission([
  'TICKET_VIEW_ALL',
  'TICKET_ASSIGN',
  'USER_VIEW_ALL',
  'AGENT_ACCESS'
]);
```

#### Super Admin Detection
Super Admin should have ALL or most permissions. Check specific feature permissions instead:
```typescript
// Instead of checking if role === 'SUPER_ADMIN'
// Check if user can do the specific action
if (hasPermission('DELETE_PROJECT') || hasPermission('SYSTEM_ADMIN')) {
  // Show delete button
}
```

#### Dynamic Role-Based Views
For complex role-based UI, create reusable components:
```typescript
// components/RoleBasedView.tsx
function RoleBasedView({ children }) {
  const { hasModuleAccess } = usePermissions();
  
  if (!hasModuleAccess('AGENT_')) {
    return <StudentView />;
  }
  
  if (hasModuleAccess('MANAGE_')) {
    return <ManagerView>{children}</ManagerView>;
  }
  
  return <AgentView>{children}</AgentView>;
}
```

---

## Related Documentation

- ✅ `RBAC_REFACTORING_SUMMARY.md` - Complete RBAC overview
- ✅ `FRONTEND_RBAC_GUIDE.md` - Frontend usage guide
- ✅ `PERMISSION_BASED_MENU_MIGRATION.md` - Menu system migration
- ✅ `backend/RBAC_PERMISSION_MAPPING.md` - Backend API permissions

---

**Last Updated:** December 2024  
**Status:** In Progress (14% complete)  
**Next Action:** Fix ProjectAgentLogin.tsx and AgentLogin.tsx (login flow priority)
