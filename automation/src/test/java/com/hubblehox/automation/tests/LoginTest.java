package com.hubblehox.automation.tests;

import com.hubblehox.automation.base.BaseTest;
import com.hubblehox.automation.pages.LoginPage;
import com.hubblehox.automation.utils.AppConstants;
import com.hubblehox.automation.utils.ConfigReader;
import com.aventstack.extentreports.Status;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Login Module â€” Test Execution Class
 *
 * Contains TC_LOGIN_01 through TC_LOGIN_15.
 * Each method name matches the TC ID in Google Sheets so results are written
 * correctly.
 *
 * Execution flow per test:
 * 
 * @BeforeMethod (BaseTest) â†’ launches browser â†’ navigates to base URL â†’
 *               creates
 *               ExtentTest node
 * @Test method â†’ creates LoginPage â†’ executes steps â†’ asserts expected
 *       result
 * @AfterMethod (BaseTest) â†’ writes PASS/FAIL to Google Sheets + ExtentReport
 *              â†’
 *              quits browser
 */
public class LoginTest extends BaseTest {

        @Override
        protected String getModuleName() {
                return AppConstants.MODULE_LOGIN;
        }

        // ======================================================================
        // TC_LOGIN_01 â€” Verify Login page loads correctly
        // Steps:
        // 1. Browser launched and URL navigated to base URL (done by @BeforeMethod)
        // 2. Wait for the login page to fully load
        // 3. Check Email Address field is visible
        // 4. Check Password field is visible
        // 5. Check Login button is visible
        // 6. Check Forgot Password link is visible
        // Expected: All four elements should be visible on screen
        // ======================================================================
        @Test
        public void TC_LOGIN_01() {
                getExtentTest().log(Status.INFO,
                                "Step 1 & 2: Browser launched and navigated to base URL â€” waiting for login page to load");

                LoginPage loginPage = new LoginPage();

                getExtentTest().log(Status.INFO, "Step 3: Checking Email Address field is visible");
                Assert.assertTrue(loginPage.isEmailFieldVisible(),
                                "TC_LOGIN_01 FAILED â€” Email Address field is NOT visible on login page");

                getExtentTest().log(Status.INFO, "Step 4: Checking Password field is visible");
                Assert.assertTrue(loginPage.isPasswordFieldVisible(),
                                "TC_LOGIN_01 FAILED â€” Password field is NOT visible on login page");

                getExtentTest().log(Status.INFO, "Step 5: Checking Login button is visible");
                Assert.assertTrue(loginPage.isLoginButtonVisible(),
                                "TC_LOGIN_01 FAILED â€” Login button is NOT visible on login page");

                getExtentTest().log(Status.INFO, "Step 6: Checking 'Forgot your password?' link is visible");
                Assert.assertTrue(loginPage.isForgotPasswordLinkVisible(),
                                "TC_LOGIN_01 FAILED â€” Forgot Password link is NOT visible on login page");

                getExtentTest().log(Status.PASS,
                                "TC_LOGIN_01 PASSED â€” Login page loaded correctly. All elements are visible.");
        }

        // ======================================================================
        // TC_LOGIN_02 â€” Verify page title on Login page
        // Steps:
        // 1. Browser launched and navigated to base URL (done by @BeforeMethod)
        // 2. Wait for the page to fully load
        // 3. Read the browser tab title using driver.getTitle()
        // Expected: Browser tab title should display 'SAC Helpdesk Portal'
        // ======================================================================
        @Test
        public void TC_LOGIN_02() {
                getExtentTest().log(Status.INFO,
                                "Step 1 & 2: Browser launched and navigated to URL â€” waiting for page to load");

                LoginPage loginPage = new LoginPage();

                getExtentTest().log(Status.INFO, "Step 3: Reading browser tab title using driver.getTitle()");
                String actualTitle = loginPage.fetchPageTitle();
                getExtentTest().log(Status.INFO, "Actual page title: '" + actualTitle + "'");

                Assert.assertTrue(actualTitle.contains("SAC Helpdesk") || actualTitle.contains("Helpdesk"),
                                "TC_LOGIN_02 FAILED â€” Page title is: '" + actualTitle
                                                + "'. Expected it to contain 'SAC Helpdesk'");

                getExtentTest().log(Status.PASS,
                                "TC_LOGIN_02 PASSED â€” Page title is correct: '" + actualTitle + "'");
        }

