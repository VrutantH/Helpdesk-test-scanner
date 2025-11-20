# Frontend Fix - AddProjectForm Role Type Error

## Error on Production
```
Uncaught TypeError: user.role.toLowerCase is not a function
at AddProjectForm.tsx:341:46
at Array.filter (<anonymous>)
```

**URL:** `https://helpdesk.hubblehox.ai/src/components/AddProjectForm.tsx:22:27`  
**Component:** Project Management → Add Project Form  
**Impact:** Project management page completely broken

## Root Cause

After the JWT optimization (backend changes), the user object structure changed:

**Before (Old JWT):**
```javascript
{
  userId: "...",
  email: "...",
  role: "agent"  // ← STRING
}
```

**After (New JWT):**
```javascript
{
  userId: "...",
  email: "...",
  role: {  // ← OBJECT
    _id: "...",
    code: "AGENT",
    name: "Agent",
    permissions: ["PERMISSION_1", "PERMISSION_2", ...]
  }
}
```

The frontend code was still expecting `role` to be a string and calling `.toLowerCase()` on it, which fails when it's an object.

## Fixes Applied

### 1. Updated Filter Logic
**File:** `frontend/src/components/AddProjectForm.tsx` (Line 340-355)

**Before:**
```typescript
const projectAgents = projectUsers.filter(user => 
  user.roleId === agentRoleId || user.role.toLowerCase() === 'agent'
);
```

**After:**
```typescript
const projectAgents = projectUsers.filter(user => {
  // Check by roleId first
  if (user.roleId === agentRoleId) return true;
  
  // Check by role object (new JWT structure)
  if (typeof user.role === 'object' && user.role?.code) {
    return user.role.code.toLowerCase() === 'agent';
  }
  
  // Fallback for old string-based role (backward compatibility)
  if (typeof user.role === 'string') {
    return user.role.toLowerCase() === 'agent';
  }
  
  return false;
});
```

### 2. Updated TypeScript Interface
**File:** `frontend/src/components/AddProjectForm.tsx` (Line 301)

**Before:**
```typescript
const [users, setUsers] = useState<Array<{ 
  _id: string; 
  name: string; 
  email: string; 
  role: string;  // ← Only string
  roleId?: string; 
  projects?: string[] 
}>>([]);
```

**After:**
```typescript
const [users, setUsers] = useState<Array<{ 
  _id: string; 
  name: string; 
  email: string; 
  role: string | {  // ← String OR Object
    _id: string; 
    code: string; 
    name: string; 
    permissions?: string[]
  }; 
  roleId?: string; 
  projects?: string[] 
}>>([]);
```

## Build Status

✅ **TypeScript Compilation:** PASSED  
✅ **Vite Build:** SUCCESS  
✅ **Build Size:** 2.1 MB (419 KB gzipped)  
✅ **Output:** `frontend/dist/`

## Deployment Instructions

### Option 1: Git Deployment (Recommended)

```bash
# 1. Commit changes (on dev branch)
git add .
git commit -m "Fix: AddProjectForm role object compatibility + TypeScript types"
git push origin dev

# 2. SSH to VM
ssh ubuntu@your-vm-ip

# 3. Pull and build frontend
cd ~/helpdesk/frontend
git pull origin dev
npm install  # If needed
npm run build

# 4. Restart PM2
pm2 restart Frontend
pm2 logs Frontend --lines 20
```

### Option 2: Direct Upload (Faster for Testing)

```bash
# 1. Upload built files
scp -r frontend/dist/* ubuntu@vm-ip:/home/ubuntu/helpdesk/frontend/dist/

# 2. SSH and restart
ssh ubuntu@vm-ip
pm2 restart Frontend
```

## Post-Deployment

### 1. Clear Browser Cache
Users MUST clear their browser cache or do a hard refresh:
- **Windows:** `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`
- **Manual:** Clear cache in browser settings

### 2. Verify Fix
1. Navigate to Project Management page
2. Click "Add Project" or edit existing project
3. Should load without errors
4. Check browser console (F12) - no errors

### 3. Test User Assignment
1. Create/edit a project
2. Go to "Ticket Settings" tab
3. Enable auto-assignment
4. Select agents - should work without errors

## Files Changed

1. ✅ `frontend/src/components/AddProjectForm.tsx` (2 changes)
   - Line 301: Updated user type definition
   - Line 340-355: Updated projectAgents filter logic

## Backward Compatibility

✅ Supports **both** role formats:
- New object format: `{ code: "AGENT", name: "Agent" }`
- Old string format: `"agent"` (for cached JWTs)

This ensures the app works even if some users have old JWT tokens cached.

## Summary

| Issue | Status |
|-------|--------|
| TypeError: toLowerCase is not a function | ✅ FIXED |
| TypeScript compilation errors | ✅ FIXED |
| Build successful | ✅ YES |
| Backward compatible | ✅ YES |
| Ready for deployment | ✅ YES |

**Impact:** This fix resolves the critical issue preventing users from accessing the Project Management page on production.
