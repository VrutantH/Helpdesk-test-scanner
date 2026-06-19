package com.hubblehox.automation.pages;

import com.hubblehox.automation.keywords.ActionKeywords;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.List;

public class TicketConfigPage extends ActionKeywords {

    // ===================================================================
    // PAGE-LEVEL LOCATORS
    // ===================================================================
    private final By sidebarLink = By.xpath("//a[contains(@href, '/ticket-config')]");
    private final By searchInput = By.xpath("//input[@placeholder='Search projects...']");
    private final By pageHeading = By.xpath("//h1[contains(normalize-space(),'Ticket Configuration')]");
    
    // Project Selection
    public By getProjectCardLocator(String projectName) {
        return By.xpath("//h3[contains(translate(normalize-space(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '" + projectName.toLowerCase() + "')]");
    }

    // Tabs
    private final By numberingTab = By.xpath("//button[normalize-space()='Ticket Numbering']");
    private final By statusesTab = By.xpath("//button[normalize-space()='Ticket Statuses']");
    private final By categoriesTab = By.xpath("//button[normalize-space()='Ticket Categories']");
    private final By fieldsTab = By.xpath("//button[normalize-space()='Form Fields']");
    private final By columnsTab = By.xpath("//button[normalize-space()='Table Columns']");

    // Save All Changes
    private final By saveAllChangesBtn = By.xpath("//button[contains(normalize-space(),'Save All Changes')]");
    private final By saveSuccessBtn = By.xpath("//button[contains(normalize-space(),'Saved!')]");
    private final By saveModalBtn = By.xpath("//button[normalize-space()='Save']");

    // Numbering Locators
    private final By prefixInput = By.xpath("//label[contains(normalize-space(),'Prefix')]/following::input[1]");
    private final By startNumInput = By.xpath("//label[contains(normalize-space(),'Starting Number')]/following::input[1]");
    private final By separatorInput = By.xpath("//label[contains(normalize-space(),'Separator')]/following::input[1]");
    private final By includeYearCheckbox = By.xpath("//label[contains(normalize-space(),'Include Year')]/input[@type='checkbox']");
    private final By includeMonthCheckbox = By.xpath("//label[contains(normalize-space(),'Include Month')]/input[@type='checkbox']");
    private final By resetFreqSelect = By.xpath("//label[contains(normalize-space(),'Reset Frequency')]/following::select[1]");
    private final By numberingPreview = By.xpath("//strong[contains(normalize-space(),'Preview')]/following::p[1]");

    // Statuses Locators
    private final By addStatusBtn = By.xpath("//button[contains(normalize-space(),'Add Status')]");
    private final By statusNameInput = By.xpath("//label[contains(text(),'Name')]/following::input[1]");
    private final By statusCodeInput = By.xpath("//label[contains(text(),'Code')]/following::input[@type='text' or not(@type)][1]");
    private final By statusColorInput = By.xpath("//label[contains(text(),'Color')]/following::input[@type='color']");
    private final By statusDefaultCheckbox = By.xpath("//label[contains(text(),'Default')]/input[@type='checkbox']");
    private final By statusClosedCheckbox = By.xpath("//label[contains(text(),'Closed')]/input[@type='checkbox']");
    
    // Categories Locators
    private final By addCategoryBtn = By.xpath("//button[contains(normalize-space(),'Add Category')]");
    private final By categoryNameInput = By.xpath("//label[contains(normalize-space(),'Name *')]/following::input[1]");
    private final By categoryDescInput = By.xpath("//label[contains(normalize-space(),'Description')]/following::textarea[1]");
    private final By categoryPrioritySelect = By.xpath("//label[contains(normalize-space(),'Default Priority')]/following::select[1]");
    private final By categoryActiveCheckbox = By.xpath("//label[contains(normalize-space(),'Active')]/input[@type='checkbox']");

    // Form Fields Locators
    private final By addFieldBtn = By.xpath("//button[contains(normalize-space(),'+ Add Field')]");
    private final By fieldNameInputs = By.xpath("//input[@placeholder='Field Name']");
    private final By fieldTypeSelects = By.xpath("//select[.//option[@value='text'] and .//option[@value='dropdown']]");
    private final By fieldPlaceholderInputs = By.xpath("//input[@placeholder='Placeholder text']");
    private final By fieldRequiredCheckboxes = By.xpath("//label[contains(normalize-space(),'Required')]/input[@type='checkbox']");
    private final By dropdownOptionsTextarea = By.xpath("//textarea[contains(@placeholder, 'Enter options (one per line)')]");
    
