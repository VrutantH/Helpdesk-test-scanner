package com.hubblehox.automation.pages;

import com.hubblehox.automation.keywords.ActionKeywords;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class UserManagementPage extends ActionKeywords {

    // ===================================================================
    // MODAL SCOPE PREFIX – all fixed-overlay locators are anchored here
    // ===================================================================
    private static final String MODAL = "//div[contains(@style,'fixed') and .//h2[normalize-space()='Create User']]";

    // ===================================================================
    // PAGE-LEVEL LOCATORS
    // ===================================================================
    private final By sidebarLink = By.xpath("//*[normalize-space()='User Management']");
    private final By pageHeading = By.xpath("//h1[normalize-space()='User Management']");
    private final By pageSubtitle = By.xpath("//*[contains(normalize-space(),'Manage system users and their access')]");
    private final By searchInput = By.xpath("//input[@placeholder='Search users...']");
    // Role filter: first <select> on the page that is NOT inside a fixed-position
    // modal
    private final By roleFilterSelect = By.xpath(
            "(//select[not(ancestor::div[contains(@style,'fixed')])])[1]");
    // Status filter: has value='true' option (Active) – uniquely identifies it
    private final By statusFilterSelect = By.xpath(
            "//select[.//option[@value='true']][not(ancestor::div[contains(@style,'fixed')])]");
    // Center filter: first select in the filter bar
    private final By centerFilterSelect = By.xpath(
            "//*[@id='main-content']/div/div/div[3]/div[1]/select[1]");
    private final By addFromHrmsBtn = By.xpath("//button[contains(normalize-space(),'Add from HRMS')]");
    private final By createUserPageBtn = By
            .xpath("//button[normalize-space()='Create User'][not(ancestor::div[contains(@style,'fixed')])]");
    private final By tableRows = By.xpath("//tbody/tr");

    // Table column headers
    private final By colName = By.xpath(
            "//th[translate(normalize-space(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='NAME']");
    private final By colEmail = By.xpath(
            "//th[translate(normalize-space(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='EMAIL']");
    private final By colEmployeeCode = By.xpath(
            "//th[contains(translate(normalize-space(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ'),'EMPLOYEE CODE')]");
    private final By colRole = By.xpath(
            "//th[translate(normalize-space(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='ROLE']");
    private final By colProjects = By.xpath(
            "//th[translate(normalize-space(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='PROJECTS']");
    private final By colStatus = By.xpath(
            "//th[translate(normalize-space(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='STATUS']");
    private final By colActions = By.xpath(
            "//th[translate(normalize-space(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='ACTIONS']");

    // ===================================================================
    // MODAL LOCATORS
    // ===================================================================
    private final By modalTitle = By.xpath("//h2[normalize-space()='Create User']");
    private final By cancelBtn = By.xpath(MODAL + "//button[normalize-space()='Cancel']");
    private final By modalSubmitBtn = By
            .xpath(MODAL + "//button[normalize-space()='Create User' or normalize-space()='Saving...']");

    // Form fields — scoped to modal via label siblings
    private final By firstNameInput = By
            .xpath(MODAL + "//label[contains(normalize-space(),'First Name')]/following-sibling::input[@type='text']");
    private final By lastNameInput = By
            .xpath(MODAL + "//label[contains(normalize-space(),'Last Name')]/following-sibling::input[@type='text']");
    private final By emailInput = By.xpath(MODAL + "//input[@type='email']");
    private final By mobileInput = By.xpath(MODAL + "//input[@type='tel']");
    private final By employeeCodeInput = By.xpath(
            MODAL + "//label[contains(normalize-space(),'Employee Code')]/following-sibling::input[@type='text']");
    private final By joiningDateInput = By.xpath(MODAL + "//input[@type='date']");
    private final By passwordInput = By.xpath(MODAL + "//input[@type='password']");
    // Project selector: Find select following 'Project' label
    private final By projectSelect = By.xpath(MODAL + "//label[contains(normalize-space(),'Project')]/following::select[1]");
    // Role select: Find select following 'Role' label
    private final By roleSelect = By.xpath(MODAL + "//label[contains(normalize-space(),'Role')]/following::select[1]");
    // Department: text input following Department label (sibling or ancestor
    // approach)
    private final By departmentInput = By
            .xpath("(" + MODAL
                    + "//label[contains(normalize-space(),'Department')]/following-sibling::input[@type='text'] | " +
                    MODAL + "//label[contains(normalize-space(),'Department')]/following::input[@type='text'][1])[1]");
    private final By designationInput = By
            .xpath("(" + MODAL
                    + "//label[contains(normalize-space(),'Designation')]/following-sibling::input[@type='text'] | " +
                    MODAL + "//label[contains(normalize-space(),'Designation')]/following::input[@type='text'][1])[1]");
    private final By reportingManagerSelect = By
            .xpath(MODAL + "//select[.//option[contains(normalize-space(),'Select Reporting Manager')]]");
    private final By assignedProjectsLabel = By
            .xpath(MODAL + "//label[contains(normalize-space(),'Assigned Projects')]");
    private final By projectCheckboxes = By.xpath(MODAL + "//input[@type='checkbox']");

    // ===================================================================
    // CONSTRUCTOR
    // ===================================================================
    public UserManagementPage() {
        super();
    }

    // ===================================================================
    // NAVIGATION
    // ===================================================================

    public void clickUserMgmtMenu() {
        wait.until(ExpectedConditions.elementToBeClickable(sidebarLink)).click();
        pause(800);
    }

    public boolean isUserMgmtMenuVisible() {
        return isElementVisible(sidebarLink);
    }

    public boolean isUsersPageDisplayed() {
        try {
            wait.until(ExpectedConditions.urlContains("/users"));
            wait.until(ExpectedConditions.visibilityOfElementLocated(pageHeading));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ===================================================================
    // PAGE LANDING VERIFICATIONS
    // ===================================================================

    public boolean isPageHeadingDisplayed() {
        return isElementVisible(pageHeading);
    }

    public boolean isPageSubtitleDisplayed() {
        return isElementVisible(pageSubtitle);
    }

    public boolean isSearchInputVisible() {
        return isElementVisible(searchInput);
    }

    public boolean isRoleFilterVisible() {
        return isElementVisible(roleFilterSelect);
    }

    public boolean isStatusFilterVisible() {
        return isElementVisible(statusFilterSelect);
    }

    public boolean isAddFromHrmsButtonVisible() {
        return isElementVisible(addFromHrmsBtn);
    }

    public boolean isCreateUserPageButtonVisible() {
        return isElementVisible(createUserPageBtn);
    }

    public String getRoleFilterDefaultValue() {
        try {
            return new Select(wait.until(ExpectedConditions.visibilityOfElementLocated(roleFilterSelect)))
                    .getFirstSelectedOption().getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    public String getStatusFilterDefaultValue() {
        try {
            return new Select(wait.until(ExpectedConditions.visibilityOfElementLocated(statusFilterSelect)))
                    .getFirstSelectedOption().getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    public boolean isTableDisplayed() {
        try {
            return !driver.findElements(tableRows).isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isTableLoadedWithData() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(tableRows));
            return !driver.findElements(tableRows).isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isColumnHeaderVisible(By columnLocator) {
        return isElementVisible(columnLocator);
    }

    // Expose column locators for tests
    public By getColName() {
        return colName;
    }

    public By getColEmail() {
        return colEmail;
    }

    public By getColEmployeeCode() {
        return colEmployeeCode;
    }

    public By getColRole() {
        return colRole;
    }

    public By getColProjects() {
        return colProjects;
    }

    public By getColStatus() {
        return colStatus;
    }

    public By getColActions() {
        return colActions;
    }

    // ===================================================================
    // MODAL OPEN / CLOSE
    // ===================================================================

    public void clickCreateUserPageButton() {
        WebElement btn = wait.until(ExpectedConditions.visibilityOfElementLocated(createUserPageBtn));
        scrollToElement(btn);
        jsClick(btn); // JS click bypasses any overlay/toast covering the button
        pause(800);
    }

    public boolean isCreateUserModalOpen() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(modalTitle));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getModalTitleText() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(modalTitle)).getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    public void clickCancelButton() {
        wait.until(ExpectedConditions.elementToBeClickable(cancelBtn)).click();
        pause(600);
    }

    public boolean isModalClosed() {
        try {
            new WebDriverWait(driver, Duration.ofSeconds(10))
                    .until(ExpectedConditions.invisibilityOfElementLocated(modalTitle));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /** Safe close: clicks Cancel if the modal is currently visible */
    public void closeModalIfOpen() {
        try {
            List<WebElement> btns = driver.findElements(cancelBtn);
            if (!btns.isEmpty() && btns.get(0).isDisplayed()) {
                btns.get(0).click();
                pause(600);
            }
        } catch (Exception ignored) {
        }
    }

    // ===================================================================
    // FORM FIELD VISIBILITY CHECKS
    // ===================================================================

    public boolean isFirstNameFieldVisible() {
        return isElementVisible(firstNameInput);
    }

    public boolean isLastNameFieldVisible() {
        return isElementVisible(lastNameInput);
    }

    public boolean isEmailFieldVisible() {
        return isElementVisible(emailInput);
    }

    public boolean isMobileFieldVisible() {
        return isElementVisible(mobileInput);
    }

    public boolean isEmployeeCodeFieldVisible() {
        return isElementVisible(employeeCodeInput);
    }

    public boolean isJoiningDateFieldVisible() {
        return isElementVisible(joiningDateInput);
    }

    public boolean isPasswordFieldVisible() {
        return isElementVisible(passwordInput);
    }

    public boolean isRoleSelectVisible() {
        return isElementVisible(roleSelect);
    }

    public boolean isDepartmentFieldVisible() {
        return isElementVisible(departmentInput);
    }

    public boolean isDesignationFieldVisible() {
        return isElementVisible(designationInput);
    }

    public boolean isReportingManagerSelectVisible() {
        return isElementVisible(reportingManagerSelect);
    }

    public boolean isAssignedProjectsSectionVisible() {
        return isElementVisible(assignedProjectsLabel);
    }

    public String getRoleSelectDefaultValue() {
        try {
            return new Select(wait.until(ExpectedConditions.visibilityOfElementLocated(roleSelect)))
                    .getFirstSelectedOption().getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    public String getReportingManagerDefaultValue() {
        try {
            return new Select(wait.until(ExpectedConditions.visibilityOfElementLocated(reportingManagerSelect)))
                    .getFirstSelectedOption().getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    // ===================================================================
    // FIELD ENTRY (React-safe: click + Ctrl+A + Delete + sendKeys)
    // ===================================================================

    private void typeInField(By locator, String text) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        scrollToElement(field);
        field.click();
        field.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        field.sendKeys(Keys.DELETE);
        field.sendKeys(text);
    }

    public void enterFirstName(String text) {
        typeInField(firstNameInput, text);
    }

    public void enterLastName(String text) {
        typeInField(lastNameInput, text);
    }

    public void enterEmail(String text) {
        typeInField(emailInput, text);
    }

    public void enterMobile(String text) {
        typeInField(mobileInput, text);
    }

    public void enterEmployeeCode(String text) {
        typeInField(employeeCodeInput, text);
    }

    public void enterPassword(String text) {
        typeInField(passwordInput, text);
    }

    public void enterDepartment(String text) {
        typeInField(departmentInput, text);
    }

    public void enterDesignation(String text) {
        typeInField(designationInput, text);
    }

    public void enterJoiningDate(String dateYYYYMMDD) {
        try {
            WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(joiningDateInput));
            scrollToElement(field);
            ((JavascriptExecutor) driver).executeScript(
                    "arguments[0].value = arguments[1]; " +
                            "arguments[0].dispatchEvent(new Event('change', {bubbles:true}));",
                    field, dateYYYYMMDD);
        } catch (Exception ignored) {
        }
    }

    public String getFieldValue(By locator) {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(locator)).getAttribute("value");
        } catch (Exception e) {
            return "";
        }
    }

    public String getFirstNameValue() {
        return getFieldValue(firstNameInput);
    }

    public String getLastNameValue() {
        return getFieldValue(lastNameInput);
    }

    public String getEmailValue() {
        return getFieldValue(emailInput);
    }

    public String getMobileValue() {
        return getFieldValue(mobileInput);
    }

    public String getEmployeeCodeValue() {
        return getFieldValue(employeeCodeInput);
    }

    public String getPasswordFieldType() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(passwordInput))
                    .getAttribute("type");
        } catch (Exception e) {
            return "";
        }
    }

    // ===================================================================
    // ROLE SELECT
    // ===================================================================

    public void selectRoleByVisibleText(String roleName) {
        try {
            WebElement sel = wait.until(ExpectedConditions.elementToBeClickable(roleSelect));
            scrollToElement(sel);
            Select s = new Select(sel);
            boolean selected = false;
            try {
                s.selectByVisibleText(roleName);
                selected = true;
            } catch (Exception e) {
                // Case-insensitive fallback
                for (WebElement opt : s.getOptions()) {
                    if (opt.getText().trim().equalsIgnoreCase(roleName)) {
                        opt.click();
                        selected = true;
                        break;
                    }
                }
            }
            
            // If still not selected (React sync issue), force it via JS and dispatch event
            if (!selected || !getSelectedRoleName().equalsIgnoreCase(roleName)) {
                String value = "";
                for (WebElement opt : s.getOptions()) {
                    if (opt.getText().trim().equalsIgnoreCase(roleName)) {
                        value = opt.getAttribute("value");
                        break;
                    }
                }
                if (!value.isEmpty()) {
                    ((JavascriptExecutor) driver).executeScript(
                        "arguments[0].value = arguments[1]; " +
                        "arguments[0].dispatchEvent(new Event('change', {bubbles:true})); " +
                        "arguments[0].dispatchEvent(new Event('input', {bubbles:true}));",
                        sel, value);
                }
            }
            pause(500);
        } catch (Exception ignored) {
        }
    }

    public void selectFirstAvailableRole() {
        try {
            WebElement sel = wait.until(ExpectedConditions.elementToBeClickable(roleSelect));
            scrollToElement(sel);
            Select s = new Select(sel);
            if (s.getOptions().size() > 1) {
                s.selectByIndex(1);
                String val = s.getOptions().get(1).getAttribute("value");
                ((JavascriptExecutor) driver).executeScript(
                    "arguments[0].value = arguments[1]; " +
                    "arguments[0].dispatchEvent(new Event('change', {bubbles:true}));",
                    sel, val);
                pause(500);
            }
        } catch (Exception ignored) {
        }
    }

    public String getSelectedRoleName() {
        try {
            WebElement sel = wait.until(ExpectedConditions.visibilityOfElementLocated(roleSelect));
            Select s = new Select(sel);
            return s.getFirstSelectedOption().getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Select project from the project <select> dropdown (production UI).
     * Falls back gracefully if not present.
     */
    public void selectProjectFromDropdown(String projectName) {
        try {
            WebElement sel = wait.until(ExpectedConditions.elementToBeClickable(projectSelect));
            scrollToElement(sel);
            Select s = new Select(sel);
            boolean selected = false;
            try {
                s.selectByVisibleText(projectName);
                selected = true;
            } catch (Exception e) {
                // Try partial match
                for (WebElement opt : s.getOptions()) {
                    if (opt.getText().trim().contains(projectName)) {
                        opt.click();
                        selected = true;
                        break;
                    }
                }
            }

            if (!selected) {
                 for (WebElement opt : s.getOptions()) {
                    if (opt.getText().trim().equalsIgnoreCase(projectName)) {
                        String val = opt.getAttribute("value");
                        ((JavascriptExecutor) driver).executeScript(
                            "arguments[0].value = arguments[1]; " +
                            "arguments[0].dispatchEvent(new Event('change', {bubbles:true}));",
                            sel, val);
                        break;
                    }
                }
            }
            pause(800); // wait for role dropdown to populate
        } catch (Exception ignored) {
        }
    }

    public boolean isProjectSelectVisible() {
        return isElementVisible(projectSelect);
    }

    // ===================================================================
    // ASSIGNED PROJECTS CHECKBOXES
    // ===================================================================

    public boolean hasAtLeastOneProjectCheckbox() {
        try {
            return !driver.findElements(projectCheckboxes).isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isProjectCheckboxVisible(String projectName) {
        By loc = By.xpath(MODAL + "//label[.//span[normalize-space()='" + projectName + "'] " +
                "or contains(normalize-space(),'" + projectName + "')]//input[@type='checkbox']");
        return isElementVisible(loc);
    }

    public boolean isProjectCheckboxChecked(String projectName) {
        By loc = By.xpath(MODAL + "//label[.//span[normalize-space()='" + projectName + "'] " +
                "or contains(normalize-space(),'" + projectName + "')]//input[@type='checkbox']");
        try {
            WebElement chk = driver.findElement(loc);
            Boolean checked = (Boolean) ((JavascriptExecutor) driver)
                    .executeScript("return arguments[0].checked;", chk);
            return Boolean.TRUE.equals(checked);
        } catch (Exception e) {
            return false;
        }
    }

    public void checkProjectCheckbox(String projectName) {
        By loc = By.xpath(MODAL + "//label[.//span[normalize-space()='" + projectName + "'] " +
                "or contains(normalize-space(),'" + projectName + "')]//input[@type='checkbox']");
        try {
            WebElement chk = wait.until(ExpectedConditions.presenceOfElementLocated(loc));
            scrollToElement(chk);
            // Click via parent label for React synthetic event compatibility
            try {
                chk.findElement(By.xpath("ancestor::label[1]")).click();
            } catch (Exception e) {
                chk.click();
            }
            pause(300);
        } catch (Exception ignored) {
        }
    }

    // ===================================================================
    // MODAL SUBMIT BUTTON
    // ===================================================================

    public boolean isModalSubmitButtonDisabled() {
        try {
            WebElement btn = wait.until(ExpectedConditions.visibilityOfElementLocated(modalSubmitBtn));
            String disabled = btn.getAttribute("disabled");
            return disabled != null;
        } catch (Exception e) {
            return true;
        }
    }

    public boolean isModalSubmitButtonEnabled() {
        return !isModalSubmitButtonDisabled();
    }

    public void clickModalSubmitButton() {
        try {
            WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(modalSubmitBtn));
            scrollToElement(btn);
            btn.click();
        } catch (Exception e) {
            // JS click as fallback
            try {
                WebElement btn = wait.until(ExpectedConditions.visibilityOfElementLocated(modalSubmitBtn));
                jsClick(btn);
            } catch (Exception ignored) {
            }
        }
    }

    /**
     * Force-clicks the submit button via JavaScript, bypassing disabled state (for
     * negative tests)
     */
    public void forceClickModalSubmitButton() {
        try {
            WebElement btn = wait.until(ExpectedConditions.presenceOfElementLocated(modalSubmitBtn));
            scrollToElement(btn);
            jsClick(btn);
        } catch (Exception ignored) {
        }
    }

    // ===================================================================
    // ALERT HANDLING
    // ===================================================================

    public String getAlertText() {
        try {
            Alert alert = new WebDriverWait(driver, Duration.ofSeconds(10))
                    .until(ExpectedConditions.alertIsPresent());
            return alert.getText();
        } catch (Exception e) {
            return "";
        }
    }

    public void acceptAlert() {
        try {
            Alert alert = new WebDriverWait(driver, Duration.ofSeconds(10))
                    .until(ExpectedConditions.alertIsPresent());
            alert.accept();
            pause(500);
        } catch (Exception ignored) {
        }
    }

    /**
     * Returns true if no alert is currently present (no pending blocking dialog)
     */
    public boolean isNoAlertPresent() {
        try {
            driver.switchTo().alert();
            return false;
        } catch (Exception e) {
            return true;
        }
    }

    // ===================================================================
    // TABLE VERIFICATION
    // ===================================================================

    public boolean isUserInTable(String searchText) {
        try {
            By row = By.xpath("//tbody//td[contains(normalize-space(),'" + searchText + "')]");
            return wait.until(ExpectedConditions.visibilityOfElementLocated(row)) != null;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isEditButtonVisibleForUser(String userName) {
        By loc = By.xpath("//tbody//tr[.//td[contains(normalize-space(),'" + userName + "')]]" +
                "//*[contains(@title,'Edit') or contains(@aria-label,'Edit') or contains(@class,'edit') or name()='svg'][1]"
                +
                " | //tbody//tr[.//td[contains(normalize-space(),'" + userName + "')]]//button[1]");
        try {
            return !driver.findElements(loc).isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isActionButtonsVisibleForUser(String userName) {
        By loc = By.xpath("//tbody//tr[.//td[contains(normalize-space(),'" + userName + "')]]//button");
        try {
            List<WebElement> btns = driver.findElements(loc);
            return btns.size() >= 1;
        } catch (Exception e) {
            return false;
        }
    }

    // ===================================================================
    // SEARCH
    // ===================================================================

    public void enterSearchQuery(String query) {
        closeModalIfOpen(); // Dismiss any open modal that may cover the search field
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(searchInput));
        scrollToElement(field);
        jsClick(field); // JS click bypasses any residual overlay
        field.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        field.sendKeys(Keys.DELETE);
        field.sendKeys(query);
        pause(800);
    }

    public void clearSearch() {
        try {
            WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(searchInput));
            field.click();
            field.sendKeys(Keys.chord(Keys.CONTROL, "a"));
            field.sendKeys(Keys.DELETE);
            pause(800);
        } catch (Exception ignored) {
        }
    }

    public String getSearchInputValue() {
        return getFieldValue(searchInput);
    }

    // ===================================================================
    // FILTERS
    // ===================================================================

    public void selectStatusFilter(String visibleText) {
        try {
            new Select(wait.until(ExpectedConditions.elementToBeClickable(statusFilterSelect)))
                    .selectByVisibleText(visibleText);
            pause(800);
        } catch (Exception ignored) {
        }
    }

    public void selectCenterFilterByValue(String value) {
        try {
            new Select(wait.until(ExpectedConditions.elementToBeClickable(centerFilterSelect)))
                    .selectByValue(value);
            pause(800);
        } catch (Exception ignored) {
        }
    }

    public void selectStatusFilterByValue(String value) {
        try {
            new Select(wait.until(ExpectedConditions.elementToBeClickable(statusFilterSelect)))
                    .selectByValue(value);
            pause(800);
        } catch (Exception ignored) {
        }
    }

    public void selectRoleFilter(String roleName) {
        try {
            WebElement sel = wait.until(ExpectedConditions.elementToBeClickable(roleFilterSelect));
            Select s = new Select(sel);
            try {
                s.selectByVisibleText(roleName);
            } catch (Exception e) {
                for (WebElement opt : s.getOptions()) {
                    if (opt.getText().trim().equalsIgnoreCase(roleName)) {
                        opt.click();
                        break;
                    }
                }
            }
            pause(800);
        } catch (Exception ignored) {
        }
    }

    // ===================================================================
    // HTML5 VALIDATION CHECK (via JS)
    // ===================================================================

    public boolean isFieldHtml5Valid(By locator) {
        try {
            WebElement field = driver.findElement(locator);
            return (Boolean) ((JavascriptExecutor) driver)
                    .executeScript("return arguments[0].checkValidity();", field);
        } catch (Exception e) {
            return true;
        }
    }

    // ===================================================================
    // HELPERS
    // ===================================================================

    private void pause(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
