package com.hubblehox.automation.utils;

import com.hubblehox.automation.driver.DriverFactory;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ScreenshotUtils {

    private static final String SCREENSHOTS_PATH = ConfigReader.getScreenshotsPath();

    private ScreenshotUtils() {
    }

    public static String captureScreenshot(String tcId) {
        try {
            // Create screenshots directory if it doesn't exist
            Files.createDirectories(Paths.get(SCREENSHOTS_PATH));

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy_HH-mm-ss"));
            String fileName = tcId + "_" + timestamp + ".png";
            String filePath = SCREENSHOTS_PATH + fileName;

            File srcFile = ((TakesScreenshot) DriverFactory.getDriver()).getScreenshotAs(OutputType.FILE);
            Files.copy(srcFile.toPath(), Paths.get(filePath));

            return filePath;
        } catch (IOException e) {
            System.err.println("Failed to capture screenshot for " + tcId + ": " + e.getMessage());
            return "";
        }
    }
}