    // Table Columns Locators
    private final By defaultSortSelect = By.xpath("//label[contains(normalize-space(),'Default Sort Column')]/following::select[1]");
    private final By sortDirectionSelect = By.xpath("//label[contains(normalize-space(),'Sort Direction')]/following::select[1]");

    public By getColumnCheckboxLocator(String columnName) {
        return By.xpath("//label[contains(normalize-space(),'" + columnName + "')]/input[@type='checkbox']");
    }

    // ===================================================================
    // METHODS
    // ===================================================================

    public void navigateToTicketConfig() {
        WebElement link = wait.until(ExpectedConditions.elementToBeClickable(sidebarLink));
        scrollToElement(link);
        link.click();
        pause(2000); // Wait for page load and API fetch
    }

    public void searchAndSelectProject(String projectName) {
        try {
            WebElement search = wait.until(ExpectedConditions.presenceOfElementLocated(searchInput));
            if (search.isDisplayed()) {
                search.clear();
                search.sendKeys(projectName);
                pause(1000); // Wait for filter
            }
        } catch (Exception e) {
            System.out.println("Search input not found, proceeding to look for project card directly.");
        }
        
        WebElement card = wait.until(ExpectedConditions.presenceOfElementLocated(getProjectCardLocator(projectName)));
        scrollToElement(card);
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", card);
        pause(2000); // Wait for settings page to load
    }

