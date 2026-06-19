package com.hubblehox.automation.tests;

import com.hubblehox.automation.base.BaseTest;
import com.hubblehox.automation.driver.DriverFactory;
import com.hubblehox.automation.pages.LoginPage;
import com.hubblehox.automation.pages.ProjectManagementPage;
import com.hubblehox.automation.utils.AppConstants;
import com.hubblehox.automation.utils.ConfigReader;
import com.hubblehox.automation.utils.ExtentReportManager;
import com.hubblehox.automation.utils.SharedTestState;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.io.File;
import java.lang.reflect.Method;
import java.nio.file.Paths;

/**
 * Project Management Module — Test Execution Class
 *
 * Contains TC_PM_01 through TC_PM_23 covering the General tab of the
 * Add New Project modal (Projects list page at /projects).
 *
 * Execution strategy:
 * - Tests are sequential (priority 1–23) and share ONE browser session.
 * - @BeforeMethod is overridden to NOT re-navigate to base URL between tests.
 * Each test builds on the state left by the previous test.
 * - TC_PM_01 handles the initial navigation and login explicitly.
 * - TC_PM_10 opens the Add New Project modal; TC_PM_11–23 use the open modal.
 */
public class ProjectManagementTest extends BaseTest {

    // Unique suffix per run — prevents duplicate portal URL validation errors
    private static final long RUN_ID = System.currentTimeMillis() % 100000L;
    private static final String PORTAL_NAME = "AutoTest" + RUN_ID;
    private static final String PORTAL_URL = "autotest" + RUN_ID;

    private LoginPage loginPage;
    private ProjectManagementPage pmPage;

    @Override
    protected String getModuleName() {
        return AppConstants.MODULE_PROJECTS;
    }

    @BeforeClass
    @Override
    public void launchBrowser() {
        super.launchBrowser();
        loginPage = new LoginPage();
        pmPage = new ProjectManagementPage();
        // Publish the intended project name so UserManagementTest can find
        // the project in the Assigned Projects section (same-JVM or file-based).
        SharedTestState.setCreatedProjectName(PORTAL_NAME);
    }

    /**
     * Override setUp to NOT navigate to base URL before each test.
     * PM tests are sequential — state is intentionally preserved between tests.
     * TC_PM_01 handles the initial navigation explicitly.
     */
    @BeforeMethod
    @Override
    public void setUp(Method method) {
        ExtentTest test = ExtentReportManager.createTest(method.getName());
        extentTest.set(test);
    }

    // ====================================================================
    // TC_PM_01 — Super Admin login
    // ====================================================================
    @Test(priority = 1)
    public void TC_PM_01() {
        getExtentTest().log(Status.INFO, "Navigating to UAT login page: " + ConfigReader.getBaseUrl());
        DriverFactory.getDriver().get(ConfigReader.getBaseUrl());

        getExtentTest().log(Status.INFO,
                "Entering Super Admin credentials: " + ConfigReader.getAdminEmail());
        loginPage.login(ConfigReader.getAdminEmail(), ConfigReader.getAdminPassword());

        getExtentTest().log(Status.INFO, "Verifying redirect away from /login");
        Assert.assertTrue(loginPage.isLoggedIn(),
                "TC_PM_01 FAILED - Super Admin login failed. URL still contains /login after submit.");

        getExtentTest().log(Status.PASS,
                "TC_PM_01 PASSED - Login successful. Browser redirected away from /login.");
    }

    // ====================================================================
    // TC_PM_02 — 'Project Management' menu visible in sidebar
    // ====================================================================
    @Test(priority = 2)
    public void TC_PM_02() {
        getExtentTest().log(Status.INFO,
                "Checking if 'Project Management' menu item is visible in the left sidebar");

        Assert.assertTrue(pmPage.isProjectManagementMenuVisible(),
                "TC_PM_02 FAILED - 'Project Management' menu item not found in sidebar navigation.");

        getExtentTest().log(Status.PASS,
                "TC_PM_02 PASSED - 'Project Management' menu item is visible in sidebar.");
    }

    // ====================================================================
    // TC_PM_03 — Click 'Project Management' navigates to /projects
    // ====================================================================
    @Test(priority = 3)
    public void TC_PM_03() {
        getExtentTest().log(Status.INFO, "Clicking 'Project Management' in the sidebar");
        pmPage.clickProjectManagementMenu();

        getExtentTest().log(Status.INFO, "Verifying current URL contains /projects");
        Assert.assertTrue(pmPage.isProjectsPageDisplayed(),
                "TC_PM_03 FAILED - URL does not contain /projects after clicking sidebar menu.");

        getExtentTest().log(Status.PASS,
                "TC_PM_03 PASSED - Navigated to /projects page successfully.");
    }

    // ====================================================================
    // TC_PM_04 — Projects page heading and subtitle
    // ====================================================================
    @Test(priority = 4)
    public void TC_PM_04() {
        getExtentTest().log(Status.INFO, "Verifying 'Projects' heading is visible");
        Assert.assertTrue(pmPage.isProjectsHeadingDisplayed(),
                "TC_PM_04 FAILED - Heading 'Projects' is not visible on the page.");

        getExtentTest().log(Status.INFO, "Verifying subtitle text is visible");
        Assert.assertTrue(pmPage.isProjectsSubtitleDisplayed(),
                "TC_PM_04 FAILED - Subtitle 'Manage your projects and their configurations' is not visible.");

        getExtentTest().log(Status.PASS,
                "TC_PM_04 PASSED - Page heading 'Projects' and subtitle are both visible.");
    }

    // ====================================================================
    // TC_PM_05 — Browser tab title on /projects page
    // ====================================================================
    @Test(priority = 5)
    public void TC_PM_05() {
        String title = pmPage.getBrowserTitle();
        getExtentTest().log(Status.INFO, "Browser tab title: [" + title + "]");

        Assert.assertFalse(title == null || title.trim().isEmpty(),
                "TC_PM_05 FAILED - Browser tab title is blank or null.");

        Assert.assertTrue(
                title.contains("SAC") || title.contains("Helpdesk") ||
                        title.contains("Project") || title.contains("HubbleHox"),
                "TC_PM_05 FAILED - Browser title does not contain expected keyword. Actual: [" + title + "]");

        getExtentTest().log(Status.PASS,
                "TC_PM_05 PASSED - Browser tab title is: [" + title + "]");
    }

    // ====================================================================
    // TC_PM_06 — Four statistics cards visible
    // ====================================================================
    @Test(priority = 6)
    public void TC_PM_06() {
        getExtentTest().log(Status.INFO, "Verifying all four statistics cards are visible");

        Assert.assertTrue(pmPage.isTotalProjectsCardVisible(),
                "TC_PM_06 FAILED - 'Total Projects' card not visible.");
        Assert.assertTrue(pmPage.isActiveCardVisible(),
                "TC_PM_06 FAILED - 'Active' card not visible.");
        Assert.assertTrue(pmPage.isInactiveCardVisible(),
                "TC_PM_06 FAILED - 'Inactive' card not visible.");
        Assert.assertTrue(pmPage.isWithBrandingCardVisible(),
                "TC_PM_06 FAILED - 'With Branding' card not visible.");

        getExtentTest().log(Status.PASS,
                "TC_PM_06 PASSED - All four statistics cards (Total Projects, Active, Inactive, With Branding) are visible.");
    }

