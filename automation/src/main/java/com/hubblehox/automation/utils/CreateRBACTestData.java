package com.hubblehox.automation.utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.io.IOException;

/**
 * Standalone generator – run once to create testdata/RBAC Test cases.xlsx
 * with all 75 RBAC Setup test cases pre-populated.
 *
 * Run from project root:
 * mvn compile exec:java
 * -Dexec.mainClass="com.hubblehox.automation.utils.CreateRBACTestData"
 */
public class CreateRBACTestData {

    private static final String OUTPUT_PATH = "testdata/RBAC Test cases.xlsx";
    private static final String SHEET_NAME = "rbac";

    // ── Column indices (matches AppConstants) ───────────────────────────────
    private static final int COL_TC_ID = 0;
    private static final int COL_DESC = 1;
    private static final int COL_STEPS = 2;
    private static final int COL_EXPECTED = 3;
    private static final int COL_ACTUAL = 4;
    private static final int COL_COMMENTS = 5;

    // ── All 75 test cases ────────────────────────────────────────────────────
    // Format: { TC_ID, Description, Steps, Expected Result, Actual, Comments }
    private static final String[][] TEST_CASES = {

            // ── SECTION A – Login & Navigate ──────────────────────────────────
            {
                    "TC_RBAC_01",
                    "Login as Super Admin",
                    "1. Open application URL\n2. Enter Super Admin email and password\n3. Click Login button",
                    "User is logged in successfully and redirected to Dashboard",
                    "", ""
            },
            {
                    "TC_RBAC_02",
                    "Navigate to RBAC Setup via sidebar",
                    "1. On Dashboard, locate sidebar\n2. Click 'RBAC Setup' menu item",
                    "URL changes to /rbac; RBAC Setup page loads successfully",
                    "", ""
            },

            // ── SECTION B – Landing Page Element Verification ─────────────────
            {
                    "TC_RBAC_03",
                    "Verify page heading 'RBAC Setup' is visible",
                    "1. On /rbac page, check for h1 heading element",
                    "h1 element with text 'RBAC Setup' is visible on the page",
                    "", ""
            },
            {
                    "TC_RBAC_04",
                    "Verify page subtitle text is visible",
                    "1. Check for subtitle paragraph below the heading",
                    "Text 'Manage roles and permissions' is visible below the heading",
                    "", ""
            },
            {
                    "TC_RBAC_05",
                    "Verify 'Create New Role' button is visible",
                    "1. Check top-right area of the page for the button",
                    "Blue 'Create New Role' button with + icon is present and visible",
                    "", ""
            },
            {
                    "TC_RBAC_06",
                    "Verify Search input is present with correct placeholder",
                    "1. Check the filter bar area for a text input",
                    "Text input with placeholder 'Search roles...' is visible",
                    "", ""
            },
            {
                    "TC_RBAC_07",
                    "Verify 4 filter type buttons are present with correct labels",
                    "1. Check the filter bar for toggle buttons",
                    "Buttons: All, Master, System, Custom - all 4 visible; 'All' is active (blue) by default",
                    "", ""
            },
            {
                    "TC_RBAC_08",
                    "Verify Roles table column headers are all present",
                    "1. Check the table thead for all column labels",
                    "Columns visible: Master, Role Name, Code, Type, Permissions, Projects, Agents, Actions",
                    "", ""
            },
            {
                    "TC_RBAC_09",
                    "Verify at least one role row exists in the table",
                    "1. Check the table tbody for rows",
                    "One or more role rows are present in the table body",
                    "", ""
            },

            // ── SECTION C – Search & Filter ───────────────────────────────────
            {
                    "TC_RBAC_10",
                    "Search by role name filters table rows",
                    "1. Type a known role name in the Search input",
                    "Only rows matching that name are shown; non-matching rows are hidden",
                    "", ""
            },
            {
                    "TC_RBAC_11",
                    "Search by role Code filters table rows",
                    "1. Type a known role Code (e.g. SUPER_ADMIN) in the Search input",
                    "Matching role row is shown; non-matching rows are hidden",
                    "", ""
            },
            {
                    "TC_RBAC_12",
                    "Search with no matching value shows empty table",
                    "1. Type 'xyznonexistent' in the Search input",
                    "No rows shown in table body; table body is effectively empty",
                    "", ""
            },
            {
                    "TC_RBAC_13",
                    "Clearing search input restores full role list",
                    "1. Type a value in search\n2. Clear the search input completely",
                    "All roles are displayed again in the table",
                    "", ""
            },
            {
                    "TC_RBAC_14",
                    "'Master' filter button shows only master roles",
                    "1. Click the 'Master' filter button",
                    "Only rows with gold star (isMaster=true) are shown; 'Master' button turns blue",
                    "", ""
            },
            {
                    "TC_RBAC_15",
                    "'System' filter button shows only system roles",
                    "1. Click the 'System' filter button",
                    "Only rows with 'system' type badge are shown; 'System' button turns blue",
                    "", ""
            },
            {
                    "TC_RBAC_16",
                    "'Custom' filter button shows only custom roles",
                    "1. Click the 'Custom' filter button",
                    "Only rows with 'custom' type badge are shown; 'Custom' button turns blue",
                    "", ""
            },
            {
                    "TC_RBAC_17",
                    "'All' filter button resets to full list",
                    "1. Click any filter button\n2. Then click the 'All' button",
                    "All roles are restored in the table; 'All' button turns blue",
                    "", ""
            },

            // ── SECTION D – Table Row Element Verification ────────────────────
            {
                    "TC_RBAC_18",
                    "Verify gold star icon for master roles",
                    "1. Find a role row where isMaster=true\n2. Check the Master column icon",
                    "Star icon is gold/filled (MdStar) for that row",
                    "", ""
            },
            {
                    "TC_RBAC_19",
                    "Verify grey star icon for non-master roles",
                    "1. Find a role row where isMaster=false\n2. Check the Master column icon",
                    "Star icon is grey/outlined (MdStarBorder) for that row",
                    "", ""
            },
            {
                    "TC_RBAC_20",
                    "Verify star icon is disabled and non-clickable for system roles",
                    "1. Find a system role row\n2. Attempt to click the star icon",
                    "Star button is disabled; cursor is not-allowed; click has no effect on the role",
                    "", ""
            },
            {
                    "TC_RBAC_21",
                    "Verify Type badge colors - system=blue, custom=amber",
                    "1. Check the Type column for both system and custom rows",
                    "'system' badge has blue background; 'custom' badge has amber/yellow background",
                    "", ""
            },
            {
                    "TC_RBAC_22",
                    "Verify Clone icon only appears on master role rows",
                    "1. Check the Actions column across all visible rows",
                    "Green Clone (copy) icon is visible only on rows where isMaster=true; absent on non-master rows",
                    "", ""
            },
            {
                    "TC_RBAC_23",
                    "Verify Edit icon is present on every role row",
                    "1. Check the Actions column for all rows in the table",
                    "Blue Edit (pencil) icon is present on every row regardless of type or master status",
                    "", ""
            },
            {
                    "TC_RBAC_24",
                    "Verify Delete icon only appears on custom role rows",
                    "1. Check the Actions column across all visible rows",
                    "Red Delete (trash) icon is visible only on rows with Type=custom; absent on system rows",
                    "", ""
            },

            // ── SECTION E – Create New Role ───────────────────────────────────
            {
                    "TC_RBAC_25",
                    "Click 'Create New Role' - modal opens with correct title",
                    "1. Click the 'Create New Role' button",
                    "Modal appears with title 'Create New Role'; close (X) button is visible at top-right",
                    "", ""
            },
            {
                    "TC_RBAC_26",
                    "Verify 'Role Name *' field is present and marked required",
                    "1. In Create modal, check the Basic Information section",
                    "Text input labeled 'Role Name *' is visible and has the required attribute",
                    "", ""
            },
            {
                    "TC_RBAC_27",
                    "Verify 'Code *' field auto-generates from Role Name",
                    "1. Type 'AutoRBAC Role' in Role Name field\n2. Observe the Code field",
                    "Code field auto-populates with 'AUTORBAC_ROLE'; placeholder 'Auto-generated from name' is shown",
                    "", ""
            },
            {
                    "TC_RBAC_28",
                    "Verify Code field manual input is auto-uppercased",
                    "1. Click into the Code field\n2. Manually type 'autorbac'",
                    "Value in Code field displays as 'AUTORBAC' (automatically uppercased)",
                    "", ""
            },
            {
                    "TC_RBAC_29",
                    "Verify 'Description' textarea is present in Create modal",
                    "1. Check the Basic Information section for Description",
                    "Textarea labeled 'Description' with 3 rows is visible",
                    "", ""
            },
            {
                    "TC_RBAC_30",
                    "Verify 'Role Type' dropdown has all 5 options",
                    "1. Click the Role Type dropdown in Create modal",
                    "Options present: Custom (All Permissions), Super Admin (Full Access), Manager, Agent, Student",
                    "", ""
            },
            {
                    "TC_RBAC_31",
                    "Changing Role Type filters the Permissions list shown",
                    "1. In Create modal select Role Type = 'Agent'\n2. Scroll to Permissions section",
                    "Only Agent-relevant permissions are shown; Super Admin/Manager-only permissions are hidden",
                    "", ""
            },
            {
                    "TC_RBAC_32",
                    "Verify 'Project Mapping' section is present with project checkboxes",
                    "1. Scroll to Project Mapping section in Create modal",
                    "Section heading 'Project Mapping' is visible; project checkboxes are listed in a grid",
                    "", ""
            },
            {
                    "TC_RBAC_33",
                    "Project Mapping warning shown when no project is selected",
                    "1. Open Create modal\n2. Do NOT check any project checkbox",
                    "Warning text 'No projects selected. This role won't be usable in any project.' is visible",
                    "", ""
            },
            {
                    "TC_RBAC_34",
                    "Project Mapping count message shown when one project is selected",
                    "1. Check 1 project checkbox in Project Mapping section",
                    "Warning is replaced by message 'This role is mapped to 1 project.'",
                    "", ""
            },
            {
                    "TC_RBAC_35",
                    "Verify 'Permissions' accordion section is present in Create modal",
                    "1. Scroll to Permissions section in Create modal",
                    "Section heading 'Permissions' is visible; collapsible category rows are present",
                    "", ""
            },
            {
                    "TC_RBAC_36",
                    "Permissions accordion category expands on click",
                    "1. Click a collapsed category row in the Permissions section",
                    "Category expands showing permission checkboxes and module names below it",
                    "", ""
            },
            {
                    "TC_RBAC_37",
                    "Permissions accordion category collapses on second click",
                    "1. Click the same expanded category row again",
                    "Category collapses; permission checkboxes are hidden",
                    "", ""
            },
            {
                    "TC_RBAC_38",
                    "Module-level 'Select All' checkbox selects all permissions in module",
                    "1. Expand a category\n2. Click the module-level checkbox (currently unchecked)",
                    "All individual permission checkboxes under that module become checked",
                    "", ""
            },
            {
                    "TC_RBAC_39",
                    "Unchecking module 'Select All' deselects all permissions in module",
                    "1. With module fully selected, click the module-level checkbox again",
                    "All individual permission checkboxes under that module become unchecked",
                    "", ""
            },
            {
                    "TC_RBAC_40",
                    "Cancel button closes Create modal without creating a role",
                    "1. Fill in some data in Create modal\n2. Click Cancel button",
                    "Modal closes; no new role is added to the roles table",
                    "", ""
            },
            {
                    "TC_RBAC_41",
                    "X button closes Create modal without creating a role",
                    "1. Fill in some data in Create modal\n2. Click the X icon button at top-right of modal",
                    "Modal closes; no new role is added to the roles table",
                    "", ""
            },
            {
                    "TC_RBAC_42",
                    "Submit Create form with empty Role Name is blocked by validation",
                    "1. Open Create modal\n2. Leave Role Name empty\n3. Click 'Create Role' button",
                    "Form does not submit; Role Name field shows HTML5 required validation error",
                    "", ""
            },
            {
                    "TC_RBAC_43",
                    "Submit Create form with empty Code is blocked by validation",
                    "1. Open Create modal\n2. Fill Role Name then manually clear Code field\n3. Click 'Create Role'",
                    "Form does not submit; Code field shows HTML5 required validation error",
                    "", ""
            },
            {
                    "TC_RBAC_44",
                    "Create role 'AutoRBAC Role' with all fields filled",
                    "1. Click 'Create New Role'\n2. Enter Name: AutoRBAC Role\n3. Verify Code = AUTORBAC_ROLE\n4. Enter Description: Automation Test Role\n5. Select Role Type: Custom\n6. Select 1 project checkbox\n7. Click 'Create Role'",
                    "Modal closes without error; roles list reloads with new role present",
                    "", ""
            },
            {
                    "TC_RBAC_45",
                    "Verify 'AutoRBAC Role' appears in the listing table after creation",
                    "1. Search 'AutoRBAC Role' in the search input",
                    "Row with Name 'AutoRBAC Role', Code 'AUTORBAC_ROLE', Type badge 'custom' is present",
                    "", ""
            },

            // ── SECTION F – Edit Role ─────────────────────────────────────────
            {
                    "TC_RBAC_46",
                    "Click Edit icon on 'AutoRBAC Role' - Edit modal opens",
                    "1. Find 'AutoRBAC Role' row\n2. Click the blue Edit (pencil) icon",
                    "Modal opens with title 'Edit Role'; X close button is visible",
                    "", ""
            },
            {
                    "TC_RBAC_47",
                    "Verify all fields are pre-populated with correct existing data",
                    "1. Check all fields in Edit modal after opening for 'AutoRBAC Role'",
                    "Name='AutoRBAC Role', Code='AUTORBAC_ROLE', Description='Automation Test Role', Type=Custom are all pre-filled correctly",
                    "", ""
            },
            {
                    "TC_RBAC_48",
                    "Verify Code field is disabled for system type roles",
                    "1. Open Edit modal for any system role\n2. Check Code input field",
                    "Code input is disabled (greyed out); user cannot type or edit it",
                    "", ""
            },
            {
                    "TC_RBAC_49",
                    "Verify 'Mark as Master Role' checkbox is visible for custom roles",
                    "1. Open Edit modal for 'AutoRBAC Role' (custom)\n2. Check for Master checkbox",
                    "Checkbox 'Mark as Master Role' with helper text is visible in the form",
                    "", ""
            },
            {
                    "TC_RBAC_50",
                    "Verify 'Mark as Agent Role' checkbox is visible for custom roles",
                    "1. Open Edit modal for 'AutoRBAC Role' (custom)\n2. Check for Agent checkbox",
                    "Checkbox 'Mark as Agent Role' with round-robin helper text is visible in the form",
                    "", ""
            },
            {
                    "TC_RBAC_51",
                    "Edit system role - Project Mapping section is NOT shown",
                    "1. Open Edit modal for any system role\n2. Look for Project Mapping section",
                    "'Project Mapping' section is not rendered / not visible in the Edit modal",
                    "", ""
            },
            {
                    "TC_RBAC_52",
                    "Edit system role - Master/Agent checkboxes are NOT shown",
                    "1. Open Edit modal for any system role\n2. Look for Master/Agent checkboxes",
                    "'Mark as Master Role' and 'Mark as Agent Role' checkboxes are absent from the form",
                    "", ""
            },
            {
                    "TC_RBAC_53",
                    "X button on Edit modal closes it without saving changes",
                    "1. Open Edit modal for 'AutoRBAC Role'\n2. Change the name field\n3. Click X icon button",
                    "Modal closes; original role data remains unchanged in the listing table",
                    "", ""
            },
            {
                    "TC_RBAC_54",
                    "Update Description of 'AutoRBAC Role' via Edit modal",
                    "1. Open Edit modal for 'AutoRBAC Role'\n2. Clear Description field\n3. Type 'Automation Test Role Updated'\n4. Click 'Update Role'",
                    "Modal closes without error; no alert shown",
                    "", ""
            },
            {
                    "TC_RBAC_55",
                    "Verify updated description is reflected in the listing table",
                    "1. Find 'AutoRBAC Role' row in the table after update",
                    "Row shows 'Automation Test Role Updated' as description text below the role name",
                    "", ""
            },

            // ── SECTION G – Toggle Master Star ────────────────────────────────
            {
                    "TC_RBAC_56",
                    "Toggle Master star ON for 'AutoRBAC Role'",
                    "1. Find 'AutoRBAC Role' row\n2. Click the grey star icon",
                    "Star turns gold; page refreshes/reloads role data",
                    "", ""
            },
            {
                    "TC_RBAC_57",
                    "Verify Clone icon appears after marking 'AutoRBAC Role' as Master",
                    "1. Check Actions column for 'AutoRBAC Role' row after star turned gold",
                    "Green Clone (copy) icon is now visible in the Actions column for that row",
                    "", ""
            },
            {
                    "TC_RBAC_58",
                    "Toggle Master star OFF for 'AutoRBAC Role'",
                    "1. Click the gold star icon on 'AutoRBAC Role' row",
                    "Star turns grey; role is no longer master; page reloads",
                    "", ""
            },
            {
                    "TC_RBAC_59",
                    "Verify Clone icon disappears after removing Master status",
                    "1. Check Actions column for 'AutoRBAC Role' row after star turned grey",
                    "Clone icon is no longer visible in the Actions column for that row",
                    "", ""
            },
            {
                    "TC_RBAC_60",
                    "Toggle Master star ON again to prepare for Clone test",
                    "1. Click grey star on 'AutoRBAC Role' row",
                    "Star turns gold again; Clone icon reappears in Actions column",
                    "", ""
            },

            // ── SECTION H – Clone Role ────────────────────────────────────────
            {
                    "TC_RBAC_61",
                    "Click Clone icon on 'AutoRBAC Role' - Clone modal opens",
                    "1. Click the green Clone (copy) icon on 'AutoRBAC Role' row",
                    "Modal opens with title 'Clone Role'; X close button is visible",
                    "", ""
            },
            {
                    "TC_RBAC_62",
                    "Verify info banner in Clone modal shows source role name and message",
                    "1. Check the banner area at top of Clone modal",
                    "Blue banner shows 'Cloning from: AutoRBAC Role' and 'All permissions will be copied to the new role.'",
                    "", ""
            },
            {
                    "TC_RBAC_63",
                    "Verify 'New Role Name *' field is present and required in Clone modal",
                    "1. Check Clone modal form fields",
                    "Text input labeled 'New Role Name *' is visible and has required attribute",
                    "", ""
            },
            {
                    "TC_RBAC_64",
                    "Verify Code auto-generates from New Role Name in Clone modal",
                    "1. Type 'AutoRBAC Clone' in New Role Name field in Clone modal",
                    "Code field auto-populates with 'AUTORBAC_CLONE'",
                    "", ""
            },
            {
                    "TC_RBAC_65",
                    "Verify Description textarea is present in Clone modal",
                    "1. Check Clone modal form fields",
                    "Textarea labeled 'Description' is visible",
                    "", ""
            },
            {
                    "TC_RBAC_66",
                    "Verify 'Assign to Projects' checkboxes are present in Clone modal",
                    "1. Check Clone modal form fields",
                    "Project checkboxes are listed under 'Assign to Projects' label",
                    "", ""
            },
            {
                    "TC_RBAC_67",
                    "Cancel button on Clone modal closes it without cloning",
                    "1. Fill Clone form partially\n2. Click Cancel button",
                    "Modal closes; no cloned role is added to the roles table",
                    "", ""
            },
            {
                    "TC_RBAC_68",
                    "X button on Clone modal closes it without cloning",
                    "1. Fill Clone form partially\n2. Click the X icon button",
                    "Modal closes; no cloned role is added to the roles table",
                    "", ""
            },
            {
                    "TC_RBAC_69",
                    "Clone 'AutoRBAC Role' as 'AutoRBAC Clone'",
                    "1. Open Clone modal on 'AutoRBAC Role'\n2. Enter Name: AutoRBAC Clone\n3. Verify Code = AUTORBAC_CLONE\n4. Select 1 project\n5. Click 'Clone Role'",
                    "Modal closes without error; roles list reloads",
                    "", ""
            },
            {
                    "TC_RBAC_70",
                    "Verify 'AutoRBAC Clone' appears in listing table after cloning",
                    "1. Search 'AutoRBAC Clone' in search input",
                    "Row with Name 'AutoRBAC Clone', Code 'AUTORBAC_CLONE', Type 'custom' is present in table",
                    "", ""
            },

            // ── SECTION I – Delete Cloned Role ────────────────────────────────
            {
                    "TC_RBAC_71",
                    "Click Delete on 'AutoRBAC Clone' - confirm dialog appears",
                    "1. Find 'AutoRBAC Clone' row\n2. Click the red Delete (trash) icon",
                    "Browser confirm dialog appears with message 'Are you sure you want to delete this role?'",
                    "", ""
            },
            {
                    "TC_RBAC_72",
                    "Cancel deletion - verify 'AutoRBAC Clone' is NOT removed",
                    "1. Click Delete on 'AutoRBAC Clone'\n2. Click Cancel on confirm dialog",
                    "Dialog is dismissed; 'AutoRBAC Clone' row is still present in the table",
                    "", ""
            },
            {
                    "TC_RBAC_73",
                    "Confirm delete - verify 'AutoRBAC Clone' is removed from table",
                    "1. Click Delete on 'AutoRBAC Clone'\n2. Click OK on confirm dialog",
                    "'AutoRBAC Clone' row is no longer present in the roles table",
                    "", ""
            },

            // ── SECTION J – Delete Original Created Role (Cleanup) ────────────
            {
                    "TC_RBAC_74",
                    "Click Delete on 'AutoRBAC Role' - confirm dialog appears",
                    "1. Find 'AutoRBAC Role' row\n2. Click the red Delete (trash) icon",
                    "Browser confirm dialog appears with message 'Are you sure you want to delete this role?'",
                    "", ""
            },
            {
                    "TC_RBAC_75",
                    "Confirm delete - verify 'AutoRBAC Role' is removed from table",
                    "1. Click OK on confirm dialog",
                    "'AutoRBAC Role' row is no longer in the table; searching for it returns no results",
                    "", ""
            }
    };

