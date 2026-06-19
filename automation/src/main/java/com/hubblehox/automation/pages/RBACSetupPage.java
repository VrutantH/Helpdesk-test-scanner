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

public class RBACSetupPage extends ActionKeywords {

    // ===================================================================
    // MODAL SCOPE PREFIXES
    // CE_MODAL – anchors all Create-New-Role AND Edit-Role modal locators
    // CLONE_MODAL – anchors all Clone-Role modal locators
    // ===================================================================
    private static final String CE_MODAL = "//div[contains(@style,'fixed') and " +
            "(.//h2[normalize-space()='Create New Role'] or .//h2[normalize-space()='Edit Role'])]";

    private static final String CLONE_MODAL = "//div[contains(@style,'fixed') and .//h2[normalize-space()='Clone Role']]";

    // ===================================================================
    // PAGE-LEVEL LOCATORS
    // ===================================================================
    private final By sidebarLink = By.xpath("//*[normalize-space()='RBAC Setup']");
    private final By pageHeading = By.xpath("//h1[normalize-space()='RBAC Setup']");
    private final By pageSubtitle = By.xpath("//*[contains(normalize-space(),'Manage roles and permissions')]");
    private final By createRoleBtn = By.xpath(
            "//button[contains(normalize-space(),'Create New Role')][not(ancestor::div[contains(@style,'fixed')])]");
    private final By searchInput = By.xpath(
            "//input[contains(translate(@placeholder,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'search')]"
                    + "[not(ancestor::div[contains(@style,'fixed')])]");
    private final By filterAllBtn = By.xpath(
            "//button[translate(normalize-space(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='all']"
                    + "[not(ancestor::div[contains(@style,'fixed')])]");
    private final By filterMasterBtn = By.xpath(
            "//button[translate(normalize-space(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='master']"
                    + "[not(ancestor::div[contains(@style,'fixed')])]");
    private final By filterSystemBtn = By.xpath(
            "//button[translate(normalize-space(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='system']"
                    + "[not(ancestor::div[contains(@style,'fixed')])]");
    private final By filterCustomBtn = By.xpath(
            "//button[translate(normalize-space(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='custom']"
                    + "[not(ancestor::div[contains(@style,'fixed')])]");
    private final By tableRows = By.xpath("//tbody/tr");

    // ── Table column headers ──────────────────────────────────────────
    private final By colMaster = By.xpath(
            "//th[translate(normalize-space(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='MASTER']");
    private final By colRoleName = By.xpath(
            "//th[contains(translate(normalize-space(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ'),'ROLE NAME')]");
    private final By colCode = By.xpath(
            "//th[translate(normalize-space(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='CODE']");
    private final By colType = By.xpath(
            "//th[translate(normalize-space(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='TYPE']");
    private final By colPermissions = By.xpath(
            "//th[translate(normalize-space(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='PERMISSIONS']");
    private final By colProjects = By.xpath(
            "//th[translate(normalize-space(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='PROJECTS']");
    private final By colAgents = By.xpath(
            "//th[translate(normalize-space(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='AGENTS']");
    private final By colActions = By.xpath(
            "//th[translate(normalize-space(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='ACTIONS']");

