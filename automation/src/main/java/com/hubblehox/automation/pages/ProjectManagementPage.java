package com.hubblehox.automation.pages;

import com.hubblehox.automation.keywords.ActionKeywords;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.List;
import java.util.stream.Collectors;
import org.openqa.selenium.Keys;
import org.openqa.selenium.support.ui.Select;

/**
 * Page Object for the Project Management module.
 *
 * Covers two areas:
 * 1. Projects List Page — URL: /projects
 * 2. Add New Project Modal — opened by clicking "+ Add Project" button
 *
 * Locators verified against:
 * - frontend/src/components/ProjectManagement.tsx
 * - frontend/src/components/AddProjectForm.tsx
 *
 * URL: http://helpdesksupport365.com/projects
 */
public class ProjectManagementPage extends ActionKeywords {

    // ================================================================
    // PROJECTS LIST PAGE — locators
    // ================================================================

    // Page heading — h1 or h2 with text "Projects"
    private final By projectsHeading = By.xpath(
            "//h1[normalize-space()='Projects'] | //h2[normalize-space()='Projects']");

    // Subtitle text below heading
    private final By projectsSubtitle = By.xpath(
            "//*[contains(normalize-space(),'Manage your projects and their configurations')]");

    // Stats cards (text labels inside the stat boxes)
    private final By totalProjectsLabel = By.xpath(
            "//*[contains(normalize-space(),'Total Projects')]");

    private final By activeLabel = By.xpath(
            "//*[normalize-space()='Active']");

    private final By inactiveLabel = By.xpath(
            "//*[normalize-space()='Inactive']");

    private final By withBrandingLabel = By.xpath(
            "//*[contains(normalize-space(),'With Branding')]");

    // "+ Add Project" button
    private final By addProjectBtn = By.xpath(
            "//button[contains(normalize-space(),'Add Project')]");

    // Table body rows
    private final By tableRows = By.xpath("//tbody/tr");

    // Table column headers
    // NOTE: CSS may apply text-transform: uppercase visually — XPath uses
    // translate() to match case-insensitively with the actual DOM text.
    private final By colProjectId = By.xpath(
            "//th[contains(translate(normalize-space(),"
                    + "'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ'),'PROJECT ID')]");

    private final By colName = By.xpath(
            "//th[translate(normalize-space(),"
                    + "'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='NAME']");

    private final By colCode = By.xpath(
            "//th[translate(normalize-space(),"
                    + "'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='CODE']");

    private final By colUsers = By.xpath(
            "//th[translate(normalize-space(),"
                    + "'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='USERS']");

    private final By colStatus = By.xpath(
            "//th[translate(normalize-space(),"
                    + "'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='STATUS']");

    private final By colCreated = By.xpath(
            "//th[translate(normalize-space(),"
                    + "'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='CREATED']");

    private final By colActions = By.xpath(
            "//th[translate(normalize-space(),"
                    + "'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='ACTIONS']");

    // Edit button in the first project row
    private final By firstRowEditBtn = By.xpath(
            "(//tbody/tr)[1]//button[normalize-space()='Edit']");

    // Project Management menu item in the left sidebar navigation
    private final By projectManagementSidebarMenu = By.xpath(
            "//*[normalize-space()='Project Management']");

    // ================================================================
    // ADD NEW PROJECT MODAL — locators
    // ================================================================

    // Modal title: "Add New Project"
    private final By modalTitle = By.xpath(
            "//h2[normalize-space()='Add New Project']");

    // Modal subtitle
    private final By modalSubtitle = By.xpath(
            "//*[contains(normalize-space(),'Configure portal, security, and ticket settings in one place')]");

    // Sidebar tab buttons (by span text inside each tab button)
    private final By tabGeneral = By.xpath(
            "//button[.//span[normalize-space()='General']]");

    private final By tabLogin = By.xpath(
            "//button[.//span[normalize-space()='Login']]");

    private final By tabSecurity = By.xpath(
            "//button[.//span[normalize-space()='Security']]");

    private final By tabTicketPortal = By.xpath(
            "//button[.//span[normalize-space()='Ticket Portal']]");

    private final By tabCustomization = By.xpath(
            "//button[.//span[normalize-space()='Customization']]");

    // ================================================================
    // GENERAL TAB FIELDS — locators
    // ================================================================

    // Portal Name input — placeholder="Enter portal name"
    private final By portalNameField = By.xpath(
            "//input[@placeholder='Enter portal name']");

    // Required fields note — only visible while on General tab
    private final By requiredFieldsNote = By.xpath(
            "//*[contains(normalize-space(),'indicates required fields')]");

    // Terms of Use URL — text input (after the protocol dropdown)
    private final By termsOfUseInput = By.xpath(
            "//label[contains(normalize-space(),'Terms of Use URL')]"
                    + "/following-sibling::div//input[@type='text']");

    // Privacy Policy URL — text input
    private final By privacyPolicyInput = By.xpath(
            "//label[contains(normalize-space(),'Privacy Policy URL')]"
                    + "/following-sibling::div//input[@type='text']");

    // Cookie Policy URL — text input
    private final By cookiePolicyInput = By.xpath(
            "//label[contains(normalize-space(),'Cookie Policy URL')]"
                    + "/following-sibling::div//input[@type='text']");

    // Footer Text — unique placeholder from AddProjectForm.tsx
    private final By footerTextField = By.xpath(
            "//input[contains(@placeholder,'Your Organization')]");

    // Custom Portal URL Path — placeholder 'studentassistcenter'
    private final By customUrlPathField = By.xpath(
            "//input[@placeholder='studentassistcenter']");

    // Logo file input (hidden) — first <input type="file"> inside the logo upload
    // label
    private final By logoFileInput = By.xpath(
            "//label[not(contains(normalize-space(),'Favicon'))"
                    + " and (contains(normalize-space(),'Upload Logo') or contains(normalize-space(),'Change Logo'))]"
                    + "//input[@type='file']");

    // Favicon file input (hidden) — inside the favicon upload label
    private final By faviconFileInput = By.xpath(
            "//label[(contains(normalize-space(),'Upload Favicon') or contains(normalize-space(),'Change Favicon'))]"
                    + "//input[@type='file']");

    // Logo preview image — shown after a logo is successfully uploaded
    private final By logoPreviewImg = By.xpath(
            "//img[@alt='Logo Preview']");

