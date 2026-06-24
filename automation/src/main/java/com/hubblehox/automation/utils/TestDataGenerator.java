package com.hubblehox.automation.utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Run this ONCE before starting test execution.
 * Generates all result Excel files in testresults/ folder.
 * Framework will auto-fill PASS/FAIL results into these files after each run.
 */
public class TestDataGenerator {

    /**
     * HOW TO USE:
     * - To generate LOGIN module Excel → pass argument: login
     * - To generate TICKETS module Excel → pass argument: tickets
     * - To generate ALL modules at once → pass argument: all
     * - Run via Maven: mvn exec:java
     * -Dexec.mainClass="com.hubblehox.automation.utils.TestDataGenerator"
     * -Dexec.args="login"
     */
    public static void main(String[] args) throws IOException {
        String module = (args.length > 0) ? args[0].toLowerCase().trim() : "all";

        switch (module) {
            case "login":
                generateLoginResults();
                System.out.println("✅ LOGIN_Results.xlsx generated at testresults/LOGIN_Results.xlsx");
                break;

            case "projects":
                generateProjectManagementResults();
                System.out.println("✅ Project_Management.xlsx generated at testresults/Project_Management.xlsx");
                break;

            case "users":
                generateUserManagementResults();
                System.out.println("✅ User_Management.xlsx generated at testresults/User_Management.xlsx");
                break;

            case "all":
            default:
                generateLoginResults();
                System.out.println("✅ LOGIN_Results.xlsx generated at testresults/LOGIN_Results.xlsx");
                generateProjectManagementResults();
                System.out.println("✅ Project_Management.xlsx generated at testresults/Project_Management.xlsx");
                generateUserManagementResults();
                System.out.println("✅ User_Management.xlsx generated at testresults/User_Management.xlsx");
                break;
        }
    }

    // ==================== LOGIN MODULE ====================
    public static void generateLoginResults() throws IOException {
        Files.createDirectories(Paths.get("testresults"));

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("LOGIN");

            // -------------------- Header Row --------------------
            Row header = sheet.createRow(0);
            String[] headers = {
                    "Test Case ID",
                    "Test Case Description",
                    "Steps",
                    "Expected Result",
                    "Actual Result",
                    "Comments"
            };
            CellStyle headerStyle = createHeaderStyle(workbook);
            int[] colWidths = { 4000, 10000, 20000, 12000, 6000, 6000 };
            for (int i = 0; i < headers.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, colWidths[i]);
            }

