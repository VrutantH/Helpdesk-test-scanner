# RBAC Validation Guide

**Date:** November 21, 2025  
**Purpose:** Comprehensive validation that RBAC is the single source of truth with zero hardcoded role checks

---

## 🎯 Validation Objectives

1. ✅ New roles work immediately without code changes
2. ✅ UI dynamically adapts to permissions
3. ✅ API endpoints enforce permissions correctly
4. ✅ Token invalidation works on permission changes
5. ✅ No hardcoded Super Admin privileges exist

---

## 📋 Test Plan

### Test 1: Create Limited Role & Verify Dynamic UI

**Goal:** Prove that a new role with limited permissions works without code deployment

#### Steps:

1. **Login as Super Admin** (user with RBAC_CREATE_ROLE permission)
   - URL: `http://localhost:3000/dashboard`

2. **Create a Test Role:**
   - Navigate to: Setup → RBAC Management
   - Click "Add Role"
   - **Role Details:**
     ```
     Name: Support Viewer
     Code: SUPPORT_VIEWER
     Description: Can only view tickets and users
     ```
   - **Grant Only These Permissions:**
     - ✅ TICKET_VIEW_OWN
     - ✅ USER_VIEW
     - ❌ NO create/edit/delete permissions
     - ❌ NO PROJECT_VIEW_ALL
     - ❌ NO RBAC permissions
     - ❌ NO MASTER_DATA permissions

3. **Create Test User:**
   - Navigate to: Setup → User Management
   - Click "Add User"
   - **User Details:**
     ```
     Name: Test Viewer
     Email: testviewer@example.com
     Role: Support Viewer (select the role you just created)
     Password: Test@123
     ```

4. **Logout and Login as Test User:**
   - Logout from Super Admin
   - Login as: `testviewer@example.com` / `Test@123`

#### Expected Results:

**✅ PASS Criteria:**
- Sidebar shows ONLY:
  - 🏠 Dashboard
  - 🎫 Tickets (view only)
  - 👥 Users (view only)
- Sidebar does NOT show:
  - ❌ Projects
  - ❌ Master Data
  - ❌ RBAC Setup
  - ❌ Reports
  - ❌ Integrations
  - ❌ Audit Logs

**Screenshot Evidence:** Take screenshots showing limited sidebar

---

### Test 2: Verify Route Protection

**Goal:** Ensure users cannot access pages they don't have permissions for

#### Steps (while logged in as Test Viewer):

1. Try to access these URLs directly:
   ```
   http://localhost:3000/projects
   http://localhost:3000/rbac
   http://localhost:3000/master-data
   http://localhost:3000/reports
   ```

#### Expected Results:

**✅ PASS Criteria:**
- All above routes should:
  - Redirect to `/dashboard` OR
  - Show "Access Denied" message
- User should NOT see the content of these pages

**Screenshot Evidence:** Capture browser showing redirect or access denied

---

### Test 3: Verify Button-Level Permissions

**Goal:** Confirm that action buttons appear only when user has permission

#### Steps (while logged in as Test Viewer):

1. **Go to User Management:**
   - Navigate to: Users (from sidebar)
   
2. **Check Button Visibility:**
   - Look for these buttons at top of page:
     - ❌ "Add User" button should NOT appear
   - Look at action buttons in user list:
     - ❌ Edit icons should NOT appear
     - ❌ Delete icons should NOT appear
     - ❌ Reset Password button should NOT appear
   - User list should be **read-only**

3. **Go to Tickets:**
   - Navigate to: Tickets (from sidebar)
   - ❌ "Create Ticket" button should NOT appear
   - ❌ "Assign" button should NOT appear on tickets
   - ❌ "Edit" buttons should NOT appear
   - Can only VIEW ticket details

#### Expected Results:

**✅ PASS Criteria:**
- NO action buttons visible (Create, Edit, Delete, Assign, etc.)
- All pages are read-only views
- Lists display but no modification options

**Screenshot Evidence:** Capture User Management and Tickets pages showing no action buttons

---

### Test 4: Test API Endpoint Protection

**Goal:** Verify API rejects unauthorized actions

#### Steps (while logged in as Test Viewer):

1. **Open Browser DevTools:**
   - Press F12
   - Go to Console tab

2. **Try to Create a User via API:**
   ```javascript
   fetch('http://localhost:3003/api/users', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + localStorage.getItem('authToken')
     },
     body: JSON.stringify({
       firstName: 'Hack',
       lastName: 'Attempt',
       email: 'hack@test.com',
       role: '...'
     })
   })
   .then(r => r.json())
   .then(d => console.log('Response:', d))
   ```

3. **Try to Delete a User via API:**
   ```javascript
   fetch('http://localhost:3003/api/users/someUserId', {
     method: 'DELETE',
     headers: {
       'Authorization': 'Bearer ' + localStorage.getItem('authToken')
     }
   })
   .then(r => r.json())
   .then(d => console.log('Response:', d))
   ```