    // ── Section labels for row grouping (optional visual marker) ────────────
    private static final String[] SECTION_HEADERS = {
            "TC_RBAC_01", "SECTION A - Login & Navigate",
            "TC_RBAC_03", "SECTION B - Landing Page Element Verification",
            "TC_RBAC_10", "SECTION C - Search & Filter",
            "TC_RBAC_18", "SECTION D - Table Row Element Verification",
            "TC_RBAC_25", "SECTION E - Create New Role",
            "TC_RBAC_46", "SECTION F - Edit Role",
            "TC_RBAC_56", "SECTION G - Toggle Master Star",
            "TC_RBAC_61", "SECTION H - Clone Role",
            "TC_RBAC_71", "SECTION I - Delete Cloned Role",
            "TC_RBAC_74", "SECTION J - Delete Original Created Role"
    };

    public static void main(String[] args) throws IOException {

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet(SHEET_NAME);

            // ── Column widths ────────────────────────────────────────────
            sheet.setColumnWidth(COL_TC_ID, 18 * 256);
            sheet.setColumnWidth(COL_DESC, 50 * 256);
            sheet.setColumnWidth(COL_STEPS, 70 * 256);
            sheet.setColumnWidth(COL_EXPECTED, 70 * 256);
            sheet.setColumnWidth(COL_ACTUAL, 40 * 256);
            sheet.setColumnWidth(COL_COMMENTS, 40 * 256);

            // ── Shared styles ────────────────────────────────────────────
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle sectionStyle = createSectionStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);
            CellStyle tcIdStyle = createTcIdStyle(workbook);