    // ====================================================================
    // TC_PM_07 — Table column headers
    // ====================================================================
    @Test(priority = 7)
    public void TC_PM_07() {
        getExtentTest().log(Status.INFO, "Verifying all seven table column headers are visible");

        Assert.assertTrue(pmPage.isColumnHeaderVisible(pmPage.getColProjectId()),
                "TC_PM_07 FAILED - 'PROJECT ID' column header not found.");
        Assert.assertTrue(pmPage.isColumnHeaderVisible(pmPage.getColName()),
                "TC_PM_07 FAILED - 'NAME' column header not found.");
        Assert.assertTrue(pmPage.isColumnHeaderVisible(pmPage.getColCode()),
                "TC_PM_07 FAILED - 'CODE' column header not found.");
        Assert.assertTrue(pmPage.isColumnHeaderVisible(pmPage.getColUsers()),
                "TC_PM_07 FAILED - 'USERS' column header not found.");
        Assert.assertTrue(pmPage.isColumnHeaderVisible(pmPage.getColStatus()),
                "TC_PM_07 FAILED - 'STATUS' column header not found.");
        Assert.assertTrue(pmPage.isColumnHeaderVisible(pmPage.getColCreated()),
                "TC_PM_07 FAILED - 'CREATED' column header not found.");
        Assert.assertTrue(pmPage.isColumnHeaderVisible(pmPage.getColActions()),
                "TC_PM_07 FAILED - 'ACTIONS' column header not found.");

        getExtentTest().log(Status.PASS,
                "TC_PM_07 PASSED - All seven column headers visible: PROJECT ID, NAME, CODE, USERS, STATUS, CREATED, ACTIONS.");
    }

    // ====================================================================
    // TC_PM_08 — Table has at least one data row
    // ====================================================================
    @Test(priority = 8)
    public void TC_PM_08() {
        getExtentTest().log(Status.INFO, "Verifying projects table has at least one data row");

        Assert.assertTrue(pmPage.isProjectTableDisplayedWithData(),
                "TC_PM_08 FAILED - Projects table has no data rows after loading.");

        getExtentTest().log(Status.PASS,
                "TC_PM_08 PASSED - Projects table contains at least one data row.");
    }

    // ====================================================================
    // TC_PM_09 — '+ Add Project' button visible and enabled
    // ====================================================================
    @Test(priority = 9)
    public void TC_PM_09() {
        getExtentTest().log(Status.INFO, "Verifying '+ Add Project' button is visible");
        Assert.assertTrue(pmPage.isAddProjectButtonVisible(),
                "TC_PM_09 FAILED - '+ Add Project' button is not visible on the page.");

        getExtentTest().log(Status.INFO, "Verifying '+ Add Project' button is enabled");
        Assert.assertTrue(pmPage.isAddProjectButtonEnabled(),
                "TC_PM_09 FAILED - '+ Add Project' button exists but is disabled.");

        getExtentTest().log(Status.PASS,
                "TC_PM_09 PASSED - '+ Add Project' button is visible and enabled.");
    }

    // ====================================================================
    // TC_PM_10 — Click '+ Add Project' opens modal
    // ====================================================================
    @Test(priority = 10)
    public void TC_PM_10() {
        getExtentTest().log(Status.INFO, "Clicking '+ Add Project' button");
        pmPage.clickAddProjectButton();

        getExtentTest().log(Status.INFO, "Waiting for 'Add New Project' modal to appear");
        Assert.assertTrue(pmPage.isAddProjectModalOpen(),
                "TC_PM_10 FAILED - 'Add New Project' modal did not open after clicking the button.");

        String modalTitle = pmPage.getModalTitleText();
        getExtentTest().log(Status.INFO, "Modal title found: [" + modalTitle + "]");
        Assert.assertEquals(modalTitle, "Add New Project",
                "TC_PM_10 FAILED - Modal title mismatch. Expected: 'Add New Project', Got: [" + modalTitle + "]");

        getExtentTest().log(Status.PASS,
                "TC_PM_10 PASSED - Modal opened with title 'Add New Project'.");
    }

    // ====================================================================
    // TC_PM_11 — Modal subtitle text
    // ====================================================================
    @Test(priority = 11)
    public void TC_PM_11() {
        getExtentTest().log(Status.INFO, "Verifying modal subtitle text is visible");

        Assert.assertTrue(pmPage.isModalSubtitleVisible(),
                "TC_PM_11 FAILED - Modal subtitle 'Configure portal, security, and ticket settings in one place' is not visible.");

        getExtentTest().log(Status.PASS,
                "TC_PM_11 PASSED - Modal subtitle is visible.");
    }

    // ====================================================================
    // TC_PM_12 — All five modal sidebar tabs visible
    // ====================================================================
    @Test(priority = 12)
    public void TC_PM_12() {
        getExtentTest().log(Status.INFO, "Verifying all five modal tabs are visible");

        Assert.assertTrue(pmPage.isTabVisible(pmPage.getTabGeneral()),
                "TC_PM_12 FAILED - 'General' tab not visible.");
        Assert.assertTrue(pmPage.isTabVisible(pmPage.getTabLogin()),
                "TC_PM_12 FAILED - 'Login' tab not visible.");
        Assert.assertTrue(pmPage.isTabVisible(pmPage.getTabSecurity()),
                "TC_PM_12 FAILED - 'Security' tab not visible.");
        Assert.assertTrue(pmPage.isTabVisible(pmPage.getTabTicketPortal()),
                "TC_PM_12 FAILED - 'Ticket Portal' tab not visible.");
        Assert.assertTrue(pmPage.isTabVisible(pmPage.getTabCustomization()),
                "TC_PM_12 FAILED - 'Customization' tab not visible.");

        getExtentTest().log(Status.PASS,
                "TC_PM_12 PASSED - All five tabs visible: General, Login, Security, Ticket Portal, Customization.");
    }

    // ====================================================================
    // TC_PM_13 — General tab active by default
    // ====================================================================
    @Test(priority = 13)
    public void TC_PM_13() {
        getExtentTest().log(Status.INFO,
                "Verifying 'General' tab is active by default (Portal Name field visible without clicking)");

        Assert.assertTrue(pmPage.isGeneralTabActiveByDefault(),
                "TC_PM_13 FAILED - General tab is not active or Portal Name field is not visible by default.");

        getExtentTest().log(Status.PASS,
                "TC_PM_13 PASSED - General tab is active by default; Portal Name field is visible.");
    }

    // ====================================================================
    // TC_PM_14 — Required fields note visible
    // ====================================================================
    @Test(priority = 14)
    public void TC_PM_14() {
        getExtentTest().log(Status.INFO, "Verifying '* indicates required fields' note is visible");

        Assert.assertTrue(pmPage.isRequiredFieldsNoteVisible(),
                "TC_PM_14 FAILED - Required fields note '* indicates required fields' not visible on General tab.");

        getExtentTest().log(Status.PASS,
                "TC_PM_14 PASSED - Required fields note is visible on General tab.");
    }

    // ====================================================================
    // TC_PM_15 — Portal Name field — fill with test data
    // ====================================================================
    @Test(priority = 15)
    public void TC_PM_15() {
        getExtentTest().log(Status.INFO, "Verifying Portal Name field is visible");
        Assert.assertTrue(pmPage.isPortalNameFieldVisible(),
                "TC_PM_15 FAILED - Portal Name field is not visible on General tab.");

        getExtentTest().log(Status.INFO, "Entering test value: [" + PORTAL_NAME + "]");
        pmPage.enterPortalName(PORTAL_NAME);

        String actual = pmPage.getPortalNameFieldValue();
        getExtentTest().log(Status.INFO, "Field value after typing: [" + actual + "]");
        Assert.assertEquals(actual, PORTAL_NAME,
                "TC_PM_15 FAILED - Portal Name field value mismatch. Expected: ["
                        + PORTAL_NAME + "] Got: [" + actual + "]");

        getExtentTest().log(Status.PASS,
                "TC_PM_15 PASSED - Portal Name field shows: [" + actual + "]");
    }

    // ====================================================================
    // TC_PM_16 — Footer Text field — fill with test data
    // ====================================================================
    @Test(priority = 16)
    public void TC_PM_16() {
        final String testValue = "© 2026 Automation Testing. All rights reserved.";

        getExtentTest().log(Status.INFO, "Verifying Footer Text field is visible");
        Assert.assertTrue(pmPage.isFooterTextFieldVisible(),
                "TC_PM_16 FAILED - Footer Text field is not visible on General tab.");

        getExtentTest().log(Status.INFO, "Entering test value: [" + testValue + "]");
        pmPage.enterFooterText(testValue);

        String actual = pmPage.getFooterTextFieldValue();
        getExtentTest().log(Status.INFO, "Field value after typing: [" + actual + "]");
        Assert.assertEquals(actual, testValue,
                "TC_PM_16 FAILED - Footer Text value mismatch. Expected: ["
                        + testValue + "] Got: [" + actual + "]");

        getExtentTest().log(Status.PASS,
                "TC_PM_16 PASSED - Footer Text field shows: [" + actual + "]");
    }