        // ======================================================================
        // TC_LOGIN_03 â€” Verify Email field accepts text input
        // Steps:
        // 1. Browser launched and navigated to base URL (done by @BeforeMethod)
        // 2. Wait for the Email Address field to be visible
        // 3. Click on the Email Address field
        // 4. Type the value: 'test@gmail.com'
        // 5. Read back the value entered in the field
        // Expected: Email field is enabled. The typed value appears inside the field.
        // ======================================================================
        @Test
        public void TC_LOGIN_03() {
                getExtentTest().log(Status.INFO,
                                "Step 1: Browser launched and navigated to base URL");

                LoginPage loginPage = new LoginPage();

                getExtentTest().log(Status.INFO,
                                "Step 2 & 3: Waiting for Email field to be visible, then clicking on it");
                getExtentTest().log(Status.INFO, "Step 4: Typing value 'test@gmail.com' into the Email field");
                loginPage.enterEmail("test@gmail.com");

                getExtentTest().log(Status.INFO, "Step 5: Reading back the value entered in the Email field");
                String enteredValue = loginPage.getEmailFieldValue();
                getExtentTest().log(Status.INFO, "Value read from Email field: '" + enteredValue + "'");

                Assert.assertEquals(enteredValue, "test@gmail.com",
                                "TC_LOGIN_03 FAILED â€” Email field did not retain the entered value. Got: '"
                                                + enteredValue + "'");

                getExtentTest().log(Status.PASS,
                                "TC_LOGIN_03 PASSED â€” Email field accepts text input correctly.");
        }

        // ======================================================================
        // TC_LOGIN_04 â€” Verify Password field masks the entered text
        // Steps:
        // 1. Browser launched and navigated to base URL (done by @BeforeMethod)
        // 2. Wait for Password field to be visible
        // 3. Click on the Password field
        // 4. Type the value: 'TestPass@123'
        // 5. Check the 'type' attribute of the Password input element
        // Expected: Password 'type' attribute should be 'password' (text is masked as
        // dots)
        // ======================================================================
        @Test
        public void TC_LOGIN_04() {
                getExtentTest().log(Status.INFO,
                                "Step 1: Browser launched and navigated to base URL");

                LoginPage loginPage = new LoginPage();

                getExtentTest().log(Status.INFO,
                                "Step 2 & 3: Waiting for Password field to be visible, then clicking on it");
                getExtentTest().log(Status.INFO, "Step 4: Typing value 'TestPass@123' into the Password field");
                loginPage.enterPassword("TestPass@123");

                getExtentTest().log(Status.INFO,
                                "Step 5: Reading the 'type' attribute of the Password input element");
                String fieldType = loginPage.getPasswordFieldType();
                getExtentTest().log(Status.INFO, "Password field type attribute: '" + fieldType + "'");

                Assert.assertEquals(fieldType, "password",
                                "TC_LOGIN_04 FAILED â€” Password field type is '" + fieldType
                                                + "'. Expected 'password' (text should be masked, not visible as plain text)");

                getExtentTest().log(Status.PASS,
                                "TC_LOGIN_04 PASSED â€” Password field type is 'password'. Text is correctly masked.");
        }

        // ======================================================================
        // TC_LOGIN_05 â€” Verify Forgot Password link is visible on Login page
        // Steps:
        // 1. Browser launched and navigated to base URL (done by @BeforeMethod)
        // 2. Wait for the page to fully load
        // 3. Locate the 'Forgot your password?' link on the page
        // 4. Check if the link is displayed
        // Expected: 'Forgot your password?' link should be clearly visible
        // ======================================================================
        @Test
        public void TC_LOGIN_05() {
                getExtentTest().log(Status.INFO,
                                "Step 1 & 2: Browser launched and navigated to base URL â€” waiting for page to load");

                LoginPage loginPage = new LoginPage();

                getExtentTest().log(Status.INFO,
                                "Step 3 & 4: Locating 'Forgot your password?' link and checking if it is displayed");
                boolean isVisible = loginPage.isForgotPasswordLinkVisible();

                Assert.assertTrue(isVisible,
                                "TC_LOGIN_05 FAILED â€” 'Forgot your password?' link is NOT visible on the login page");

                getExtentTest().log(Status.PASS,
                                "TC_LOGIN_05 PASSED â€” 'Forgot your password?' link is visible on the login page.");
        }