            // ── Row 0: column headers ────────────────────────────────────
            Row headerRow = sheet.createRow(0);
            headerRow.setHeightInPoints(20);
            String[] headers = { "TC ID", "TC Description", "Steps", "Expected Result", "Actual Result", "Comments" };
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // ── Data rows ────────────────────────────────────────────────
            int rowNum = 1;
            int sectionIdx = 0;

            for (String[] tc : TEST_CASES) {
                // Insert section header row if this TC starts a section
                if (sectionIdx < SECTION_HEADERS.length && tc[0].equals(SECTION_HEADERS[sectionIdx])) {
                    Row secRow = sheet.createRow(rowNum++);
                    secRow.setHeightInPoints(18);
                    Cell secCell = secRow.createCell(0);
                    secCell.setCellValue(SECTION_HEADERS[sectionIdx + 1]);
                    secCell.setCellStyle(sectionStyle);
                    sectionIdx += 2;
                }

                Row row = sheet.createRow(rowNum++);
                row.setHeightInPoints(60);

                Cell tcIdCell = row.createCell(COL_TC_ID);
                tcIdCell.setCellValue(tc[0]);
                tcIdCell.setCellStyle(tcIdStyle);

                for (int col = 1; col < 6; col++) {
                    Cell cell = row.createCell(col);
                    cell.setCellValue(tc[col]);
                    cell.setCellStyle(dataStyle);
                }
            }

            // ── Write file ────────────────────────────────────────────────
            try (FileOutputStream fos = new FileOutputStream(OUTPUT_PATH)) {
                workbook.write(fos);
            }

            System.out.println("✅  Created: " + OUTPUT_PATH);
            System.out.println("    Sheet  : " + SHEET_NAME);
            System.out.println("    Rows   : " + TEST_CASES.length + " test cases written.");
        }
    }

    // ── Style helpers ────────────────────────────────────────────────────────

    private static CellStyle createHeaderStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setWrapText(true);
        return style;
    }

    private static CellStyle createSectionStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 10);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private static CellStyle createTcIdStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 10);
        font.setColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFont(font);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setVerticalAlignment(VerticalAlignment.TOP);
        style.setWrapText(true);
        return style;
    }

    private static CellStyle createDataStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setFontHeightInPoints((short) 10);
        style.setFont(font);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setVerticalAlignment(VerticalAlignment.TOP);
        style.setWrapText(true);
        return style;
    }
}
