package com.hubblehox.automation.utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class ConfigReader {

    private static Properties properties;
    private static final String CONFIG_PATH = "resources/config.properties";

    static {
        try {
            FileInputStream fis = new FileInputStream(CONFIG_PATH);
            properties = new Properties();
            properties.load(fis);
            fis.close();
        } catch (IOException e) {
            throw new RuntimeException("Failed to load config.properties from path: " + CONFIG_PATH, e);
        }
    }

    private ConfigReader() {
    }

    public static String get(String key) {
        String value = properties.getProperty(key);
        if (value == null || value.trim().isEmpty()) {
            throw new RuntimeException("Property '" + key + "' not found in config.properties");
        }
        return value.trim();
    }

    // -------------------- Browser --------------------
    public static String getBrowser() {
        return get("browser");
    }

    public static boolean isHeadless() {
        return Boolean.parseBoolean(get("headless"));
    }

    // -------------------- URLs --------------------
    public static String getBaseUrl() {
        return get("base.url");
    }

    // -------------------- Credentials --------------------
    public static String getAdminEmail() {
        return get("admin.email");
    }

    public static String getAdminPassword() {
        return get("admin.password");
    }

    public static String getAgentEmail() {
        return get("agent.email");
    }

    public static String getAgentPassword() {
        return get("agent.password");
    }

    public static String getStudentEmail() {
        return get("student.email");
    }

    public static String getStudentPassword() {
        return get("student.password");
    }

    // -------------------- Timeouts --------------------
    public static int getImplicitWait() {
        return Integer.parseInt(get("implicit.wait"));
    }

    public static int getExplicitWait() {
        return Integer.parseInt(get("explicit.wait"));
    }

    public static int getPageLoadTimeout() {
        return Integer.parseInt(get("page.load.timeout"));
    }

    // -------------------- Google Sheets --------------------
    public static String getGoogleCredentialsPath() {
        return get("google.credentials.path");
    }

    public static String getSheetId(String module) {
        return get("google.sheet.id." + module.toLowerCase());
    }

    public static String getSheetTabName() {
        return get("google.sheet.tab.name");
    }

    /**
     * Returns the Google Sheet tab name for the given module.
     * Looks up "google.sheet.tab.name.{module}" first,
     * then falls back to the generic "google.sheet.tab.name" property.
     */
    public static String getSheetTabName(String module) {
        String key = "google.sheet.tab.name." + module.toLowerCase();
        String value = properties.getProperty(key);
        if (value != null && !value.trim().isEmpty()) {
            return value.trim();
        }
        return get("google.sheet.tab.name");
    }

    // -------------------- Paths --------------------
    public static String getReportsPath() {
        return get("reports.path");
    }

    public static String getScreenshotsPath() {
        return get("screenshots.path");
    }

    public static String getTestDataPath() {
        return get("testdata.path");
    }

    public static String getTestResultsPath() {
        return get("testresults.path");
    }
}
