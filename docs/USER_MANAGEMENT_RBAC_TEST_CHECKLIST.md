# User Management RBAC Testing Checklist
**Test Date:** November 23, 2025  
**Test User:** Priya Sharma  
**Email:** priya.sharma@sac.gov.in  
**Password:** Agent@123

## ✅ Setup Complete
- [x] Assigned all 8 User Management permissions to Priya Sharma
- [x] Created custom test role: "Priya Test Role"
- [x] Verified permissions in database

## 📋 Permission Test Results

### 1. USER_VIEW_ALL
**What it controls:** Access to User Management page and ability to see all users

**Test Steps:**
1. Login as Priya Sharma
2. Check if "Users" menu item appears in sidebar
3. Click "Users" menu item
4. Verify page loads at `/users`
5. Verify user list table displays

**Expected Results:**
- ✅ "Users" menu item visible in sidebar
- ✅ Can navigate to `/users` page
- ✅ User list table loads with all users
- ✅ Can see user details (name, email, role, status, projects)

**Test Result:** [ ] PASS  [ ] FAIL

**Notes:**
_________________________________________________________________

---

### 2. USER_CREATE
**What it controls:** Ability to create new users

**Test Steps:**
1. On Users page, look for "Add User" button (top right)
2. Click "Add User" button
3. Verify create user modal opens
4. Fill in user details:
   - First Name: Test
   - Last Name: User
   - Email: test.user@example.com
   - Mobile: 1234567890
   - Password: Test@123
   - Role: (select any role)
5. Click "Save" or "Create User"
6. Verify success message
7. Check if new user appears in list

**Expected Results:**
- ✅ "Add User" button is visible
- ✅ Modal opens with create user form
- ✅ Can fill all fields
- ✅ Form validates required fields
- ✅ Success message appears
- ✅ New user added to user list

**Test Result:** [ ] PASS  [ ] FAIL

**Notes:**
_________________________________________________________________

---

### 3. USER_EDIT
**What it controls:** Ability to edit existing user details

**Test Steps:**
1. On Users page, find a user row
2. Look for edit icon (pencil) in actions column
3. Click edit icon
4. Verify edit user modal opens with existing data
5. Modify user details (e.g., change first name)
6. Click "Save" or "Update User"
7. Verify success message
8. Check if changes reflect in user list

**Expected Results:**
- ✅ Edit icon (pencil) visible for each user
- ✅ Modal opens with pre-filled data
- ✅ Can modify fields
- ✅ Success message appears
- ✅ Changes reflect in user list

**Test Result:** [ ] PASS  [ ] FAIL

**Notes:**
_________________________________________________________________

---

### 4. USER_DELETE
**What it controls:** Ability to delete user accounts

**Test Steps:**
1. On Users page, find a user row (preferably test user created earlier)
2. Look for delete icon (trash) in actions column
3. Click delete icon
4. Verify confirmation dialog appears
5. Confirm deletion
6. Verify success message
7. Check if user removed from list

**Expected Results:**
- ✅ Delete icon (trash) visible for each user
- ✅ Confirmation dialog appears
- ✅ Success message on deletion
- ✅ User removed from list

**Test Result:** [ ] PASS  [ ] FAIL

**Notes:**
_________________________________________________________________

---

### 5. USER_TOGGLE_STATUS
**What it controls:** Ability to activate/deactivate user accounts

**Test Steps:**
1. On Users page, find an active user
2. Look for status toggle or activate/deactivate button
3. Click to deactivate
4. Verify status badge changes to "Inactive"
5. Click again to reactivate
6. Verify status badge changes back to "Active"

**Expected Results:**
- ✅ Toggle/button visible for each user
- ✅ Can deactivate user (Active → Inactive)
- ✅ Status badge updates correctly
- ✅ Can reactivate user (Inactive → Active)

**Test Result:** [ ] PASS  [ ] FAIL

**Notes:**
_________________________________________________________________

---

### 6. USER_ASSIGN_ROLE
**What it controls:** Ability to change user's role

**Test Steps:**
1. Click edit icon for a user
2. Look for "Role" dropdown in edit modal
3. Select a different role from dropdown
4. Click "Save" or "Update User"
5. Verify success message
6. Check if role updated in user list

**Expected Results:**
- ✅ Role dropdown visible in edit modal
- ✅ Shows list of available roles
- ✅ Can select different role
- ✅ Success message appears
- ✅ Role updates in user list

**Test Result:** [ ] PASS  [ ] FAIL

**Notes:**
_________________________________________________________________

---