#### Expected Results:

**✅ PASS Criteria:**
- Both API calls should return:
  ```json
  {
    "message": "Access denied. You do not have permission: USER_CREATE",
    "statusCode": 403
  }
  ```
- Server logs should show permission denial

**Screenshot Evidence:** Capture console showing 403 errors with permission denial messages

---

### Test 5: Token Invalidation on Permission Change

**Goal:** Verify users are auto-logged out when permissions change

#### Steps:

1. **Keep Test Viewer logged in** (don't close that browser tab)
   - Make a note of current permissions (TICKET_VIEW_OWN, USER_VIEW)

2. **In another browser/incognito, login as Super Admin**

3. **Modify the Support Viewer role:**
   - Navigate to: RBAC Management
   - Edit "Support Viewer" role
   - Add permission: `TICKET_VIEW_ALL`
   - Click Save

4. **Switch back to Test Viewer browser tab**

5. **Click on any link or refresh** (trigger an API call)

#### Expected Results:

**✅ PASS Criteria:**
- Test Viewer should be immediately logged out
- Alert message should appear:
  ```
  "Your permissions have been updated. Please login again to continue."
  ```
- User redirected to login page
- After re-login, user should now have the new permission (TICKET_VIEW_ALL)

**Screenshot Evidence:** Capture alert message and successful logout

---

### Test 6: Data Filtering Based on Permissions

**Goal:** Verify ticket visibility changes with TICKET_VIEW_ALL vs TICKET_VIEW_OWN

#### Steps:

**Part A: With TICKET_VIEW_OWN only**

1. Login as Test Viewer (should have TICKET_VIEW_OWN only)
2. Navigate to Tickets
3. Count how many tickets you see
4. Note: Should only see tickets:
   - Created by this user OR
   - Assigned to this user OR
   - From projects mapped to this user

**Part B: After granting TICKET_VIEW_ALL**

1. Login as Super Admin
2. Edit "Support Viewer" role → Add `TICKET_VIEW_ALL` permission
3. Test Viewer will be auto-logged out (from Test 5)
4. Re-login as Test Viewer
5. Navigate to Tickets
6. Count how many tickets you see now

#### Expected Results:

**✅ PASS Criteria:**
- With TICKET_VIEW_OWN: Limited ticket list (only relevant tickets)
- With TICKET_VIEW_ALL: All tickets in system visible
- Number of tickets should increase significantly
- NO code deployment needed for this change

**Screenshot Evidence:** Capture ticket list before/after permission change

---

### Test 7: No Hardcoded Super Admin Privileges

**Goal:** Verify that "Super Admin" is just another role, not hardcoded

#### Steps:

1. **Login as Super Admin**

2. **Create a New Role with SAME permissions as Super Admin:**
   ```
   Name: System Administrator
   Code: SYS_ADMIN
   Description: Full system access (identical to Super Admin)
   ```
   - Grant ALL permissions (same as Super Admin has)

3. **Create a New User with this Role:**
   ```
   Name: System Admin Test
   Email: sysadmin@example.com
   Role: System Administrator
   ```

4. **Logout and Login as System Admin Test**

5. **Verify Full Access:**
   - Check all sidebar menus appear
   - Try accessing all pages
   - Try creating/editing/deleting records

#### Expected Results:

**✅ PASS Criteria:**
- System Administrator role works identically to Super Admin
- All menus visible
- All actions permitted
- No "You must be Super Admin" errors
- Proves there's NO hardcoded role name checks

**Screenshot Evidence:** Show sidebar with all menus for custom role

---

### Test 8: Dynamic Menu Adaptation

**Goal:** Verify sidebar menu items appear/disappear based on permissions

#### Steps:

1. **Create Multiple Test Roles with Different Permissions:**

   **Role A: "Ticket Manager"**
   - Permissions: TICKET_* (all ticket permissions only)
   
   **Role B: "User Manager"**
   - Permissions: USER_* (all user permissions only)
   
   **Role C: "Report Viewer"**
   - Permissions: REPORT_* (all report permissions only)

2. **Create 3 test users, one for each role**

3. **Login as each user and capture sidebar screenshot**

#### Expected Results:

**✅ PASS Criteria:**
- Ticket Manager sees: Dashboard + Tickets (no Users, no Reports)
- User Manager sees: Dashboard + Users (no Tickets, no Reports)
- Report Viewer sees: Dashboard + Reports (no Tickets, no Users)
- Each sidebar is dynamically generated from permissions

**Screenshot Evidence:** 3 screenshots showing different sidebars for different roles

---

## 🔍 Backend Validation

### Verify Permission Middleware

Run this test script to verify backend protection:

```bash
cd backend
npm run test:permissions  # If test suite exists
```

Or manually test with curl:

```bash
# Test without permission (should fail with 403)
curl -X POST http://localhost:3003/api/users \
  -H "Authorization: Bearer <test_viewer_token>" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@test.com","role":"xxx"}'

# Expected: 403 Forbidden with permission error
```

---

## 📊 Validation Checklist

After completing all tests, verify:

- [ ] New role works without code deployment
- [ ] Sidebar menu adapts dynamically to permissions
- [ ] Route protection blocks unauthorized access
- [ ] Buttons appear/disappear based on permissions
- [ ] API endpoints return 403 for unauthorized actions
- [ ] Token invalidation works on permission changes
- [ ] Data filtering respects TICKET_VIEW_ALL vs TICKET_VIEW_OWN
- [ ] No "Super Admin" hardcoding exists
- [ ] Custom roles with full permissions work identically to Super Admin
- [ ] Multiple roles with different permissions show different UIs

---

## ✅ Success Criteria

**RBAC Implementation is VALID if:**

1. ✅ Any new role created in database works immediately
2. ✅ Zero code changes needed to support new permissions
3. ✅ UI completely adapts to user's permission set
4. ✅ No role name/code checks in access control logic
5. ✅ Permission changes force re-authentication
6. ✅ All access decisions derived from database permissions
7. ✅ "Super Admin" is just a role, not a special case

**If ANY test fails:** There may be remaining hardcoded role checks. Review code for:
- `if (role.code === 'SUPER_ADMIN')`
- `if (roleCode === 'STUDENT')`
- `['SUPER_ADMIN', 'MANAGER'].includes(role)`

---

## 🐛 Common Issues & Solutions

### Issue: Button still shows when it shouldn't

**Check:**
- Is the component using `hasPermission()` hook?
- Is the button wrapped in conditional: `{hasPermission('PERMISSION_CODE') && (<button>...)}`
- Is the permission code spelled correctly?

**Fix:** Add permission check wrapper to button

---

### Issue: Menu item appears when it shouldn't

**Check:**
- `menuConfig.tsx` - Does menu item have `requiredPermission` property?
- Is `DynamicSidebar` component filtering based on permissions?

**Fix:** Add `requiredPermission: 'PERMISSION_CODE'` to menu config

---

### Issue: Route accessible when it shouldn't be

**Check:**
- `routePermissions.ts` - Is route listed with required permission?
- Is route wrapped in `<ProtectedRoute>` component?

**Fix:** Add route to config or wrap in ProtectedRoute

---

### Issue: User not logged out after permission change

**Check:**
- Backend: Does `roleController` increment tokenVersion?
- Backend: Does `auth middleware` validate tokenVersion?
- Frontend: Does `api.ts` handle TOKEN_VERSION_MISMATCH?

**Fix:** Review Task 8 implementation

---

## 📝 Test Results Template

Use this template to document your results:

```markdown
## RBAC Validation Results

**Date:** November 21, 2025
**Tester:** [Your Name]

### Test 1: Limited Role Creation
- Status: ✅ PASS / ❌ FAIL
- Notes: 
- Screenshot: [Attach]

### Test 2: Route Protection
- Status: ✅ PASS / ❌ FAIL
- Notes:
- Screenshot: [Attach]

### Test 3: Button Visibility
- Status: ✅ PASS / ❌ FAIL
- Notes:
- Screenshot: [Attach]

### Test 4: API Protection
- Status: ✅ PASS / ❌ FAIL
- Console Output: [Paste]

### Test 5: Token Invalidation
- Status: ✅ PASS / ❌ FAIL
- Notes:
- Screenshot: [Attach]

### Test 6: Data Filtering
- Status: ✅ PASS / ❌ FAIL
- Ticket count before: [Number]
- Ticket count after: [Number]

### Test 7: No Hardcoded Privileges
- Status: ✅ PASS / ❌ FAIL
- Notes:

### Test 8: Dynamic Menu
- Status: ✅ PASS / ❌ FAIL
- Screenshots: [Attach 3 different sidebars]

---

**Overall Result:** ✅ RBAC FULLY VALIDATED / ❌ ISSUES FOUND

**Issues Found:**
1. [List any failures]

**Recommendations:**
1. [List improvements]
```

---

## 🚀 Next Steps After Validation

Once all tests pass:

1. **Document the RBAC System** for future developers
2. **Create Admin Training Guide** for managing roles/permissions
3. **Set up Monitoring** for permission denials (audit logs)
4. **Plan Permission Updates** as new features are added
5. **Review Performance** of permission checks at scale

---

## 📞 Need Help?

If validation fails, check:
1. Browser console for errors
2. Backend logs for permission denials
3. Database to verify role/permission mappings
4. JWT token payload (decode at jwt.io)

**Happy Testing! 🎉**
