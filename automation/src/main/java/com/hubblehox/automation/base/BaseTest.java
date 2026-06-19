package com.hubblehox.automation.base;

import com.hubblehox.automation.driver.DriverFactory;
import com.hubblehox.automation.utils.ConfigReader;
import com.hubblehox.automation.utils.ExtentReportManager;
import com.hubblehox.automation.utils.GoogleSheetsUtils;
import com.hubblehox.automation.utils.ScreenshotUtils;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import org.testng.ITestResult;
import org.testng.annotations.AfterClass;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeSuite;

import java.lang.reflect.Method;

public class BaseTest {

    protected static final ThreadLocal<ExtentTest> extentTest = new ThreadLocal<>();

    // ── Report initialised once before the whole suite ──────────────────────
    @BeforeSuite
    public void initReport() {
        ExtentReportManager.initReports();
    }

    // ── Browser opened ONCE before the first test in the class ──────────────
    @BeforeClass
    public void launchBrowser() {
        DriverFactory.initDriver();
    }

    // ── Before every test: navigate back to base URL + create report node ───
    @BeforeMethod
    public void setUp(Method method) {
        DriverFactory.getDriver().get(ConfigReader.getBaseUrl());
        ExtentTest test = ExtentReportManager.createTest(method.getName());
        extentTest.set(test);
    }

    // ── After every test: write result to Google Sheets + Extent Report ─────
    @AfterMethod
    public void tearDown(ITestResult result) {
        String tcId = result.getMethod().getMethodName();
        String module = getModuleName();

        if (result.getStatus() == ITestResult.FAILURE) {
            String screenshotPath = ScreenshotUtils.captureScreenshot(tcId);
            String reason = result.getThrowable() != null
                    ? result.getThrowable().getMessage()
                    : "Unknown failure";

            extentTest.get().log(Status.FAIL, "Test Failed: " + reason);
            extentTest.get().addScreenCaptureFromPath(screenshotPath, "Failure Screenshot");

            String sheetTcId = tcId.startsWith("TC_") ? tcId.substring(3) : tcId;
            GoogleSheetsUtils.writeResult(module, sheetTcId, "FAIL - " + reason);

        } else if (result.getStatus() == ITestResult.SUCCESS) {
            extentTest.get().log(Status.PASS, "Test Passed");
            String sheetTcId = tcId.startsWith("TC_") ? tcId.substring(3) : tcId;
            GoogleSheetsUtils.writeResult(module, sheetTcId, "PASS");
        }
        // ── Browser is NOT closed here — it stays open for the next test ────
    }

    // ── Browser closed ONCE after the last test in the class ────────────────
    @AfterClass
    public void closeBrowser() {
        DriverFactory.quitDriver();
    }

    // ── Extent Report flushed once after the whole suite ────────────────────
    @AfterSuite
    public void flushReport() {
        ExtentReportManager.flushReports();
    }

    // Override in each test class to specify the module name
    protected String getModuleName() {
        return "login";
    }

    public static ExtentTest getExtentTest() {
        return extentTest.get();
    }
}
