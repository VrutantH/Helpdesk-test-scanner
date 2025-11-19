# Frontend Unused Code Cleanup

This document identifies unused/duplicate code in the frontend for cleanup purposes.

## ✅ ALREADY CLEANED UP

### App.tsx
- ✅ `RoleManagement` import - **COMMENTED OUT** (Replaced by RBACSetup)

## 🔍 DUPLICATE FILES (Need Investigation)

### Potential Duplicates Between `components/` and `pages/`

1. **AgentDashboard.tsx**
   - Location 1: `src/components/AgentDashboard.tsx` (548 lines) - **CURRENTLY USED in App.tsx**
   - Location 2: `src/pages/AgentDashboard.tsx` (868 lines) - **POTENTIALLY UNUSED**
   - Action: Verify which version is correct, comment out or delete unused version

2. **ProjectLogin.tsx**
   - Location 1: `src/components/ProjectLogin.tsx`
   - Location 2: `src/pages/ProjectLogin.tsx` - **CURRENTLY USED in App.tsx**
   - Action: Verify and remove unused version from components/

## 📋 COMPONENTS TO INVESTIGATE

### Unused/Replaced Components
- `src/components/RoleManagement.tsx` - **REPLACED BY** `src/pages/RBACSetup.tsx`
  - Should be moved to archive or deleted
  - Currently commented out in App.tsx

### TODO Components (Commented in App.tsx)
These are placeholders for future implementation:
- `FieldFormManagement` - Not yet implemented
- `TicketAutomation` - Not yet implemented  
- `BlockedEmailRecipients` - Not yet implemented
- `EmailFailureLogs` - Not yet implemented
- `IntegrationsManagement` - Not yet implemented

## 🚨 RECOMMENDED ACTIONS

### Immediate Actions

1. **Archive Replaced Components**
   ```
   mkdir -p src/components/_archive
   mv src/components/RoleManagement.tsx src/components/_archive/
   ```

2. **Remove Duplicate Files**
   - Investigate `pages/AgentDashboard.tsx` vs `components/AgentDashboard.tsx`
   - Investigate `pages/ProjectLogin.tsx` vs `components/ProjectLogin.tsx`
   - Keep the version that's imported in App.tsx, archive the other

3. **Clean Up Imports**
   - ✅ Already done: Commented out `RoleManagement` in App.tsx

### Future Cleanup

1. **Component Organization**
   - Move all page components to `pages/` folder
   - Keep only reusable UI components in `components/` folder
   - Create `components/common/` for shared UI elements

2. **File Naming Convention**
   - Pages: `PascalCase.tsx` (e.g., `ProjectPortalDashboard.tsx`)
   - Components: `PascalCase.tsx` (e.g., `DashboardLayout.tsx`)
   - Utilities: `camelCase.ts` (e.g., `apiHelpers.ts`)

3. **Code Organization**
   - Group related components in subdirectories
   - Example: `components/forms/`, `components/modals/`, `components/layouts/`

## 📊 COMPARISON TABLE

| Component | Location | Lines | Used in App.tsx | Status |
|-----------|----------|-------|----------------|--------|
| RoleManagement | components/ | ? | ❌ No (commented) | ⚠️ Can be archived |
| RBACSetup | pages/ | 962 | ✅ Yes | ✅ Active |
| AgentDashboard | components/ | 548 | ✅ Yes | ✅ Active |
| AgentDashboard | pages/ | 868 | ❌ No | ⚠️ Duplicate? |
| ProjectLogin | components/ | ? | ❌ No | ⚠️ Duplicate? |
| ProjectLogin | pages/ | 768 | ✅ Yes | ✅ Active |

## 🔧 CLEANUP SCRIPT (PowerShell)

```powershell
# Navigate to frontend directory
cd "d:\Niraj\SAC\SAC Helpdesk\frontend\src"

# Create archive directory
New-Item -ItemType Directory -Force -Path "components\_archive"

# Archive RoleManagement (already replaced)
Move-Item -Path "components\RoleManagement.tsx" -Destination "components\_archive\" -Force

# TODO: After verification, move duplicates
# Move-Item -Path "pages\AgentDashboard.tsx" -Destination "components\_archive\" -Force
# Move-Item -Path "components\ProjectLogin.tsx" -Destination "components\_archive\" -Force

Write-Host "✅ Cleanup complete! Archived components moved to _archive folder."
```

## ⚠️ BEFORE DELETING ANYTHING

1. Run the application and test all routes
2. Check git history to see when files were last modified
3. Search codebase for any dynamic imports: `grep -r "import.*AgentDashboard" .`
4. Verify no lazy loading or dynamic components
5. Check if files are used in tests

## 📝 NOTES

- Always create backups before deleting files
- Use Git to track all deletions
- Test thoroughly after cleanup
- Update this document as cleanup progresses