    public boolean isLandingPageLoaded() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[contains(normalize-space(),'Configure Tickets')]"))).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isPageHeadingVisible() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[contains(normalize-space(),'Ticket Numbering')]"))).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void clickTab(String tabName) {
        By locator = switch (tabName.toLowerCase()) {
            case "numbering" -> numberingTab;
            case "statuses" -> statusesTab;
            case "categories" -> categoriesTab;
            case "form fields" -> fieldsTab;
            case "table columns" -> columnsTab;
            default -> throw new IllegalArgumentException("Unknown tab: " + tabName);
        };
        WebElement tab = wait.until(ExpectedConditions.elementToBeClickable(locator));
        scrollToElement(tab);
        forceClick(tab);
        pause(1000); // Wait for tab switch animation and content load
    }

    // Numbering Methods
    public void enterPrefix(String prefix) {
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(prefixInput));
        input.sendKeys(org.openqa.selenium.Keys.chord(org.openqa.selenium.Keys.CONTROL, "a"), org.openqa.selenium.Keys.BACK_SPACE);
        input.sendKeys(prefix);
        // Force React update and blur
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript(
            "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));" +
            "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));" +
            "arguments[0].dispatchEvent(new Event('blur', { bubbles: true }));", input);
        input.sendKeys(org.openqa.selenium.Keys.TAB);
    }

    public void enterStartingNumber(String num) {
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(startNumInput));
        input.sendKeys(org.openqa.selenium.Keys.chord(org.openqa.selenium.Keys.CONTROL, "a"), org.openqa.selenium.Keys.BACK_SPACE);
        input.sendKeys(num);
        // Force React update and blur
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript(
            "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));" +
            "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));" +
            "arguments[0].dispatchEvent(new Event('blur', { bubbles: true }));", input);
        input.sendKeys(org.openqa.selenium.Keys.TAB);
    }
    
    public void selectSeparator(String sep) {
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(separatorInput));
        input.clear();
        input.sendKeys(sep);
    }
    
    public void toggleIncludeYear(boolean state) {
        setCheckboxState(includeYearCheckbox, state);
    }
    
    public void toggleIncludeMonth(boolean state) {
        setCheckboxState(includeMonthCheckbox, state);
    }
    
    public void selectResetFrequency(String visibleText) {
        selectDropdownByVisibleText(resetFreqSelect, visibleText);
    }

    public String getPreviewText() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(numberingPreview)).getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    // Statuses Methods
    public void clickAddStatus() {
        WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(addStatusBtn));
        scrollToElement(btn);
        forceClick(btn);
        wait.until(ExpectedConditions.visibilityOfElementLocated(statusNameInput));
    }

    public void enterStatusName(String name) {
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(statusNameInput));
        input.clear();
        input.sendKeys(name);
    }
    
    public String getStatusCode() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(statusCodeInput)).getAttribute("value");
        } catch (Exception e) {
            return "";
        }
    }

    public void setStatusColor(String hexColor) {
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(statusColorInput));
        // HTML5 color inputs usually require JS to set value reliably
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].value = arguments[1];", input, hexColor);
        input.sendKeys(org.openqa.selenium.Keys.TAB); // trigger change
    }

    public void toggleDefaultStatus(boolean state) {
        setCheckboxState(statusDefaultCheckbox, state);
    }
    
    public void toggleClosedStatus(boolean state) {
        setCheckboxState(statusClosedCheckbox, state);
    }

    public void clickModalSave() {
        WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(saveModalBtn));
        scrollToElement(btn);
        btn.click();
        pause(1000); // Wait for save
    }

    // Categories Methods
    public void clickAddCategory() {
        WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(addCategoryBtn));
        scrollToElement(btn);
        btn.click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(categoryNameInput));
    }

    public void enterCategoryName(String name) {
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(categoryNameInput));
        input.clear();
        input.sendKeys(name);
    }

    public void selectCategoryPriority(String priority) {
        selectDropdownByVisibleText(categoryPrioritySelect, priority);
    }

    public void enterCategoryDescription(String desc) {
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(categoryDescInput));
        input.clear();
        input.sendKeys(desc);
    }
    
    public void toggleCategoryActive(boolean state) {
        setCheckboxState(categoryActiveCheckbox, state);
    }

    // Form Fields Methods
    public void clickAddField() {
        WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(addFieldBtn));
        scrollToElement(btn);
        btn.click();
        pause(500);
    }

    public void enterLastFieldName(String name) {
        List<WebElement> inputs = driver.findElements(fieldNameInputs);
        if (!inputs.isEmpty()) {
            WebElement lastInput = inputs.get(inputs.size() - 1);
            scrollToElement(lastInput);
            lastInput.clear();
            lastInput.sendKeys(name);
        }
    }

    public void selectLastFieldType(String typeValue) {
        List<WebElement> selects = driver.findElements(fieldTypeSelects);
        if (!selects.isEmpty()) {
            WebElement lastSelect = selects.get(selects.size() - 1);
            scrollToElement(lastSelect);
            new org.openqa.selenium.support.ui.Select(lastSelect).selectByValue(typeValue.toLowerCase());
            pause(500);
        }
    }

    public void enterLastFieldOptions(String options) {
        List<WebElement> textareas = driver.findElements(dropdownOptionsTextarea);
        if (!textareas.isEmpty()) {
            WebElement lastTextarea = textareas.get(textareas.size() - 1);
            scrollToElement(lastTextarea);
            lastTextarea.clear();
            lastTextarea.sendKeys(options);
            // Trigger blur to save
            lastTextarea.sendKeys(org.openqa.selenium.Keys.TAB);
        }
    }
    
    public void toggleLastFieldRequired(boolean state) {
        List<WebElement> checkboxes = driver.findElements(fieldRequiredCheckboxes);
        if (!checkboxes.isEmpty()) {
            WebElement lastCheckbox = checkboxes.get(checkboxes.size() - 1);
            if (lastCheckbox.isSelected() != state) {
                scrollToElement(lastCheckbox);
                lastCheckbox.click();
            }
        }
    }

    // Table Columns Methods
    public void toggleColumnVisibility(String columnName, boolean state) {
        By locator = getColumnCheckboxLocator(columnName);
        try {
            WebElement cb = driver.findElement(locator);
            scrollToElement(cb);
            if (cb.isSelected() != state) {
                cb.click();
            }
        } catch (Exception e) {
            System.err.println("Column not found or cannot be toggled: " + columnName);
        }
    }
    
    public void selectDefaultSort(String columnName) {
        selectDropdownByVisibleText(defaultSortSelect, columnName);
    }
    
    public void selectSortDirection(String direction) {
        selectDropdownByVisibleText(sortDirectionSelect, direction);
    }

    // Global Save
    public void clickSaveAllChanges() {
        WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(saveAllChangesBtn));
        scrollToElement(btn);
        forceClick(btn);
        wait.until(ExpectedConditions.visibilityOfElementLocated(saveSuccessBtn));
        pause(1000); // Allow time for toast
    }
    
    public boolean isSaveSuccessVisible() {
        return isElementVisible(saveSuccessBtn);
    }
    
    public boolean isSaveButtonEnabled() {
        try {
            WebElement btn = driver.findElement(saveAllChangesBtn);
            return btn.isEnabled();
        } catch (Exception e) {
            return false;
        }
    }

    // -------------------- Helpers --------------------
    private void setCheckboxState(By locator, boolean targetState) {
        try {
            WebElement cb = wait.until(ExpectedConditions.presenceOfElementLocated(locator));
            scrollToElement(cb);
            if (cb.isSelected() != targetState) {
                cb.click();
            }
        } catch (Exception ignored) { }
    }
    
    private void selectDropdownByVisibleText(By locator, String text) {
        try {
            WebElement sel = wait.until(ExpectedConditions.elementToBeClickable(locator));
            scrollToElement(sel);
            new org.openqa.selenium.support.ui.Select(sel).selectByVisibleText(text);
        } catch (Exception ignored) { }
    }

    public void pause(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
