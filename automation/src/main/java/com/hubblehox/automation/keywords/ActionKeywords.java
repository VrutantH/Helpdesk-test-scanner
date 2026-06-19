package com.hubblehox.automation.keywords;

import com.hubblehox.automation.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

/**
 * Keyword-Driven layer.
 * Generic reusable actions called from Page classes and Test classes.
 */
public class ActionKeywords extends BasePage {

    // -------------------- Input Actions --------------------

    public void doClick(WebElement element) {
        click(element);
    }

    public void doType(WebElement element, String text) {
        enterText(element, text);
    }

    public void doClear(WebElement element) {
        waitForVisible(element).clear();
    }

    public void doClickByLocator(By locator) {
        waitForClickable(locator).click();
    }

    // -------------------- Verification --------------------

    public boolean isElementVisible(WebElement element) {
        return isDisplayed(element);
    }

    public boolean isElementVisible(By locator) {
        return isDisplayed(locator);
    }

    public String getElementText(WebElement element) {
        return getText(element);
    }

    public boolean verifyText(WebElement element, String expectedText) {
        String actual = getText(element);
        return actual.equalsIgnoreCase(expectedText.trim());
    }

    public boolean verifyUrlContains(String keyword) {
        return getCurrentUrl().contains(keyword);
    }

    public boolean verifyPageTitle(String expectedTitle) {
        return getPageTitle().equalsIgnoreCase(expectedTitle.trim());
    }

    // -------------------- Navigation --------------------

    public void goToUrl(String url) {
        navigateTo(url);
    }

    public void refreshPage() {
        driver.navigate().refresh();
    }

    // -------------------- Scroll --------------------

    public void scrollTo(WebElement element) {
        scrollToElement(element);
    }

    // -------------------- JS Actions --------------------

    public void forceClick(WebElement element) {
        jsClick(element);
    }
}