    // Favicon preview image — shown after a favicon is successfully uploaded
    private final By faviconPreviewImg = By.xpath(
            "//img[@alt='Favicon Preview']");

    // Upload Logo / Change Logo button label (text changes after upload)
    private final By uploadLogoLabel = By.xpath(
            "//label[not(contains(normalize-space(),'Favicon'))"
                    + " and (contains(normalize-space(),'Upload Logo') or contains(normalize-space(),'Change Logo'))]");

    // Change Logo label — only visible AFTER a logo has been uploaded
    private final By changeLogoLabel = By.xpath(
            "//label[contains(normalize-space(),'Change Logo') and not(contains(normalize-space(),'Favicon'))]");

    // Upload Favicon / Change Favicon button label
    private final By uploadFaviconLabel = By.xpath(
            "//label[contains(normalize-space(),'Upload Favicon') or contains(normalize-space(),'Change Favicon')]");

    // Change Favicon label — only visible AFTER a favicon has been uploaded
    private final By changeFaviconLabel = By.xpath(
            "//label[contains(normalize-space(),'Change Favicon')]");

    // Logo Linkback URL — text input (after protocol select dropdown)
    private final By logoLinkbackUrlInput = By.xpath(
            "//label[normalize-space()='Logo Linkback URL']"
                    + "/following-sibling::div//input[@type='text']");

    // Copyright URL — text input (first item in Footer Links section)
    private final By copyrightUrlInput = By.xpath(
            "//label[contains(normalize-space(),'Copyright URL')]"
                    + "/following-sibling::div//input[@type='text']");

    // Announcement Banner Message label (visible even when textarea is off-screen)
    private final By announcementBannerLabel = By.xpath(
            "//label[contains(normalize-space(),'Announcement Banner Message')]"
                    + " | //*[normalize-space()='Announcement Banner Message']");

    // Announcement Banner textarea
    private final By announcementBannerTextarea = By.xpath(
            "//textarea[contains(@placeholder,'Enter')]");

    // Modal footer buttons
    private final By discardBtn = By.xpath(
            "//button[normalize-space()='Discard']");

    private final By updateProjectBtn = By.xpath(
            "//button[contains(normalize-space(),'Update Project')]");

    // ================================================================
    // LOGIN TAB — locators
    // ================================================================

    private final By loginTabSSOHeading = By.xpath(
            "//*[contains(normalize-space(),'Single Sign-On')]"
                    + "[self::h2 or self::h3 or self::h4 or self::h5 or self::p or self::span]"
                    + "[not(self::button)]");

    private final By loginTabFormLoginHeading = By.xpath(
            "//*[contains(normalize-space(),'Form Login')]"
                    + "[self::h2 or self::h3 or self::h4 or self::h5]");

    private final By enableFormLoginChk = By.xpath(
            "//input[@type='checkbox'][following-sibling::div/label[normalize-space()='Enable Form Login']]"
                    + " | //input[@type='checkbox'][following-sibling::div[./label[normalize-space()='Enable Form Login']]]");

    private final By enableRecaptchaChk = By.xpath(
            "//input[@type='checkbox'][following-sibling::div/label[contains(normalize-space(),'Google reCAPTCHA')]]"
                    + " | //input[@type='checkbox'][following-sibling::div[./label[contains(normalize-space(),'reCAPTCHA')]]]");

    private final By recommendedBadge = By.xpath(
            "//*[normalize-space()='recommended' or normalize-space()='Recommended']");

    // ================================================================
    // SECURITY TAB — locators
    // ================================================================

    private final By securityGeneralSettingsHeading = By.xpath(
            "//*[contains(normalize-space(),'General Settings')]"
                    + "[self::h2 or self::h3 or self::h4 or self::h5]");

    private final By twoFAHeading = By.xpath(
            "//*[contains(normalize-space(),'Two-Factor Authentication')]"
                    + "[self::h2 or self::h3 or self::h4 or self::h5 or self::p or self::span]"
                    + "[not(self::button)]");

    private final By enforceTwoFAChk = By.xpath(
            "//input[@type='checkbox'][ancestor::*["
                    + "   contains(normalize-space(),'two-factor') or contains(normalize-space(),'2FA')"
                    + "   or contains(normalize-space(),'Two-Factor')]]"
                    + " | //label[contains(normalize-space(),'2FA') or contains(normalize-space(),'two-factor')]"
                    + "   //input[@type='checkbox']"
                    + " | //*[contains(normalize-space(),'Enforce') and (contains(normalize-space(),'2FA')"
                    + "   or contains(normalize-space(),'two-factor'))]"
                    + "   /preceding::input[@type='checkbox'][1]"
                    + " | //*[contains(normalize-space(),'Enforce') and (contains(normalize-space(),'2FA')"
                    + "   or contains(normalize-space(),'two-factor'))]"
                    + "   /following::input[@type='checkbox'][1]");

    private final By passwordPolicyHeading = By.xpath(
            "//*[normalize-space()='Password Policy']"
                    + "[self::h2 or self::h3 or self::h4 or self::h5]");

    private final By defaultPolicyRadio = By.xpath(
            "//label[.//span[normalize-space()='Default Policy']]//input[@type='radio']");

    private final By customPolicyRadio = By.xpath(
            "//label[.//span[normalize-space()='Custom Policy']]//input[@type='radio']");

    private final By lowercaseChk = By.xpath(
            "//label[.//span[contains(normalize-space(),'lower case') or contains(normalize-space(),'a-z')]]"
                    + "//input[@type='checkbox']");

    private final By uppercaseChk = By.xpath(
            "//label[.//span[contains(normalize-space(),'upper case') or contains(normalize-space(),'A-Z')]]"
                    + "//input[@type='checkbox']");

    private final By numberChk = By.xpath(
            "//label[.//span[contains(normalize-space(),'0-9')]]//input[@type='checkbox']");

    private final By specialCharChk = By.xpath(
            "//label[.//span[contains(normalize-space(),'special character') or contains(normalize-space(),'Special')]]"
                    + "//input[@type='checkbox']");

    private final By minPasswordLengthSelect = By.xpath(
            "//label[.//span[normalize-space()='Minimum password length']]//select"
                    + " | //span[normalize-space()='Minimum password length']/following-sibling::select");

    // ================================================================
    // TICKET PORTAL TAB — locators
    // ================================================================

    private final By studentTicketPortalHeading = By.xpath(
            "//*[contains(normalize-space(),'Student Ticket Submission Portal')]"
                    + "[self::h2 or self::h3 or self::h4 or self::h5]");