### 7. USER_RESET_PASSWORD
**What it controls:** Ability to reset user passwords

**Test Steps:**
1. On Users page or in user detail view
2. Look for "Reset Password" button
3. Click "Reset Password"
4. Verify reset password modal/dialog opens
5. Enter or generate new password
6. Confirm reset
7. Verify success message

**Expected Results:**
- ✅ "Reset Password" button visible
- ✅ Modal/dialog opens
- ✅ Can enter new password or auto-generate
- ✅ Success message appears
- ✅ User can login with new password

**Test Result:** [ ] PASS  [ ] FAIL

**Notes:**
_________________________________________________________________

---

### 8. USER_IMPORT
**What it controls:** Ability to bulk import users from CSV

**Test Steps:**
1. On Users page, look for "Import Users" button
2. Click "Import Users"
3. Verify import modal opens
4. Upload a CSV file with user data
5. Verify file is processed
6. Check if users are created in bulk
7. Verify all imported users appear in list

**Expected Results:**
- ✅ "Import Users" button visible
- ✅ Import modal opens
- ✅ Can upload CSV file
- ✅ File validates and processes
- ✅ Success message with count
- ✅ All users created and visible in list

**Sample CSV Format:**
```csv
firstName,lastName,email,mobile,role,password
John,Doe,john.doe@test.com,1234567890,Agent,Welcome@123
Jane,Smith,jane.smith@test.com,0987654321,Agent,Welcome@123
```

**Test Result:** [ ] PASS  [ ] FAIL

**Notes:**
_________________________________________________________________

---

## 🎯 Testing Individual Permissions

To test permissions one at a time, run:
```bash
cd "d:\Niraj\SAC\SAC Helpdesk\backend"
node test-single-permission.js <PERMISSION_CODE>
```

### Example: Test Only USER_CREATE
```bash
node test-single-permission.js USER_CREATE
```

This will:
- Remove all other permissions
- Assign ONLY USER_CREATE to Priya
- You can then verify ONLY the create button works
- Other buttons (edit, delete) should NOT appear

### Available Permission Codes:
- `USER_VIEW_ALL` - Base permission to access the page
- `USER_CREATE` - Create button
- `USER_EDIT` - Edit icons
- `USER_DELETE` - Delete icons
- `USER_TOGGLE_STATUS` - Status toggle
- `USER_ASSIGN_ROLE` - Role assignment
- `USER_RESET_PASSWORD` - Password reset
- `USER_IMPORT` - Bulk import

---

## 🔍 Additional Verification Tests

### Negative Testing (What should NOT work)

1. **Without USER_VIEW_ALL:**
   - User menu item should NOT appear in sidebar
   - Direct URL access to `/users` should redirect or show no access

2. **Without USER_CREATE:**
   - "Add User" button should NOT be visible

3. **Without USER_EDIT:**
   - Edit icons should NOT be visible
   - Edit modal should not open

4. **Without USER_DELETE:**
   - Delete icons should NOT be visible

5. **Without USER_RESET_PASSWORD:**
   - Reset password button should NOT be visible

---

## 📝 Test Summary

**Total Permissions:** 8  
**Permissions Tested:** ____/8  
**Permissions Passed:** ____/8  
**Permissions Failed:** ____/8  

**Overall Result:** [ ] ALL PASS  [ ] SOME FAILED

---

## 🐛 Issues Found

| Permission | Issue Description | Severity | Status |
|-----------|-------------------|----------|--------|
|           |                   |          |        |
|           |                   |          |        |
|           |                   |          |        |

---

## 💡 Recommendations

1. **UI Improvements:**
   - 
   - 

2. **Permission Logic:**
   - 
   - 

3. **User Experience:**
   - 
   - 

---

## 📸 Screenshots

*Attach screenshots showing:*
1. User Management page with all buttons visible
2. Create User modal
3. Edit User modal
4. Delete confirmation
5. Status toggle in action
6. Import Users interface

---

## ✅ Final Verification

**Tested By:** _____________________  
**Date:** _____________________  
**Sign-off:** _____________________

---

## 🔄 To Restore Priya's Original Permissions

After testing, restore Priya's original "Counselor" role:

```bash
cd "d:\Niraj\SAC\SAC Helpdesk\backend"
# Run the restore script (create if needed)
# Or manually reassign the Counselor role via database/admin panel
```

**Original Priya Details:**
- Role: Counselor
- Permissions: 15 (TICKET_VIEW_OWN, TICKET_CREATE, KB_VIEW, OFFLINE_* permissions)