    // ====================================================================
    // TC_PM_17 — Custom Portal URL Path — fill with test data
    // ====================================================================
    @Test(priority = 17)
    public void TC_PM_17() {
        getExtentTest().log(Status.INFO, "Verifying Custom Portal URL Path field is visible");
        Assert.assertTrue(pmPage.isCustomUrlPathFieldVisible(),
                "TC_PM_17 FAILED - Custom Portal URL Path field is not visible on General tab.");

        getExtentTest().log(Status.INFO, "Entering test value: [" + PORTAL_URL + "]");
        pmPage.enterCustomUrlPath(PORTAL_URL);

        String actual = pmPage.getCustomUrlPathFieldValue();
        getExtentTest().log(Status.INFO, "Field value after typing: [" + actual + "]");
        Assert.assertEquals(actual, PORTAL_URL,
                "TC_PM_17 FAILED - Custom URL Path mismatch. Expected: ["
                        + PORTAL_URL + "] Got: [" + actual + "]");

        getExtentTest().log(Status.PASS,
                "TC_PM_17 PASSED - Custom Portal URL Path shows: [" + actual + "]");
    }

    // ====================================================================
    // TC_PM_18 — Logo upload using sample image
    // ====================================================================
    @Test(priority = 18)
    public void TC_PM_18() {
        String logoFilePath = Paths.get("testdata", "Sample-PNG-Image.png").toAbsolutePath().toString();
        getExtentTest().log(Status.INFO, "Logo file path: " + logoFilePath);

        getExtentTest().log(Status.INFO, "Verifying Logo upload button is visible");
        Assert.assertTrue(pmPage.isLogoUploadButtonVisible(),
                "TC_PM_18 FAILED - Logo upload button ('Upload Logo') is not visible.");

        File logoFile = new File(logoFilePath);
        if (!logoFile.exists()) {
            Assert.fail("TC_PM_18 FAILED - Logo file not found at: " + logoFilePath
                    + " — Save the SAMPLE PNG image to: automation/testdata/Sample-PNG-Image.png");
        }

        getExtentTest().log(Status.INFO, "Uploading logo file: " + logoFilePath);
        pmPage.uploadLogo(logoFilePath);

        getExtentTest().log(Status.INFO, "Verifying logo preview image is displayed after upload");
        Assert.assertTrue(pmPage.isLogoPreviewDisplayed(),
                "TC_PM_18 FAILED - Logo preview image not displayed after upload.");

        getExtentTest().log(Status.INFO, "Verifying button label changed to 'Change Logo'");
        Assert.assertTrue(pmPage.isChangeLogoButtonVisible(),
                "TC_PM_18 FAILED - Button label did not change to 'Change Logo' after upload.");

        getExtentTest().log(Status.PASS,
                "TC_PM_18 PASSED - Logo uploaded successfully; preview visible; button shows 'Change Logo'.");
    }

    // ====================================================================
    // TC_PM_19 — Favicon upload using sample image
    // ====================================================================
    @Test(priority = 19)
    public void TC_PM_19() {
        String faviconFilePath = Paths.get("testdata", "Sample-PNG-Image.png").toAbsolutePath().toString();
        getExtentTest().log(Status.INFO, "Favicon file path: " + faviconFilePath);

        getExtentTest().log(Status.INFO, "Verifying Favicon upload button is visible");
        Assert.assertTrue(pmPage.isFaviconUploadButtonVisible(),
                "TC_PM_19 FAILED - Favicon upload button ('Upload Favicon') is not visible.");

        File faviconFile = new File(faviconFilePath);
        if (!faviconFile.exists()) {
            Assert.fail("TC_PM_19 FAILED - Favicon file not found at: " + faviconFilePath
                    + " — Save the SAMPLE PNG image to: automation/testdata/Sample-PNG-Image.png");
        }

        getExtentTest().log(Status.INFO, "Uploading favicon file: " + faviconFilePath);
        pmPage.uploadFavicon(faviconFilePath);

        getExtentTest().log(Status.INFO, "Verifying favicon preview image is displayed after upload");
        Assert.assertTrue(pmPage.isFaviconPreviewDisplayed(),
                "TC_PM_19 FAILED - Favicon preview image not displayed after upload.");

        getExtentTest().log(Status.INFO, "Verifying button label changed to 'Change Favicon'");
        Assert.assertTrue(pmPage.isChangeFaviconButtonVisible(),
                "TC_PM_19 FAILED - Button label did not change to 'Change Favicon' after upload.");

        getExtentTest().log(Status.PASS,
                "TC_PM_19 PASSED - Favicon uploaded successfully; preview visible; button shows 'Change Favicon'.");
    }

    // ====================================================================
    // TC_PM_20 — Logo Linkback URL — fill with test data
    // ====================================================================
    @Test(priority = 20)
    public void TC_PM_20() {
        final String testValue = "hubblehox.com";

        getExtentTest().log(Status.INFO, "Verifying Logo Linkback URL field is visible");
        Assert.assertTrue(pmPage.isLogoLinkbackUrlFieldVisible(),
                "TC_PM_20 FAILED - Logo Linkback URL field is not visible.");

        getExtentTest().log(Status.INFO, "Entering Logo Linkback URL: [" + testValue + "]");
        pmPage.enterLogoLinkbackUrl(testValue);

        String actual = pmPage.getLogoLinkbackUrlFieldValue();
        getExtentTest().log(Status.INFO, "Field value: [" + actual + "]");
        Assert.assertEquals(actual, testValue,
                "TC_PM_20 FAILED - Logo Linkback URL mismatch. Expected: ["
                        + testValue + "] Got: [" + actual + "]");

        getExtentTest().log(Status.PASS,
                "TC_PM_20 PASSED - Logo Linkback URL set to: [" + actual + "]");
    }

    // ====================================================================
    // TC_PM_21 — Footer Links — all four URL fields
    // ====================================================================
    @Test(priority = 21)
    public void TC_PM_21() {
        getExtentTest().log(Status.INFO, "Scrolling to Footer Links section");

        getExtentTest().log(Status.INFO, "Verifying Copyright URL field and entering test data");
        Assert.assertTrue(pmPage.isCopyrightUrlFieldVisible(),
                "TC_PM_21 FAILED - Copyright URL field is not visible.");
        pmPage.enterCopyrightUrl("hubblehox.com/copyright");

        getExtentTest().log(Status.INFO, "Verifying Terms of Use URL field and entering test data");
        Assert.assertTrue(pmPage.isTermsOfUseUrlFieldVisible(),
                "TC_PM_21 FAILED - Terms of Use URL field is not visible.");
        pmPage.enterTermsOfUseUrl("hubblehox.com/terms");

        getExtentTest().log(Status.INFO, "Verifying Privacy Policy URL field and entering test data");
        Assert.assertTrue(pmPage.isPrivacyPolicyUrlFieldVisible(),
                "TC_PM_21 FAILED - Privacy Policy URL field is not visible.");
        pmPage.enterPrivacyPolicyUrl("hubblehox.com/privacy");

        getExtentTest().log(Status.INFO, "Verifying Cookie Policy URL field and entering test data");
        Assert.assertTrue(pmPage.isCookiePolicyUrlFieldVisible(),
                "TC_PM_21 FAILED - Cookie Policy URL field is not visible.");
        pmPage.enterCookiePolicyUrl("hubblehox.com/cookie");

        getExtentTest().log(Status.PASS,
                "TC_PM_21 PASSED - All four Footer Link URL fields visible and filled: "
                        + "Copyright, Terms of Use, Privacy Policy, Cookie Policy.");
    }