    // ===================================================================
    // CREATE / EDIT MODAL LOCATORS
    // ===================================================================
    private final By ceModalTitle = By.xpath(
            "//h2[normalize-space()='Create New Role' or normalize-space()='Edit Role']");
    private final By ceModalCloseBtn = By.xpath(
            "//h2[normalize-space()='Create New Role' or normalize-space()='Edit Role']/following-sibling::button");
    private final By roleNameInput = By.xpath(
            CE_MODAL + "//label[contains(normalize-space(),'Role Name')]/following-sibling::input[@type='text']");
    private final By codeInput = By.xpath(
            CE_MODAL + "//label[contains(normalize-space(),'Code')]/following-sibling::input[@type='text']");
    private final By descriptionTextarea = By.xpath(CE_MODAL + "//textarea");
    private final By roleTypeSelect = By.xpath(CE_MODAL + "//select");
    private final By markAsMasterCheckbox = By.xpath(
            CE_MODAL + "//label[contains(normalize-space(),'Mark as Master Role')]//input[@type='checkbox']");
    private final By markAsAgentCheckbox = By.xpath(
            CE_MODAL + "//label[contains(normalize-space(),'Mark as Agent Role')]//input[@type='checkbox']");
    private final By projectMappingSection = By.xpath(
            CE_MODAL + "//h3[contains(normalize-space(),'Project Mapping')]");
    private final By projectMappingCheckboxes = By.xpath(
            CE_MODAL + "//h3[contains(normalize-space(),'Project Mapping')]/following-sibling::*//input[@type='checkbox']");
    private final By noProjectsWarning = By.xpath(
            CE_MODAL + "//*[contains(normalize-space(),'No projects selected')]");
    private final By projectMappedMsg = By.xpath(
            CE_MODAL + "//*[contains(normalize-space(),'This role is mapped to')]");
    private final By permissionsSection = By.xpath(
            CE_MODAL + "//h3[contains(normalize-space(),'Permissions')]");
    // First category expand/collapse button inside the permissions accordion
    private final By firstCategoryBtn = By.xpath(
            CE_MODAL + "//h3[contains(normalize-space(),'Permissions')]/following-sibling::div[1]//button[@type='button'][1]");
    // First module-level 'select all' checkbox (only visible after category is
    // expanded)
    private final By firstModuleSelectAll = By.xpath(
            CE_MODAL + "//h3[contains(normalize-space(),'Permissions')]/following-sibling::div[1]//input[@type='checkbox'][1]");
    private final By ceCancelBtn = By.xpath(CE_MODAL + "//button[normalize-space()='Cancel']");
    private final By ceSubmitBtn = By.xpath(CE_MODAL + "//button[@type='submit']");

    // ===================================================================
    // CLONE MODAL LOCATORS
    // ===================================================================
    private final By cloneModalTitle = By.xpath("//h2[normalize-space()='Clone Role']");
    private final By cloneModalCloseBtn = By.xpath("//h2[normalize-space()='Clone Role']/following-sibling::button");
    private final By cloneInfoBanner = By.xpath(CLONE_MODAL + "//*[contains(normalize-space(),'Cloning from')]");
    private final By cloneNameInput = By.xpath(CLONE_MODAL + "//input[@type='text'][1]");
    private final By cloneCodeInput = By.xpath(CLONE_MODAL + "//input[@type='text'][2]");
    private final By cloneDescTextarea = By.xpath(CLONE_MODAL + "//textarea");
    private final By cloneProjectsLabel = By
            .xpath(CLONE_MODAL + "//*[contains(normalize-space(),'Assign to Projects')]");
    private final By cloneProjectCheckboxes = By.xpath(CLONE_MODAL + "//input[@type='checkbox']");
    private final By cloneCancelBtn = By.xpath(CLONE_MODAL + "//button[normalize-space()='Cancel']");
    private final By cloneSubmitBtn = By.xpath(CLONE_MODAL + "//button[@type='submit']");

    // ===================================================================
    // CONSTRUCTOR
    // ===================================================================
    public RBACSetupPage() {
        super();
    }

    // ===================================================================
    // NAVIGATION
    // ===================================================================

    public void clickRBACSetupMenu() {
        wait.until(ExpectedConditions.elementToBeClickable(sidebarLink)).click();
        pause(800);
    }

    public boolean isRBACSetupMenuVisible() {
        return isElementVisible(sidebarLink);
    }