    private final By ticketModeOnlineOnly = By.xpath(
            "//input[@type='radio'][@name='ticketSubmissionMode'][@value='online']");

    private final By ticketModeOfflineOnly = By.xpath(
            "//input[@type='radio'][@name='ticketSubmissionMode'][@value='offline']");

    private final By ticketModeBothOnlineOffline = By.xpath(
            "//input[@type='radio'][@name='ticketSubmissionMode'][@value='both']");

    private final By knowledgeBaseChk = By.xpath(
            "//input[@type='checkbox'][ancestor::*[contains(normalize-space(),'Knowledge Base')]]"
                    + " | //label[contains(normalize-space(),'Knowledge Base')]//input[@type='checkbox']"
                    + " | //*[contains(normalize-space(),'Knowledge Base')]"
                    + "   /preceding::input[@type='checkbox'][1]"
                    + " | //*[contains(normalize-space(),'Knowledge Base')]"
                    + "   /following::input[@type='checkbox'][1]");

    private final By ticketPortalAnnouncementBannerHeading = By.xpath(
            "//*[normalize-space()='Announcement Banner']"
                    + "[self::h2 or self::h3 or self::h4 or self::h5 or self::label]");

    private final By ticketPortalAnnouncementTextarea = By.xpath(
            "//*[normalize-space()='Announcement Banner']/following::textarea[1]");

    private final By assignmentMethodSelect = By.xpath(
            "//select[ancestor::*[contains(normalize-space(),'Assignment Method')]]");

    private final By assignmentMethodDropdownTrigger = By.xpath(
            "//*[contains(normalize-space(),'Assignment Method')]"
                    + "/following::*[@role='combobox' or @role='listbox'][1]");

    private final By assignmentManualInfoBanner = By.xpath(
            "//*[contains(normalize-space(),'Tickets will not be automatically assigned')"
                    + "   or contains(normalize-space(),'manual assignment role')"
                    + "   or contains(normalize-space(),'available after you create')]");

    private final By welcomeMessageTextarea = By.xpath(
            "//*[contains(normalize-space(),'Welcome Message')]/following::textarea[1]");

    // ================================================================
    // CUSTOMIZATION TAB — locators
    // ================================================================

    private final By loginPageSectionHeading = By.xpath(
            "//*[normalize-space()='Login Page']"
                    + "[self::h2 or self::h3 or self::h4 or self::h5 or self::label or self::span]"
                    + "[not(self::button)]");

    private final By uploadImageBtn = By.xpath(
            "//button[contains(normalize-space(),'Upload Image')]");

    private final By themeCustomizationHeading = By.xpath(
            "//*[contains(normalize-space(),'Theme Customization')]"
                    + "[self::h2 or self::h3 or self::h4 or self::h5]");

    private final By lightThemeRadio = By.xpath(
            "//input[@type='radio'][@name='themeMode'][@value='light']");

    private final By darkThemeRadio = By.xpath(
            "//input[@type='radio'][@name='themeMode'][@value='dark']");

    private final By themeColorLabel = By.xpath(
            "//*[normalize-space()='Theme Color']"
                    + "[self::label or self::h4 or self::h5 or self::span or self::p]");

    private final By themeColorSwatches = By.xpath(
            "//*[contains(normalize-space(),'Theme Color')]"
                    + "/following::button[contains(@style,'background')"
                    + "   or contains(@class,'swatch') or contains(@class,'color')]");

    private final By hexColorInput = By.xpath(
            "//*[contains(normalize-space(),'Theme Color')]/following::input[@type='text'][1]");

    private final By advancedCustomizationHeading = By.xpath(
            "//*[contains(normalize-space(),'Advanced Customization')]"
                    + "[self::h2 or self::h3 or self::h4 or self::h5]");

    // ================================================================
    // SUCCESS TOAST + TABLE ROW VERIFICATION — locators
    // ================================================================

    // Toast HTML has no role/class — only inline styles. Match by visible text
    // content.
    private final By successToast = By.xpath(
            "//*[contains(normalize-space(),'created successfully')"
                    + " or contains(normalize-space(),'updated successfully')"
                    + " or contains(normalize-space(),'Project created')"
                    + " or contains(normalize-space(),'Project updated')]"
                    + "[not(self::script)][not(self::style)]");

    private final By firstRowProjectIdCell = By.xpath("(//tbody/tr)[1]/td[1]");

    private final By firstRowEditButton = By.xpath(
            "(//tbody/tr)[1]//button[normalize-space()='Edit']");

    private final By firstRowDeleteButton = By.xpath(
            "(//tbody/tr)[1]//button[normalize-space()='Delete']");

    // ================================================================
    // CONSTRUCTOR
    // ================================================================

    public ProjectManagementPage() {
        super();
    }

    // ================================================================
    // PROJECTS LIST PAGE — methods
    // ================================================================