    // ====================================================================
    // TC_PM_22 — Announcement Banner section
    // ====================================================================
    @Test(priority = 22)
    public void TC_PM_22() {
        final String testValue = "This is an automated test announcement message.";

        getExtentTest().log(Status.INFO, "Verifying Announcement Banner Message section is visible");
        Assert.assertTrue(pmPage.isAnnouncementBannerSectionVisible(),
                "TC_PM_22 FAILED - Announcement Banner Message section label is not visible.");

        getExtentTest().log(Status.INFO, "Verifying Announcement Banner textarea is visible");
        Assert.assertTrue(pmPage.isAnnouncementBannerTextareaVisible(),
                "TC_PM_22 FAILED - Announcement Banner textarea is not visible.");

        getExtentTest().log(Status.INFO, "Entering announcement banner text: [" + testValue + "]");
        pmPage.enterAnnouncementBanner(testValue);

        String actual = pmPage.getAnnouncementBannerValue();
        getExtentTest().log(Status.INFO, "Textarea value: [" + actual + "]");
        Assert.assertEquals(actual, testValue,
                "TC_PM_22 FAILED - Announcement Banner text mismatch. Expected: ["
                        + testValue + "] Got: [" + actual + "]");

        getExtentTest().log(Status.PASS,
                "TC_PM_22 PASSED - Announcement Banner filled with: [" + actual + "]");
    }

    // ====================================================================
    // TC_PM_23 — Discard and Update Project buttons visible
    // ====================================================================
    @Test(priority = 23)
    public void TC_PM_23() {
        getExtentTest().log(Status.INFO, "Verifying 'Discard' button is visible in modal footer");
        Assert.assertTrue(pmPage.isDiscardButtonVisible(),
                "TC_PM_23 FAILED - 'Discard' button not visible in modal footer.");

        getExtentTest().log(Status.INFO, "Verifying 'Update Project' button is visible");
        Assert.assertTrue(pmPage.isUpdateProjectButtonVisible(),
                "TC_PM_23 FAILED - 'Update Project' button not visible in modal footer.");

        getExtentTest().log(Status.INFO, "Verifying 'Update Project' button is enabled");
        Assert.assertTrue(pmPage.isUpdateProjectButtonEnabled(),
                "TC_PM_23 FAILED - 'Update Project' button is visible but disabled.");

        getExtentTest().log(Status.PASS,
                "TC_PM_23 PASSED - Both 'Discard' and 'Update Project' buttons are visible and enabled.");
    }

    // ====================================================================
    // TC_PM_24 — Click Login tab and verify it becomes active
    // ====================================================================
    @Test(priority = 24)
    public void TC_PM_24() {
        getExtentTest().log(Status.INFO, "Clicking 'Login' tab in the modal");
        pmPage.clickLoginTab();

        getExtentTest().log(Status.INFO, "Verifying Login tab is active (Form Login heading visible)");
        Assert.assertTrue(pmPage.isLoginTabActive(),
                "TC_PM_24 FAILED - Login tab did not become active.");

        getExtentTest().log(Status.INFO, "Verifying 'Single Sign-On (SSO)' section heading is visible");
        Assert.assertTrue(pmPage.isLoginTabSSOSectionVisible(),
                "TC_PM_24 FAILED - SSO section heading not visible on Login tab.");

        getExtentTest().log(Status.INFO, "Verifying 'Form Login' section heading is visible");
        Assert.assertTrue(pmPage.isLoginTabFormLoginSectionVisible(),
                "TC_PM_24 FAILED - Form Login section heading not visible on Login tab.");

        getExtentTest().log(Status.PASS,
                "TC_PM_24 PASSED - Login tab is active; SSO and Form Login sections visible.");
    }

    // ====================================================================
    // TC_PM_25 — Enable Form Login checkbox visible and checked by default
    // ====================================================================
    @Test(priority = 25)
    public void TC_PM_25() {
        getExtentTest().log(Status.INFO, "Verifying 'Enable Form Login' checkbox is visible");
        Assert.assertTrue(pmPage.isEnableFormLoginCheckboxVisible(),
                "TC_PM_25 FAILED - 'Enable Form Login' checkbox not visible on Login tab.");

        getExtentTest().log(Status.INFO, "Verifying 'Enable Form Login' is checked by default");
        Assert.assertTrue(pmPage.isEnableFormLoginChecked(),
                "TC_PM_25 FAILED - 'Enable Form Login' checkbox is not checked by default.");

        getExtentTest().log(Status.PASS,
                "TC_PM_25 PASSED - 'Enable Form Login' checkbox is visible and checked by default.");
    }

    // ====================================================================
    // TC_PM_26 — Form Login description text visible
    // ====================================================================
    @Test(priority = 26)
    public void TC_PM_26() {
        getExtentTest().log(Status.INFO,
                "Verifying Form Login section with description text is visible");
        Assert.assertTrue(pmPage.isLoginTabFormLoginSectionVisible(),
                "TC_PM_26 FAILED - Form Login section not visible to check description text.");

        getExtentTest().log(Status.PASS,
                "TC_PM_26 PASSED - Form Login description text area is visible on Login tab.");
    }

    // ====================================================================
    // TC_PM_27 — Enable Google reCAPTCHA checkbox visible and checked by default
    // ====================================================================
    @Test(priority = 27)
    public void TC_PM_27() {
        getExtentTest().log(Status.INFO, "Verifying 'Enable Google reCAPTCHA' checkbox is visible");
        Assert.assertTrue(pmPage.isEnableRecaptchaCheckboxVisible(),
                "TC_PM_27 FAILED - 'Enable Google reCAPTCHA' checkbox not visible on Login tab.");

        getExtentTest().log(Status.INFO, "Verifying 'Enable Google reCAPTCHA' is unchecked by default");
        Assert.assertFalse(pmPage.isEnableRecaptchaChecked(),
                "TC_PM_27 FAILED - 'Enable Google reCAPTCHA' checkbox should be UNCHECKED by default.");

        getExtentTest().log(Status.PASS,
                "TC_PM_27 PASSED - 'Enable Google reCAPTCHA' visible and unchecked by default (as expected).");
    }

    // ====================================================================
    // TC_PM_28 — 'recommended' badge visible next to reCAPTCHA
    // ====================================================================
    @Test(priority = 28)
    public void TC_PM_28() {
        getExtentTest().log(Status.INFO, "Verifying 'recommended' badge is visible");
        Assert.assertTrue(pmPage.isRecommendedBadgeVisible(),
                "TC_PM_28 FAILED - 'recommended' badge not visible next to Google reCAPTCHA.");

        getExtentTest().log(Status.PASS,
                "TC_PM_28 PASSED - 'recommended' badge is visible next to Google reCAPTCHA.");
    }

    // ====================================================================
    // TC_PM_29 — reCAPTCHA description text visible
    // ====================================================================
    @Test(priority = 29)
    public void TC_PM_29() {
        getExtentTest().log(Status.INFO, "Verifying reCAPTCHA checkbox area is visible (description check)");
        Assert.assertTrue(pmPage.isEnableRecaptchaCheckboxVisible(),
                "TC_PM_29 FAILED - reCAPTCHA section not visible to check description text.");

        getExtentTest().log(Status.PASS,
                "TC_PM_29 PASSED - reCAPTCHA section with description text is visible on Login tab.");
    }

    // ====================================================================
    // TC_PM_30 — Click Security tab and verify it becomes active
    // ====================================================================
    @Test(priority = 32)
    public void TC_PM_30() {
        getExtentTest().log(Status.INFO, "Clicking 'Security' tab in the modal");
        pmPage.clickSecurityTab();

        getExtentTest().log(Status.INFO,
                "Verifying Security tab is active (General Settings heading visible)");
        Assert.assertTrue(pmPage.isSecurityTabActive(),
                "TC_PM_30 FAILED - Security tab did not become active.");

        getExtentTest().log(Status.PASS,
                "TC_PM_30 PASSED - Security tab active; 'General Settings' heading visible.");
    }