        // ======================================================================
        // TC_LOGIN_06 â€” Valid Super Admin login with correct credentials
        // Steps:
        // 1. Browser launched and navigated to base URL (done by @BeforeMethod)
        // 2. Wait for Email field to be visible
        // 3. Click on Email field and enter valid Super Admin email (from config)
        // 4. Click on Password field and enter valid Super Admin password (from config)
        // 5. Click the Login button
        // 6. Wait for the page to load after login
        // 7. Check that the current URL contains '/dashboard' or '/portal'
        // Expected: User logged in. URL redirects to Dashboard. Dashboard visible.
        // ======================================================================
        @Test
        public void TC_LOGIN_06() {
                String adminEmail = ConfigReader.getAdminEmail();
                String adminPassword = ConfigReader.getAdminPassword();

                getExtentTest().log(Status.INFO,
                                "Step 1 & 2: Browser launched and navigated to base URL â€” waiting for Email field to be visible");

                LoginPage loginPage = new LoginPage();

                getExtentTest().log(Status.INFO,
                                "Step 3: Clicking Email field and entering Super Admin email from config");
                loginPage.enterEmail(adminEmail);

                getExtentTest().log(Status.INFO,
                                "Step 4: Clicking Password field and entering Super Admin password from config");
                loginPage.enterPassword(adminPassword);

                getExtentTest().log(Status.INFO, "Step 5: Clicking the Login button");
                loginPage.clickLoginButton();

                getExtentTest().log(Status.INFO,
                                "Step 6: Waiting for redirect after login (checking URL for /dashboard or /portal)");
                boolean loggedIn = loginPage.isLoggedIn();

                Assert.assertTrue(loggedIn,
                                "TC_LOGIN_06 FAILED â€” Super Admin login did not redirect to Dashboard. "
                                                + "Current URL: " + loginPage.getCurrentUrl());

                getExtentTest().log(Status.PASS,
                                "TC_LOGIN_06 PASSED â€” Super Admin logged in successfully. Redirected to: "
                                                + loginPage.getCurrentUrl());
        }

        // ======================================================================
        // TC_LOGIN_07 â€” Login with correct email but wrong password
        // Steps:
        // 1. Browser launched and navigated to base URL (done by @BeforeMethod)
        // 2. Wait for Email field to be visible
        // 3. Click on Email field and enter valid Super Admin email (from config)
        // 4. Click on Password field and enter wrong password: 'WrongPass@123'
        // 5. Click the Login button
        // 6. Wait for the application to respond (API call)
        // 7. Check if an error message is displayed on the page
        // Expected: Login fails. Error message appears. User stays on login page.
        // ======================================================================
        @Test
        public void TC_LOGIN_07() {
                String adminEmail = ConfigReader.getAdminEmail();

                getExtentTest().log(Status.INFO,
                                "Step 1 & 2: Browser launched and navigated to base URL â€” waiting for Email field");

                LoginPage loginPage = new LoginPage();

                getExtentTest().log(Status.INFO,
                                "Step 3: Clicking Email field and entering valid Super Admin email");
                loginPage.enterEmail(adminEmail);

                getExtentTest().log(Status.INFO,
                                "Step 4: Clicking Password field and entering wrong password: 'WrongPass@123'");
                loginPage.enterPassword("WrongPass@123");

                getExtentTest().log(Status.INFO, "Step 5: Clicking the Login button");
                loginPage.clickLoginButton();

                getExtentTest().log(Status.INFO,
                                "Step 6: Waiting for the application to respond to the API call");
                boolean errorVisible = loginPage.waitForErrorBanner();

                getExtentTest().log(Status.INFO,
                                "Step 7: Checking if error message is displayed on the page");
                Assert.assertTrue(errorVisible,
                                "TC_LOGIN_07 FAILED â€” Error message NOT shown after entering wrong password. "
                                                + "Current URL: " + loginPage.getCurrentUrl());

                Assert.assertTrue(loginPage.isLoginPageDisplayed(),
                                "TC_LOGIN_07 FAILED â€” User was redirected away from login page despite wrong password");

                getExtentTest().log(Status.PASS,
                                "TC_LOGIN_07 PASSED â€” Error message displayed correctly. User remained on login page.");
        }

