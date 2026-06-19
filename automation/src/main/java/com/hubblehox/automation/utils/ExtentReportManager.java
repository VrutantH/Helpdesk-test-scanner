package com.hubblehox.automation.utils;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ExtentReportManager {

    private static ExtentReports extentReports;
    private static final String REPORT_PATH = ConfigReader.getReportsPath();

    private ExtentReportManager() {
    }

    public static void initReports() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy_HH-mm-ss"));
        String reportFileName = REPORT_PATH + "ExtentReport_" + timestamp + ".html";

        ExtentSparkReporter sparkReporter = new ExtentSparkReporter(reportFileName);
        sparkReporter.config().setDocumentTitle("HubbleHox Automation Report");
        sparkReporter.config().setReportName("SAC Helpdesk Portal - Test Execution Report");
        sparkReporter.config().setTheme(Theme.STANDARD);
        sparkReporter.config().setTimeStampFormat("dd-MM-yyyy HH:mm:ss");

        extentReports = new ExtentReports();
        extentReports.attachReporter(sparkReporter);
        extentReports.setSystemInfo("Application", "SAC Helpdesk Portal");
        extentReports.setSystemInfo("Environment", "UAT");
        extentReports.setSystemInfo("URL", ConfigReader.getBaseUrl());
        extentReports.setSystemInfo("Browser", ConfigReader.getBrowser());
    }

    public static ExtentTest createTest(String testName) {
        return extentReports.createTest(testName);
    }

    public static void flushReports() {
        if (extentReports != null) {
            extentReports.flush();
        }
    }
}