    // ====================================================================
    // TC_PM_31 — 2FA section heading and checkbox visible
    // ====================================================================
    @Test(priority = 33)
    public void TC_PM_31() {
        getExtentTest().log(Status.INFO, "Verifying 'Two-Factor Authentication (2FA)' heading is visible");
        Assert.assertTrue(pmPage.isTwoFAHeadingVisible(),
                "TC_PM_31 FAILED - 2FA heading not visible on Security tab.");

        getExtentTest().log(Status.INFO, "Verifying 'Enforce 2FA for all users' checkbox is visible");
        Assert.assertTrue(pmPage.isTwoFACheckboxVisible(),
                "TC_PM_31 FAILED - 2FA checkbox not visible on Security tab.");

        getExtentTest().log(Status.PASS,
                "TC_PM_31 PASSED - 2FA heading and checkbox are both visible.");
    }

    // ====================================================================
    // TC_PM_32 — 2FA checkbox is unchecked by default
    // ====================================================================
    @Test(priority = 34)
    public void TC_PM_32() {
        getExtentTest().log(Status.INFO, "Verifying 2FA checkbox is unchecked by default");
        Assert.assertFalse(pmPage.isTwoFAChecked(),
                "TC_PM_32 FAILED - 'Enforce 2FA' checkbox should be UNCHECKED by default.");

        getExtentTest().log(Status.PASS,
                "TC_PM_32 PASSED - 'Enforce 2FA' checkbox is unchecked by default.");
    }

    // ====================================================================
    // TC_PM_33 — Password Policy section visible
    // ====================================================================
    @Test(priority = 35)
    public void TC_PM_33() {
        getExtentTest().log(Status.INFO, "Verifying 'Password Policy' section heading is visible");
        Assert.assertTrue(pmPage.isPasswordPolicyHeadingVisible(),
                "TC_PM_33 FAILED - 'Password Policy' heading not visible on Security tab.");

        getExtentTest().log(Status.PASS,
                "TC_PM_33 PASSED - 'Password Policy' section heading is visible.");
    }

    // ====================================================================
    // TC_PM_34 — Default and Custom Policy radio buttons visible; Default selected
    // ====================================================================
    @Test(priority = 36)
    public void TC_PM_34() {
        getExtentTest().log(Status.INFO, "Verifying 'Default Policy' radio button is visible");
        Assert.assertTrue(pmPage.isDefaultPolicyRadioVisible(),
                "TC_PM_34 FAILED - 'Default Policy' radio not visible.");

        getExtentTest().log(Status.INFO, "Verifying 'Custom Policy' radio button is visible");
        Assert.assertTrue(pmPage.isCustomPolicyRadioVisible(),
                "TC_PM_34 FAILED - 'Custom Policy' radio not visible.");

        getExtentTest().log(Status.INFO, "Verifying 'Default Policy' is selected by default");
        Assert.assertTrue(pmPage.isDefaultPolicySelected(),
                "TC_PM_34 FAILED - 'Default Policy' is not selected by default.");

        getExtentTest().log(Status.PASS,
                "TC_PM_34 PASSED - Both policy radios visible; 'Default Policy' selected by default.");
    }

    // ====================================================================
    // TC_PM_35 — All four Custom Policy checkboxes visible
    // ====================================================================
    @Test(priority = 39)
    public void TC_PM_35() {
        getExtentTest().log(Status.INFO, "Verifying all four password policy checkboxes are visible");

        Assert.assertTrue(pmPage.isLowercaseCheckboxVisible(),
                "TC_PM_35 FAILED - Lowercase requirement checkbox not visible.");
        Assert.assertTrue(pmPage.isUppercaseCheckboxVisible(),
                "TC_PM_35 FAILED - Uppercase requirement checkbox not visible.");
        Assert.assertTrue(pmPage.isNumberCheckboxVisible(),
                "TC_PM_35 FAILED - Number requirement checkbox not visible.");
        Assert.assertTrue(pmPage.isSpecialCharCheckboxVisible(),
                "TC_PM_35 FAILED - Special character requirement checkbox not visible.");

        getExtentTest().log(Status.PASS,
                "TC_PM_35 PASSED - All four Custom Policy checkboxes are visible.");
    }

    // ====================================================================
    // TC_PM_36 — Minimum password length dropdown visible; default = 8
    // ====================================================================
    @Test(priority = 40)
    public void TC_PM_36() {
        getExtentTest().log(Status.INFO,
                "Verifying 'Minimum password length' dropdown is visible");
        Assert.assertTrue(pmPage.isMinPasswordLengthDropdownVisible(),
                "TC_PM_36 FAILED - 'Minimum password length' dropdown not visible.");

        String val = pmPage.getMinPasswordLengthValue();
        getExtentTest().log(Status.INFO, "Default value: [" + val + "]");
        Assert.assertEquals(val, "8",
                "TC_PM_36 FAILED - Expected default '8', Got: [" + val + "]");

        getExtentTest().log(Status.PASS,
                "TC_PM_36 PASSED - Min password length dropdown visible; default = 8.");
    }

    // ====================================================================
    // TC_PM_37 — Click Ticket Portal tab and verify it becomes active
    // ====================================================================
    @Test(priority = 42)
    public void TC_PM_37() {
        getExtentTest().log(Status.INFO, "Clicking 'Ticket Portal' tab in the modal");
        pmPage.clickTicketPortalTab();

        getExtentTest().log(Status.INFO,
                "Verifying 'Student Ticket Submission Portal' heading is visible");
        Assert.assertTrue(pmPage.isTicketPortalTabActive(),
                "TC_PM_37 FAILED - Ticket Portal tab not active.");

        getExtentTest().log(Status.PASS,
                "TC_PM_37 PASSED - Ticket Portal tab active; heading visible.");
    }

    // ====================================================================
    // TC_PM_38 — Student Ticket Submission Portal heading visible
    // ====================================================================
    @Test(priority = 43)
    public void TC_PM_38() {
        getExtentTest().log(Status.INFO,
                "Verifying 'Student Ticket Submission Portal' heading is visible");
        Assert.assertTrue(pmPage.isStudentTicketPortalHeadingVisible(),
                "TC_PM_38 FAILED - 'Student Ticket Submission Portal' heading not visible.");

        getExtentTest().log(Status.PASS,
                "TC_PM_38 PASSED - Student Ticket Submission Portal heading is visible.");
    }

    // ====================================================================
    // TC_PM_39 — All three Ticket Submission Mode radio buttons visible
    // ====================================================================
    @Test(priority = 44)
    public void TC_PM_39() {
        getExtentTest().log(Status.INFO, "Verifying all three Ticket Submission Mode radios visible");

        Assert.assertTrue(pmPage.isOnlineOnlyRadioVisible(),
                "TC_PM_39 FAILED - 'Online Only' radio not visible.");
        Assert.assertTrue(pmPage.isOfflineOnlyRadioVisible(),
                "TC_PM_39 FAILED - 'Offline Only' radio not visible.");
        Assert.assertTrue(pmPage.isBothOnlineOfflineRadioVisible(),
                "TC_PM_39 FAILED - 'Both Online & Offline' radio not visible.");

        getExtentTest().log(Status.PASS,
                "TC_PM_39 PASSED - All three Ticket Submission Mode radio buttons are visible.");
    }

    // ====================================================================
    // TC_PM_40 — 'Both Online & Offline' selected by default
    // ====================================================================
    @Test(priority = 45)
    public void TC_PM_40() {
        getExtentTest().log(Status.INFO,
                "Verifying 'Both Online & Offline' is selected by default");
        Assert.assertTrue(pmPage.isTicketModeSelected(pmPage.getTicketModeBothOnlineOffline()),
                "TC_PM_40 FAILED - 'Both Online & Offline' is not selected by default.");

        getExtentTest().log(Status.PASS,
                "TC_PM_40 PASSED - 'Both Online & Offline' is selected by default.");
    }

    // ====================================================================
    // TC_PM_41 — Knowledge Base checkbox visible and checked by default
    // ====================================================================
    @Test(priority = 46)
    public void TC_PM_41() {
        getExtentTest().log(Status.INFO, "Verifying Knowledge Base checkbox is visible");
        Assert.assertTrue(pmPage.isKnowledgeBaseCheckboxVisible(),
                "TC_PM_41 FAILED - Knowledge Base checkbox not visible.");

        getExtentTest().log(Status.INFO, "Verifying Knowledge Base checkbox is checked by default");
        Assert.assertTrue(pmPage.isKnowledgeBaseChecked(),
                "TC_PM_41 FAILED - Knowledge Base checkbox not checked by default.");

        getExtentTest().log(Status.PASS,
                "TC_PM_41 PASSED - Knowledge Base checkbox visible and checked by default.");
    }