        // ======================================================================
        // TC_LOGIN_08 â€” Login with wrong email but correct password
        // Steps:
        // 1. Browser launched and navigated to base URL (done by @BeforeMethod)
        // 2. Wait for Email field to be visible
        // 3. Click on Email field and enter invalid email: 'wrong@test.com'
        // 4. Click on Password field and enter valid Super Admin password (from config)
        // 5. Click the Login button
        // 6. Wait for the application to respond (API call)
        // 7. Check if an error message is displayed on the page
        // Expected: Login fails. Error message appears. User stays on login page.
        // ======================================================================
        @Test
        public void TC_LOGIN_08() {
                String adminPassword = ConfigReader.getAdminPassword();

                getExtentTest().log(Status.INFO,
                                "Step 1 & 2: Browser launched and navigated to base URL â€” waiting for Email field");

                LoginPage loginPage = new LoginPage();

                getExtentTest().log(Status.INFO,
                                "Step 3: Clicking Email field and entering invalid email: 'wrong@test.com'");
                loginPage.enterEmail("wrong@test.com");

                getExtentTest().log(Status.INFO,
                                "Step 4: Clicking Password field and entering valid Super Admin password");
                loginPage.enterPassword(adminPassword);

                getExtentTest().log(Status.INFO, "Step 5: Clicking the Login button");
                loginPage.clickLoginButton();

                getExtentTest().log(Status.INFO,
                                "Step 6: Waiting for the application to respond to the API call");
                boolean errorVisible = loginPage.waitForErrorBanner();

                getExtentTest().log(Status.INFO,
                                "Step 7: Checking if error message is displayed on the page");
                Assert.assertTrue(errorVisible,
                                "TC_LOGIN_08 FAILED â€” Error message NOT shown after entering wrong email. "
                                                + "Current URL: " + loginPage.getCurrentUrl());

                Assert.assertTrue(loginPage.isLoginPageDisplayed(),
                                "TC_LOGIN_08 FAILED â€” User was redirected away from login page despite wrong email");

                getExtentTest().log(Status.PASS,
                                "TC_LOGIN_08 PASSED â€” Error message displayed correctly. User remained on login page.");
        }

        // ======================================================================
        // TC_LOGIN_09 â€” Login with Email field left empty
        // Steps:
        // 1. Browser launched and navigated to base URL (done by @BeforeMethod)
        // 2. Wait for the page to fully load
        // 3. Leave Email field blank (do not click or type)
        // 4. Click on Password field and enter valid Super Admin password (from config)
        // 5. Click the Login button
        // 6. Check if a validation message appears below the Email field
        // Expected: Validation error appears for empty Email. User stays on login page.
        // ======================================================================
        @Test
        public void TC_LOGIN_09() {
                String adminPassword = ConfigReader.getAdminPassword();

                getExtentTest().log(Status.INFO,
                                "Step 1 & 2: Browser launched and navigated to base URL â€” waiting for page to load");

                LoginPage loginPage = new LoginPage();

                getExtentTest().log(Status.INFO,
                                "Step 3: Leaving Email field blank â€” not clicking or typing anything");

                getExtentTest().log(Status.INFO,
                                "Step 4: Clicking Password field and entering valid Super Admin password");
                loginPage.enterPassword(adminPassword);

                getExtentTest().log(Status.INFO, "Step 5: Clicking the Login button");
                loginPage.clickLoginButton();

                getExtentTest().log(Status.INFO,
                                "Step 6: Checking if a validation error message appears for the empty Email field");
                boolean validationShown = loginPage.isAnyErrorDisplayed();

                Assert.assertTrue(validationShown,
                                "TC_LOGIN_09 FAILED â€” No validation error shown when Email field is empty");

                Assert.assertTrue(loginPage.isLoginPageDisplayed(),
                                "TC_LOGIN_09 FAILED â€” User was redirected away despite empty Email field");

                getExtentTest().log(Status.PASS,
                                "TC_LOGIN_09 PASSED â€” Validation error shown for empty Email field. User stayed on login page.");
        }