    public boolean isRBACPageDisplayed() {
        try {
            wait.until(ExpectedConditions.urlContains("/rbac"));
            wait.until(ExpectedConditions.visibilityOfElementLocated(pageHeading));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ===================================================================
    // LANDING PAGE ELEMENT VERIFICATION
    // ===================================================================

    public boolean isPageHeadingDisplayed() {
        return isElementVisible(pageHeading);
    }

    public boolean isPageSubtitleDisplayed() {
        return isElementVisible(pageSubtitle);
    }

    public boolean isCreateRoleButtonVisible() {
        return isElementVisible(createRoleBtn);
    }

    public boolean isSearchInputVisible() {
        return isElementVisible(searchInput);
    }

    public boolean isFilterAllButtonVisible() {
        return isElementVisible(filterAllBtn);
    }

    public boolean isFilterMasterButtonVisible() {
        return isElementVisible(filterMasterBtn);
    }

    public boolean isFilterSystemButtonVisible() {
        return isElementVisible(filterSystemBtn);
    }

    public boolean isFilterCustomButtonVisible() {
        return isElementVisible(filterCustomBtn);
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

    // ── Column header visibility ──────────────────────────────────────
    public boolean isColMasterVisible() {
        return isElementVisible(colMaster);
    }

    public boolean isColRoleNameVisible() {
        return isElementVisible(colRoleName);
    }

    public boolean isColCodeVisible() {
        return isElementVisible(colCode);
    }

    public boolean isColTypeVisible() {
        return isElementVisible(colType);
    }

    public boolean isColPermissionsVisible() {
        return isElementVisible(colPermissions);
    }

    public boolean isColProjectsVisible() {
        return isElementVisible(colProjects);
    }

    public boolean isColAgentsVisible() {
        return isElementVisible(colAgents);
    }

    public boolean isColActionsVisible() {
        return isElementVisible(colActions);
    }

    // Expose column locators for tests
    public By getColMaster() {
        return colMaster;
    }

    public By getColRoleName() {
        return colRoleName;
    }

    public By getColCode() {
        return colCode;
    }

    public By getColType() {
        return colType;
    }

    public By getColPermissions() {
        return colPermissions;
    }

    public By getColProjects() {
        return colProjects;
    }

    public By getColAgents() {
        return colAgents;
    }

    public By getColActions() {
        return colActions;
    }

    public boolean isColumnHeaderVisible(By locator) {
        return isElementVisible(locator);
    }

    // ===================================================================
    // SEARCH & FILTER
    // ===================================================================

    public void typeInSearch(String text) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(searchInput));
        scrollToElement(field);
        jsClick(field);
        field.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        field.sendKeys(Keys.DELETE);
        field.sendKeys(text);
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
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(searchInput))
                    .getAttribute("value");
        } catch (Exception e) {
            return "";
        }
    }

    public int getVisibleRowCount() {
        try {
            return driver.findElements(tableRows).size();
        } catch (Exception e) {
            return 0;
        }
    }

    public void clickFilterAll() {
        wait.until(ExpectedConditions.elementToBeClickable(filterAllBtn)).click();
        pause(600);
    }

    public void clickFilterMaster() {
        wait.until(ExpectedConditions.elementToBeClickable(filterMasterBtn)).click();
        pause(600);
    }

    public void clickFilterSystem() {
        wait.until(ExpectedConditions.elementToBeClickable(filterSystemBtn)).click();
        pause(600);
    }

    public void clickFilterCustom() {
        wait.until(ExpectedConditions.elementToBeClickable(filterCustomBtn)).click();
        pause(600);
    }

    /**
     * Returns true if the filter button for the given type appears to be active
     * (has a blue background-color: ~rgb(59,130,246) or #3b82f6).
     */
    public boolean isFilterButtonActive(String type) {
        By btn = switch (type.toLowerCase()) {
            case "all" -> filterAllBtn;
            case "master" -> filterMasterBtn;
            case "system" -> filterSystemBtn;
            case "custom" -> filterCustomBtn;
            default -> filterAllBtn;
        };
        try {
            String bg = wait.until(ExpectedConditions.visibilityOfElementLocated(btn))
                    .getCssValue("background-color");
            // active blue: rgb(59, 130, 246) or rgb(37, 99, 235)
            return bg != null && (bg.contains("59") && bg.contains("130") || bg.contains("37") && bg.contains("99"));
        } catch (Exception e) {
            return false;
        }
    }

    // ===================================================================
    // TABLE ROW VERIFICATION
    // ===================================================================

    public boolean isRoleInTable(String roleName) {
        return !driver.findElements(
                By.xpath("//tbody/tr[.//div[normalize-space()='" + roleName + "']]")).isEmpty();
    }

    /**
     * Returns true if the master star icon in the row is gold (#f59e0b).
     */
    public boolean isStarGoldForRole(String roleName) {
        try {
            WebElement btn = driver.findElement(
                    By.xpath("//tbody/tr[.//div[normalize-space()='" + roleName + "']]//td[1]/button"));
            String style = btn.getAttribute("style");
            return style != null && (style.contains("f59e0b") || style.contains("245, 158, 11"));
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Returns true if the master star icon in the row is grey (#d1d5db).
     */
    public boolean isStarGreyForRole(String roleName) {
        try {
            WebElement btn = driver.findElement(
                    By.xpath("//tbody/tr[.//div[normalize-space()='" + roleName + "']]//td[1]/button"));
            String style = btn.getAttribute("style");
            return style != null && (style.contains("d1d5db") || style.contains("209, 213, 219"));
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Returns true if the star/master button is disabled for the first system role
     * found.
     */
    public boolean isStarDisabledForFirstSystemRole() {
        try {
            // First find the system role row
            By systemRow = By.xpath(
                    "(//tbody/tr[.//span[translate(normalize-space()," +
                            "'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='system']])[1]");
            WebElement row = wait.until(ExpectedConditions.presenceOfElementLocated(systemRow));
            
            // Find star button (first button in row)
            List<WebElement> buttons = row.findElements(By.xpath(".//button"));
            if (buttons.isEmpty()) {
                return false;
            }
            WebElement btn = buttons.get(0); // Star button is first
            
            // Check multiple disabled indicators
            if (btn.getAttribute("disabled") != null)
                return true;
            if ("true".equalsIgnoreCase(btn.getAttribute("aria-disabled")))
                return true;
            String cls = btn.getAttribute("class");
            if (cls != null
                    && (cls.contains("disabled") || cls.contains("opacity") || cls.contains("cursor-not-allowed")))
                return true;
            String ptrEvents = btn.getCssValue("pointer-events");
            if ("none".equalsIgnoreCase(ptrEvents))
                return true;
            String cursor = btn.getCssValue("cursor");
            if ("not-allowed".equalsIgnoreCase(cursor))
                return true;
            return !btn.isEnabled();
        } catch (Exception e) {
            // If element not found, return false (test will fail with proper message)
            return false;
        }
    }

    /**
     * Returns true if every row in the table has an Edit button (title='Edit
     * Role').
     */
    public boolean isEditIconVisibleForAllRoles() {
        List<WebElement> rows = driver.findElements(tableRows);
        if (rows.isEmpty())
            return false;
        for (WebElement row : rows) {
            if (row.findElements(By.xpath(".//button[@title='Edit Role']")).isEmpty())
                return false;
        }
        return true;
    }

    /**
     * Returns true if no system-role row has a Delete button.
     */
    public boolean isDeleteIconAbsentForSystemRoles() {
        try {
            List<WebElement> sysRows = driver.findElements(By.xpath(
                    "//tbody/tr[.//span[translate(normalize-space()," +
                            "'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='system']]"));
            for (WebElement row : sysRows) {
                if (!row.findElements(By.xpath(".//button[@title='Delete Role']")).isEmpty())
                    return false;
            }
            return true;
        } catch (Exception e) {
            return true;
        }
    }

    /**
     * Returns true if the Clone button is visible for the given role row.
     */
    public boolean isCloneIconVisibleForRole(String roleName) {
        return !driver.findElements(
                By.xpath("//tbody/tr[.//div[normalize-space()='" + roleName + "']]//button[@title='Clone Role']"))
                .isEmpty();
    }

    // ===================================================================
    // CREATE / EDIT MODAL – OPEN & CLOSE
    // ===================================================================

    public void clickCreateRoleButton() {
        WebElement btn = wait.until(ExpectedConditions.visibilityOfElementLocated(createRoleBtn));
        scrollToElement(btn);
        jsClick(btn);
        pause(800);
    }

    public boolean isCreateEditModalOpen() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(ceModalTitle));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getCEModalTitleText() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(ceModalTitle)).getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    public void clickCEModalCloseButton() {
        wait.until(ExpectedConditions.elementToBeClickable(ceModalCloseBtn)).click();
        pause(600);
    }

    public void clickCECancelButton() {
        wait.until(ExpectedConditions.elementToBeClickable(ceCancelBtn)).click();
        pause(600);
    }

    public boolean isCEModalClosed() {
        try {
            new WebDriverWait(driver, Duration.ofSeconds(10))
                    .until(ExpectedConditions.invisibilityOfElementLocated(ceModalTitle));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ===================================================================
    // CREATE / EDIT MODAL – FIELD VISIBILITY
    // ===================================================================

    public boolean isRoleNameFieldVisible() {
        return isElementVisible(roleNameInput);
    }

    public boolean isCodeFieldVisible() {
        return isElementVisible(codeInput);
    }

    public boolean isDescriptionTextareaVisible() {
        return isElementVisible(descriptionTextarea);
    }

    public boolean isRoleTypeSelectVisible() {
        return isElementVisible(roleTypeSelect);
    }

    public boolean isMasterCheckboxVisible() {
        return isElementVisible(markAsMasterCheckbox);
    }

    public boolean isAgentCheckboxVisible() {
        return isElementVisible(markAsAgentCheckbox);
    }

    public boolean isProjectMappingSectionVisible() {
        return isElementVisible(projectMappingSection);
    }

    public boolean isPermissionsSectionVisible() {
        return isElementVisible(permissionsSection);
    }

    public boolean isNoProjectsWarningVisible() {
        return isElementVisible(noProjectsWarning);
    }

    public boolean isProjectMappedMsgVisible() {
        return isElementVisible(projectMappedMsg);
    }

    public boolean isMasterCheckboxAbsent() {
        return driver.findElements(markAsMasterCheckbox).isEmpty();
    }

    public boolean isAgentCheckboxAbsent() {
        return driver.findElements(markAsAgentCheckbox).isEmpty();
    }

    public boolean isProjectMappingSectionAbsent() {
        return driver.findElements(projectMappingSection).isEmpty();
    }

    public boolean hasProjectMappingCheckboxes() {
        return !driver.findElements(projectMappingCheckboxes).isEmpty();
    }

    // ===================================================================
    // ROLE TYPE SELECT
    // ===================================================================

    public int getRoleTypeOptionCount() {
        try {
            return new Select(wait.until(ExpectedConditions.visibilityOfElementLocated(roleTypeSelect)))
                    .getOptions().size();
        } catch (Exception e) {
            return 0;
        }
    }

    public String getRoleTypeSelectedValue() {
        try {
            return new Select(wait.until(ExpectedConditions.visibilityOfElementLocated(roleTypeSelect)))
                    .getFirstSelectedOption().getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    public void selectRoleType(String visibleText) {
        try {
            WebElement sel = wait.until(ExpectedConditions.elementToBeClickable(roleTypeSelect));
            scrollToElement(sel);
            Select s = new Select(sel);
            boolean selected = false;
            // 1. Try exact visible text
            try {
                s.selectByVisibleText(visibleText);
                selected = true;
            } catch (Exception ignored) {
            }
            if (!selected) {
                // 2. Try case-insensitive exact match
                for (WebElement opt : s.getOptions()) {
                    if (opt.getText().trim().equalsIgnoreCase(visibleText)) {
                        opt.click();
                        selected = true;
                        break;
                    }
                }
            }
            if (!selected) {
                // 3. Try case-insensitive contains match
                for (WebElement opt : s.getOptions()) {
                    if (opt.getText().trim().toLowerCase().contains(visibleText.toLowerCase())) {
                        opt.click();
                        break;
                    }
                }
            }
            pause(500);
        } catch (Exception ignored) {
        }
    }

    // ===================================================================
    // CODE FIELD
    // ===================================================================

    public String getCodeFieldValue() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(codeInput))
                    .getAttribute("value");
        } catch (Exception e) {
            return "";
        }
    }

    public boolean isCodeFieldDisabled() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(codeInput))
                    .getAttribute("disabled") != null;
        } catch (Exception e) {
            return false;
        }
    }

    // ===================================================================
    // FORM ENTRY (React-safe: click + Ctrl+A + DELETE + sendKeys)
    // ===================================================================

    private void reactType(By locator, String text) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        scrollToElement(field);
        field.click();
        field.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        field.sendKeys(Keys.DELETE);
        field.sendKeys(text);
        pause(300);
    }

    public void enterRoleName(String name) {
        reactType(roleNameInput, name);
    }

    public void clearAndTypeCode(String code) {
        reactType(codeInput, code);
    }

    public void enterDescription(String desc) {
        reactType(descriptionTextarea, desc);
    }

    public String getRoleNameFieldValue() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(roleNameInput))
                    .getAttribute("value");
        } catch (Exception e) {
            return "";
        }
    }

    public String getDescriptionFieldValue() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(descriptionTextarea))
                    .getAttribute("value");
        } catch (Exception e) {
            return "";
        }
    }

    // ===================================================================
    // PERMISSIONS ACCORDION
    // ===================================================================

    public void clickFirstPermissionCategory() {
        WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(firstCategoryBtn));
        scrollToElement(btn);
        btn.click();
        pause(500);
    }

    public boolean isFirstPermissionCategoryExpanded() {
        return !driver.findElements(firstModuleSelectAll).isEmpty();
    }

    public void clickFirstModuleSelectAll() {
        WebElement chk = wait.until(ExpectedConditions.presenceOfElementLocated(firstModuleSelectAll));
        scrollToElement(chk);
        try {
            chk.findElement(By.xpath("ancestor::label[1]")).click();
        } catch (Exception e) {
            chk.click();
        }
        pause(300);
    }

    public boolean isFirstModuleSelectAllChecked() {
        try {
            WebElement chk = driver.findElement(firstModuleSelectAll);
            return Boolean.TRUE.equals(
                    ((JavascriptExecutor) driver).executeScript("return arguments[0].checked;", chk));
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Simple method to select at least one permission checkbox in the Create/Edit modal.
     * Finds any unchecked checkbox and clicks it to satisfy permission requirements.
     */
    public void selectAnyPermissionCheckbox() {
        try {
            // Find all checkboxes in the modal (excluding project mapping checkboxes)
            List<WebElement> checkboxes = driver.findElements(
                By.xpath(CE_MODAL + "//input[@type='checkbox']"));
            
            for (WebElement chk : checkboxes) {
                try {
                    // Check if checkbox is not already checked
                    boolean isChecked = Boolean.TRUE.equals(
                        ((JavascriptExecutor) driver).executeScript("return arguments[0].checked;", chk));
                    if (!isChecked && chk.isDisplayed()) {
                        scrollToElement(chk);
                        // Try to click the parent label first (better UX)
                        try {
                            chk.findElement(By.xpath("ancestor::label[1]")).click();
                        } catch (Exception e) {
                            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", chk);
                        }
                        pause(500);
                        return; // Exit after clicking one checkbox
                    }
                } catch (Exception ignored) {
                    // Skip this checkbox and try next
                }
            }
        } catch (Exception e) {
            // If no checkbox found, that's okay - role might be valid without permissions
        }
    }

    // ===================================================================
    // PROJECT MAPPING SECTION
    // ===================================================================

    /**
     * Clicks the first project checkbox in the Project Mapping section (Create/Edit
     * modal).
     */
    public void selectFirstProjectInMapping() {
        try {
            List<WebElement> checkboxes = wait.until(
                    ExpectedConditions.presenceOfAllElementsLocatedBy(projectMappingCheckboxes));
            if (!checkboxes.isEmpty()) {
                WebElement chk = checkboxes.get(0);
                scrollToElement(chk);
                try {
                    chk.findElement(By.xpath("ancestor::label[1]")).click();
                } catch (Exception e) {
                    chk.click();
                }
                pause(400);
            }
        } catch (Exception ignored) {
        }
    }

    // ===================================================================
    // CE MODAL SUBMIT
    // ===================================================================

    public void clickCESubmitButton() {
        try {
            WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(ceSubmitBtn));
            scrollToElement(btn);
            btn.click();
            pause(1200);
        } catch (Exception e) {
            try {
                WebElement btn = driver.findElement(ceSubmitBtn);
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", btn);
                pause(1200);
            } catch (Exception ignored) {
            }
        }
    }

    /**
     * Force-clicks submit via JavaScript, bypassing disabled state (for negative
     * tests).
     */
    public void forceClickCESubmit() {
        try {
            WebElement btn = wait.until(ExpectedConditions.presenceOfElementLocated(ceSubmitBtn));
            scrollToElement(btn);
            jsClick(btn);
        } catch (Exception ignored) {
        }
    }

    // ===================================================================
    // EDIT MODAL – open for a specific role
    // ===================================================================

    public void clickEditForRole(String roleName) {
        By editBtn = By.xpath(
                "//tbody/tr[.//div[normalize-space()='" + roleName + "']]//button[@title='Edit Role']");
        WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(editBtn));
        scrollToElement(btn);
        btn.click();
        pause(800);
    }

    public void clickEditForFirstSystemRole() {
        By editBtn = By.xpath(
                "(//tbody/tr[.//span[translate(normalize-space()," +
                        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='system']])[1]//button[@title='Edit Role']");
        try {
            WebElement btn = wait.until(ExpectedConditions.presenceOfElementLocated(editBtn));
            scrollToElement(btn);
            pause(500);
            // Use JavaScript click to avoid ElementClickInterceptedException
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", btn);
            pause(800);
        } catch (Exception e) {
            throw new RuntimeException("Failed to click edit button for first system role. Error: " + e.getMessage());
        }
    }

    // ===================================================================
    // TOGGLE MASTER STAR
    // ===================================================================

    public void clickStarForRole(String roleName) {
        // Find all buttons in the row - star is typically the 1st button
        By rowButtons = By.xpath(
                "//tbody/tr[.//div[normalize-space()='" + roleName + "']]//button");
        try {
            List<WebElement> buttons = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(rowButtons));
            if (buttons.isEmpty()) {
                throw new RuntimeException("No buttons found in row for role: " + roleName);
            }
            // Star button is usually the first button in the row
            WebElement starBtn = buttons.get(0);
            scrollToElement(starBtn);
            pause(500);
            // Use JavaScript click to bypass CSS/overlay issues
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", starBtn);
            pause(1000);
        } catch (Exception e) {
            throw new RuntimeException("Failed to click star button for role: " + roleName + ". Error: " + e.getMessage());
        }
    }

    // ===================================================================
    // CLONE MODAL – open, verify, fill, submit
    // ===================================================================

    public void clickCloneForRole(String roleName) {
        // Find all buttons in the row - typically 3 buttons: star, edit, clone/delete
        By rowButtons = By.xpath(
                "//tbody/tr[.//div[normalize-space()='" + roleName + "']]//button");
        try {
            List<WebElement> buttons = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(rowButtons));
            if (buttons.isEmpty()) {
                throw new RuntimeException("No buttons found in row for role: " + roleName);
            }
            
            // Debug: Log all button titles
            System.out.println("[DEBUG] Found " + buttons.size() + " buttons for role: " + roleName);
            for (int i = 0; i < buttons.size(); i++) {
                String title = buttons.get(i).getAttribute("title");
                String text = buttons.get(i).getText();
                System.out.println("[DEBUG]   Button[" + i + "]: title='" + title + "', text='" + text + "'");
            }
            
            // Try to find clone button by checking title attribute first
            WebElement cloneBtn = null;
            int cloneBtnIndex = -1;
            for (int i = 0; i < buttons.size(); i++) {
                String title = buttons.get(i).getAttribute("title");
                if (title != null && title.toLowerCase().contains("clone")) {
                    cloneBtn = buttons.get(i);
                    cloneBtnIndex = i;
                    break;
                }
            }
            
            // If not found by title, check button text
            if (cloneBtn == null) {
                for (int i = 0; i < buttons.size(); i++) {
                    String text = buttons.get(i).getText();
                    if (text != null && text.toLowerCase().contains("clone")) {
                        cloneBtn = buttons.get(i);
                        cloneBtnIndex = i;
                        break;
                    }
                }
            }
            
            if (cloneBtn == null) {
                throw new RuntimeException("Could not find clone button by title or text. Found " + buttons.size() + " buttons in row");
            }
            
            System.out.println("[DEBUG] Clicking clone button at index " + cloneBtnIndex);
            scrollToElement(cloneBtn);
            pause(500);
            // Use JavaScript click to bypass CSS/overlay issues
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", cloneBtn);
            pause(2000); // Increased wait for modal to appear
        } catch (Exception e) {
            throw new RuntimeException("Failed to click clone button for role: " + roleName + ". Error: " + e.getMessage());
        }
    }

    public boolean isCloneModalOpen() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(cloneModalTitle));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isCloneModalClosed() {
        try {
            new WebDriverWait(driver, Duration.ofSeconds(10))
                    .until(ExpectedConditions.invisibilityOfElementLocated(cloneModalTitle));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isCloneInfoBannerVisible() {
        return isElementVisible(cloneInfoBanner);
    }

    public boolean isCloneNameInputVisible() {
        return isElementVisible(cloneNameInput);
    }

    public boolean isCloneCodeInputVisible() {
        return isElementVisible(cloneCodeInput);
    }

    public boolean isCloneDescTextareaVisible() {
        return isElementVisible(cloneDescTextarea);
    }

    public boolean isCloneProjectsLabelVisible() {
        return isElementVisible(cloneProjectsLabel);
    }

    public boolean isCloneProjectCheckboxesPresent() {
        return !driver.findElements(cloneProjectCheckboxes).isEmpty();
    }

    public String getCloneInfoBannerText() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(cloneInfoBanner)).getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    public String getCloneCodeValue() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(cloneCodeInput))
                    .getAttribute("value");
        } catch (Exception e) {
            return "";
        }
    }

    public void clickCloneModalCloseButton() {
        wait.until(ExpectedConditions.elementToBeClickable(cloneModalCloseBtn)).click();
        pause(600);
    }

    public void clickCloneCancelButton() {
        wait.until(ExpectedConditions.elementToBeClickable(cloneCancelBtn)).click();
        pause(600);
    }

    public void enterCloneName(String name) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(cloneNameInput));
        scrollToElement(field);
        field.click();
        field.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        field.sendKeys(Keys.DELETE);
        field.sendKeys(name);
        pause(300);
    }

    public void selectFirstProjectInClone() {
        try {
            List<WebElement> checkboxes = wait.until(
                    ExpectedConditions.presenceOfAllElementsLocatedBy(cloneProjectCheckboxes));
            if (!checkboxes.isEmpty()) {
                WebElement chk = checkboxes.get(0);
                scrollToElement(chk);
                try {
                    chk.findElement(By.xpath("ancestor::label[1]")).click();
                } catch (Exception e) {
                    chk.click();
                }
                pause(400);
            }
        } catch (Exception ignored) {
        }
    }

    public void clickCloneSubmitButton() {
        try {
            WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(cloneSubmitBtn));
            scrollToElement(btn);
            btn.click();
            pause(1200);
        } catch (Exception e) {
            try {
                WebElement btn = driver.findElement(cloneSubmitBtn);
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", btn);
                pause(1200);
            } catch (Exception ignored) {
            }
        }
    }

    // ===================================================================
    // DELETE ROLE
    // ===================================================================

    public void clickDeleteForRole(String roleName) {
        By deleteBtn = By.xpath(
                "//tbody/tr[.//div[normalize-space()='" + roleName + "']]//button[@title='Delete Role']");
        WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(deleteBtn));
        scrollToElement(btn);
        btn.click();
        pause(500);
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
            pause(800);
        } catch (Exception ignored) {
        }
    }

    public void dismissAlert() {
        try {
            Alert alert = new WebDriverWait(driver, Duration.ofSeconds(5))
                    .until(ExpectedConditions.alertIsPresent());
            alert.dismiss();
            pause(500);
        } catch (Exception ignored) {
        }
    }

    public boolean isNoAlertPresent() {
        try {
            driver.switchTo().alert();
            return false;
        } catch (Exception e) {
            return true;
        }
    }

    // ===================================================================
    // SAFE MODAL CLOSE
    // ===================================================================

    /**
     * Dismisses any open Create/Edit or Clone modal by clicking Cancel.
     * Safe to call even if no modal is open.
     */
    public void closeModalIfOpen() {
        // Try CE modal Cancel
        try {
            List<WebElement> btns = driver.findElements(ceCancelBtn);
            if (!btns.isEmpty() && btns.get(0).isDisplayed()) {
                btns.get(0).click();
                pause(600);
                return;
            }
        } catch (Exception ignored) {
        }
        // Try Clone modal Cancel
        try {
            List<WebElement> btns = driver.findElements(cloneCancelBtn);
            if (!btns.isEmpty() && btns.get(0).isDisplayed()) {
                btns.get(0).click();
                pause(600);
            }
        } catch (Exception ignored) {
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