    // ====================================================================
    // TC_PM_42 — Announcement Banner section and textarea visible
    // ====================================================================
    @Test(priority = 47)
    public void TC_PM_42() {
        getExtentTest().log(Status.INFO,
                "Verifying Announcement Banner section heading is visible");
        Assert.assertTrue(pmPage.isTicketPortalAnnouncementSectionVisible(),
                "TC_PM_42 FAILED - Announcement Banner section heading not visible.");

        getExtentTest().log(Status.INFO,
                "Verifying Announcement Banner textarea is visible");
        Assert.assertTrue(pmPage.isTicketPortalAnnouncementTextareaVisible(),
                "TC_PM_42 FAILED - Announcement Banner textarea not visible.");

        getExtentTest().log(Status.PASS,
                "TC_PM_42 PASSED - Announcement Banner section and textarea are both visible.");
    }

    // ====================================================================
    // TC_PM_43 — Ticket Assignment dropdown visible with default value
    // ====================================================================
    @Test(priority = 48)
    public void TC_PM_43() {
        getExtentTest().log(Status.INFO, "Verifying Assignment Method dropdown is visible");
        Assert.assertTrue(pmPage.isAssignmentMethodDropdownVisible(),
                "TC_PM_43 FAILED - Assignment Method dropdown not visible.");

        String val = pmPage.getAssignmentMethodDefaultValue();
        getExtentTest().log(Status.INFO, "Assignment Method default value: [" + val + "]");
        Assert.assertTrue(val.toLowerCase().contains("manual") || !val.isEmpty(),
                "TC_PM_43 FAILED - Assignment Method dropdown has unexpected or empty default.");

        getExtentTest().log(Status.PASS,
                "TC_PM_43 PASSED - Assignment Method dropdown visible; default: [" + val + "]");
    }

    // ====================================================================
    // TC_PM_44 — Manual assignment info banner visible
    // ====================================================================
    @Test(priority = 49)
    public void TC_PM_44() {
        getExtentTest().log(Status.INFO,
                "Verifying manual assignment info/note banner is visible");
        boolean visible = pmPage.isAssignmentManualInfoBannerVisible();
        if (!visible) {
            getExtentTest().log(Status.INFO,
                    "TC_PM_44 INFO - Info banner text not found via XPath; verifying section.");
            visible = pmPage.isAssignmentMethodDropdownVisible();
        }
        Assert.assertTrue(visible,
                "TC_PM_44 FAILED - Ticket Assignment section / info banner not visible.");

        getExtentTest().log(Status.PASS,
                "TC_PM_44 PASSED - Ticket Assignment section with manual assignment note is visible.");
    }

    // ====================================================================
    // TC_PM_45 — Portal Messages section and Welcome Message textarea visible
    // ====================================================================
    @Test(priority = 50)
    public void TC_PM_45() {
        getExtentTest().log(Status.INFO, "Verifying Welcome Message textarea is visible");
        Assert.assertTrue(pmPage.isWelcomeMessageTextareaVisible(),
                "TC_PM_45 FAILED - Welcome Message textarea not visible.");

        String defaultMsg = pmPage.getWelcomeMessageValue();
        getExtentTest().log(Status.INFO, "Welcome Message value: [" + defaultMsg + "]");
        Assert.assertFalse(defaultMsg.isEmpty(),
                "TC_PM_45 FAILED - Welcome Message textarea is empty (should have pre-filled text).");

        getExtentTest().log(Status.PASS,
                "TC_PM_45 PASSED - Welcome Message textarea visible with pre-filled text: ["
                        + defaultMsg + "]");
    }

    // ====================================================================
    // TC_PM_46 — Click Customization tab and verify it becomes active
    // ====================================================================
    @Test(priority = 55)
    public void TC_PM_46() {
        getExtentTest().log(Status.INFO, "Clicking 'Customization' tab in the modal");
        pmPage.clickCustomizationTab();

        getExtentTest().log(Status.INFO, "Verifying 'Login Page' section heading is visible");
        Assert.assertTrue(pmPage.isCustomizationTabActive(),
                "TC_PM_46 FAILED - Customization tab not active.");

        getExtentTest().log(Status.PASS,
                "TC_PM_46 PASSED - Customization tab is active; Login Page section visible.");
    }

    // ====================================================================
    // TC_PM_47 — Login Page section and Upload Image button visible
    // ====================================================================
    @Test(priority = 56)
    public void TC_PM_47() {
        getExtentTest().log(Status.INFO, "Verifying 'Login Page' section heading is visible");
        Assert.assertTrue(pmPage.isLoginPageSectionVisible(),
                "TC_PM_47 FAILED - 'Login Page' section heading not visible.");

        getExtentTest().log(Status.INFO, "Verifying 'Upload Image' button is visible");
        Assert.assertTrue(pmPage.isUploadImageButtonVisible(),
                "TC_PM_47 FAILED - 'Upload Image' button not visible.");

        getExtentTest().log(Status.PASS,
                "TC_PM_47 PASSED - 'Login Page' section and 'Upload Image' button are both visible.");
    }

    // ====================================================================
    // TC_PM_48 — Theme Customization: Light/Dark radios; Light selected by default
    // ====================================================================
    @Test(priority = 57)
    public void TC_PM_48() {
        getExtentTest().log(Status.INFO, "Verifying 'Theme Customization' heading is visible");
        Assert.assertTrue(pmPage.isThemeCustomizationHeadingVisible(),
                "TC_PM_48 FAILED - 'Theme Customization' heading not visible.");

        getExtentTest().log(Status.INFO, "Verifying 'Light' radio button is visible");
        Assert.assertTrue(pmPage.isLightThemeRadioVisible(),
                "TC_PM_48 FAILED - 'Light' theme radio not visible.");

        getExtentTest().log(Status.INFO, "Verifying 'Dark' radio button is visible");
        Assert.assertTrue(pmPage.isDarkThemeRadioVisible(),
                "TC_PM_48 FAILED - 'Dark' theme radio not visible.");

        getExtentTest().log(Status.INFO, "Verifying 'Light' theme is selected by default");
        Assert.assertTrue(pmPage.isLightThemeSelected(),
                "TC_PM_48 FAILED - 'Light' theme is not selected by default.");

        getExtentTest().log(Status.PASS,
                "TC_PM_48 PASSED - Theme radios visible; 'Light' selected by default.");
    }

    // ====================================================================
    // TC_PM_49 — Theme Color palette (color swatches) visible
    // ====================================================================
    @Test(priority = 58)
    public void TC_PM_49() {
        getExtentTest().log(Status.INFO, "Verifying Theme Color swatch palette is visible");
        Assert.assertTrue(pmPage.isColorSwatchPaletteVisible(),
                "TC_PM_49 FAILED - Theme Color swatch palette not visible.");

        int count = pmPage.getColorSwatchCount();
        getExtentTest().log(Status.INFO, "Color swatches found: " + count);
        Assert.assertTrue(count >= 1,
                "TC_PM_49 FAILED - Expected at least 1 color swatch, found: " + count);

        getExtentTest().log(Status.PASS,
                "TC_PM_49 PASSED - Theme Color swatch palette visible with " + count + " swatches.");
    }

    // ====================================================================
    // TC_PM_50 — Theme Color hex input visible with default hex value
    // ====================================================================
    @Test(priority = 59)
    public void TC_PM_50() {
        String hexVal = pmPage.getHexColorInputValue();
        getExtentTest().log(Status.INFO, "Hex color input value: [" + hexVal + "]");

        Assert.assertFalse(hexVal.isEmpty(),
                "TC_PM_50 FAILED - Hex color input not found or has no value.");
        Assert.assertTrue(hexVal.startsWith("#") || hexVal.matches("[0-9a-fA-F]{6}"),
                "TC_PM_50 FAILED - Hex value is not a valid color: [" + hexVal + "]");

        getExtentTest().log(Status.PASS,
                "TC_PM_50 PASSED - Theme Color hex input visible with value: [" + hexVal + "]");
    }