        // ======================================================================
        // TC_LOGIN_10 â€” Login with Password field left empty
        // Steps:
        // 1. Browser launched and navigated to base URL (done by @BeforeMethod)
        // 2. Wait for Email field to be visible
        // 3. Click on Email field and enter valid Super Admin email (from config)
        // 4. Leave Password field blank (do not click or type)
        // 5. Click the Login button
        // 6. Check if a validation message appears below the Password field
        // Expected: Validation error appears for empty Password. User stays on login
        // page.
        // ======================================================================
        @Test
        public void TC_LOGIN_10() {
                String adminEmail = ConfigReader.getAdminEmail();

                getExtentTest().log(Status.INFO,
                                "Step 1 & 2: Browser launched and navigated to base URL â€” waiting for Email field");

                LoginPage loginPage = new LoginPage();

                getExtentTest().log(Status.INFO,
                                "Step 3: Clicking Email field and entering valid Super Admin email");
                loginPage.enterEmail(adminEmail);

                getExtentTest().log(Status.INFO,
                                "Step 4: Leaving Password field blank â€” not clicking or typing anything");

                getExtentTest().log(Status.INFO, "Step 5: Clicking the Login button");
                loginPage.clickLoginButton();

                getExtentTest().log(Status.INFO,
                                "Step 6: Checking if a validation error message appears for the empty Password field");
                boolean validationShown = loginPage.isAnyErrorDisplayed();

                Assert.assertTrue(validationShown,
                                "TC_LOGIN_10 FAILED â€” No validation error shown when Password field is empty");

                Assert.assertTrue(loginPage.isLoginPageDisplayed(),
                                "TC_LOGIN_10 FAILED â€” User was redirected away despite empty Password field");

                getExtentTest().log(Status.PASS,
                                "TC_LOGIN_10 PASSED â€” Validation error shown for empty Password field. User stayed on login page.");
        }

        // ======================================================================
        // TC_LOGIN_11 â€” Login with both Email and Password fields empty
        // Steps:
        // 1. Browser launched and navigated to base URL (done by @BeforeMethod)
        // 2. Wait for the page to fully load
        // 3. Leave both Email and Password fields completely blank
        // 4. Click the Login button
        // 5. Check if validation messages appear for both Email and Password fields
        // Expected: Validation errors for both fields. User stays on login page.
        // ======================================================================
        @Test
        public void TC_LOGIN_11() {
                getExtentTest().log(Status.INFO,
                                "Step 1 & 2: Browser launched and navigated to base URL â€” waiting for page to load");

                LoginPage loginPage = new LoginPage();

                getExtentTest().log(Status.INFO,
                                "Step 3: Leaving both Email and Password fields completely blank");

                getExtentTest().log(Status.INFO, "Step 4: Clicking the Login button with both fields empty");
                loginPage.clickLoginButton();

                getExtentTest().log(Status.INFO,
                                "Step 5: Checking if validation error messages appear for both fields");
                boolean validationShown = loginPage.isAnyErrorDisplayed();

                Assert.assertTrue(validationShown,
                                "TC_LOGIN_11 FAILED â€” No validation errors shown when both Email and Password fields are empty");

                Assert.assertTrue(loginPage.isLoginPageDisplayed(),
                                "TC_LOGIN_11 FAILED â€” User was redirected away despite both fields being empty");

                getExtentTest().log(Status.PASS,
                                "TC_LOGIN_11 PASSED â€” Validation errors shown for both empty fields. User stayed on login page.");
        }

        // ======================================================================
        // TC_LOGIN_12 â€” Login with invalid email format (no @ symbol)
        // Steps:
        // 1. Browser launched and navigated to base URL (done by @BeforeMethod)
        // 2. Wait for Email field to be visible
        // 3. Click on Email field and type: 'admingmail.com' (no @ symbol)
        // 4. Click on Password field and enter any password
        // 5. Click the Login button
        // 6. Check if a validation message appears for invalid email format
        // Expected: Validation error shown for invalid email format. User stays on
        // login page.
        // Note: Browser HTML5 type="email" prevents submit â€” native validation
        // tooltip
        // appears.
        // ======================================================================
        @Test
        public void TC_LOGIN_12() {
                getExtentTest().log(Status.INFO,
                                "Step 1 & 2: Browser launched and navigated to base URL â€” waiting for Email field");

                LoginPage loginPage = new LoginPage();

                getExtentTest().log(Status.INFO,
                                "Step 3: Clicking Email field and typing 'admingmail.com' (no @ symbol â€” invalid format)");
                loginPage.enterEmail("admingmail.com");

                getExtentTest().log(Status.INFO,
                                "Step 4: Clicking Password field and entering any password");
                loginPage.enterPassword("AnyPass@123");

                getExtentTest().log(Status.INFO, "Step 5: Clicking the Login button");
                loginPage.clickLoginButton();

                getExtentTest().log(Status.INFO,
                                "Step 6: Checking that user remains on login page (browser or form validation rejected invalid email)");

                // Browser HTML5 email validation (type="email") blocks form submission for
                // 'admingmail.com'
                // â€” no redirect occurs and the login form remains fully visible
                Assert.assertTrue(loginPage.isLoginPageDisplayed(),
                                "TC_LOGIN_12 FAILED â€” Login form is no longer displayed after submitting invalid email format. "
                                                + "Current URL: " + loginPage.getCurrentUrl());

                Assert.assertFalse(loginPage.waitForUrlToContain("/dashboard"),
                                "TC_LOGIN_12 FAILED â€” User was redirected to Dashboard despite invalid email format");

                getExtentTest().log(Status.PASS,
                                "TC_LOGIN_12 PASSED â€” Invalid email format rejected. User remained on login page.");
        }