    /**
     * Returns true once the URL contains /projects and the heading is visible.
     */
    public boolean isProjectsPageDisplayed() {
        try {
            wait.until(ExpectedConditions.urlContains("/projects"));
            return isElementVisible(projectsHeading);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isProjectsHeadingDisplayed() {
        return isElementVisible(projectsHeading);
    }

    public boolean isProjectsSubtitleDisplayed() {
        return isElementVisible(projectsSubtitle);
    }

    public boolean isTotalProjectsCardVisible() {
        return isElementVisible(totalProjectsLabel);
    }

    public boolean isActiveCardVisible() {
        return isElementVisible(activeLabel);
    }

    public boolean isInactiveCardVisible() {
        return isElementVisible(inactiveLabel);
    }

    public boolean isWithBrandingCardVisible() {
        return isElementVisible(withBrandingLabel);
    }

    public boolean isAddProjectButtonVisible() {
        return isElementVisible(addProjectBtn);
    }

    public boolean isAddProjectButtonEnabled() {
        try {
            WebElement btn = wait.until(ExpectedConditions.visibilityOfElementLocated(addProjectBtn));
            return btn.isEnabled();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isProjectTableDisplayedWithData() {
        try {
            List<WebElement> rows = driver.findElements(tableRows);
            return !rows.isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isColumnHeaderVisible(By columnLocator) {
        return isElementVisible(columnLocator);
    }

    public By getColProjectId() {
        return colProjectId;
    }

    public By getColName() {
        return colName;
    }

    public By getColCode() {
        return colCode;
    }

    public By getColUsers() {
        return colUsers;
    }

    public By getColStatus() {
        return colStatus;
    }

    public By getColCreated() {
        return colCreated;
    }

    public By getColActions() {
        return colActions;
    }

    public boolean isEditButtonVisibleInFirstRow() {
        return isElementVisible(firstRowEditBtn);
    }

    public void clickAddProjectButton() {
        wait.until(ExpectedConditions.elementToBeClickable(addProjectBtn)).click();
    }

    // ================================================================
    // ADD NEW PROJECT MODAL — methods
    // ================================================================

    public boolean isAddProjectModalOpen() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(modalTitle)) != null;
        } catch (Exception e) {
            return false;
        }
    }

    public String getModalTitleText() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(modalTitle))
                    .getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    public boolean isModalSubtitleVisible() {
        return isElementVisible(modalSubtitle);
    }

    /**
     * The General tab is "active" when its content (Portal Name field) is visible.
     * This is more reliable than checking CSS background color via WebDriver.
     */
    public boolean isGeneralTabActiveByDefault() {
        return isElementVisible(portalNameField);
    }

    public boolean isTabVisible(By tabLocator) {
        return isElementVisible(tabLocator);
    }

    public By getTabGeneral() {
        return tabGeneral;
    }

    public By getTabLogin() {
        return tabLogin;
    }

    public By getTabSecurity() {
        return tabSecurity;
    }

    public By getTabTicketPortal() {
        return tabTicketPortal;
    }

    public By getTabCustomization() {
        return tabCustomization;
    }

    // ================================================================
    // GENERAL TAB FIELDS — methods
    // ================================================================

    public boolean isPortalNameFieldVisible() {
        return isElementVisible(portalNameField);
    }

    public boolean isRequiredFieldsNoteVisible() {
        return isElementVisible(requiredFieldsNote);
    }

    /**
     * Scrolls the General tab content area to bring Terms of Use / Privacy Policy /
     * Cookie Policy / Announcement Banner into view, then checks visibility.
     */
    public boolean isTermsOfUseUrlFieldVisible() {
        scrollToFooterLinks();
        return isElementVisible(termsOfUseInput);
    }

    public boolean isPrivacyPolicyUrlFieldVisible() {
        scrollToFooterLinks();
        return isElementVisible(privacyPolicyInput);
    }

    public boolean isCookiePolicyUrlFieldVisible() {
        scrollToFooterLinks();
        return isElementVisible(cookiePolicyInput);
    }

    public boolean isAnnouncementBannerSectionVisible() {
        scrollToFooterLinks();
        return isElementVisible(announcementBannerLabel);
    }

    public boolean isDiscardButtonVisible() {
        return isElementVisible(discardBtn);
    }

    public boolean isUpdateProjectButtonVisible() {
        return isElementVisible(updateProjectBtn);
    }

    public boolean isUpdateProjectButtonEnabled() {
        try {
            WebElement btn = wait.until(ExpectedConditions.visibilityOfElementLocated(updateProjectBtn));
            return btn.isEnabled();
        } catch (Exception e) {
            return false;
        }
    }

    // ================================================================
    // PROJECTS LIST PAGE — sidebar navigation methods
    // ================================================================

    public boolean isProjectManagementMenuVisible() {
        return isElementVisible(projectManagementSidebarMenu);
    }

    public void clickProjectManagementMenu() {
        try {
            waitForClickable(projectManagementSidebarMenu).click();
        } catch (Exception e) {
            WebElement el = wait.until(
                    ExpectedConditions.visibilityOfElementLocated(projectManagementSidebarMenu));
            jsClick(el);
        }
    }

    // ================================================================
    // GENERAL TAB — additional field methods
    // ================================================================

    public String getBrowserTitle() {
        return driver.getTitle();
    }

    public void enterPortalName(String name) {
        WebElement field = wait.until(
                ExpectedConditions.visibilityOfElementLocated(portalNameField));
        field.click();
        field.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        field.sendKeys(Keys.DELETE);
        field.sendKeys(name);
    }

    public String getPortalNameFieldValue() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(portalNameField))
                    .getAttribute("value");
        } catch (Exception e) {
            return "";
        }
    }

    public boolean isFooterTextFieldVisible() {
        try {
            scrollToElement(wait.until(
                    ExpectedConditions.visibilityOfElementLocated(footerTextField)));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void enterFooterText(String text) {
        WebElement field = wait.until(
                ExpectedConditions.visibilityOfElementLocated(footerTextField));
        scrollToElement(field);
        field.click();
        field.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        field.sendKeys(Keys.DELETE);
        field.sendKeys(text);
    }

    public String getFooterTextFieldValue() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(footerTextField))
                    .getAttribute("value");
        } catch (Exception e) {
            return "";
        }
    }

    public boolean isCustomUrlPathFieldVisible() {
        try {
            scrollToElement(wait.until(
                    ExpectedConditions.visibilityOfElementLocated(customUrlPathField)));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void enterCustomUrlPath(String path) {
        WebElement field = wait.until(
                ExpectedConditions.visibilityOfElementLocated(customUrlPathField));
        scrollToElement(field);
        field.click();
        field.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        field.sendKeys(Keys.DELETE);
        field.sendKeys(path);
    }

    public String getCustomUrlPathFieldValue() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(customUrlPathField))
                    .getAttribute("value");
        } catch (Exception e) {
            return "";
        }
    }

    public boolean isLogoUploadButtonVisible() {
        scrollToLogoSection();
        return isElementVisible(uploadLogoLabel);
    }

    public void uploadLogo(String absoluteFilePath) {
        scrollToLogoSection();
        WebElement fileInput = driver.findElement(logoFileInput);
        ((JavascriptExecutor) driver).executeScript("arguments[0].style.display='block';", fileInput);
        fileInput.sendKeys(absoluteFilePath);
        // Wait briefly for React to process the file and render preview
        try {
            Thread.sleep(1500);
        } catch (InterruptedException ignored) {
            Thread.currentThread().interrupt();
        }
    }

    public boolean isLogoPreviewDisplayed() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(logoPreviewImg)) != null;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isChangeLogoButtonVisible() {
        return isElementVisible(changeLogoLabel);
    }

    public boolean isFaviconUploadButtonVisible() {
        scrollToLogoSection();
        return isElementVisible(uploadFaviconLabel);
    }

    public void uploadFavicon(String absoluteFilePath) {
        scrollToLogoSection();
        WebElement fileInput = driver.findElement(faviconFileInput);
        ((JavascriptExecutor) driver).executeScript("arguments[0].style.display='block';", fileInput);
        fileInput.sendKeys(absoluteFilePath);
        try {
            Thread.sleep(1500);
        } catch (InterruptedException ignored) {
            Thread.currentThread().interrupt();
        }
    }

    public boolean isFaviconPreviewDisplayed() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(faviconPreviewImg)) != null;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isChangeFaviconButtonVisible() {
        return isElementVisible(changeFaviconLabel);
    }

    public boolean isLogoLinkbackUrlFieldVisible() {
        scrollToLogoSection();
        return isElementVisible(logoLinkbackUrlInput);
    }

    public void enterLogoLinkbackUrl(String url) {
        WebElement field = wait.until(
                ExpectedConditions.visibilityOfElementLocated(logoLinkbackUrlInput));
        scrollToElement(field);
        field.click();
        field.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        field.sendKeys(Keys.DELETE);
        field.sendKeys(url);
    }

    public String getLogoLinkbackUrlFieldValue() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(logoLinkbackUrlInput))
                    .getAttribute("value");
        } catch (Exception e) {
            return "";
        }
    }

    public boolean isCopyrightUrlFieldVisible() {
        scrollToFooterLinks();
        return isElementVisible(copyrightUrlInput);
    }

    public void enterCopyrightUrl(String url) {
        scrollToFooterLinks();
        WebElement field = wait.until(
                ExpectedConditions.visibilityOfElementLocated(copyrightUrlInput));
        field.click();
        field.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        field.sendKeys(Keys.DELETE);
        field.sendKeys(url);
    }

    public void enterTermsOfUseUrl(String url) {
        scrollToFooterLinks();
        WebElement field = wait.until(
                ExpectedConditions.visibilityOfElementLocated(termsOfUseInput));
        field.click();
        field.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        field.sendKeys(Keys.DELETE);
        field.sendKeys(url);
    }

    public void enterPrivacyPolicyUrl(String url) {
        scrollToFooterLinks();
        WebElement field = wait.until(
                ExpectedConditions.visibilityOfElementLocated(privacyPolicyInput));
        field.click();
        field.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        field.sendKeys(Keys.DELETE);
        field.sendKeys(url);
    }

    public void enterCookiePolicyUrl(String url) {
        scrollToFooterLinks();
        WebElement field = wait.until(
                ExpectedConditions.visibilityOfElementLocated(cookiePolicyInput));
        field.click();
        field.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        field.sendKeys(Keys.DELETE);
        field.sendKeys(url);
    }

    public boolean isAnnouncementBannerTextareaVisible() {
        try {
            scrollToElement(wait.until(
                    ExpectedConditions.visibilityOfElementLocated(announcementBannerTextarea)));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void enterAnnouncementBanner(String text) {
        WebElement field = wait.until(
                ExpectedConditions.visibilityOfElementLocated(announcementBannerTextarea));
        scrollToElement(field);
        field.click();
        field.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        field.sendKeys(Keys.DELETE);
        field.sendKeys(text);
    }

    public String getAnnouncementBannerValue() {
        try {
            return wait.until(
                    ExpectedConditions.visibilityOfElementLocated(announcementBannerTextarea))
                    .getAttribute("value");
        } catch (Exception e) {
            return "";
        }
    }

    // ================================================================
    // HELPERS
    // ================================================================

    /**
     * Scrolls the modal content pane so that the Terms of Use URL label
     * (lower in the General tab) becomes visible.
     */
    private void scrollToFooterLinks() {
        try {
            List<WebElement> elements = driver.findElements(termsOfUseInput);
            if (!elements.isEmpty()) {
                scrollToElement(elements.get(0));
            } else {
                // Fallback: scroll the modal content via JS
                driver.findElements(By.xpath("//div[contains(@style,'overflowY')]"))
                        .stream()
                        .filter(WebElement::isDisplayed)
                        .findFirst()
                        .ifPresent(el -> scrollToElement(el));
            }
        } catch (Exception ignored) {
        }
    }

    private void scrollToLogoSection() {
        try {
            List<WebElement> logoLabels = driver.findElements(uploadLogoLabel);
            if (!logoLabels.isEmpty()) {
                scrollToElement(logoLabels.get(0));
            } else {
                // Fallback — scroll down inside modal content area
                driver.findElements(By.xpath("//div[contains(@style,'overflow')]"))
                        .stream()
                        .filter(WebElement::isDisplayed)
                        .findFirst()
                        .ifPresent(el -> ((JavascriptExecutor) driver)
                                .executeScript("arguments[0].scrollTop += 400;", el));
            }
        } catch (Exception ignored) {
        }
    }

    // ================================================================
    // TAB NAVIGATION METHODS
    // ================================================================

    public void clickLoginTab() {
        WebElement tab = waitForClickable(tabLogin);
        scrollToElement(tab);
        tab.click();
        pause(600);
    }

    public void clickSecurityTab() {
        WebElement tab = waitForClickable(tabSecurity);
        scrollToElement(tab);
        tab.click();
        pause(600);
    }

    public void clickTicketPortalTab() {
        WebElement tab = waitForClickable(tabTicketPortal);
        scrollToElement(tab);
        tab.click();
        pause(600);
    }

    public void clickCustomizationTab() {
        WebElement tab = waitForClickable(tabCustomization);
        scrollToElement(tab);
        tab.click();
        pause(600);
    }

    // ================================================================
    // LOGIN TAB — methods
    // ================================================================

    public boolean isLoginTabActive() {
        return isElementVisible(loginTabFormLoginHeading)
                || isElementVisible(loginTabSSOHeading);
    }

    public boolean isLoginTabSSOSectionVisible() {
        return isElementVisible(loginTabSSOHeading);
    }

    public boolean isLoginTabFormLoginSectionVisible() {
        return isElementVisible(loginTabFormLoginHeading);
    }

    public boolean isEnableFormLoginCheckboxVisible() {
        return findFirstVisible(enableFormLoginChk) != null;
    }

    public boolean isEnableFormLoginChecked() {
        return isCheckboxChecked(enableFormLoginChk);
    }

    public void toggleFormLoginCheckbox() {
        clickCheckbox(enableFormLoginChk);
    }

    public boolean isEnableRecaptchaCheckboxVisible() {
        return findFirstVisible(enableRecaptchaChk) != null;
    }

    public boolean isEnableRecaptchaChecked() {
        return isCheckboxChecked(enableRecaptchaChk);
    }

    public void toggleRecaptchaCheckbox() {
        clickCheckbox(enableRecaptchaChk);
    }

    public boolean isRecommendedBadgeVisible() {
        return isElementVisible(recommendedBadge);
    }

    // ================================================================
    // SECURITY TAB — methods
    // ================================================================

    public boolean isSecurityTabActive() {
        return isElementVisible(securityGeneralSettingsHeading);
    }

    public boolean isSecurityGeneralSettingsHeadingVisible() {
        return isElementVisible(securityGeneralSettingsHeading);
    }

    public boolean isTwoFAHeadingVisible() {
        return isElementVisible(twoFAHeading);
    }

    public boolean isTwoFACheckboxVisible() {
        return findFirstVisible(enforceTwoFAChk) != null;
    }

    public boolean isTwoFAChecked() {
        return isCheckboxChecked(enforceTwoFAChk);
    }

    public void clickTwoFACheckbox() {
        clickCheckbox(enforceTwoFAChk);
    }

    public boolean isPasswordPolicyHeadingVisible() {
        return isElementVisible(passwordPolicyHeading);
    }

    public boolean isDefaultPolicyRadioVisible() {
        return findFirstVisible(defaultPolicyRadio) != null;
    }

    public boolean isCustomPolicyRadioVisible() {
        return findFirstVisible(customPolicyRadio) != null;
    }

    public boolean isCustomPolicySelected() {
        return isCheckboxChecked(customPolicyRadio);
    }

    public boolean isDefaultPolicySelected() {
        return isCheckboxChecked(defaultPolicyRadio);
    }

    public void clickCustomPolicyRadio() {
        clickCheckbox(customPolicyRadio);
    }

    public boolean isLowercaseCheckboxVisible() {
        return findFirstVisible(lowercaseChk) != null;
    }

    public void clickLowercaseCheckbox() {
        clickCheckbox(lowercaseChk);
    }

    public boolean isLowercaseChecked() {
        return isCheckboxChecked(lowercaseChk);
    }

    public boolean isUppercaseCheckboxVisible() {
        return findFirstVisible(uppercaseChk) != null;
    }

    public void clickUppercaseCheckbox() {
        clickCheckbox(uppercaseChk);
    }

    public boolean isUppercaseChecked() {
        return isCheckboxChecked(uppercaseChk);
    }

    public boolean isNumberCheckboxVisible() {
        return findFirstVisible(numberChk) != null;
    }

    public void clickNumberCheckbox() {
        clickCheckbox(numberChk);
    }

    public boolean isNumberChecked() {
        return isCheckboxChecked(numberChk);
    }

    public boolean isSpecialCharCheckboxVisible() {
        return findFirstVisible(specialCharChk) != null;
    }

    public void clickSpecialCharCheckbox() {
        clickCheckbox(specialCharChk);
    }

    public boolean isSpecialCharChecked() {
        return isCheckboxChecked(specialCharChk);
    }

    public boolean isMinPasswordLengthDropdownVisible() {
        return isElementVisible(minPasswordLengthSelect);
    }

    public String getMinPasswordLengthValue() {
        try {
            WebElement sel = wait.until(
                    ExpectedConditions.presenceOfElementLocated(minPasswordLengthSelect));
            try {
                return new Select(sel).getFirstSelectedOption().getText().trim();
            } catch (Exception e) {
                String v = sel.getAttribute("value");
                if (v != null && !v.isEmpty())
                    return v;
                // Custom dropdowns: try getText() (div/button showing selected value)
                String t = sel.getText().trim();
                if (!t.isEmpty())
                    return t;
                // aria-label or data-value
                String a = sel.getAttribute("data-value");
                if (a != null && !a.isEmpty())
                    return a;
                return "";
            }
        } catch (Exception e) {
            return "";
        }
    }

    public void selectMinPasswordLength(String value) {
        try {
            WebElement sel = wait.until(
                    ExpectedConditions.elementToBeClickable(minPasswordLengthSelect));
            scrollToElement(sel);
            // Try native <select>
            try {
                new Select(sel).selectByVisibleText(value);
                return;
            } catch (Exception ignored) {
            }
            // Try custom dropdown: click trigger, then click option
            jsClick(sel);
            pause(500);
            // Look for role=option or li/div with the value text
            List<WebElement> options = driver.findElements(By.xpath(
                    "//*[@role='option'][normalize-space()='" + value + "']"
                            + " | //li[normalize-space()='" + value + "']"
                            + " | //div[@class and normalize-space()='" + value + "']"));
            options.stream().filter(WebElement::isDisplayed).findFirst()
                    .ifPresent(o -> {
                        jsClick(o);
                    });
        } catch (Exception ignored) {
        }
    }

    // ================================================================
    // TICKET PORTAL TAB — methods
    // ================================================================

    public boolean isTicketPortalTabActive() {
        return isElementVisible(studentTicketPortalHeading);
    }

    public boolean isStudentTicketPortalHeadingVisible() {
        return isElementVisible(studentTicketPortalHeading);
    }

    public boolean isOnlineOnlyRadioVisible() {
        return findFirstVisible(ticketModeOnlineOnly) != null;
    }

    public boolean isOfflineOnlyRadioVisible() {
        return findFirstVisible(ticketModeOfflineOnly) != null;
    }

    public boolean isBothOnlineOfflineRadioVisible() {
        return findFirstVisible(ticketModeBothOnlineOffline) != null;
    }

    public By getTicketModeOnlineOnly() {
        return ticketModeOnlineOnly;
    }

    public By getTicketModeOfflineOnly() {
        return ticketModeOfflineOnly;
    }

    public By getTicketModeBothOnlineOffline() {
        return ticketModeBothOnlineOffline;
    }

    public boolean isTicketModeSelected(By radioLocator) {
        return isCheckboxChecked(radioLocator);
    }

    public void selectOnlineOnlyMode() {
        clickCheckbox(ticketModeOnlineOnly);
    }

    public void selectBothOnlineOfflineMode() {
        clickCheckbox(ticketModeBothOnlineOffline);
    }

    public boolean isKnowledgeBaseCheckboxVisible() {
        return findFirstVisible(knowledgeBaseChk) != null;
    }

    public boolean isKnowledgeBaseChecked() {
        return isCheckboxChecked(knowledgeBaseChk);
    }

    public boolean isTicketPortalAnnouncementSectionVisible() {
        return isElementVisible(ticketPortalAnnouncementBannerHeading);
    }

    public boolean isTicketPortalAnnouncementTextareaVisible() {
        try {
            WebElement el = wait.until(
                    ExpectedConditions.visibilityOfElementLocated(ticketPortalAnnouncementTextarea));
            return el != null;
        } catch (Exception e) {
            return false;
        }
    }

    public void enterTicketPortalAnnouncementText(String text) {
        try {
            WebElement ta = wait.until(
                    ExpectedConditions.visibilityOfElementLocated(ticketPortalAnnouncementTextarea));
            scrollToElement(ta);
            ta.clear();
            ta.sendKeys(text);
        } catch (Exception e) {
            // fallback: find first visible textarea after scrolling
            List<WebElement> all = driver.findElements(By.tagName("textarea"));
            for (WebElement ta : all) {
                if (ta.isDisplayed()) {
                    scrollToElement(ta);
                    ta.clear();
                    ta.sendKeys(text);
                    break;
                }
            }
        }
    }

    public boolean isAssignmentMethodDropdownVisible() {
        return isElementVisible(assignmentMethodSelect)
                || isElementVisible(assignmentMethodDropdownTrigger);
    }

    public boolean isAssignmentManualInfoBannerVisible() {
        return isElementVisible(assignmentManualInfoBanner);
    }

    public String getAssignmentMethodDefaultValue() {
        try {
            WebElement sel = driver.findElement(assignmentMethodSelect);
            return new Select(sel).getFirstSelectedOption().getText().trim();
        } catch (Exception e) {
            try {
                return wait.until(ExpectedConditions.visibilityOfElementLocated(
                        assignmentMethodDropdownTrigger)).getText().trim();
            } catch (Exception e2) {
                return "";
            }
        }
    }

    public void changeAssignmentMethod() {
        try {
            WebElement sel = wait.until(
                    ExpectedConditions.elementToBeClickable(assignmentMethodSelect));
            scrollToElement(sel);
            Select dropdown = new Select(sel);
            List<WebElement> options = dropdown.getOptions();
            if (options.size() > 1) {
                dropdown.selectByIndex(1);
            }
        } catch (Exception e) {
            try {
                WebElement trigger = wait.until(ExpectedConditions.elementToBeClickable(
                        assignmentMethodDropdownTrigger));
                scrollToElement(trigger);
                trigger.click();
                pause(400);
                List<WebElement> opts = driver.findElements(
                        By.xpath("//*[@role='option']"));
                if (opts.size() > 1)
                    opts.get(1).click();
            } catch (Exception ignored) {
            }
        }
    }

    public boolean isWelcomeMessageTextareaVisible() {
        try {
            WebElement el = wait.until(
                    ExpectedConditions.visibilityOfElementLocated(welcomeMessageTextarea));
            scrollToElement(el);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getWelcomeMessageValue() {
        try {
            WebElement ta = wait.until(
                    ExpectedConditions.visibilityOfElementLocated(welcomeMessageTextarea));
            String val = ta.getAttribute("value");
            if (val == null)
                val = ta.getText();
            return val == null ? "" : val;
        } catch (Exception e) {
            return "";
        }
    }

    public void clearAndEnterWelcomeMessage(String text) {
        try {
            WebElement ta = wait.until(
                    ExpectedConditions.visibilityOfElementLocated(welcomeMessageTextarea));
            scrollToElement(ta);
            ta.clear();
            ta.sendKeys(text);
        } catch (Exception ignored) {
        }
    }

    // ================================================================
    // CUSTOMIZATION TAB — methods
    // ================================================================

    public boolean isCustomizationTabActive() {
        return isElementVisible(loginPageSectionHeading);
    }

    public boolean isLoginPageSectionVisible() {
        return isElementVisible(loginPageSectionHeading);
    }

    public boolean isUploadImageButtonVisible() {
        return isElementVisible(uploadImageBtn);
    }

    public boolean isThemeCustomizationHeadingVisible() {
        return isElementVisible(themeCustomizationHeading);
    }

    public boolean isLightThemeRadioVisible() {
        return findFirstVisible(lightThemeRadio) != null;
    }

    public boolean isDarkThemeRadioVisible() {
        return findFirstVisible(darkThemeRadio) != null;
    }

    public boolean isLightThemeSelected() {
        return isCheckboxChecked(lightThemeRadio);
    }

    public void clickDarkTheme() {
        scrollToSection(themeCustomizationHeading);
        clickCheckbox(darkThemeRadio);
    }

    public void clickLightTheme() {
        scrollToSection(themeCustomizationHeading);
        clickCheckbox(lightThemeRadio);
    }

    public boolean isThemeColorLabelVisible() {
        return isElementVisible(themeColorLabel);
    }

    public int getColorSwatchCount() {
        try {
            List<WebElement> swatches = driver.findElements(themeColorSwatches);
            return (int) swatches.stream().filter(WebElement::isDisplayed).count();
        } catch (Exception e) {
            return 0;
        }
    }

    public boolean isColorSwatchPaletteVisible() {
        return getColorSwatchCount() > 0;
    }

    public String getHexColorInputValue() {
        try {
            WebElement input = wait.until(
                    ExpectedConditions.visibilityOfElementLocated(hexColorInput));
            String val = input.getAttribute("value");
            if (val == null || val.isEmpty())
                val = input.getText();
            return val == null ? "" : val;
        } catch (Exception e) {
            return "";
        }
    }

    public void clickSecondColorSwatch() {
        try {
            List<WebElement> visible = driver.findElements(themeColorSwatches)
                    .stream().filter(WebElement::isDisplayed)
                    .collect(Collectors.toList());
            if (visible.size() >= 2) {
                scrollToElement(visible.get(1));
                jsClick(visible.get(1));
                pause(400);
            }
        } catch (Exception ignored) {
        }
    }

    public void setHexColorValue(String hex) {
        try {
            WebElement input = wait.until(
                    ExpectedConditions.elementToBeClickable(hexColorInput));
            scrollToElement(input);
            input.click();
            input.sendKeys(Keys.chord(Keys.CONTROL, "a"));
            input.sendKeys(hex);
            input.sendKeys(Keys.TAB);
            pause(300);
        } catch (Exception ignored) {
        }
    }

    public boolean isAdvancedCustomizationSectionVisible() {
        scrollToSection(advancedCustomizationHeading);
        return isElementVisible(advancedCustomizationHeading);
    }

    // ================================================================
    // UPDATE PROJECT + TABLE VERIFICATION — methods
    // ================================================================

    public void clickUpdateProjectButton() {
        try {
            WebElement btn = wait.until(
                    ExpectedConditions.elementToBeClickable(updateProjectBtn));
            scrollToElement(btn);
            btn.click();
        } catch (Exception e) {
            jsClick(wait.until(
                    ExpectedConditions.visibilityOfElementLocated(updateProjectBtn)));
        }
    }

    public boolean isSuccessToastVisible() {
        try {
            new org.openqa.selenium.support.ui.WebDriverWait(
                    driver, java.time.Duration.ofSeconds(10))
                    .until(ExpectedConditions.visibilityOfElementLocated(successToast));
            return true;
        } catch (Exception e) {
            // Fallback: scan all visible elements for success text
            try {
                List<WebElement> candidates = driver.findElements(By.xpath(
                        "//*[contains(normalize-space(),'successfully')"
                                + " or contains(normalize-space(),'created')"
                                + " or contains(normalize-space(),'saved')]"
                                + "[not(self::script)][not(self::style)]"));
                return candidates.stream().anyMatch(WebElement::isDisplayed);
            } catch (Exception ignored) {
                return false;
            }
        }
    }

    public boolean isModalClosed() {
        try {
            new org.openqa.selenium.support.ui.WebDriverWait(
                    driver, java.time.Duration.ofSeconds(20))
                    .until(ExpectedConditions.invisibilityOfElementLocated(modalTitle));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isProjectTableVisible() {
        return isElementVisible(projectsHeading) || isElementVisible(tableRows);
    }

    public boolean isFirstRowDataPresent() {
        try {
            WebElement cell = wait.until(
                    ExpectedConditions.visibilityOfElementLocated(firstRowProjectIdCell));
            return !cell.getText().trim().isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isFirstRowStatusActive() {
        try {
            WebElement row = wait.until(
                    ExpectedConditions.visibilityOfElementLocated(
                            By.xpath("(//tbody/tr)[1]")));
            return row.getText().contains("Active");
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isFirstRowEditButtonVisible() {
        return isElementVisible(firstRowEditButton);
    }

    public boolean isFirstRowDeleteButtonVisible() {
        return isElementVisible(firstRowDeleteButton);
    }

    public boolean isProjectInTable(String portalName) {
        try {
            By row = By.xpath("//tbody//td[contains(normalize-space(),'" + portalName + "')]");
            return wait.until(ExpectedConditions.visibilityOfElementLocated(row)) != null;
        } catch (Exception e) {
            return false;
        }
    }

    // ================================================================
    // PRIVATE HELPERS (shared by all tab methods)
    // ================================================================

    /**
     * Returns the first visible WebElement matching the locator, or null.
     */
    private WebElement findFirstVisible(By locator) {
        try {
            for (WebElement el : driver.findElements(locator)) {
                try {
                    if (el.isDisplayed())
                        return el;
                } catch (Exception ignored) {
                }
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    /**
     * Returns true when any element matching the locator is selected/checked.
     * Handles native inputs, React-controlled inputs via JS .checked property,
     * and custom toggle components via parent aria-checked / data-state.
     */
    private boolean isCheckboxChecked(By locator) {
        try {
            List<WebElement> els = driver.findElements(locator);
            if (els.isEmpty())
                return false;
            for (WebElement el : els) {
                try {
                    // Standard isSelected() — works for native inputs
                    if (el.isSelected())
                        return true;
                    // JS .checked property — works for React controlled inputs
                    Object jsChecked = ((JavascriptExecutor) driver)
                            .executeScript("return arguments[0].checked;", el);
                    if (Boolean.TRUE.equals(jsChecked))
                        return true;
                    // aria-checked on this element
                    String aria = el.getAttribute("aria-checked");
                    if ("true".equals(aria))
                        return true;
                    // Walk up to 4 parent elements — React toggles put aria-checked on wrapper
                    Object parentState = ((JavascriptExecutor) driver).executeScript(
                            "var e=arguments[0]; for(var i=0;i<4;i++){" +
                                    "  e=e.parentElement; if(!e) break;" +
                                    "  if(e.getAttribute('aria-checked')==='true') return true;" +
                                    "  if(e.getAttribute('data-checked')==='true') return true;" +
                                    "  if(e.getAttribute('data-state')==='checked') return true;" +
                                    "} return false;",
                            el);
                    if (Boolean.TRUE.equals(parentState))
                        return true;
                } catch (Exception ignored) {
                }
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Clicks a checkbox/radio input in a React-friendly way.
     * Priority: ancestor <label> click → native click → jsClick + change event.
     */
    private void clickCheckbox(By locator) {
        try {
            WebElement el = findFirstVisible(locator);
            if (el == null) {
                List<WebElement> els = driver.findElements(locator);
                if (!els.isEmpty())
                    el = els.get(0);
                else
                    el = wait.until(ExpectedConditions.presenceOfElementLocated(locator));
            }
            scrollToElement(el);
            // Try ancestor <label> first — React handles label.click() via synthetic events
            try {
                WebElement label = el.findElement(By.xpath("ancestor::label[1]"));
                jsClick(label);
                pause(400);
                return;
            } catch (Exception ignored) {
            }
            // Try native click (browser dispatches click → focus → change chain)
            try {
                el.click();
                pause(400);
                return;
            } catch (Exception ignored) {
            }
            // Fallback: JS click + explicit change event dispatch
            jsClick(el);
            try {
                ((JavascriptExecutor) driver).executeScript(
                        "arguments[0].dispatchEvent(new Event('change', {bubbles:true}));", el);
            } catch (Exception ignored) {
            }
            pause(400);
        } catch (Exception ignored) {
        }
    }

    /**
     * Scrolls the heading for a section into view.
     */
    private void scrollToSection(By headingLocator) {
        try {
            for (WebElement el : driver.findElements(headingLocator)) {
                if (el.isDisplayed()) {
                    scrollToElement(el);
                    return;
                }
            }
        } catch (Exception ignored) {
        }
    }

    /**
     * Short pause (milliseconds). Used after tab switches and interactions.
     */
    private void pause(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException ignored) {
            Thread.currentThread().interrupt();
        }
    }
}