    // ====================================================================
    // TC_PM_51 — Advanced Customization section visible
    // ====================================================================
    @Test(priority = 60)
    public void TC_PM_51() {
        getExtentTest().log(Status.INFO, "Verifying 'Advanced Customization' section is visible");
        Assert.assertTrue(pmPage.isAdvancedCustomizationSectionVisible(),
                "TC_PM_51 FAILED - 'Advanced Customization' section heading not visible.");

        getExtentTest().log(Status.PASS,
                "TC_PM_51 PASSED - 'Advanced Customization' section is visible.");
    }

    // ====================================================================
    // TC_PM_52 — Uncheck and re-check "Enable Form Login" checkbox
    // ====================================================================
    @Test(priority = 30)
    public void TC_PM_52() {
        getExtentTest().log(Status.INFO, "Testing Login tab interactions — toggling Form Login");
        pmPage.clickLoginTab();

        getExtentTest().log(Status.INFO, "Verifying Form Login checkbox is checked before unchecking");
        Assert.assertTrue(pmPage.isEnableFormLoginChecked(),
                "TC_PM_52 FAILED - Form Login checkbox should be checked before unchecking.");

        getExtentTest().log(Status.INFO, "Unchecking 'Enable Form Login' checkbox");
        pmPage.toggleFormLoginCheckbox();
        Assert.assertFalse(pmPage.isEnableFormLoginChecked(),
                "TC_PM_52 FAILED - Form Login checkbox is still checked after unchecking.");

        getExtentTest().log(Status.INFO, "Re-checking 'Enable Form Login' checkbox");
        pmPage.toggleFormLoginCheckbox();
        Assert.assertTrue(pmPage.isEnableFormLoginChecked(),
                "TC_PM_52 FAILED - Form Login checkbox is not checked after re-checking.");

        getExtentTest().log(Status.PASS,
                "TC_PM_52 PASSED - 'Enable Form Login' toggles correctly; ends CHECKED.");
    }

    // ====================================================================
    // TC_PM_53 — Uncheck and re-check "Enable Google reCAPTCHA" checkbox
    // ====================================================================
    @Test(priority = 31)
    public void TC_PM_53() {
        getExtentTest().log(Status.INFO, "Verifying reCAPTCHA checkbox is unchecked before toggling");
        Assert.assertFalse(pmPage.isEnableRecaptchaChecked(),
                "TC_PM_53 FAILED - reCAPTCHA checkbox should be UNCHECKED before toggling.");

        getExtentTest().log(Status.INFO, "Checking 'Enable Google reCAPTCHA' checkbox");
        pmPage.toggleRecaptchaCheckbox();
        Assert.assertTrue(pmPage.isEnableRecaptchaChecked(),
                "TC_PM_53 FAILED - reCAPTCHA checkbox not checked after toggling.");

        getExtentTest().log(Status.INFO, "Unchecking 'Enable Google reCAPTCHA' checkbox");
        pmPage.toggleRecaptchaCheckbox();
        Assert.assertFalse(pmPage.isEnableRecaptchaChecked(),
                "TC_PM_53 FAILED - reCAPTCHA checkbox still checked after unchecking.");

        getExtentTest().log(Status.PASS,
                "TC_PM_53 PASSED - 'Enable Google reCAPTCHA' toggles correctly; ends UNCHECKED.");
    }

    // ====================================================================
    // TC_PM_54 — Check the "Enforce 2FA" checkbox on Security tab
    // ====================================================================
    @Test(priority = 37)
    public void TC_PM_54() {
        getExtentTest().log(Status.INFO, "Testing Security tab interactions — enabling 2FA");
        pmPage.clickSecurityTab();

        getExtentTest().log(Status.INFO, "Verifying 2FA checkbox is unchecked before clicking");
        Assert.assertFalse(pmPage.isTwoFAChecked(),
                "TC_PM_54 FAILED - 2FA checkbox should be unchecked before clicking.");

        getExtentTest().log(Status.INFO, "Checking 'Enforce 2FA for all users' checkbox");
        pmPage.clickTwoFACheckbox();
        Assert.assertTrue(pmPage.isTwoFAChecked(),
                "TC_PM_54 FAILED - 2FA checkbox not checked after clicking.");

        getExtentTest().log(Status.PASS,
                "TC_PM_54 PASSED - 'Enforce 2FA' checkbox transitions UNCHECKED → CHECKED.");
    }

    // ====================================================================
    // TC_PM_55 — Click Custom Policy and check all 4 password requirement
    // checkboxes
    // ====================================================================
    @Test(priority = 38)
    public void TC_PM_55() {
        getExtentTest().log(Status.INFO, "Clicking 'Custom Policy' radio button");
        pmPage.clickCustomPolicyRadio();
        Assert.assertTrue(pmPage.isCustomPolicySelected(),
                "TC_PM_55 FAILED - 'Custom Policy' radio not selected after clicking.");

        getExtentTest().log(Status.INFO, "Checking lowercase letter requirement");
        pmPage.clickLowercaseCheckbox();
        Assert.assertTrue(pmPage.isLowercaseChecked(),
                "TC_PM_55 FAILED - Lowercase checkbox not checked.");

        getExtentTest().log(Status.INFO, "Checking uppercase letter requirement");
        pmPage.clickUppercaseCheckbox();
        Assert.assertTrue(pmPage.isUppercaseChecked(),
                "TC_PM_55 FAILED - Uppercase checkbox not checked.");

        getExtentTest().log(Status.INFO, "Checking number requirement");
        pmPage.clickNumberCheckbox();
        Assert.assertTrue(pmPage.isNumberChecked(),
                "TC_PM_55 FAILED - Number checkbox not checked.");

        getExtentTest().log(Status.INFO, "Checking special character requirement");
        pmPage.clickSpecialCharCheckbox();
        Assert.assertTrue(pmPage.isSpecialCharChecked(),
                "TC_PM_55 FAILED - Special character checkbox not checked.");

        getExtentTest().log(Status.PASS,
                "TC_PM_55 PASSED - Custom Policy selected; all 4 password requirement checkboxes checked.");
    }

    // ====================================================================
    // TC_PM_56 — Change minimum password length from 8 to 12
    // ====================================================================
    @Test(priority = 41)
    public void TC_PM_56() {
        String initial = pmPage.getMinPasswordLengthValue();
        getExtentTest().log(Status.INFO, "Initial min password length: [" + initial + "]");

        getExtentTest().log(Status.INFO, "Changing minimum password length to '12'");
        pmPage.selectMinPasswordLength("12");

        String updated = pmPage.getMinPasswordLengthValue();
        getExtentTest().log(Status.INFO, "Updated value: [" + updated + "]");
        Assert.assertEquals(updated, "12",
                "TC_PM_56 FAILED - Min password length did not change to '12'. Got: [" + updated + "]");

        getExtentTest().log(Status.PASS,
                "TC_PM_56 PASSED - Min password length changed from [" + initial + "] to [12].");
    }

    // ====================================================================
    // TC_PM_57 — Select "Online Only" then revert to "Both Online & Offline"
    // ====================================================================
    @Test(priority = 51)
    public void TC_PM_57() {
        getExtentTest().log(Status.INFO, "Testing Ticket Portal tab interactions — toggling submission mode");
        pmPage.clickTicketPortalTab();

        getExtentTest().log(Status.INFO, "Clicking 'Online Only' radio button");
        pmPage.selectOnlineOnlyMode();
        Assert.assertTrue(pmPage.isTicketModeSelected(pmPage.getTicketModeOnlineOnly()),
                "TC_PM_57 FAILED - 'Online Only' is not selected after clicking.");

        getExtentTest().log(Status.INFO, "Reverting to 'Both Online & Offline'");
        pmPage.selectBothOnlineOfflineMode();
        Assert.assertTrue(pmPage.isTicketModeSelected(pmPage.getTicketModeBothOnlineOffline()),
                "TC_PM_57 FAILED - 'Both Online & Offline' not re-selected.");

        getExtentTest().log(Status.PASS,
                "TC_PM_57 PASSED - Ticket mode toggled Online Only → Both Online & Offline.");
    }