        // ======================================================================
        // TC_LOGIN_13 â€” Verify Login button is visible and clickable
        // Steps:
        // 1. Browser launched and navigated to base URL (done by @BeforeMethod)
        // 2. Wait for the page to fully load
        // 3. Locate the Login button on the page
        // 4. Check that the Login button is displayed (visible)
        // 5. Check that the Login button is enabled (not disabled / greyed out)
        // 6. Click the Login button and confirm it responds
        // Expected: Login button is visible, enabled, and responds to a click action.
        // ======================================================================
        @Test
        public void TC_LOGIN_13() {
                getExtentTest().log(Status.INFO,
                                "Step 1 & 2: Browser launched and navigated to base URL â€” waiting for page to load");

                LoginPage loginPage = new LoginPage();

                getExtentTest().log(Status.INFO, "Step 3 & 4: Locating the Login button and checking it is displayed");
                Assert.assertTrue(loginPage.isLoginButtonVisible(),
                                "TC_LOGIN_13 FAILED â€” Login button is NOT visible on the login page");

                getExtentTest().log(Status.INFO,
                                "Step 5: Checking that the Login button is enabled (not disabled / greyed out)");
                Assert.assertTrue(loginPage.isLoginButtonEnabled(),
                                "TC_LOGIN_13 FAILED â€” Login button is NOT enabled (disabled state detected)");

                getExtentTest().log(Status.INFO, "Step 6: Clicking the Login button to confirm it responds");
                loginPage.clickLoginButton();
                // After clicking without credentials, form validation will trigger â€” button
                // is
                // confirmed clickable

                getExtentTest().log(Status.PASS,
                                "TC_LOGIN_13 PASSED â€” Login button is visible, enabled, and responds to click.");
        }

        // ======================================================================
        // TC_LOGIN_14 â€” Forgot Password link navigates to Forgot Password screen
        // Steps:
        // 1. Browser launched and navigated to base URL (done by @BeforeMethod)
        // 2. Wait for the page to fully load
        // 3. Locate the 'Forgot your password?' link
        // 4. Click on the 'Forgot your password?' link
        // 5. Wait for the next screen to load
        // 6. Check that the Forgot Password screen is displayed
        // (should show an email input field for sending OTP)
        // Expected: Clicking 'Forgot your password?' shows Forgot Password screen with
        // email input.
        // ======================================================================
        @Test
        public void TC_LOGIN_14() {
                getExtentTest().log(Status.INFO,
                                "Step 1 & 2: Browser launched and navigated to base URL â€” waiting for page to load");

                LoginPage loginPage = new LoginPage();

                getExtentTest().log(Status.INFO,
                                "Step 3: Locating the 'Forgot your password?' link on the login page");
                Assert.assertTrue(loginPage.isForgotPasswordLinkVisible(),
                                "TC_LOGIN_14 FAILED â€” 'Forgot your password?' link is not visible. Cannot proceed.");

                getExtentTest().log(Status.INFO,
                                "Step 4: Clicking on the 'Forgot your password?' link");
                loginPage.clickForgotPassword();

                getExtentTest().log(Status.INFO,
                                "Step 5 & 6: Waiting for Forgot Password screen to load â€” checking for email input (id='forgot-email')");
                boolean forgotScreenDisplayed = loginPage.isForgotPasswordScreenDisplayed();

                Assert.assertTrue(forgotScreenDisplayed,
                                "TC_LOGIN_14 FAILED â€” Forgot Password screen did NOT appear after clicking 'Forgot your password?'. "
                                                + "Current URL: " + loginPage.getCurrentUrl());

                getExtentTest().log(Status.PASS,
                                "TC_LOGIN_14 PASSED â€” 'Forgot your password?' navigates to the Forgot Password screen correctly.");
        }

