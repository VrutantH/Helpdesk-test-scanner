package com.hubblehox.automation.pages;

import com.hubblehox.automation.keywords.ActionKeywords;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;

/**
 * Page Object for the Login Page.
 *
 * All locators verified against the actual Login.tsx source code.
 * URL: https://helpdesk-uat.hubblehox.ai/login
 *
 * Page structure (from Login.tsx):
 * - Email input → id="email"
 * - Password input → id="password"
 * - Login submit button → <button type="submit">
 * - Forgot Password → <button type="button" style="text-decoration: underline">
 * - Server error banner → <div role="alert">
 * <p style="color:#DC2626">
 * message
 * </p>
 * </div>
 * - Field validation msg →
 * <p role="alert">
 * below each input
 * - Language selector → <select id="language-select">
 * - Forgot pwd email → id="forgot-email" (visible after clicking Forgot
 * Password)
 */
public class LoginPage extends ActionKeywords {

    // ================================================================
    // STATIC LOCATORS — always present when login page is loaded
    // Using @FindBy (PageFactory) — safe to use directly
    // ================================================================

    // Email Address input field
    // HTML: <input id="email" type="email" ...>
    @FindBy(id = "email")
    private WebElement emailField;

    // Password input field
    // HTML: <input id="password" type="password" ...>
    @FindBy(id = "password")
    private WebElement passwordField;

    // Login submit button
    // HTML: <button type="submit" ...>
    @FindBy(xpath = "//button[@type='submit']")
    private WebElement loginButton;

    // Language selector dropdown — top-right of the login card
    // HTML: <select id="language-select" ...>
    @FindBy(id = "language-select")
    private WebElement languageSelector;

    // ================================================================
    // DYNAMIC LOCATORS — conditionally rendered by React
    // Using By constants — safe because isDisplayed(By) catches exceptions
    // ================================================================

    // Forgot Password button — rendered as a button with underline style, NOT an
    // anchor tag
    // HTML: <button type="button" style="...text-decoration: underline...">Forgot
    // your password?</button>
    private final By forgotPasswordBtn = By.xpath("//button[contains(@style,'underline')]");

    // Server-side error banner — appears after API call returns invalid credentials
    // HTML: <div role="alert" aria-live="polite"><p style="color:
    // #DC2626;">message</p></div>
    private final By serverErrorBanner = By.xpath("//div[@role='alert']//p");

    // Field-level validation errors — shown by React Hook Form / Zod on empty or
    // invalid input
    // HTML: <p role="alert">Email is required</p> — rendered below each input field
    private final By anyFieldValidationError = By.xpath("//p[@role='alert']");

    // Forgot Password screen email input — visible after clicking Forgot Password
    // button
    // HTML: <input id="forgot-email" type="email" ...>
    private final By forgotPasswordEmailInput = By.id("forgot-email");

    // ================================================================
    // STEP ACTIONS — called from test methods to perform UI actions
    // ================================================================

    /**
     * Types the given email into the Email Address field.
     * Clears the field first, then sends the value.
     */
    public void enterEmail(String email) {
        doType(emailField, email);
    }

    /**
     * Types the given password into the Password field.
     * Clears the field first, then sends the value.
     */
    public void enterPassword(String password) {
        doType(passwordField, password);
    }

    /**
     * Clicks the Login submit button.
     */
    public void clickLoginButton() {
        doClick(loginButton);
    }

    /**
     * Full login action: enter email → enter password → click Login.
     */
    public void login(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        clickLoginButton();
    }

    /**
     * Clicks the 'Forgot your password?' button to navigate to the Forgot Password
     * screen.
     */
    public void clickForgotPassword() {
        doClickByLocator(forgotPasswordBtn);
    }

    // ================================================================
    // VERIFICATION METHODS — used in assertions inside test methods
    // ================================================================

    /**
     * Returns true if the Email field is visible and enabled (can accept input).
     */
    public boolean isEmailFieldVisible() {
        return isElementVisible(emailField);
    }

    /**
     * Returns true if the Password field is visible.
     */
    public boolean isPasswordFieldVisible() {
        return isElementVisible(passwordField);
    }

    /**
     * Returns true if the Login submit button is visible.
     */
    public boolean isLoginButtonVisible() {
        return isElementVisible(loginButton);
    }

    /**
     * Returns true if the Login submit button is enabled (not disabled/greyed out).
     */
    public boolean isLoginButtonEnabled() {
        return isElementVisible(loginButton) && loginButton.isEnabled();
    }

    /**
     * Returns true if all three core login form elements are visible:
     * Email field + Password field + Login button.
     */
    public boolean isLoginPageDisplayed() {
        return isEmailFieldVisible() && isPasswordFieldVisible() && isLoginButtonVisible();
    }

    /**
     * Returns the current browser tab page title.
     * Expected: 'SAC Helpdesk Portal'
     */
    public String fetchPageTitle() {
        return getPageTitle();
    }

    /**
     * Types a test value in the email field and reads it back.
     * Used to confirm the field accepts text input.
     */
    public String getEmailFieldValue() {
        return emailField.getAttribute("value");
    }

    /**
     * Returns the HTML 'type' attribute of the password input.
     * Expected value: 'password' (meaning text is masked).
     * If the show-password toggle is clicked, value becomes 'text'.
     */
    public String getPasswordFieldType() {
        return passwordField.getAttribute("type");
    }

    /**
     * Returns true if the 'Forgot your password?' button is visible on the login
     * page.
     */
    public boolean isForgotPasswordLinkVisible() {
        return isElementVisible(forgotPasswordBtn);
    }

    /**
     * Returns true if the language selector dropdown is visible.
     */
    public boolean isLanguageSelectorDisplayed() {
        return isElementVisible(languageSelector);
    }

    /**
     * Returns true if ANY error is visible on the page.
     * Covers two types:
     * 1. Server-side error banner → wrong credentials returned by API
     * 2. Field-level validation error → empty fields or invalid format from React
     * Hook Form
     */
    public boolean isAnyErrorDisplayed() {
        return isElementVisible(serverErrorBanner) || isElementVisible(anyFieldValidationError);
    }

    /**
     * Waits (up to explicit-wait timeout) for the server error banner to appear.
     * Use this after a login attempt with wrong credentials to allow the API call
     * to return.
     * Returns true if the error banner became visible within the timeout.
     */
    public boolean waitForErrorBanner() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(serverErrorBanner));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Waits (up to explicit-wait timeout) for the URL to contain the given keyword.
     * Use this after a successful login to confirm redirect to Dashboard.
     */
    public boolean waitForUrlToContain(String keyword) {
        try {
            return wait.until(ExpectedConditions.urlContains(keyword));
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Returns true if user is successfully logged in.
     * Waits for URL to contain '/dashboard'. Falls back to checking '/portal'.
     */
    public boolean isLoggedIn() {
        try {
            // Wait for any valid post-login URL — dashboard, projects, or portal
            wait.until(org.openqa.selenium.support.ui.ExpectedConditions.or(
                    org.openqa.selenium.support.ui.ExpectedConditions.urlContains("/dashboard"),
                    org.openqa.selenium.support.ui.ExpectedConditions.urlContains("/projects"),
                    org.openqa.selenium.support.ui.ExpectedConditions.urlContains("/portal")));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Returns true if the Forgot Password screen is now displayed.
     * Confirms by waiting for the 'forgot-email' input field to become visible.
     */
    public boolean isForgotPasswordScreenDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(forgotPasswordEmailInput));
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
