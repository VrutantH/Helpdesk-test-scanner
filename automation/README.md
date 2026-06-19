# Automation Test Scripts

This directory contains automation test scripts and utilities for the HubbleHox Helpdesk Portal.

## Test Execution Scripts

### `run-rbac-tests.ps1`
Runs RBAC Setup module test cases.

**Usage:**
```powershell
# Run all RBAC tests
.\run-rbac-tests.ps1

# Run specific test cases
.\run-rbac-tests.ps1 TC_RBAC_01 TC_RBAC_02 TC_RBAC_03
```

**Features:**
- Automatic cleanup of locked ChromeDriver/Chrome processes before execution
- Automatic removal of locked target directory files
- Dynamic TestNG XML generation for selective test execution
- Prevents "file locked" errors during Maven builds

### `run-um-tests.ps1`
Runs User Management module test cases.

**Usage:**
```powershell
# Run all User Management tests
.\run-um-tests.ps1

# Run specific test cases
.\run-um-tests.ps1 TC_UM_01 TC_UM_02 TC_UM_03
```

**Features:**
- Same automatic cleanup as run-rbac-tests.ps1
- Dynamic TestNG XML generation
- Selective test execution support

## Utility Scripts

### `cleanup-locked-files.ps1` ⭐ NEW
Standalone utility to fix "file locked" errors during Maven builds.

**Usage:**
```powershell
.\cleanup-locked-files.ps1
```

**What it does:**
1. Kills all ChromeDriver processes
2. Kills Chrome processes started by automation (preserves your personal Chrome browser)
3. Removes the locked `target` directory
4. Displays detailed cleanup progress

**When to use:**
- Before running Maven clean/compile commands
- When you see "Failed to delete target\test-classes" errors
- After a test run crashes or is interrupted
- Anytime Maven complains about locked files

## Permanent Solution for "File Locked" Issues

The test execution scripts (`run-rbac-tests.ps1`, `run-um-tests.ps1`) now **automatically clean up locked processes** before running tests. This prevents the common issue where:
- Maven clean fails with "Failed to delete C:\...\target\test-classes"
- ChromeDriver processes remain running after test failures
- Target directory becomes locked by zombie processes

### How It Works

1. **Before each test run**, the scripts:
   - Kill any running ChromeDriver processes
   - Kill Chrome automation processes (identified by `--test-type` or `--disable-features=CalculateNativeWinOcclusion` flags)
   - Wait 500ms for processes to terminate
   - Attempt to remove the entire `target` directory
   - If that fails, selectively remove `target/test-classes`

2. **This happens automatically** - you don't need to do anything!

3. **Your personal Chrome browser is safe** - only automation-launched Chrome instances are killed

### Manual Cleanup

If you need to manually clean up locked files:
```powershell
# Option 1: Run the standalone cleanup script
.\cleanup-locked-files.ps1

# Option 2: Use Task Manager
# - End all "chromedriver.exe" processes
# - End Chrome processes with command line containing "--test-type"
# - Then run: mvn clean compile test-compile
```

## Common Issues & Solutions

### Issue: "Failed to delete target directory"
**Solution:** The scripts now handle this automatically. If you still see this:
1. Run `.\cleanup-locked-files.ps1`
2. Wait a few seconds
3. Try your Maven command again

### Issue: Browser stays open after test failure
**Solution:** Already fixed! The next test run will automatically close it.

### Issue: Multiple Chrome windows pile up
**Solution:** The cleanup function runs before each test, preventing this.

## Test Configuration Files

- `testng-rbac.xml` - TestNG suite for RBAC tests (all test cases)
- `testng-um.xml` - TestNG suite for User Management tests
- `testng-rbac-run.xml` - Auto-generated for selective RBAC test execution (temporary)
- `testng-um-run.xml` - Auto-generated for selective UM test execution (temporary)

## Google Sheets Configuration

Test data is sourced from Google Sheets. Configuration is in `resources/config.properties`:

```properties
# RBAC Module
google.sheet.id.rbac=1uBZ6bOj15CBcAbIcSY1FKzxXB0cgXOC-xtVmREOYhzk
google.sheet.tab.name.rbac=RBAC

# User Management Module
google.sheet.id.um=<your-sheet-id>
google.sheet.tab.name.um=UserManagement
```

## Browser Configuration

- **Browser:** Chrome (maximized, forced to foreground)
- **Zoom Level:** 80% (set automatically in TC_RBAC_01/TC_UM_01)
- **Window Position:** (0, 0) - top-left corner
- **Chrome Options:**
  - `--disable-features=CalculateNativeWinOcclusion` (prevents window hiding)
  - `--new-window` (opens in new window)

## Framework Structure

```
automation/
├── src/
│   ├── main/java/com/hubblehox/automation/
│   │   ├── base/         # BasePage, BaseTest
│   │   ├── driver/       # DriverFactory (browser setup)
│   │   ├── pages/        # Page Object Models (RBACSetupPage, etc.)
│   │   └── utils/        # Utilities, ExtentReports
│   └── test/java/com/hubblehox/automation/tests/
│       ├── RBACSetupTest.java        # 75 RBAC test cases
│       └── UserManagementTest.java   # User Management tests
├── resources/
│   └── config.properties  # Configuration (URLs, credentials, sheet IDs)
├── target/
│   └── surefire-reports/ # Test execution reports
├── run-rbac-tests.ps1    # RBAC test runner (with auto-cleanup)
├── run-um-tests.ps1      # UM test runner (with auto-cleanup)
└── cleanup-locked-files.ps1  # Standalone cleanup utility
```

## Tips for Test Development

1. **Unique Test Data:** Tests now use timestamps to generate unique role names (e.g., `AutoRBAC_20260603_150522`)
2. **No Conflicts:** Each test run creates fresh roles/users, preventing "already exists" errors
3. **Sequential Execution:** Tests run in priority order (1, 2, 3...) for state preservation
4. **Zoom Level:** Set once at login (80%), persists throughout the session
5. **Cleanup:** Always happens automatically before test runs

## Maintenance

### Adding New Test Cases

1. Add test method to `RBACSetupTest.java` or `UserManagementTest.java`
2. Use `@Test(priority = N)` to set execution order
3. Use unique timestamped names for created data
4. Run tests using the PowerShell scripts (cleanup happens automatically)

### No More Manual Cleanup Needed!

Previously, you had to manually:
- Close Chrome windows
- Kill chromedriver.exe in Task Manager
- Delete target directory
- Run `mvn clean`

**Now:** Just run `.\run-rbac-tests.ps1` or `.\run-um-tests.ps1` and everything is handled automatically!