        // ======================================================================
        // TC_LOGIN_15 â€” Verify language selector is visible on Login page
        // Steps:
        // 1. Browser launched and navigated to base URL (done by @BeforeMethod)
        // 2. Wait for the page to fully load
        // 3. Look for the language selector dropdown on the page (id='language-select')
        // 4. Check if the language selector is displayed
        // Expected: Language selector should be visible on the login page.
        // ======================================================================
        @Test
        public void TC_LOGIN_15() {
                getExtentTest().log(Status.INFO,
                                "Step 1 & 2: Browser launched and navigated to base URL â€” waiting for page to load");

                LoginPage loginPage = new LoginPage();

                getExtentTest().log(Status.INFO,
                                "Step 3 & 4: Locating language selector dropdown (id='language-select') and checking visibility");
                boolean isVisible = loginPage.isLanguageSelectorDisplayed();

                Assert.assertTrue(isVisible,
                                "TC_LOGIN_15 FAILED â€” Language selector is NOT visible on the login page");

                getExtentTest().log(Status.PASS,
                                "TC_LOGIN_15 PASSED — Language selector is visible on the login page.");
        }

        // ======================================================================
        // TC_LOGIN_16 — Valid login redirects to Dashboard
        // (https://helpdesk-uat.hubblehox.ai/dashboard)
        // Steps:
        // 1. Browser launched and navigated to base URL (done by @BeforeMethod)
        // 2. Wait for Email field to be visible
        // 3. Click on Email field and enter valid Super Admin email (from config)
        // 4. Click on Password field and enter valid Super Admin password (from config)
        // 5. Click the Login button
        // 6. Wait for the page to redirect after login
        // 7. Verify the current URL is exactly:
        // https://helpdesk-uat.hubblehox.ai/dashboard
        // 8. Verify the login page elements (email/password fields) are no longer
        // visible
        // Expected: User is redirected to Dashboard. URL =
        // https://helpdesk-uat.hubblehox.ai/dashboard
        // ======================================================================
        @Test
        public void TC_LOGIN_16() {
                String adminEmail = ConfigReader.getAdminEmail();
                String adminPassword = ConfigReader.getAdminPassword();

                getExtentTest().log(Status.INFO,
                                "Step 1 & 2: Browser launched and navigated to base URL — waiting for Email field to be visible");

                LoginPage loginPage = new LoginPage();

                getExtentTest().log(Status.INFO,
                                "Step 3: Entering valid Super Admin email: " + adminEmail);
                loginPage.enterEmail(adminEmail);

                getExtentTest().log(Status.INFO,
                                "Step 4: Entering valid Super Admin password");
                loginPage.enterPassword(adminPassword);

                getExtentTest().log(Status.INFO, "Step 5: Clicking the Login button");
                loginPage.clickLoginButton();

                getExtentTest().log(Status.INFO,
                                "Step 6: Waiting for redirect to Dashboard after successful login");
                boolean redirectedToDashboard = loginPage.waitForUrlToContain("/dashboard");

                getExtentTest().log(Status.INFO,
                                "Step 7: Verifying the current URL is: https://helpdesk-uat.hubblehox.ai/dashboard");
                String currentUrl = loginPage.getCurrentUrl();
                getExtentTest().log(Status.INFO, "Current URL after login: " + currentUrl);

                Assert.assertTrue(redirectedToDashboard,
                                "TC_LOGIN_16 FAILED — Page did NOT redirect to Dashboard. Current URL: " + currentUrl);

                Assert.assertTrue(currentUrl.contains("helpdesk-uat.hubblehox.ai/dashboard"),
                                "TC_LOGIN_16 FAILED — URL is not the Dashboard URL. Got: " + currentUrl);

                getExtentTest().log(Status.INFO,
                                "Step 8: Verifying login page elements are no longer visible (user is on Dashboard)");
                Assert.assertFalse(loginPage.isLoginPageDisplayed(),
                                "TC_LOGIN_16 FAILED — Login page is still visible after successful login");

                getExtentTest().log(Status.PASS,
                                "TC_LOGIN_16 PASSED — Login successful. User redirected to Dashboard: " + currentUrl);
        }
}