            // -------------------- Test Case Rows --------------------
            // Format: {TC ID, Description, Steps, Expected Result, Actual Result, Comments}
            String[][] testCases = {

                    // ------------------------------------------------------------------
                    // TC_LOGIN_01 — Verify Login page loads correctly
                    // ------------------------------------------------------------------
                    {
                            "TC_LOGIN_01",
                            "Verify Login page loads correctly",
                            """
                                    1. Launch browser (Chrome / Firefox / Edge based on config)
                                    2. Navigate to URL: http://helpdesksupport365.com/login
                                    3. Wait for the page to fully load
                                    4. Check that the Email Address field is visible
                                    5. Check that the Password field is visible
                                    6. Check that the Login button is visible
                                    7. Check that the 'Forgot your password?' link is visible""",
                            """
                                    Login page should load successfully.
                                    Email field, Password field, Login button and Forgot Password link
                                    should all be visible on screen.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_LOGIN_02 — Verify page title on Login page
                    // ------------------------------------------------------------------
                    {
                            "TC_LOGIN_02",
                            "Verify page title on Login page",
                            """
                                    1. Launch browser
                                    2. Navigate to URL: http://helpdesksupport365.com/login
                                    3. Wait for the page to fully load
                                    4. Read the browser tab title using driver.getTitle()""",
                            "Browser tab title should display 'SAC Helpdesk Portal'",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_LOGIN_03 — Verify Email field accepts text input
                    // ------------------------------------------------------------------
                    {
                            "TC_LOGIN_03",
                            "Verify Email field accepts text input",
                            """
                                    1. Launch browser
                                    2. Navigate to URL: http://helpdesksupport365.com/login
                                    3. Wait for the Email Address field to be visible
                                    4. Click on the Email Address field
                                    5. Type the value: 'test@gmail.com'
                                    6. Read back the value entered in the field""",
                            """
                                    Email field should be enabled and editable.
                                    The typed value 'test@gmail.com' should appear inside the field.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_LOGIN_04 — Verify Password field masks the entered text
                    // ------------------------------------------------------------------
                    {
                            "TC_LOGIN_04",
                            "Verify Password field masks the entered text",
                            """
                                    1. Launch browser
                                    2. Navigate to URL: http://helpdesksupport365.com/login
                                    3. Wait for the Password field to be visible
                                    4. Click on the Password field
                                    5. Type the value: 'TestPass@123'
                                    6. Check the 'type' attribute of the Password input element""",
                            """
                                    Password field 'type' attribute should be 'password'.
                                    Entered text should be masked (shown as dots or asterisks),
                                    not displayed as plain text.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_LOGIN_05 — Verify Forgot Password link is visible
                    // ------------------------------------------------------------------
                    {
                            "TC_LOGIN_05",
                            "Verify Forgot Password link is visible on Login page",
                            """
                                    1. Launch browser
                                    2. Navigate to URL: http://helpdesksupport365.com/login
                                    3. Wait for the page to fully load
                                    4. Locate the 'Forgot your password?' link on the page
                                    5. Check if the link is displayed""",
                            "'Forgot your password?' link should be clearly visible on the login page.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_LOGIN_06 — Valid Super Admin login with correct credentials
                    // ------------------------------------------------------------------
                    {
                            "TC_LOGIN_06",
                            "Valid Super Admin login with correct credentials",
                            """
                                    1. Launch browser
                                    2. Navigate to URL: http://helpdesksupport365.com/login
                                    3. Wait for the Email field to be visible
                                    4. Click on the Email field and enter valid Super Admin email (from config)
                                    5. Click on the Password field and enter valid Super Admin password (from config)
                                    6. Click the Login button
                                    7. Wait for the page to load after login
                                    8. Check that the current URL contains '/dashboard' or '/portal'""",
                            """
                                    User should be logged in successfully.
                                    Browser URL should redirect to the Dashboard page.
                                    Dashboard content should be visible on screen.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_LOGIN_07 — Login with correct email but wrong password
                    // ------------------------------------------------------------------
                    {
                            "TC_LOGIN_07",
                            "Login attempt with correct email but wrong password",
                            """
                                    1. Launch browser
                                    2. Navigate to URL: http://helpdesksupport365.com/login
                                    3. Wait for the Email field to be visible
                                    4. Click on the Email field and enter valid Super Admin email (from config)
                                    5. Click on the Password field and enter wrong password: 'WrongPass@123'
                                    6. Click the Login button
                                    7. Wait for the application to respond
                                    8. Check if an error message is displayed on the page""",
                            """
                                    Login should fail.
                                    An error message should appear indicating invalid credentials.
                                    User should remain on the Login page and NOT be redirected.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_LOGIN_08 — Login with wrong email but correct password
                    // ------------------------------------------------------------------
                    {
                            "TC_LOGIN_08",
                            "Login attempt with wrong email but correct password",
                            """
                                    1. Launch browser
                                    2. Navigate to URL: http://helpdesksupport365.com/login
                                    3. Wait for the Email field to be visible
                                    4. Click on the Email field and enter invalid email: 'wrong@test.com'
                                    5. Click on the Password field and enter valid Super Admin password (from config)
                                    6. Click the Login button
                                    7. Wait for the application to respond
                                    8. Check if an error message is displayed on the page""",
                            """
                                    Login should fail.
                                    An error message should appear indicating invalid credentials.
                                    User should remain on the Login page and NOT be redirected.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_LOGIN_09 — Login with Email field left empty
                    // ------------------------------------------------------------------
                    {
                            "TC_LOGIN_09",
                            "Login attempt with Email field left empty",
                            """
                                    1. Launch browser
                                    2. Navigate to URL: http://helpdesksupport365.com/login
                                    3. Wait for the page to fully load
                                    4. Leave the Email field blank (do not click or type anything)
                                    5. Click on the Password field and enter valid Super Admin password (from config)
                                    6. Click the Login button
                                    7. Check if a validation message appears below the Email field""",
                            """
                                    A validation error message should appear indicating that Email is required.
                                    User should remain on the Login page.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_LOGIN_10 — Login with Password field left empty
                    // ------------------------------------------------------------------
                    {
                            "TC_LOGIN_10",
                            "Login attempt with Password field left empty",
                            """
                                    1. Launch browser
                                    2. Navigate to URL: http://helpdesksupport365.com/login
                                    3. Wait for the Email field to be visible
                                    4. Click on the Email field and enter valid Super Admin email (from config)
                                    5. Leave the Password field blank (do not click or type anything)
                                    6. Click the Login button
                                    7. Check if a validation message appears below the Password field""",
                            """
                                    A validation error message should appear indicating that Password is required.
                                    User should remain on the Login page.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_LOGIN_11 — Login with both Email and Password empty
                    // ------------------------------------------------------------------
                    {
                            "TC_LOGIN_11",
                            "Login attempt with both Email and Password fields empty",
                            """
                                    1. Launch browser
                                    2. Navigate to URL: http://helpdesksupport365.com/login
                                    3. Wait for the page to fully load
                                    4. Leave both Email and Password fields completely blank
                                    5. Click the Login button
                                    6. Check if validation messages appear for both the Email and Password fields""",
                            """
                                    Validation error messages should appear for both Email and Password fields.
                                    User should remain on the Login page.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_LOGIN_12 — Login with invalid email format (no @ symbol)
                    // ------------------------------------------------------------------
                    {
                            "TC_LOGIN_12",
                            "Login attempt with invalid email format (no @ symbol)",
                            """
                                    1. Launch browser
                                    2. Navigate to URL: http://helpdesksupport365.com/login
                                    3. Wait for the Email field to be visible
                                    4. Click on the Email field and type: 'admingmail.com'  (no @ symbol)
                                    5. Click on the Password field and enter any password
                                    6. Click the Login button
                                    7. Check if a validation message appears for invalid email format""",
                            """
                                    A validation error should appear indicating that the email format is invalid.
                                    User should remain on the Login page.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_LOGIN_13 — Verify Login button is visible and clickable
                    // ------------------------------------------------------------------
                    {
                            "TC_LOGIN_13",
                            "Verify Login button is visible and clickable",
                            """
                                    1. Launch browser
                                    2. Navigate to URL: http://helpdesksupport365.com/login
                                    3. Wait for the page to fully load
                                    4. Locate the Login button on the page
                                    5. Check that the Login button is displayed (visible)
                                    6. Check that the Login button is enabled (not disabled / greyed out)
                                    7. Click the Login button and confirm it responds""",
                            """
                                    Login button should be visible on the page.
                                    Login button should be enabled and respond to a click action.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_LOGIN_14 — Forgot Password link navigates to Forgot Password screen
                    // ------------------------------------------------------------------
                    {
                            "TC_LOGIN_14",
                            "Verify Forgot Password link navigates to Forgot Password screen",
                            """
                                    1. Launch browser
                                    2. Navigate to URL: http://helpdesksupport365.com/login
                                    3. Wait for the page to fully load
                                    4. Locate the 'Forgot your password?' link
                                    5. Click on the 'Forgot your password?' link
                                    6. Wait for the next screen to load
                                    7. Check that the Forgot Password screen is displayed
                                       (should show an email input field for sending OTP)""",
                            """
                                    Clicking 'Forgot your password?' should navigate the user
                                    to the Forgot Password screen.
                                    The Forgot Password form with an email input field should be visible.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_LOGIN_15 — Verify language selector is visible on Login page
                    // ------------------------------------------------------------------
                    {
                            "TC_LOGIN_15",
                            "Verify language selector is visible on Login page",
                            """
                                    1. Launch browser
                                    2. Navigate to URL: http://helpdesksupport365.com/login
                                    3. Wait for the page to fully load
                                    4. Look for the language selector dropdown or button on the page
                                    5. Check if the language selector is displayed""",
                            "Language selector should be visible on the login page.",
                            "",
                            ""
                    }
            };

            CellStyle dataStyle = createDataStyle(workbook);
            CellStyle wrapStyle = createWrapStyle(workbook);

            for (int i = 0; i < testCases.length; i++) {
                Row row = sheet.createRow(i + 1);
                row.setHeightInPoints(80);
                for (int j = 0; j < testCases[i].length; j++) {
                    Cell cell = row.createCell(j);
                    cell.setCellValue(testCases[i][j]);
                    // Wrap text for Steps column
                    cell.setCellStyle(j == 2 ? wrapStyle : dataStyle);
                }
            }

            // -------------------- Save --------------------
            try (FileOutputStream fos = new FileOutputStream("testresults/LOGIN_Results.xlsx")) {
                workbook.write(fos);
            }
        }
    }

    // ==================== PROJECT MANAGEMENT MODULE ====================
    public static void generateProjectManagementResults() throws IOException {
        Files.createDirectories(Paths.get("testresults"));

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Project_Management");

            // -------------------- Header Row --------------------
            Row header = sheet.createRow(0);
            String[] headers = {
                    "Test Case ID",
                    "Test Case Description",
                    "Steps",
                    "Expected Result",
                    "Actual Result",
                    "Comments"
            };
            CellStyle headerStyle = createHeaderStyle(workbook);
            int[] colWidths = { 4500, 14000, 24000, 16000, 6000, 6000 };
            for (int i = 0; i < headers.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, colWidths[i]);
            }

            // -------------------- Test Case Rows --------------------
            String[][] testCases = {

                    // ------------------------------------------------------------------
                    // TC_PM_01 — Super Admin login
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_01",
                            "Verify Super Admin can login and is redirected away from login page",
                            """
                                    1. Launch browser (Chrome)
                                    2. Navigate to: http://helpdesksupport365.com/
                                    3. Wait for Login page to load
                                    4. Enter Super Admin email in the Email field (from config)
                                    5. Enter Super Admin password in the Password field (from config)
                                    6. Click the Login button
                                    7. Wait for redirect
                                    8. Verify the current URL does NOT contain /login""",
                            """
                                    Super Admin login should succeed.
                                    Browser should redirect away from the login page.
                                    URL should NOT contain /login after successful login.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_02 — Project Management menu in sidebar
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_02",
                            "Verify 'Project Management' menu item is visible in the sidebar after login",
                            """
                                    1. Complete TC_PM_01 (Super Admin logged in)
                                    2. Wait for the dashboard/home page to load
                                    3. Look for 'Project Management' in the left sidebar navigation
                                    4. Verify it is visible""",
                            """
                                    'Project Management' navigation item should be visible in the
                                    left sidebar menu for Super Admin role.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_03 — Navigate to /projects page
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_03",
                            "Verify clicking 'Project Management' opens the Projects list page at /projects",
                            """
                                    1. Complete TC_PM_01 (Super Admin logged in)
                                    2. Locate the 'Project Management' menu item in the sidebar
                                    3. Click on 'Project Management'
                                    4. Wait for the page to load
                                    5. Verify the current URL contains /projects""",
                            """
                                    URL should change to: http://helpdesksupport365.com/projects
                                    The Projects list page should be displayed.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_04 — Projects page heading and subtitle
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_04",
                            "Verify Projects page displays heading 'Projects' and subtitle text",
                            """
                                    1. Complete TC_PM_03 (on /projects page)
                                    2. Check the heading text on the page
                                    3. Verify it reads: 'Projects'
                                    4. Check the subtitle text below the heading
                                    5. Verify it reads: 'Manage your projects and their configurations'""",
                            """
                                    Heading 'Projects' should be clearly visible.
                                    Subtitle 'Manage your projects and their configurations'
                                    should appear directly below the heading.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_05 — Browser tab title on /projects page
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_05",
                            "Verify browser tab title on the Projects page",
                            """
                                    1. Complete TC_PM_03 (on /projects page)
                                    2. Read the browser tab title using driver.getTitle()
                                    3. Verify the title contains 'SAC Helpdesk' or 'Projects'""",
                            """
                                    Browser tab title should contain 'SAC Helpdesk' or 'Projects'.
                                    It should NOT be blank or show an error page title.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_06 — Four statistics cards visible
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_06",
                            "Verify four statistics cards are visible on the Projects page",
                            """
                                    1. Complete TC_PM_03 (on /projects page)
                                    2. Check that the 'Total Projects' card is visible
                                    3. Check that the 'Active' card is visible
                                    4. Check that the 'Inactive' card is visible
                                    5. Check that the 'With Branding' card is visible""",
                            """
                                    All four statistics cards must be visible:
                                    - Total Projects
                                    - Active
                                    - Inactive
                                    - With Branding
                                    Each card should display a numeric count.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_07 — Table column headers
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_07",
                            "Verify Projects list table displays all seven required column headers",
                            """
                                    1. Complete TC_PM_03 (on /projects page)
                                    2. Locate the project list table
                                    3. Verify the following column headers are visible:
                                       - PROJECT ID
                                       - NAME
                                       - CODE
                                       - USERS
                                       - STATUS
                                       - CREATED
                                       - ACTIONS""",
                            """
                                    All seven column headers must be visible in the projects table:
                                    PROJECT ID, NAME, CODE, USERS, STATUS, CREATED, ACTIONS.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_08 — Table has at least one data row
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_08",
                            "Verify Projects list table displays at least one project row",
                            """
                                    1. Complete TC_PM_03 (on /projects page)
                                    2. Wait for the table to finish loading
                                       (loading spinner / 'Loading projects...' text should disappear)
                                    3. Count the number of rows in the table body
                                    4. Verify at least one row exists""",
                            """
                                    The projects table should display at least one project row.
                                    Table body must NOT be empty after loading completes.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_09 — '+ Add Project' button visible and enabled
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_09",
                            "Verify '+ Add Project' button is visible and enabled on Projects page",
                            """
                                    1. Complete TC_PM_03 (on /projects page)
                                    2. Locate the '+ Add Project' button (top-right area)
                                    3. Verify the button is visible
                                    4. Verify the button is enabled (clickable, not disabled/greyed out)""",
                            """
                                    '+ Add Project' button should be visible and enabled.
                                    Clicking it should be possible.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_10 — Click '+ Add Project' opens modal
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_10",
                            "Verify clicking '+ Add Project' opens the 'Add New Project' modal dialog",
                            """
                                    1. Complete TC_PM_03 (on /projects page)
                                    2. Click the '+ Add Project' button
                                    3. Wait for the modal to appear (up to 20 seconds)
                                    4. Verify the modal title 'Add New Project' is visible""",
                            """
                                    A modal dialog should open.
                                    Modal title must read exactly: 'Add New Project'.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_11 — Modal subtitle text
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_11",
                            "Verify 'Add New Project' modal displays correct subtitle below the title",
                            """
                                    1. Complete TC_PM_10 (modal is open)
                                    2. Read the subtitle text below the modal title
                                    3. Verify it contains:
                                       'Configure portal, security, and ticket settings in one place'""",
                            """
                                    Modal subtitle should read:
                                    'Configure portal, security, and ticket settings in one place'.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_12 — All five sidebar tabs visible in modal
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_12",
                            "Verify modal left sidebar contains all five navigation tabs",
                            """
                                    1. Complete TC_PM_10 (modal is open)
                                    2. Check the left sidebar of the modal
                                    3. Verify tab 'General' is visible
                                    4. Verify tab 'Login' is visible
                                    5. Verify tab 'Security' is visible
                                    6. Verify tab 'Ticket Portal' is visible
                                    7. Verify tab 'Customization' is visible""",
                            """
                                    All five tabs must be visible in the modal left sidebar:
                                    General, Login, Security, Ticket Portal, Customization.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_13 — General tab active by default
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_13",
                            "Verify 'General' tab is selected and its content is shown by default",
                            """
                                    1. Complete TC_PM_10 (modal is open)
                                    2. Without clicking any tab, check which tab content is shown
                                    3. Verify the General tab content is active
                                       (Portal Name input field should be visible without any click)""",
                            """
                                    The 'General' tab should be active by default.
                                    Portal Name input field should be visible immediately on modal open.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_14 — Required fields note on General tab
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_14",
                            "Verify required fields note is shown at the top of the General tab",
                            """
                                    1. Complete TC_PM_10 (modal is open, General tab active)
                                    2. Check for a note at the top of the General tab content area
                                    3. Verify it contains: '* indicates required fields'""",
                            """
                                    A note containing '* indicates required fields' should be visible
                                    at the top of the General tab content.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_15 — Portal Name input field — visibility + fill with test data
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_15",
                            "Verify 'Portal Name' field is visible and accepts test data input",
                            """
                                    1. Complete TC_PM_10 (modal is open, General tab active)
                                    2. Locate the 'Portal Name' label and input field
                                    3. Verify the Portal Name input field is visible
                                    4. Verify placeholder text reads: 'Enter portal name'
                                    5. Click on the Portal Name input field
                                    6. Clear any existing value
                                    7. Type the test value: 'Automation Test Portal'
                                    8. Read back the value from the field
                                    9. Verify the typed value is: 'Automation Test Portal'""",
                            """
                                    Portal Name field should be visible and editable.
                                    After typing, the field value should read exactly: 'Automation Test Portal'.
                                    [Test Data — Portal Name]: Automation Test Portal""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_16 — Footer Text field — visibility + fill with test data
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_16",
                            "Verify 'Footer Text' field is visible and accepts test data input",
                            """
                                    1. Complete TC_PM_10 (modal is open, General tab active)
                                    2. Locate the 'Footer Text' label and input field below Portal Name
                                    3. Verify the Footer Text input field is visible
                                    4. Click on the Footer Text input field
                                    5. Clear any existing value
                                    6. Type the test value:
                                       '© 2026 Automation Testing. All rights reserved.'
                                    7. Read back the value from the field
                                    8. Verify the typed value matches the entered text""",
                            """
                                    Footer Text field should be visible and editable.
                                    After typing, field value should read:
                                    '© 2026 Automation Testing. All rights reserved.'
                                    [Test Data — Footer Text]: © 2026 Automation Testing. All rights reserved.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_17 — Custom Portal URL Path — visibility + fill with test data
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_17",
                            "Verify 'Custom Portal URL Path' field is visible and accepts test data input",
                            """
                                    1. Complete TC_PM_10 (modal is open, General tab active)
                                    2. Locate the 'Custom Portal URL Path' label and input field
                                    3. Verify the field is visible (required field, marked with *)
                                    4. Verify the placeholder text reads: 'studentassistcenter'
                                    5. Verify the domain prefix (http://helpdesksupport365.com/) is shown
                                    6. Click on the URL path input field
                                    7. Clear any existing value
                                    8. Type the test value: 'automationtestportal'
                                       (only lowercase letters, numbers, hyphens allowed)
                                    9. Verify the field value reads: 'automationtestportal'""",
                            """
                                    Custom Portal URL Path field must be visible and editable.
                                    After typing, field should show: 'automationtestportal'.
                                    Full URL displayed should be:
                                    http://helpdesksupport365.com/automationtestportal
                                    [Test Data — Custom Portal URL Path]: automationtestportal""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_18 — Logo upload using sample image
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_18",
                            "Verify Logo upload field is visible and accepts a PNG image file",
                            """
                                     1. Complete TC_PM_10 (modal is open, General tab active)
                                     2. Scroll down to the 'Logo and Favicon' section
                                     3. Verify the Logo upload area is visible (left side of the pair)
                                     4. Verify it shows 'Recommended: 240×40px • Max 2MB' hint text
                                     5. Verify the 'Upload Logo' button is visible
                                     6. Click the 'Upload Logo' button
                                     7. Select file: testdata/Sample-PNG-Image.png
                                        (File: SAMPLE watermark image — PNG format)
                                     8. Wait for the preview to appear in the Logo box
                                     9. Verify the logo image preview is now displayed
                                    10. Verify the button label changes to 'Change Logo'""",
                            """
                                    Logo upload area should be visible.
                                    After selecting testdata/Sample-PNG-Image.png:
                                    - A preview of the image should appear in the Logo box.
                                    - Button label should change from 'Upload Logo' to 'Change Logo'.
                                    [Test Data — Logo File]: testdata/Sample-PNG-Image.png""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_19 — Favicon upload using sample image
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_19",
                            "Verify Favicon upload field is visible and accepts a PNG image file",
                            """
                                     1. Complete TC_PM_10 (modal is open, General tab active)
                                     2. Scroll down to the 'Logo and Favicon' section
                                     3. Verify the Favicon upload area is visible (right side of the pair)
                                     4. Verify it shows 'Recommended: 16×16px • Max 1MB' hint text
                                     5. Verify the 'Upload Favicon' button is visible
                                     6. Click the 'Upload Favicon' button
                                     7. Select file: testdata/Sample-PNG-Image.png
                                        (File: SAMPLE watermark image — PNG format)
                                     8. Wait for the preview to appear in the Favicon box
                                     9. Verify the favicon image preview is now displayed
                                    10. Verify the button label changes to 'Change Favicon'""",
                            """
                                    Favicon upload area should be visible.
                                    After selecting testdata/Sample-PNG-Image.png:
                                    - A preview of the image should appear in the Favicon box.
                                    - Button label should change from 'Upload Favicon' to 'Change Favicon'.
                                    [Test Data — Favicon File]: testdata/Sample-PNG-Image.png""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_20 — Logo Linkback URL — visibility + fill with test data
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_20",
                            "Verify 'Logo Linkback URL' field is visible and accepts test data input",
                            """
                                    1. Complete TC_PM_10 (modal is open, General tab active)
                                    2. Scroll to the 'Logo Linkback URL' field below the Logo/Favicon section
                                    3. Verify the Logo Linkback URL input field is visible
                                    4. Verify the protocol dropdown (https://) is visible beside the input
                                    5. Click on the Logo Linkback URL text input
                                    6. Type the test value: 'hubblehox.com'
                                    7. Verify the field value reads: 'hubblehox.com'""",
                            """
                                    Logo Linkback URL field should be visible with a protocol dropdown.
                                    After typing, field should show: 'hubblehox.com'.
                                    Full URL: https://hubblehox.com
                                    [Test Data — Logo Linkback URL]: hubblehox.com""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_21 — Footer Links section — all four URL fields with test data
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_21",
                            "Verify Footer Links section shows Copyright, Terms of Use, Privacy Policy and Cookie Policy URL fields and accepts test data",
                            """
                                    1. Complete TC_PM_10 (modal is open, General tab active)
                                    2. Scroll down to the 'Footer Links' section
                                    3. Verify 'Copyright URL' field is visible
                                       → Fill with: 'hubblehox.com/copyright'
                                    4. Verify 'Terms of Use URL' field is visible
                                       → Fill with: 'hubblehox.com/terms'
                                    5. Verify 'Privacy Policy URL' field is visible
                                       → Fill with: 'hubblehox.com/privacy'
                                    6. Verify 'Cookie Policy URL' field is visible
                                       → Fill with: 'hubblehox.com/cookie'
                                    7. Verify each field shows the filled-in value correctly""",
                            """
                                    All four Footer Link URL fields must be visible and editable.
                                    After filling, each field should retain its value:
                                    - Copyright URL: hubblehox.com/copyright
                                    - Terms of Use URL: hubblehox.com/terms
                                    - Privacy Policy URL: hubblehox.com/privacy
                                    - Cookie Policy URL: hubblehox.com/cookie
                                    Each field should have a protocol dropdown (https://).
                                    [Test Data — Copyright URL]: hubblehox.com/copyright
                                    [Test Data — Terms of Use URL]: hubblehox.com/terms
                                    [Test Data — Privacy Policy URL]: hubblehox.com/privacy
                                    [Test Data — Cookie Policy URL]: hubblehox.com/cookie""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_22 — Announcement Banner Message section
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_22",
                            "Verify 'Announcement Banner Message' section is visible and accepts text input",
                            """
                                    1. Complete TC_PM_10 (modal is open, General tab active)
                                    2. Scroll down to the 'Announcement Banner Message' section
                                    3. Verify the label 'Announcement Banner Message' is visible
                                    4. Verify the description text below the label is visible
                                    5. Verify the 'Plain Text' and 'Rich Text' radio buttons are visible
                                    6. Verify the textarea for the banner message is visible
                                    7. Click on the textarea
                                    8. Type the test value:
                                       'This is an automated test announcement message.'
                                    9. Verify the typed text appears in the textarea""",
                            """
                                    Announcement Banner Message section should be visible.
                                    Textarea should accept text input.
                                    After typing, textarea should show:
                                    'This is an automated test announcement message.'
                                    [Test Data — Announcement Banner]: This is an automated test announcement message.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_23 — Discard and Update Project buttons visible
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_23",
                            "Verify 'Discard' and 'Update Project' action buttons are visible in the modal footer",
                            """
                                    1. Complete TC_PM_10 (modal is open)
                                    2. Look at the bottom/footer of the modal
                                    3. Verify the 'Discard' button is visible
                                    4. Verify the 'Update Project' button is visible
                                    5. Verify 'Update Project' button is enabled (not greyed out)""",
                            """
                                    Both action buttons must be visible in the modal footer:
                                    - Discard (secondary/outline button)
                                    - Update Project (primary/purple button — enabled)""",
                            "",
                            ""
                    },

                    // ==================================================================
                    // ==================== LOGIN TAB ===================================
                    // ==================================================================

                    // ------------------------------------------------------------------
                    // TC_PM_24 — Click Login tab and verify it becomes active
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_24",
                            "Verify clicking 'Login' tab in the modal switches to the Login tab content",
                            """
                                    1. Complete TC_PM_10 (modal is open, General tab active)
                                    2. Locate the 'Login' tab in the modal left sidebar
                                    3. Click on the 'Login' tab
                                    4. Wait for the tab content to load
                                    5. Verify the 'Login' tab is now visually active (highlighted)
                                    6. Verify the 'Single Sign-On (SSO)' section heading is visible
                                    7. Verify the 'Form Login' section heading is visible""",
                            """
                                    Clicking the 'Login' tab should:
                                    - Highlight the Login tab as the active selection
                                    - Display the Login tab content panel
                                    - Show 'Single Sign-On (SSO)' and 'Form Login' section headings""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_25 — Enable Form Login checkbox visible and checked by default
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_25",
                            "Verify 'Enable Form Login' checkbox is visible and checked by default on the Login tab",
                            """
                                    1. Complete TC_PM_24 (Login tab is active)
                                    2. Scroll to the 'Form Login' section
                                    3. Verify the 'Enable Form Login' checkbox is visible
                                    4. Verify the checkbox is checked (enabled) by default
                                    5. Verify the label text reads: 'Enable Form Login'""",
                            """
                                    'Enable Form Login' checkbox must be:
                                    - Visible in the Form Login section
                                    - Checked (enabled) by default
                                    This means form-based login is ON by default for new projects.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_26 — Form Login description text visible
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_26",
                            "Verify description text for 'Enable Form Login' option is visible on the Login tab",
                            """
                                    1. Complete TC_PM_24 (Login tab is active)
                                    2. Locate the 'Enable Form Login' checkbox
                                    3. Check for a description/subtitle below the checkbox label
                                    4. Verify description text is visible and contains:
                                       'Enabling this option will allow users to sign into the customer portal
                                        using a username and password'""",
                            """
                                    Description text below 'Enable Form Login' must be visible.
                                    It should explain that disabling this option hides the form login
                                    from the customer portal.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_27 — Enable Google reCAPTCHA checkbox visible and checked by default
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_27",
                            "Verify 'Enable Google reCAPTCHA' checkbox is visible and checked by default on the Login tab",
                            """
                                    1. Complete TC_PM_24 (Login tab is active)
                                    2. Scroll to the Form Login section
                                    3. Locate the 'Enable Google reCAPTCHA' option below Form Login
                                    4. Verify the checkbox is visible
                                    5. Verify the checkbox is checked (enabled) by default
                                    6. Verify the label text reads: 'Enable Google reCAPTCHA'""",
                            """
                                    'Enable Google reCAPTCHA' checkbox must be:
                                    - Visible in the Form Login section
                                    - Checked (enabled) by default
                                    Google reCAPTCHA should be ON by default for new projects.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_28 — 'recommended' badge visible next to reCAPTCHA option
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_28",
                            "Verify 'recommended' badge is displayed next to the Google reCAPTCHA option",
                            """
                                    1. Complete TC_PM_24 (Login tab is active)
                                    2. Locate the 'Enable Google reCAPTCHA' option
                                    3. Check for a badge/tag next to the option label
                                    4. Verify the badge text reads: 'recommended'
                                    5. Verify the badge is displayed in a distinct style (green background)""",
                            """
                                    A 'recommended' badge must appear next to the
                                    'Enable Google reCAPTCHA' label on the Login tab.
                                    The badge should be distinctly styled (e.g., green/teal background).""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_29 — reCAPTCHA description text visible
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_29",
                            "Verify description text for 'Enable Google reCAPTCHA' option is visible on the Login tab",
                            """
                                    1. Complete TC_PM_24 (Login tab is active)
                                    2. Locate the 'Enable Google reCAPTCHA' checkbox option
                                    3. Check for the description text below the checkbox label
                                    4. Verify description text is visible and contains:
                                       'Enabling this option allows users to verify with Google reCAPTCHA
                                        during sign up and sign in'""",
                            """
                                    Description text below 'Enable Google reCAPTCHA' must be visible.
                                    It should clearly explain the purpose of this option.""",
                            "",
                            ""
                    },

                    // ==================================================================
                    // ==================== SECURITY TAB ================================
                    // ==================================================================

                    // ------------------------------------------------------------------
                    // TC_PM_30 — Click Security tab and verify it becomes active
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_30",
                            "Verify clicking 'Security' tab in the modal switches to the Security tab content",
                            """
                                    1. Complete TC_PM_10 (modal is open)
                                    2. Locate the 'Security' tab in the modal left sidebar
                                    3. Click on the 'Security' tab
                                    4. Wait for the tab content to load
                                    5. Verify the 'Security' tab is now visually active (highlighted)
                                    6. Verify the 'General Settings' heading is visible in the content panel""",
                            """
                                    Clicking the 'Security' tab should:
                                    - Highlight it as the active tab
                                    - Display the Security tab content panel
                                    - Show the 'General Settings' heading""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_31 — Two-Factor Authentication (2FA) section heading and checkbox
                    // visible
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_31",
                            "Verify '2FA' section heading and checkbox are visible on the Security tab",
                            """
                                    1. Complete TC_PM_30 (Security tab is active)
                                    2. Verify the heading 'Two-Factor Authentication (2FA)' is visible
                                    3. Verify the checkbox option 'Enforce two-factor authentication (2FA) for all users' is visible
                                    4. Verify the description text below is visible and mentions OTP and project-specific logins""",
                            """
                                    Security tab must show:
                                    - 'Two-Factor Authentication (2FA)' as a section heading
                                    - Checkbox: 'Enforce two-factor authentication (2FA) for all users'
                                    - Description explaining the OTP requirement for project-specific logins""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_32 — 2FA checkbox is unchecked by default
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_32",
                            "Verify 'Enforce 2FA' checkbox is unchecked (disabled) by default on the Security tab",
                            """
                                    1. Complete TC_PM_30 (Security tab is active)
                                    2. Locate the 'Enforce two-factor authentication (2FA) for all users' checkbox
                                    3. Check the current state of the checkbox
                                    4. Verify it is unchecked (NOT selected) by default""",
                            """
                                    The '2FA for all users' checkbox should be UNCHECKED by default.
                                    2FA enforcement should be opt-in, not enforced automatically
                                    on new projects.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_33 — Password Policy section visible with note text
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_33",
                            "Verify 'Password Policy' section heading and note text are visible on the Security tab",
                            """
                                    1. Complete TC_PM_30 (Security tab is active)
                                    2. Scroll down to the 'Password Policy' section
                                    3. Verify the heading 'Password Policy' is visible
                                    4. Verify the note text below is visible and contains:
                                       'The password policy is only applicable if you have allowed form logins'""",
                            """
                                    'Password Policy' section heading must be visible.
                                    A note below it must be visible stating that the policy
                                    only applies when form login is enabled.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_34 — Default Policy and Custom Policy radio buttons visible; Custom
                    // selected
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_34",
                            "Verify 'Default Policy' and 'Custom Policy' radio buttons are visible; 'Custom Policy' is selected by default",
                            """
                                    1. Complete TC_PM_30 (Security tab is active)
                                    2. Scroll to the 'Password Policy' section
                                    3. Verify the 'Default Policy' radio button is visible
                                    4. Verify the 'Custom Policy' radio button is visible
                                    5. Verify 'Custom Policy' is selected (active) by default""",
                            """
                                    Both radio buttons must be visible in the Password Policy section:
                                    - Default Policy
                                    - Custom Policy
                                    'Custom Policy' should be selected by default.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_35 — All four Custom Policy checkboxes are visible
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_35",
                            "Verify all four Custom Policy requirement checkboxes are visible on the Security tab",
                            """
                                    1. Complete TC_PM_30 (Security tab is active)
                                    2. Ensure 'Custom Policy' radio is selected
                                    3. Verify the following four checkboxes are visible:
                                       a. 'Require at least one lower case letter (a-z).'
                                       b. 'Require at least one upper case letter (A-Z).'
                                       c. 'Require at least one number (0-9).'
                                       d. 'Require at least one special character (@!%*?"#$?()[]^-+-.=).'
                                    4. Verify all four are unchecked by default""",
                            """
                                    All four password requirement checkboxes must be visible:
                                    - Lowercase letter requirement
                                    - Uppercase letter requirement
                                    - Number requirement
                                    - Special character requirement
                                    All should be unchecked by default under Custom Policy.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_36 — Minimum password length dropdown visible with default value 8
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_36",
                            "Verify 'Minimum password length' dropdown is visible and defaults to 8 characters",
                            """
                                    1. Complete TC_PM_30 (Security tab is active)
                                    2. Scroll to the 'Password Policy' section
                                    3. Locate the 'Minimum password length' label and dropdown
                                    4. Verify the label 'Minimum password length' is visible
                                    5. Verify the dropdown is visible
                                    6. Verify the dropdown default value is '8'
                                    7. Verify the unit text 'characters.' is visible next to the dropdown""",
                            """
                                    'Minimum password length' dropdown must be visible.
                                    Default value should be '8'.
                                    Unit label 'characters.' should appear next to the dropdown.""",
                            "",
                            ""
                    },

                    // ==================================================================
                    // ==================== TICKET PORTAL TAB ===========================
                    // ==================================================================

                    // ------------------------------------------------------------------
                    // TC_PM_37 — Click Ticket Portal tab and verify it becomes active
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_37",
                            "Verify clicking 'Ticket Portal' tab switches to Ticket Portal content",
                            """
                                    1. Complete TC_PM_10 (modal is open)
                                    2. Locate the 'Ticket Portal' tab in the modal left sidebar
                                    3. Click on the 'Ticket Portal' tab
                                    4. Wait for the tab content to load
                                    5. Verify the 'Ticket Portal' tab is now visually active
                                    6. Verify 'Student Ticket Submission Portal' heading is visible""",
                            """
                                    Clicking 'Ticket Portal' tab should:
                                    - Activate it visually in the sidebar
                                    - Display the Ticket Portal content panel
                                    - Show 'Student Ticket Submission Portal' as the first heading""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_38 — Student Ticket Submission Portal heading and description visible
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_38",
                            "Verify 'Student Ticket Submission Portal' heading and description are visible on Ticket Portal tab",
                            """
                                    1. Complete TC_PM_37 (Ticket Portal tab is active)
                                    2. Verify the heading 'Student Ticket Submission Portal' is visible
                                    3. Verify the description text below is visible and contains:
                                       'Configure how students can submit support tickets - online forms,
                                        offline centers, or both'""",
                            """
                                    Ticket Portal tab must show:
                                    - Heading: 'Student Ticket Submission Portal'
                                    - Description explaining online forms, offline centers, or both options""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_39 — Ticket Submission Mode — all three radio buttons visible
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_39",
                            "Verify all three 'Ticket Submission Mode' radio options are visible on the Ticket Portal tab",
                            """
                                    1. Complete TC_PM_37 (Ticket Portal tab is active)
                                    2. Locate the 'Ticket Submission Mode' section heading
                                    3. Verify the following three radio button options are visible:
                                       a. 'Online Only' — with description 'Students can only submit tickets through online forms'
                                       b. 'Offline Only' — with description 'Students can only visit offline support centers'
                                       c. 'Both Online & Offline' — with description 'Students can choose between online forms or visiting centers'""",
                            """
                                    All three Ticket Submission Mode options must be visible:
                                    - Online Only
                                    - Offline Only
                                    - Both Online & Offline
                                    Each option should have a description below its label.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_40 — 'Both Online & Offline' is selected by default
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_40",
                            "Verify 'Both Online & Offline' is the default selected Ticket Submission Mode",
                            """
                                    1. Complete TC_PM_37 (Ticket Portal tab is active)
                                    2. Locate the Ticket Submission Mode radio group
                                    3. Check which radio button is selected
                                    4. Verify 'Both Online & Offline' is the selected option by default""",
                            """
                                    'Both Online & Offline' radio button must be selected by default.
                                    Neither 'Online Only' nor 'Offline Only' should be pre-selected.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_41 — Knowledge Base section visible with checkbox checked by default
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_41",
                            "Verify 'Knowledge Base' section and checkbox are visible; checkbox is checked by default",
                            """
                                    1. Complete TC_PM_37 (Ticket Portal tab is active)
                                    2. Scroll down to the 'Knowledge Base' section
                                    3. Verify the 'Knowledge Base' section heading is visible
                                    4. Verify the description text is visible (mentions 'Knowledge Base tab' on submit page)
                                    5. Verify the checkbox 'Show Knowledge Base tab on submit page' is visible
                                    6. Verify the checkbox is checked (enabled) by default
                                    7. Verify the checkbox description text is visible""",
                            """
                                    Knowledge Base section must show:
                                    - Section heading: 'Knowledge Base'
                                    - Description about the Knowledge Base tab on the submit page
                                    - Checkbox: 'Show Knowledge Base tab on submit page' (checked by default)""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_42 — Announcement Banner section visible in Ticket Portal tab
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_42",
                            "Verify 'Announcement Banner' section heading, description, and textarea are visible on Ticket Portal tab",
                            """
                                    1. Complete TC_PM_37 (Ticket Portal tab is active)
                                    2. Scroll down to the 'Announcement Banner' section
                                    3. Verify the heading 'Announcement Banner' is visible
                                    4. Verify the description below the heading is visible and contains:
                                       'Display an important message at the top of the ticket submission portal'
                                    5. Verify the textarea for the announcement is visible
                                    6. Verify the placeholder text in the textarea is visible
                                       (e.g., 'e.g., Our support team is available Monday-Friday...')""",
                            """
                                    Announcement Banner section must show on Ticket Portal tab:
                                    - Heading: 'Announcement Banner'
                                    - Description about displaying a message at the top of the portal
                                    - Empty textarea with placeholder text visible""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_43 — Ticket Assignment section and dropdown visible with default value
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_43",
                            "Verify 'Ticket Assignment' section and Assignment Method dropdown are visible with default value",
                            """
                                    1. Complete TC_PM_37 (Ticket Portal tab is active)
                                    2. Scroll down to the 'Ticket Assignment' section
                                    3. Verify the 'Ticket Assignment' heading is visible
                                    4. Verify the description 'Configure how tickets should be assigned to agents in your project' is visible
                                    5. Verify the 'Assignment Method' label is visible
                                    6. Verify the dropdown is visible
                                    7. Verify the default dropdown value is 'Manual Assignment (No auto-assignment)'
                                    8. Verify the info message about manual assignment is visible below the dropdown""",
                            """
                                    Ticket Assignment section must show:
                                    - Heading: 'Ticket Assignment'
                                    - 'Assignment Method' dropdown visible
                                    - Default value: 'Manual Assignment (No auto-assignment)'
                                    - Info message: 'Tickets will not be automatically assigned...'""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_44 — Manual assignment role info banner visible
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_44",
                            "Verify the info banner about manual assignment role selection is visible on Ticket Portal tab",
                            """
                                    1. Complete TC_PM_37 (Ticket Portal tab is active)
                                    2. Scroll to the Ticket Assignment section
                                    3. With 'Manual Assignment' selected in the dropdown
                                    4. Verify the info/warning banner is visible
                                    5. Verify it contains:
                                       'Manual assignment role selection will be available after you
                                        create the project and map roles to it'""",
                            """
                                    An info banner must be visible below the Assignment Method dropdown
                                    when 'Manual Assignment' is selected.
                                    It should inform the user that role mapping is required after project creation.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_45 — Portal Messages section and Welcome Message textarea visible
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_45",
                            "Verify 'Portal Messages' section and 'Welcome Message' textarea are visible with pre-filled text",
                            """
                                    1. Complete TC_PM_37 (Ticket Portal tab is active)
                                    2. Scroll down to the 'Portal Messages' section
                                    3. Verify the 'Portal Messages' heading is visible
                                    4. Verify the 'Welcome Message' sub-label is visible
                                    5. Verify the Welcome Message textarea is visible
                                    6. Verify the textarea contains a default pre-filled message:
                                       'Welcome! Submit your query below and our team will assist you.'""",
                            """
                                    Portal Messages section must show:
                                    - Heading: 'Portal Messages'
                                    - Sub-label: 'Welcome Message'
                                    - Textarea with default text:
                                      'Welcome! Submit your query below and our team will assist you.'""",
                            "",
                            ""
                    },

                    // ==================================================================
                    // ==================== CUSTOMIZATION TAB ===========================
                    // ==================================================================

                    // ------------------------------------------------------------------
                    // TC_PM_46 — Click Customization tab and verify it becomes active
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_46",
                            "Verify clicking 'Customization' tab switches to the Customization content panel",
                            """
                                    1. Complete TC_PM_10 (modal is open)
                                    2. Locate the 'Customization' tab in the modal left sidebar
                                    3. Click on the 'Customization' tab
                                    4. Wait for the tab content to load
                                    5. Verify the 'Customization' tab is now visually active (highlighted)
                                    6. Verify 'Login Page' section heading is visible in the content area""",
                            """
                                    Clicking 'Customization' tab should:
                                    - Activate it visually in the sidebar
                                    - Display the Customization content panel
                                    - Show the 'Login Page' section""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_47 — Login Page Background Image upload button visible
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_47",
                            "Verify 'Login Page' section and 'Upload Image' button are visible on the Customization tab",
                            """
                                    1. Complete TC_PM_46 (Customization tab is active)
                                    2. Verify the 'Login Page' section heading is visible
                                    3. Verify the sub-label 'Background Image' is visible
                                    4. Verify the size hint text is visible:
                                       'Maximum file size: 2MB' and 'Best dimensions: 1920 × 1080 pixels'
                                    5. Verify the 'Upload Image' button is visible and enabled""",
                            """
                                    Customization tab - Login Page section must show:
                                    - Heading: 'Login Page'
                                    - Sub-label: 'Background Image'
                                    - Size hints: 'Maximum file size: 2MB' and 'Best dimensions: 1920 × 1080 pixels'
                                    - 'Upload Image' button visible and clickable""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_48 — Theme Customization — Light and Dark radio buttons visible; Light
                    // selected by default
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_48",
                            "Verify 'Theme Customization' section — Light and Dark radio buttons are visible; Light is selected by default",
                            """
                                    1. Complete TC_PM_46 (Customization tab is active)
                                    2. Locate the 'Theme Customization' section heading
                                    3. Verify the 'Theme Customization' heading is visible
                                    4. Verify the 'Light' radio button is visible
                                    5. Verify the 'Dark' radio button is visible
                                    6. Verify 'Light' is selected (active) by default""",
                            """
                                    Theme Customization section must show:
                                    - Heading: 'Theme Customization'
                                    - 'Light' radio button (selected by default)
                                    - 'Dark' radio button (unselected by default)""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_49 — Theme Color palette (color swatches) visible
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_49",
                            "Verify 'Theme Color' palette with color swatches is visible on the Customization tab",
                            """
                                    1. Complete TC_PM_46 (Customization tab is active)
                                    2. Locate the 'Theme Color' label in the Theme Customization section
                                    3. Verify the 'Theme Color' label is visible
                                    4. Verify the description 'Select a color for the overall theme of the customer portal.' is visible
                                    5. Verify the color swatch palette is visible (row of colored circles/squares)
                                    6. Verify at least 8 color swatches are displayed""",
                            """
                                    Theme Color section must show:
                                    - Label: 'Theme Color'
                                    - Description about customer portal theme color
                                    - Color swatch palette with at least 8 color options visible""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_50 — Theme Color hex input field visible with default hex value
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_50",
                            "Verify Theme Color hex input field is visible and contains a default hex color value",
                            """
                                    1. Complete TC_PM_46 (Customization tab is active)
                                    2. Locate the hex color input field below the color swatches
                                    3. Verify the hex color input field is visible
                                    4. Verify the color preview box (solid colored square) next to the input is visible
                                    5. Verify the input field contains a default hex color value (e.g., '#444ce7')
                                    6. Verify the value starts with '#' and is a valid 7-character hex code""",
                            """
                                    Theme Color hex input field must be visible.
                                    It should contain a default hex color value starting with '#'
                                    (default is '#444ce7' — the brand blue/purple color).
                                    A color preview swatch must appear beside the input.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_51 — Advanced Customization section visible on Customization tab
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_51",
                            "Verify 'Advanced Customization' section is visible on the Customization tab",
                            """
                                    1. Complete TC_PM_46 (Customization tab is active)
                                    2. Scroll down past Theme Customization
                                    3. Verify the 'Advanced Customization' section heading is visible
                                    4. Verify there is a content area (banner/panel) under Advanced Customization""",
                            """
                                    'Advanced Customization' section heading must be visible
                                    on the Customization tab when scrolling down.
                                    The section should have content/options below the heading.""",
                            "",
                            ""
                    },

                    // ==================================================================
                    // ==================== LOGIN TAB — INTERACTIONS ====================
                    // ==================================================================

                    // ------------------------------------------------------------------
                    // TC_PM_52 — Uncheck and re-check "Enable Form Login" checkbox
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_52",
                            "Uncheck 'Enable Form Login' checkbox and verify it is unchecked; then re-check it and verify it is checked",
                            """
                                    1. Complete TC_PM_24 (Login tab is active)
                                    2. Locate the 'Enable Form Login' checkbox (should be checked by default)
                                    3. Click the checkbox to uncheck it
                                    4. Verify the checkbox is now unchecked
                                    5. Click the checkbox again to re-check it
                                    6. Verify the checkbox is checked again""",
                            """
                                    Step 3–4: After unchecking → checkbox must be visually unchecked.
                                    Step 5–6: After re-checking → checkbox must be visually checked.
                                    The checkbox toggle must work correctly in both directions.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_53 — Uncheck and re-check "Enable Google reCAPTCHA" checkbox
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_53",
                            "Uncheck 'Enable Google reCAPTCHA' checkbox and verify it is unchecked; then re-check it and verify it is checked",
                            """
                                    1. Complete TC_PM_24 (Login tab is active)
                                    2. Locate the 'Enable Google reCAPTCHA' checkbox (should be checked by default)
                                    3. Click the checkbox to uncheck it
                                    4. Verify the checkbox is now unchecked
                                    5. Click the checkbox again to re-check it
                                    6. Verify the checkbox is checked again""",
                            """
                                    Step 3–4: After unchecking → Google reCAPTCHA checkbox must be unchecked.
                                    Step 5–6: After re-checking → checkbox must be checked again.
                                    Both Form Login and Google reCAPTCHA checkboxes should end up CHECKED
                                    (as they will be submitted in this state).""",
                            "",
                            ""
                    },

                    // ==================================================================
                    // ==================== SECURITY TAB — INTERACTIONS =================
                    // ==================================================================

                    // ------------------------------------------------------------------
                    // TC_PM_54 — Check the "Enforce 2FA" checkbox on Security tab
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_54",
                            "Check 'Enforce two-factor authentication (2FA) for all users' checkbox and verify it is checked",
                            """
                                    1. Complete TC_PM_30 (Security tab is active)
                                    2. Locate 'Enforce two-factor authentication (2FA) for all users' checkbox
                                    3. Verify it is unchecked by default
                                    4. Click the checkbox to check it
                                    5. Verify the checkbox is now checked (enabled)""",
                            """
                                    Checkbox must transition from UNCHECKED → CHECKED after clicking.
                                    The 2FA enforcement checkbox must be interactive and respond to click.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_55 — Select Custom Policy and check all 4 password requirement
                    // checkboxes
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_55",
                            "Click 'Custom Policy' radio and check all four password requirement checkboxes on the Security tab",
                            """
                                    1. Complete TC_PM_30 (Security tab is active)
                                    2. Click on 'Custom Policy' radio button (already default — click to confirm)
                                    3. Verify 'Custom Policy' is selected
                                    4. Locate the four password requirement checkboxes
                                    5. Click checkbox: 'Require at least one lower case letter (a-z).'
                                    6. Verify it is checked
                                    7. Click checkbox: 'Require at least one upper case letter (A-Z).'
                                    8. Verify it is checked
                                    9. Click checkbox: 'Require at least one number (0-9).'
                                    10. Verify it is checked
                                    11. Click checkbox: 'Require at least one special character.'
                                    12. Verify it is checked
                                    13. Verify all four checkboxes are checked""",
                            """
                                    After completing all steps:
                                    - 'Custom Policy' radio must be selected
                                    - All four password requirement checkboxes must be CHECKED:
                                      ✓ Lowercase letter
                                      ✓ Uppercase letter
                                      ✓ Number
                                      ✓ Special character""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_56 — Change minimum password length dropdown from 8 to 12
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_56",
                            "Change 'Minimum password length' dropdown value from 8 to 12 and verify the change",
                            """
                                    1. Complete TC_PM_30 (Security tab is active; Custom Policy selected)
                                    2. Locate the 'Minimum password length' dropdown (default: 8)
                                    3. Click the dropdown to open it
                                    4. Select the value '12' from the dropdown options
                                    5. Verify the dropdown now shows '12' as the selected value""",
                            """
                                    'Minimum password length' dropdown must update from '8' to '12'.
                                    The dropdown options must include '12' as a selectable value.""",
                            "",
                            ""
                    },

                    // ==================================================================
                    // ==================== TICKET PORTAL TAB — INTERACTIONS ============
                    // ==================================================================

                    // ------------------------------------------------------------------
                    // TC_PM_57 — Select "Online Only" then revert to "Both Online & Offline"
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_57",
                            "Select 'Online Only' Ticket Submission Mode, verify selection, then revert to 'Both Online & Offline'",
                            """
                                    1. Complete TC_PM_37 (Ticket Portal tab is active)
                                    2. Locate the Ticket Submission Mode radio group
                                    3. Click on 'Online Only' radio button
                                    4. Verify 'Online Only' is now selected
                                    5. Click on 'Both Online & Offline' radio button
                                    6. Verify 'Both Online & Offline' is now selected again""",
                            """
                                    Step 3–4: 'Online Only' must be selected after clicking it.
                                    Step 5–6: 'Both Online & Offline' must be re-selected correctly.
                                    Final state: 'Both Online & Offline' is the selected mode
                                    (as required for the final Update Project submission).""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_58 — Enter text in Announcement Banner textarea
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_58",
                            "Enter announcement text in the 'Announcement Banner' textarea on the Ticket Portal tab",
                            """
                                    1. Complete TC_PM_37 (Ticket Portal tab is active)
                                    2. Locate the 'Announcement Banner' textarea
                                    3. Click on the textarea to focus it
                                    4. Type the following text:
                                       'Our support team is available Monday-Friday, 9 AM - 6 PM IST. For urgent issues, please call our helpline.'
                                    5. Verify the entered text is visible in the textarea""",
                            """
                                    Textarea must accept and display the entered text:
                                    'Our support team is available Monday-Friday, 9 AM - 6 PM IST.
                                    For urgent issues, please call our helpline.'""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_59 — Change Ticket Assignment Method dropdown value
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_59",
                            "Change 'Assignment Method' dropdown to 'Auto Assignment (Round Robin)' and verify the change",
                            """
                                    1. Complete TC_PM_37 (Ticket Portal tab is active)
                                    2. Locate the 'Assignment Method' dropdown (default: 'Manual Assignment (No auto-assignment)')
                                    3. Click the dropdown to open it
                                    4. Select 'Auto Assignment (Round Robin)' or the next available option
                                    5. Verify the dropdown value has changed from the default
                                    6. Verify any additional options/settings revealed by this selection are visible""",
                            """
                                    'Assignment Method' dropdown must update from 'Manual Assignment' to
                                    the selected auto-assignment option.
                                    Any newly visible configuration options must appear in the UI.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_60 — Edit Welcome Message textarea
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_60",
                            "Clear and re-enter a custom Welcome Message in the Portal Messages section",
                            """
                                    1. Complete TC_PM_37 (Ticket Portal tab is active)
                                    2. Locate the 'Welcome Message' textarea in the Portal Messages section
                                    3. Clear the existing text
                                    4. Type new custom message:
                                       'Welcome to HubbleHox Support! Please describe your issue and our team will respond within 24 hours.'
                                    5. Verify the new text is visible in the textarea""",
                            """
                                    The Welcome Message textarea must:
                                    - Accept clearing of the existing default text
                                    - Display the new custom message:
                                      'Welcome to HubbleHox Support! Please describe your issue
                                       and our team will respond within 24 hours.'""",
                            "",
                            ""
                    },

                    // ==================================================================
                    // ==================== CUSTOMIZATION TAB — INTERACTIONS ============
                    // ==================================================================

                    // ------------------------------------------------------------------
                    // TC_PM_61 — Switch to Dark theme and verify; revert to Light
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_61",
                            "Select 'Dark' theme radio in Theme Customization and verify; then revert to 'Light' theme",
                            """
                                    1. Complete TC_PM_46 (Customization tab is active)
                                    2. Locate the Theme Customization section
                                    3. Click on 'Dark' radio button
                                    4. Verify 'Dark' is now selected (and 'Light' is deselected)
                                    5. Click on 'Light' radio button to revert
                                    6. Verify 'Light' is selected again""",
                            """
                                    Step 3–4: 'Dark' radio must be selected after clicking.
                                    Step 5–6: 'Light' radio must be re-selected.
                                    Final state: 'Light' theme is selected
                                    (for consistency with the Update Project submission).""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_62 — Click a different color swatch and verify hex input updates
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_62",
                            "Click a different color swatch in Theme Color palette and verify the hex input field updates",
                            """
                                    1. Complete TC_PM_46 (Customization tab is active)
                                    2. Note the current hex color value in the input (default: '#444ce7')
                                    3. Click on the second color swatch in the palette
                                    4. Verify the hex input field value changes to reflect the new color
                                    5. Verify the color preview box updates to show the new color
                                    6. Verify the new hex value is different from '#444ce7'""",
                            """
                                    After clicking a different color swatch:
                                    - Hex input field must update to the new color code
                                    - Color preview box must reflect the selected swatch color
                                    - The hex value must differ from the default '#444ce7'""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_63 — Enter a custom hex color value directly in the hex input
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_63",
                            "Enter a custom hex color value '#1E90FF' directly in the Theme Color hex input and verify preview updates",
                            """
                                    1. Complete TC_PM_46 (Customization tab is active)
                                    2. Locate the hex color input field
                                    3. Click on the input field and clear it
                                    4. Type '#1E90FF' (Dodger Blue)
                                    5. Press Tab or click outside to trigger the update
                                    6. Verify the hex input shows '#1E90FF'
                                    7. Verify the color preview box updates to Dodger Blue""",
                            """
                                    After entering '#1E90FF':
                                    - Hex input must display '#1E90FF'
                                    - Color preview box must update to the blue (#1E90FF) color
                                    The hex input must accept direct text entry and reflect
                                    the change in the preview swatch.""",
                            "",
                            ""
                    },