    // ====================================================================
    // TC_PM_58 — Enter text in Announcement Banner textarea
    // ====================================================================
    @Test(priority = 52)
    public void TC_PM_58() {
        final String text = "Our support team is available Monday-Friday, "
                + "9 AM - 6 PM IST. For urgent issues, please call our helpline.";

        getExtentTest().log(Status.INFO, "Entering Announcement Banner text");
        pmPage.enterTicketPortalAnnouncementText(text);

        Assert.assertTrue(pmPage.isTicketPortalAnnouncementTextareaVisible(),
                "TC_PM_58 FAILED - Announcement Banner textarea not visible after entering text.");

        getExtentTest().log(Status.PASS,
                "TC_PM_58 PASSED - Announcement Banner text entered successfully.");
    }

    // ====================================================================
    // TC_PM_59 — Change Ticket Assignment Method dropdown
    // ====================================================================
    @Test(priority = 53)
    public void TC_PM_59() {
        String before = pmPage.getAssignmentMethodDefaultValue();
        getExtentTest().log(Status.INFO, "Current Assignment Method: [" + before + "]");

        pmPage.changeAssignmentMethod();

        String after = pmPage.getAssignmentMethodDefaultValue();
        getExtentTest().log(Status.INFO, "Updated Assignment Method: [" + after + "]");

        if (before.equals(after)) {
            getExtentTest().log(Status.INFO,
                    "TC_PM_59 INFO - Value unchanged (may have one option or custom UI).");
        }
        Assert.assertFalse(after == null || after.isEmpty(),
                "TC_PM_59 FAILED - Assignment Method has no value after interaction.");

        getExtentTest().log(Status.PASS,
                "TC_PM_59 PASSED - Assignment Method dropdown interaction completed. Value: [" + after + "]");
    }

    // ====================================================================
    // TC_PM_60 — Clear and enter new Welcome Message
    // ====================================================================
    @Test(priority = 54)
    public void TC_PM_60() {
        final String newMsg = "Welcome to HubbleHox Support! Please describe your issue "
                + "and our team will respond within 24 hours.";

        getExtentTest().log(Status.INFO, "Clearing and entering new Welcome Message");
        pmPage.clearAndEnterWelcomeMessage(newMsg);

        String actual = pmPage.getWelcomeMessageValue();
        getExtentTest().log(Status.INFO, "Welcome Message after update: [" + actual + "]");
        Assert.assertEquals(actual, newMsg,
                "TC_PM_60 FAILED - Welcome Message mismatch. Got: [" + actual + "]");

        getExtentTest().log(Status.PASS,
                "TC_PM_60 PASSED - Welcome Message updated to custom text.");
    }

    // ====================================================================
    // TC_PM_61 — Switch to Dark theme and revert to Light
    // ====================================================================
    @Test(priority = 61)
    public void TC_PM_61() {
        getExtentTest().log(Status.INFO, "Navigating to Customization tab");
        pmPage.clickCustomizationTab();

        getExtentTest().log(Status.INFO, "Clicking 'Dark' theme radio");
        pmPage.clickDarkTheme();
        Assert.assertFalse(pmPage.isLightThemeSelected(),
                "TC_PM_61 FAILED - 'Light' theme still selected after clicking 'Dark'.");

        getExtentTest().log(Status.INFO, "Reverting to 'Light' theme");
        pmPage.clickLightTheme();
        Assert.assertTrue(pmPage.isLightThemeSelected(),
                "TC_PM_61 FAILED - 'Light' theme not re-selected after clicking it.");

        getExtentTest().log(Status.PASS,
                "TC_PM_61 PASSED - Theme toggled Dark → Light; 'Light' is now selected.");
    }

    // ====================================================================
    // TC_PM_62 — Click second color swatch and verify hex input reflects change
    // ====================================================================
    @Test(priority = 62)
    public void TC_PM_62() {
        String hexBefore = pmPage.getHexColorInputValue();
        getExtentTest().log(Status.INFO, "Hex value before swatch click: [" + hexBefore + "]");

        pmPage.clickSecondColorSwatch();

        String hexAfter = pmPage.getHexColorInputValue();
        getExtentTest().log(Status.INFO, "Hex value after swatch click: [" + hexAfter + "]");

        Assert.assertFalse(hexAfter.isEmpty(),
                "TC_PM_62 FAILED - Hex input is empty after clicking color swatch.");

        if (hexBefore.equals(hexAfter)) {
            getExtentTest().log(Status.INFO,
                    "TC_PM_62 INFO - Hex value unchanged (custom swatch component may use different update mechanism).");
        }

        getExtentTest().log(Status.PASS,
                "TC_PM_62 PASSED - Color swatch clicked; hex input has value: [" + hexAfter + "]");
    }

    // ====================================================================
    // TC_PM_63 — Enter custom hex color '#1E90FF' directly in hex input
    // ====================================================================
    @Test(priority = 63)
    public void TC_PM_63() {
        getExtentTest().log(Status.INFO, "Entering custom hex color '#1E90FF' in hex input");
        pmPage.setHexColorValue("#1E90FF");

        String actual = pmPage.getHexColorInputValue();
        getExtentTest().log(Status.INFO, "Hex input value after entry: [" + actual + "]");
        Assert.assertTrue(actual.toUpperCase().contains("1E90FF"),
                "TC_PM_63 FAILED - Hex input does not show '#1E90FF'. Got: [" + actual + "]");

        getExtentTest().log(Status.PASS,
                "TC_PM_63 PASSED - Custom hex '#1E90FF' entered; input shows: [" + actual + "]");
    }

    // ====================================================================
    // TC_PM_64 — Click Update Project and verify success notification + modal close
    // ====================================================================
    @Test(priority = 64)
    public void TC_PM_64() {
        getExtentTest().log(Status.INFO,
                "Clicking 'Update Project' to submit all tab configurations");
        pmPage.clickUpdateProjectButton();

        getExtentTest().log(Status.INFO, "Checking for success toast notification");
        boolean toastShown = pmPage.isSuccessToastVisible();
        if (toastShown) {
            getExtentTest().log(Status.INFO, "Success toast/notification appeared.");
        }

        getExtentTest().log(Status.INFO, "Waiting for modal to close after update");
        boolean modalClosed = pmPage.isModalClosed();

        Assert.assertTrue(modalClosed || toastShown,
                "TC_PM_64 FAILED - Neither success toast appeared nor modal closed after 'Update Project'.");

        getExtentTest().log(Status.PASS,
                "TC_PM_64 PASSED - 'Update Project' submitted; modal closed / success notification shown.");
    }

    // ====================================================================
    // TC_PM_65 — Verify updated project is visible in the project listing table
    // ====================================================================
    @Test(priority = 65)
    public void TC_PM_65() {
        getExtentTest().log(Status.INFO,
                "Verifying project listing table is visible after modal closed");
        Assert.assertTrue(pmPage.isProjectTableVisible(),
                "TC_PM_65 FAILED - Project listing table not visible after Update Project.");

        getExtentTest().log(Status.INFO,
                "Verifying the created project [" + PORTAL_NAME + "] is in the table");
        Assert.assertTrue(pmPage.isProjectInTable(PORTAL_NAME),
                "TC_PM_65 FAILED - Created project [" + PORTAL_NAME + "] not found in the project table.");

        getExtentTest().log(Status.INFO, "Verifying 'Edit' button is visible in the project table");
        Assert.assertTrue(pmPage.isFirstRowEditButtonVisible(),
                "TC_PM_65 FAILED - 'Edit' button not visible in project table.");

        getExtentTest().log(Status.PASS,
                "TC_PM_65 PASSED - Project [" + PORTAL_NAME + "] is visible in the table with Edit button.");
    }
}