                    // ==================================================================
                    // ==================== UPDATE PROJECT AND VERIFY ===================
                    // ==================================================================

                    // ------------------------------------------------------------------
                    // TC_PM_64 — Click "Update Project" button and verify success notification
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_64",
                            "Click 'Update Project' button and verify a success notification is displayed",
                            """
                                    1. Ensure all previous tab interactions (TC_PM_52–TC_PM_63) have been completed
                                       (Login, Security, Ticket Portal, and Customization tabs all filled/updated)
                                    2. Scroll to the bottom of the modal
                                    3. Locate the 'Update Project' button in the modal footer
                                    4. Click the 'Update Project' button
                                    5. Wait for the response (up to 10 seconds)
                                    6. Verify a success toast/notification appears on screen
                                    7. Verify the notification contains a success message
                                       (e.g., 'Project updated successfully' or similar)
                                    8. Verify the modal closes after the update is complete""",
                            """
                                    After clicking 'Update Project':
                                    - A success toast/notification must appear
                                    - The notification must indicate the project was updated successfully
                                    - The modal should close automatically upon success""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_PM_65 — Verify updated project is visible in the project listing table
                    // ------------------------------------------------------------------
                    {
                            "TC_PM_65",
                            "Verify the updated project is visible in the project listing table after clicking 'Update Project'",
                            """
                                    1. Complete TC_PM_64 (Update Project clicked, modal closed)
                                    2. Verify the project listing page is visible (modal is closed)
                                    3. Verify the project table is displayed with column headers:
                                       PROJECT ID | NAME | CODE | USERS | STATUS | CREATED | ACTIONS
                                    4. Locate the first row in the project table
                                    5. Verify the first row shows a project entry (PROJECT ID, NAME, STATUS)
                                    6. Verify the project that was updated is visible in the table
                                    7. Verify the project STATUS shows 'Active'
                                    8. Verify the Edit and Delete action buttons are visible for the project""",
                            """
                                    After the update:
                                    - Project listing table must be visible
                                    - The updated project must appear in the table
                                    - First row in the table must contain valid project data
                                    - STATUS column must show 'Active'
                                    - Edit and Delete buttons must be visible in the ACTIONS column""",
                            "",
                            ""
                    }
            };

            CellStyle dataStyle = createDataStyle(workbook);
            CellStyle wrapStyle = createWrapStyle(workbook);

            for (int i = 0; i < testCases.length; i++) {
                Row row = sheet.createRow(i + 1);
                row.setHeightInPoints(110);
                for (int j = 0; j < testCases[i].length; j++) {
                    Cell cell = row.createCell(j);
                    cell.setCellValue(testCases[i][j]);
                    cell.setCellStyle(j == 2 ? wrapStyle : dataStyle);
                }
            }

            try (FileOutputStream fos = new FileOutputStream("testresults/Project_Management.xlsx")) {
                workbook.write(fos);
            }
        }
    }

    // ==================== USER MANAGEMENT MODULE ====================
    public static void generateUserManagementResults() throws IOException {
        Files.createDirectories(Paths.get("testresults"));

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("User_Management");

            // -------------------- Header Row --------------------
            Row header = sheet.createRow(0);
            String[] headers = {
                    "Test Case ID",
                    "Test Case Description",
                    "Steps",
                    "Expected Result",
                    "Actual Result",
                    "Comments"
            };
            CellStyle headerStyle = createHeaderStyle(workbook);
            int[] colWidths = { 4500, 14000, 24000, 16000, 6000, 6000 };
            for (int i = 0; i < headers.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, colWidths[i]);
            }

            // -------------------- Test Case Rows --------------------
            String[][] testCases = {

                    // ==================================================================
                    // SECTION A — Login & Navigation
                    // ==================================================================

                    // ------------------------------------------------------------------
                    // TC_UM_01 — Super Admin login
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_01",
                            "Verify Super Admin can login and is redirected away from login page",
                            """
                                    1. Launch browser (Chrome)
                                    2. Navigate to: http://helpdesksupport365.com/
                                    3. Wait for Login page to load
                                    4. Enter Super Admin email: niraj.mishra@hubblehox.com
                                    5. Enter Super Admin password: admin@12345
                                    6. Click the Login button
                                    7. Wait for redirect
                                    8. Verify the current URL does NOT contain /login""",
                            """
                                    Super Admin login should succeed.
                                    Browser should redirect away from the login page.
                                    URL should NOT contain /login after successful login.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_02 — Navigate to User Management via sidebar
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_02",
                            "Verify 'User Management' menu item is visible in the sidebar and navigates to /users",
                            """
                                    1. Complete TC_UM_01 (Super Admin logged in)
                                    2. Look for 'User Management' in the left sidebar navigation
                                    3. Verify it is visible
                                    4. Click on 'User Management'
                                    5. Wait for the page to load
                                    6. Verify the current URL contains /users""",
                            """
                                    'User Management' should be visible in the sidebar.
                                    Clicking it should navigate to /users page without errors.""",
                            "",
                            ""
                    },

                    // ==================================================================
                    // SECTION B — Landing Page Verification
                    // ==================================================================

                    // ------------------------------------------------------------------
                    // TC_UM_03 — Page heading
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_03",
                            "Verify page heading reads 'User Management'",
                            """
                                    1. Complete TC_UM_02 (on /users page)
                                    2. Observe the main page heading at the top of the content area""",
                            "Page heading must read exactly: 'User Management'",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_04 — Page subtitle
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_04",
                            "Verify page subtitle reads 'Manage system users and their access'",
                            """
                                    1. Complete TC_UM_02 (on /users page)
                                    2. Observe the subtitle text directly below the heading""",
                            "Subtitle must read: 'Manage system users and their access'",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_05 — Four stats cards visible
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_05",
                            "Verify four stats cards are visible: Total Users, Active, Inactive, Projects",
                            """
                                    1. Complete TC_UM_02 (on /users page)
                                    2. Observe the stats row at the top of the page
                                    3. Verify card: 'Total Users' with numeric count
                                    4. Verify card: 'Active' with numeric count
                                    5. Verify card: 'Inactive' with numeric count
                                    6. Verify card: 'Projects' with numeric count""",
                            """
                                    All four stats cards must be visible with numeric values:
                                    Total Users, Active, Inactive, Projects.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_06 — Search input visible
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_06",
                            "Verify Search input field is visible with placeholder 'Search users...'",
                            """
                                    1. Complete TC_UM_02 (on /users page)
                                    2. Locate the search input in the filter/toolbar area
                                    3. Verify the placeholder text reads 'Search users...'""",
                            "Search input field is visible; placeholder: 'Search users...'",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_07 — Role filter dropdown visible
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_07",
                            "Verify Role filter dropdown is visible with default value 'All Roles'",
                            """
                                    1. Complete TC_UM_02 (on /users page)
                                    2. Locate the Role filter dropdown in the toolbar
                                    3. Verify its default displayed value is 'All Roles'""",
                            "Role filter dropdown visible; default value: 'All Roles'",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_08 — Status filter dropdown visible
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_08",
                            "Verify Status filter dropdown is visible with default value 'All Status'",
                            """
                                    1. Complete TC_UM_02 (on /users page)
                                    2. Locate the Status filter dropdown in the toolbar
                                    3. Verify its default displayed value is 'All Status'""",
                            "Status filter dropdown visible; default value: 'All Status'",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_09 — Add from HRMS button visible
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_09",
                            "Verify 'Add from HRMS' button is visible on the User Management page",
                            """
                                    1. Complete TC_UM_02 (on /users page)
                                    2. Observe the action buttons in the top-right area of the page
                                    3. Verify 'Add from HRMS' button is present and visible (green colour)""",
                            "'Add from HRMS' button is visible (green).",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_10 — Create User button visible
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_10",
                            "Verify 'Create User' button is visible on the User Management page",
                            """
                                    1. Complete TC_UM_02 (on /users page)
                                    2. Observe the action buttons in the top-right area of the page
                                    3. Verify 'Create User' button is present and visible (blue colour)""",
                            "'Create User' button is visible (blue).",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_11 — Users table is visible
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_11",
                            "Verify users table is visible on the landing page",
                            """
                                    1. Complete TC_UM_02 (on /users page)
                                    2. Scroll down to the table section
                                    3. Wait for any loading spinner to disappear
                                    4. Verify the table is rendered with data rows""",
                            "Users table is visible and loaded (may show spinner briefly then data).",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_12 — Table column headers
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_12",
                            "Verify users table has all required column headers: NAME, EMAIL, EMPLOYEE CODE, ROLE, PROJECTS, STATUS, ACTIONS",
                            """
                                    1. Complete TC_UM_02 (on /users page)
                                    2. Observe the table header row
                                    3. Verify the following columns exist in order:
                                       NAME | EMAIL | EMPLOYEE CODE | ROLE | PROJECTS | STATUS | ACTIONS""",
                            """
                                    All 7 column headers must be visible:
                                    NAME, EMAIL, EMPLOYEE CODE, ROLE, PROJECTS, STATUS, ACTIONS.""",
                            "",
                            ""
                    },

                    // ==================================================================
                    // SECTION C — Create User Modal: Open & Field Verification
                    // ==================================================================

                    // ------------------------------------------------------------------
                    // TC_UM_13 — Click Create User button — modal opens
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_13",
                            "Verify clicking 'Create User' button opens the Create User modal dialog",
                            """
                                    1. Complete TC_UM_02 (on /users page)
                                    2. Click the 'Create User' button
                                    3. Wait up to 10 seconds for the modal overlay to appear
                                    4. Verify the modal dialog is displayed (dark overlay, white card)""",
                            "Create User modal opens on screen with dark semi-transparent overlay background.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_14 — Modal title
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_14",
                            "Verify Create User modal title reads 'Create User'",
                            """
                                    1. Complete TC_UM_13 (modal is open)
                                    2. Read the modal header title text (h2 element)""",
                            "Modal title reads exactly: 'Create User'",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_15 — First Name field visible and required
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_15",
                            "Verify 'First Name' field is visible and marked as required (*) in the modal",
                            """
                                    1. Complete TC_UM_13 (modal is open)
                                    2. Locate the 'First Name' label in the form
                                    3. Verify a red asterisk (*) appears beside the label
                                    4. Verify a text input field is present below the label""",
                            "First Name text input is visible; label shows 'First Name *' (red asterisk).",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_16 — Last Name field visible and required
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_16",
                            "Verify 'Last Name' field is visible and marked as required (*) in the modal",
                            """
                                    1. Complete TC_UM_13 (modal is open)
                                    2. Locate the 'Last Name' label in the form
                                    3. Verify a red asterisk (*) appears beside the label
                                    4. Verify a text input field is present below the label""",
                            "Last Name text input is visible; label shows 'Last Name *' (red asterisk).",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_17 — Email field visible and required
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_17",
                            "Verify 'Email' field is visible and marked as required (*) in the modal",
                            """
                                    1. Complete TC_UM_13 (modal is open)
                                    2. Locate the 'Email' label in the form
                                    3. Verify a red asterisk (*) appears beside the label
                                    4. Verify an email-type input field is present below the label""",
                            "Email input is visible; label shows 'Email *' (red asterisk).",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_18 — Mobile field visible (optional) with hint
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_18",
                            "Verify 'Mobile' field is visible (optional) with placeholder and hint text",
                            """
                                    1. Complete TC_UM_13 (modal is open)
                                    2. Locate the 'Mobile' label (no asterisk — optional field)
                                    3. Verify the tel-type input is visible
                                    4. Verify placeholder: '10-digit number (starts with 6-9)'
                                    5. Verify hint text below field: 'Example: 9876543210'""",
                            """
                                    Mobile tel input visible; no asterisk (optional).
                                    Placeholder: '10-digit number (starts with 6-9)'
                                    Hint: 'Example: 9876543210'""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_19 — Employee Code field visible (optional)
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_19",
                            "Verify 'Employee Code' field is visible (optional) in the modal",
                            """
                                    1. Complete TC_UM_13 (modal is open)
                                    2. Locate the 'Employee Code' label (no asterisk — optional field)
                                    3. Verify a text input is present below the label""",
                            "Employee Code text input is visible; no asterisk (optional field).",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_20 — Joining Date field visible (optional)
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_20",
                            "Verify 'Joining Date' field is visible (optional) as a date picker in the modal",
                            """
                                    1. Complete TC_UM_13 (modal is open)
                                    2. Locate the 'Joining Date' label (no asterisk)
                                    3. Verify a date-type input control is visible below the label""",
                            "Joining Date date input visible; no asterisk (optional field).",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_21 — Password field visible and required (new user only)
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_21",
                            "Verify 'Password' field is visible and required (*) for a new user, with minimum-length hint",
                            """
                                    1. Complete TC_UM_13 (modal is open for a NEW user — not editing)
                                    2. Locate the 'Password' label in the form
                                    3. Verify a red asterisk (*) appears beside the label
                                    4. Verify the field type is 'password' (masked input)
                                    5. Verify placeholder: 'Minimum 8 characters'
                                    6. Verify hint text below: 'Must be at least 8 characters long'""",
                            """
                                    Password field visible; 'Password *' label shown.
                                    Field type = password (masked).
                                    Placeholder: 'Minimum 8 characters'
                                    Hint: 'Must be at least 8 characters long'""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_22 — Role dropdown visible and required
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_22",
                            "Verify 'Role' dropdown is visible, marked as required (*), and shows default 'Select Role' option",
                            """
                                    1. Complete TC_UM_13 (modal is open)
                                    2. Locate the 'Role' label (asterisk present)
                                    3. Verify a select/dropdown is visible below the label
                                    4. Verify the default selected option is 'Select Role'""",
                            "Role dropdown visible; 'Role *'; default option: 'Select Role'.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_23 — Department field visible (optional)
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_23",
                            "Verify 'Department' field is visible (optional) in the modal",
                            """
                                    1. Complete TC_UM_13 (modal is open)
                                    2. Locate the 'Department' label (no asterisk)
                                    3. Verify a text input is present below the label""",
                            "Department text input visible; no asterisk (optional).",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_24 — Designation field visible (optional)
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_24",
                            "Verify 'Designation' field is visible (optional) in the modal",
                            """
                                    1. Complete TC_UM_13 (modal is open)
                                    2. Locate the 'Designation' label (no asterisk)
                                    3. Verify a text input is present below the label""",
                            "Designation text input visible; no asterisk (optional).",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_25 — Reporting Manager dropdown visible (optional)
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_25",
                            "Verify 'Reporting Manager' dropdown is visible with default 'Select Reporting Manager'",
                            """
                                    1. Complete TC_UM_13 (modal is open)
                                    2. Locate the 'Reporting Manager' label (no asterisk)
                                    3. Verify a select/dropdown is visible
                                    4. Verify default option is 'Select Reporting Manager'""",
                            "Reporting Manager select visible; no asterisk; default: 'Select Reporting Manager'.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_26 — Assigned Projects section visible with checkboxes
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_26",
                            "Verify 'Assigned Projects' section is visible with a scrollable checkbox list",
                            """
                                    1. Complete TC_UM_13 (modal is open)
                                    2. Scroll down to the 'Assigned Projects' label
                                    3. Verify a scrollable bordered container is shown below the label
                                    4. Verify the container shows one or more project checkboxes""",
                            """
                                    'Assigned Projects' section visible.
                                    Scrollable list of project checkboxes shown below the label.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_27 — PM-created project in Assigned Projects list
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_27",
                            "Verify the project created during PM automation (AutoTest[RUN_ID]) appears in the Assigned Projects list",
                            """
                                    1. Complete TC_UM_13 (modal is open)
                                    2. Scroll through the 'Assigned Projects' checkbox list
                                    3. Locate the project named 'AutoTest[RUN_ID]'
                                       (created by ProjectManagementTest — name stored in SharedTestState.PROJECT_NAME)
                                    4. Verify the checkbox for this project is visible and unchecked""",
                            """
                                    Project 'AutoTest[RUN_ID]' is listed in the Assigned Projects section.
                                    Its checkbox is visible and in an unchecked state initially.
                                    [Test Data — Project Name]: AutoTest + RUN_ID (from PM automation run)""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_28 — Create User button disabled when required fields empty
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_28",
                            "Verify 'Create User' submit button is disabled (grey) when required fields are empty",
                            """
                                    1. Complete TC_UM_13 (modal is open; all fields empty)
                                    2. Observe the 'Create User' button in the modal footer
                                    3. Check the button's disabled attribute or background colour (grey means disabled)""",
                            """
                                    'Create User' button is disabled (grey background, cursor not-allowed).
                                    Form cannot be submitted when required fields are empty.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_29 — Cancel button closes modal
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_29",
                            "Verify clicking 'Cancel' button closes the modal without submitting data",
                            """
                                    1. Complete TC_UM_13 (modal is open)
                                    2. Click the 'Cancel' button in the modal footer
                                    3. Wait for the modal to disappear
                                    4. Verify the landing page (users table) is now visible""",
                            "Create User modal closes. Landing page visible. No data submitted.",
                            "",
                            ""
                    },

                    // ==================================================================
                    // SECTION D — Negative / Validation Tests
                    // ==================================================================

                    // ------------------------------------------------------------------
                    // TC_UM_30 — All fields empty — required field alert
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_30",
                            "[NEG] Submitting form with all fields empty should show 'Please fill all required fields' alert",
                            """
                                    1. Open Create User modal (click 'Create User' button)
                                    2. Leave all fields empty
                                    3. If 'Create User' button is enabled, click it
                                    4. Observe the browser alert dialog
                                    5. Accept the alert""",
                            "Browser alert shown: 'Please fill all required fields'",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_31 — Missing First Name — alert
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_31",
                            "[NEG] Submit without First Name — required field validation alert",
                            """
                                    1. Open Create User modal
                                    2. Fill: Last Name, Email, Password (>=8 chars), Role
                                    3. Leave First Name empty
                                    4. Click 'Create User'
                                    5. Observe alert""",
                            "Browser alert: 'Please fill all required fields'",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_32 — Missing Last Name — alert
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_32",
                            "[NEG] Submit without Last Name — required field validation alert",
                            """
                                    1. Open Create User modal
                                    2. Fill: First Name, Email, Password (>=8 chars), Role
                                    3. Leave Last Name empty
                                    4. Click 'Create User'
                                    5. Observe alert""",
                            "Browser alert: 'Please fill all required fields'",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_33 — Missing Email — alert
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_33",
                            "[NEG] Submit without Email — required field validation alert",
                            """
                                    1. Open Create User modal
                                    2. Fill: First Name, Last Name, Password (>=8 chars), Role
                                    3. Leave Email empty
                                    4. Click 'Create User'
                                    5. Observe alert""",
                            "Browser alert: 'Please fill all required fields'",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_34 — Missing Password (new user) — alert
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_34",
                            "[NEG] Submit without Password (new user) — 'Password is required' alert",
                            """
                                    1. Open Create User modal
                                    2. Fill: First Name, Last Name, Email, Role
                                    3. Leave Password empty
                                    4. Click 'Create User'
                                    5. Observe alert""",
                            "Browser alert: 'Password is required for new users'",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_35 — Role not selected — button stays disabled
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_35",
                            "[NEG] No Role selected — 'Create User' button remains disabled",
                            """
                                    1. Open Create User modal
                                    2. Fill: First Name, Last Name, Email, Password (>=8 chars)
                                    3. Leave Role as default 'Select Role' (no selection)
                                    4. Observe 'Create User' button state""",
                            """
                                    'Create User' button stays disabled (grey).
                                    The button cannot be clicked to submit because Role is required
                                    and the button is disabled when Role is empty.""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_36 — Mobile less than 10 digits — HTML5 validation
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_36",
                            "[NEG] Mobile with less than 10 digits should fail HTML5 pattern validation",
                            """
                                    1. Open Create User modal
                                    2. Click on the Mobile field
                                    3. Enter '98765' (only 5 digits — less than required 10)
                                    4. Tab to next field or attempt form submission
                                    5. Observe browser HTML5 validation tooltip""",
                            """
                                    HTML5 pattern validation triggers.
                                    Browser shows a validation tooltip.
                                    Form submission is prevented.
                                    [Test Data — Mobile]: 98765 (invalid — only 5 digits)""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_37 — Mobile not starting with 6-9 — HTML5 validation
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_37",
                            "[NEG] Mobile number not starting with 6-9 should fail HTML5 pattern validation",
                            """
                                    1. Open Create User modal
                                    2. Click on the Mobile field
                                    3. Enter '1234567890' (10 digits but starts with 1 — invalid)
                                    4. Attempt form submission
                                    5. Observe browser HTML5 validation tooltip""",
                            """
                                    HTML5 pattern [6-9][0-9]{9} validation rejects the value.
                                    Browser shows a validation tooltip indicating invalid format.
                                    [Test Data — Mobile]: 1234567890 (invalid — starts with 1)""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_38 — Password less than 8 characters — HTML5 minLength validation
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_38",
                            "[NEG] Password less than 8 characters should fail HTML5 minLength validation",
                            """
                                    1. Open Create User modal
                                    2. Fill First Name, Last Name, Email, Role (required fields)
                                    3. Enter password: 'abc' (only 3 characters)
                                    4. Click 'Create User' button
                                    5. Observe HTML5 minLength browser validation tooltip""",
                            """
                                    HTML5 minLength=8 validation rejects the short password.
                                    Browser shows: 'Please lengthen this text to 8 characters or more'.
                                    [Test Data — Password]: 'abc' (3 chars — invalid)""",
                            "",
                            ""
                    },

                    // ==================================================================
                    // SECTION E — Positive Flow: Fill and Create User
                    // ==================================================================

                    // ------------------------------------------------------------------
                    // TC_UM_39 — Reopen modal for positive creation flow
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_39",
                            "Reopen Create User modal to begin the positive user-creation flow",
                            """
                                    1. Ensure you are on the /users page
                                    2. Click the 'Create User' button
                                    3. Wait for the modal to open
                                    4. Verify modal title is 'Create User'""",
                            "Create User modal opens and is ready for data entry.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_40 — Enter First Name
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_40",
                            "Enter a unique First Name in the modal (Auto + RUN_ID)",
                            """
                                    1. Complete TC_UM_39 (modal is open)
                                    2. Click on the 'First Name' input field
                                    3. Clear any existing content (Ctrl+A → Delete)
                                    4. Type the First Name value: 'Auto' + RUN_ID
                                    5. Verify the field contains the typed value""",
                            """
                                    First Name field contains 'Auto[RUN_ID]' (e.g., Auto12345).
                                    [Test Data — First Name]: Auto + RUN_ID""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_41 — Enter Last Name
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_41",
                            "Enter a unique Last Name in the modal (User + RUN_ID)",
                            """
                                    1. Complete TC_UM_39 (modal is open)
                                    2. Click on the 'Last Name' input field
                                    3. Clear any existing content
                                    4. Type: 'User' + RUN_ID
                                    5. Verify the field contains the typed value""",
                            """
                                    Last Name field contains 'User[RUN_ID]' (e.g., User12345).
                                    [Test Data — Last Name]: User + RUN_ID""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_42 — Enter Email
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_42",
                            "Enter a unique Email address in the modal (autouser + RUN_ID + @test.com)",
                            """
                                    1. Complete TC_UM_39 (modal is open)
                                    2. Click on the 'Email' input field
                                    3. Clear any existing content
                                    4. Type: 'autouser' + RUN_ID + '@test.com'
                                    5. Verify the field contains the typed email""",
                            """
                                    Email field contains 'autouser[RUN_ID]@test.com'.
                                    [Test Data — Email]: autouser + RUN_ID + @test.com""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_43 — Enter Mobile
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_43",
                            "Enter a valid Mobile number (10-digit, starting with 9)",
                            """
                                    1. Complete TC_UM_39 (modal is open)
                                    2. Click on the 'Mobile' input field
                                    3. Type: '9876543210'
                                    4. Verify the field contains '9876543210'""",
                            """
                                    Mobile field contains '9876543210'.
                                    [Test Data — Mobile]: 9876543210""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_44 — Enter Employee Code
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_44",
                            "Enter a unique Employee Code (EMP + RUN_ID)",
                            """
                                    1. Complete TC_UM_39 (modal is open)
                                    2. Click on the 'Employee Code' input field
                                    3. Type: 'EMP' + RUN_ID
                                    4. Verify the field contains the typed value""",
                            """
                                    Employee Code field contains 'EMP[RUN_ID]'.
                                    [Test Data — Employee Code]: EMP + RUN_ID""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_45 — Enter Joining Date
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_45",
                            "Enter a Joining Date in the modal",
                            """
                                    1. Complete TC_UM_39 (modal is open)
                                    2. Click on the 'Joining Date' date picker field
                                    3. Enter today's date in yyyy-MM-dd format
                                    4. Verify the field shows the entered date""",
                            """
                                    Joining Date field shows the entered date (current date).
                                    [Test Data — Joining Date]: current date in yyyy-MM-dd format""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_46 — Enter Password
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_46",
                            "Enter a valid Password (minimum 8 characters) in the modal",
                            """
                                    1. Complete TC_UM_39 (modal is open)
                                    2. Click on the 'Password' input field
                                    3. Type: 'Test@1234' (9 characters — meets minimum 8)
                                    4. Verify the field is masked (password type)
                                    5. Verify no validation error shown""",
                            """
                                    Password field accepts 'Test@1234'; shown as masked dots.
                                    No HTML5 minLength error.
                                    [Test Data — Password]: Test@1234""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_47 — Select Role
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_47",
                            "Select the first available Role from the Role dropdown",
                            """
                                    1. Complete TC_UM_39 (modal is open; required fields filled)
                                    2. Click on the 'Role' dropdown
                                    3. Select the first non-empty option from the dropdown list
                                    4. Verify the dropdown shows the selected role name
                                    5. Verify the 'Create User' button becomes enabled (purple)""",
                            """
                                    Role dropdown shows a selected role name.
                                    'Create User' button transitions from grey (disabled) to purple (enabled).
                                    [Test Data — Role]: first available role in dropdown""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_48 — Enter Department
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_48",
                            "Enter Department in the modal",
                            """
                                    1. Complete TC_UM_39 (modal is open)
                                    2. Click on the 'Department' field
                                    3. Type: 'IT Automation'
                                    4. Verify the field contains 'IT Automation'""",
                            """
                                    Department field contains 'IT Automation'.
                                    [Test Data — Department]: IT Automation""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_49 — Enter Designation
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_49",
                            "Enter Designation in the modal",
                            """
                                    1. Complete TC_UM_39 (modal is open)
                                    2. Click on the 'Designation' field
                                    3. Type: 'QA Engineer'
                                    4. Verify the field contains 'QA Engineer'""",
                            """
                                    Designation field contains 'QA Engineer'.
                                    [Test Data — Designation]: QA Engineer""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_50 — Assign PM-created project
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_50",
                            "Check the checkbox for the PM-automation-created project in Assigned Projects",
                            """
                                    1. Complete TC_UM_39 (modal is open)
                                    2. Scroll to the 'Assigned Projects' section
                                    3. Locate the checkbox for project 'AutoTest[RUN_ID]'
                                       (SharedTestState.PROJECT_NAME from PM automation run)
                                    4. Click the checkbox to check it
                                    5. Verify the checkbox is now checked""",
                            """
                                    Checkbox for 'AutoTest[RUN_ID]' is checked (visible tick/accent).
                                    [Test Data — Project]: AutoTest + RUN_ID (from PM automation)""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_51 — Create User button enabled after required fields filled
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_51",
                            "Verify 'Create User' submit button is enabled (purple) once all required fields are filled",
                            """
                                    1. After completing TC_UM_40–TC_UM_47 (all required fields filled)
                                    2. Observe the 'Create User' button in the modal footer
                                    3. Verify button background colour is purple (#a855f7)
                                    4. Verify button cursor is 'pointer' (not 'not-allowed')""",
                            "'Create User' button is enabled (purple background); can be clicked.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_52 — Click Create User submit button
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_52",
                            "Click the 'Create User' button to submit the new user form",
                            """
                                    1. After completing TC_UM_40–TC_UM_50 (all fields filled)
                                    2. Click the 'Create User' button (purple)
                                    3. Wait for the API call to complete (button may briefly show 'Saving...')""",
                            "Form is submitted. Button may show 'Saving...' briefly during API call.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_53 — Success alert shown
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_53",
                            "Verify browser native alert shows 'User created successfully' after form submission",
                            """
                                    1. Complete TC_UM_52 (Create User button clicked)
                                    2. Wait for browser native alert dialog to appear (up to 10 seconds)
                                    3. Read the alert message text
                                    4. Verify the message reads: 'User created successfully'""",
                            "Browser alert dialog shows: 'User created successfully'",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_54 — Accept alert — modal closes
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_54",
                            "Accept the success alert — verify the Create User modal closes and table reloads",
                            """
                                    1. Complete TC_UM_53 (success alert visible)
                                    2. Click 'OK' on the browser alert dialog (driver.switchTo().alert().accept())
                                    3. Verify the Create User modal is no longer visible
                                    4. Verify the landing page users table is visible and reloads""",
                            """
                                    Alert accepted.
                                    Create User modal is dismissed (invisible).
                                    Users table reloads with updated data.""",
                            "",
                            ""
                    },

                    // ==================================================================
                    // SECTION F — Verify Created User in Table
                    // ==================================================================

                    // ------------------------------------------------------------------
                    // TC_UM_55 — Table visible after creation
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_55",
                            "Verify users table is visible and loaded after user creation",
                            """
                                    1. Complete TC_UM_54 (modal closed after successful creation)
                                    2. Observe the users table on the landing page
                                    3. Wait for data to load if spinner is shown""",
                            "Users table is visible and loaded with at least one data row.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_56 — Created user full name in table
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_56",
                            "Verify created user full name 'Auto[RUN_ID] User[RUN_ID]' appears in the users table",
                            """
                                    1. Complete TC_UM_54 (user created)
                                    2. Search or scroll through the users table
                                    3. Locate a row with full name 'Auto[RUN_ID] User[RUN_ID]'
                                    4. Verify the NAME column shows the correct full name""",
                            """
                                    NAME column shows 'Auto[RUN_ID] User[RUN_ID]'.
                                    [Expected]: Auto + RUN_ID + ' ' + User + RUN_ID""",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_57 — Created user email in table
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_57",
                            "Verify created user email 'autouser[RUN_ID]@test.com' appears in the users table",
                            """
                                    1. Complete TC_UM_54 (user created)
                                    2. Locate the created user row in the table
                                    3. Verify the EMAIL column shows: autouser[RUN_ID]@test.com""",
                            "EMAIL column shows 'autouser[RUN_ID]@test.com'.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_58 — Created user employee code in table
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_58",
                            "Verify created user Employee Code 'EMP[RUN_ID]' appears in the users table",
                            """
                                    1. Complete TC_UM_54 (user created)
                                    2. Locate the created user row in the table
                                    3. Verify the EMPLOYEE CODE column shows: EMP[RUN_ID]""",
                            "EMPLOYEE CODE column shows 'EMP[RUN_ID]'.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_59 — Created user role shown in table
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_59",
                            "Verify created user's Role is displayed correctly in the ROLE column",
                            """
                                    1. Complete TC_UM_54 (user created)
                                    2. Locate the created user row
                                    3. Verify the ROLE column shows the role selected during TC_UM_47""",
                            "ROLE column shows the correct role name assigned during user creation.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_60 — Created user projects shown in table
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_60",
                            "Verify PROJECTS column shows at least 1 project for the created user",
                            """
                                    1. Complete TC_UM_54 (user created with AutoTest[RUN_ID] project assigned)
                                    2. Locate the created user row
                                    3. Verify the PROJECTS column shows a count of at least 1 or the project name""",
                            "PROJECTS column shows '1' (or project name) — at least 1 project assigned.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_61 — Created user status is Active
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_61",
                            "Verify created user STATUS is Active (green toggle) in the users table",
                            """
                                    1. Complete TC_UM_54 (user created)
                                    2. Locate the created user row
                                    3. Observe the STATUS toggle in the STATUS column
                                    4. Verify the toggle is in the 'Active' (green/on) state""",
                            "STATUS toggle for created user is Active (green / enabled state).",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_62 — Edit button visible for created user
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_62",
                            "Verify Edit button (pencil icon) is visible in ACTIONS column for created user",
                            """
                                    1. Complete TC_UM_54 (user created)
                                    2. Locate the created user row
                                    3. Look at the ACTIONS column
                                    4. Verify the Edit (pencil icon) button is visible""",
                            "Edit button (pencil icon) is visible in ACTIONS for the created user.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_63 — Delete button visible for created user
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_63",
                            "Verify Delete button (trash icon) is visible in ACTIONS column for created user",
                            """
                                    1. Complete TC_UM_54 (user created)
                                    2. Locate the created user row
                                    3. Look at the ACTIONS column
                                    4. Verify the Delete (trash icon) button is visible""",
                            "Delete button (trash icon) is visible in ACTIONS for the created user.",
                            "",
                            ""
                    },

                    // ==================================================================
                    // SECTION G — Search & Filter Tests
                    // ==================================================================

                    // ------------------------------------------------------------------
                    // TC_UM_64 — Search for created user by first name
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_64",
                            "Search for the created user by typing their First Name in the Search field",
                            """
                                    1. Complete TC_UM_54 (user created)
                                    2. Click on the Search input field
                                    3. Type 'Auto[RUN_ID]' (First Name of the created user)
                                    4. Verify the search input shows the typed text
                                    5. Verify the table filters dynamically""",
                            "Search input shows 'Auto[RUN_ID]'; table filters dynamically.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_65 — Search results show created user
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_65",
                            "Verify search results contain the created user after searching by First Name",
                            """
                                    1. Complete TC_UM_64 (search for 'Auto[RUN_ID]' active)
                                    2. Observe the filtered table
                                    3. Verify at least 1 row is shown
                                    4. Verify the visible row contains the created user's name""",
                            "Table shows at least 1 result with name containing 'Auto[RUN_ID]'.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_66 — Clear search — all users reload
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_66",
                            "Clear the search field and verify all users are shown again",
                            """
                                    1. Complete TC_UM_64 (search filter active)
                                    2. Click on the Search input field
                                    3. Clear all text (Ctrl+A → Delete)
                                    4. Verify search field is empty
                                    5. Verify table shows all users (full list)""",
                            "Search cleared; users table shows all users (full unfiltered list).",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_67 — Filter by Active Status — created user visible
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_67",
                            "Filter by Status 'Active' — verify created user is visible in results",
                            """
                                    1. Complete TC_UM_54 (user created; on /users page)
                                    2. Click the Status filter dropdown
                                    3. Select 'Active'
                                    4. Observe the filtered table
                                    5. Verify the created user (who is active) appears in results""",
                            "Only active users shown; created user (active by default) appears in filtered results.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_68 — Filter by Inactive Status — created user NOT visible
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_68",
                            "Filter by Status 'Inactive' — verify created user is NOT visible in results",
                            """
                                    1. Complete TC_UM_54 (user created; on /users page)
                                    2. Click the Status filter dropdown
                                    3. Select 'Inactive'
                                    4. Observe the filtered table
                                    5. Verify the created user (who is active) does NOT appear in results""",
                            "Only inactive users shown; newly created user (active) is NOT in the filtered list.",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_69 — Clear Status filter — all users reload
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_69",
                            "Select 'All Status' in the Status filter to clear the filter and show all users",
                            """
                                    1. After TC_UM_68 (Inactive filter active)
                                    2. Click the Status filter dropdown
                                    3. Select 'All Status'
                                    4. Observe the table""",
                            "Status filter cleared; table shows all users (active + inactive combined).",
                            "",
                            ""
                    },

                    // ------------------------------------------------------------------
                    // TC_UM_70 — Filter by Role — created user visible
                    // ------------------------------------------------------------------
                    {
                            "TC_UM_70",
                            "Filter by the Role assigned to the created user — verify created user appears in results",
                            """
                                    1. Complete TC_UM_54 (user created)
                                    2. Click the Role filter dropdown
                                    3. Select the same role that was assigned to the created user in TC_UM_47
                                    4. Observe the filtered table
                                    5. Verify the created user appears in the filtered results""",
                            """
                                    Table shows only users with the selected role.
                                    Created user (with that role) is visible in the results.""",
                            "",
                            ""
                    }
            };

            CellStyle dataStyle = createDataStyle(workbook);
            CellStyle wrapStyle = createWrapStyle(workbook);

            for (int i = 0; i < testCases.length; i++) {
                Row row = sheet.createRow(i + 1);
                row.setHeightInPoints(110);
                for (int j = 0; j < testCases[i].length; j++) {
                    Cell cell = row.createCell(j);
                    cell.setCellValue(testCases[i][j]);
                    cell.setCellStyle(j == 2 ? wrapStyle : dataStyle);
                }
            }

            try (FileOutputStream fos = new FileOutputStream("testresults/User_Management.xlsx")) {
                workbook.write(fos);
            }
        }
    }

    // ==================== STYLES ====================

    private static CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private static CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setVerticalAlignment(VerticalAlignment.TOP);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private static CellStyle createWrapStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setWrapText(true);
        style.setVerticalAlignment(VerticalAlignment.TOP);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }
}
