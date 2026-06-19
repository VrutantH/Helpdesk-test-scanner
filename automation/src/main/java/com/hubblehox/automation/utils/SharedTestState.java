package com.hubblehox.automation.utils;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Properties;

/**
 * Shared state between test modules (PM → UM, etc.).
 *
 * In-memory: works when both suites run in the same JVM session
 * (e.g., mvn test -Dmodule=all).
 *
 * File-backed: falls back to target/test-state.properties so that
 * a subsequent "mvn test -Dmodule=um" run can still
 * pick up the project name created by the previous PM run.
 */
public final class SharedTestState {

    private SharedTestState() {
    }

    private static final String STATE_FILE = "target/test-state.properties";
    private static final String KEY_PROJECT = "lastCreatedProject";

    // ---- in-memory fast path ----
    private static volatile String lastCreatedProjectName = null;

    // ------------------------------------------------------------------
    // Write (called from ProjectManagementTest after the project is created)
    // ------------------------------------------------------------------
    public static void setCreatedProjectName(String name) {
        lastCreatedProjectName = name;
        try {
            Files.createDirectories(Paths.get("target"));
            Properties props = new Properties();
            props.setProperty(KEY_PROJECT, name);
            try (FileOutputStream fos = new FileOutputStream(STATE_FILE)) {
                props.store(fos, "HubbleHox Automation Shared State");
            }
        } catch (IOException ignored) {
            // non-critical — in-memory value is still usable
        }
    }

    // ------------------------------------------------------------------
    // Read (called from UserManagementTest when selecting project)
    // ------------------------------------------------------------------
    public static String getCreatedProjectName() {
        if (lastCreatedProjectName != null) {
            return lastCreatedProjectName;
        }
        // File fallback
        try (FileInputStream fis = new FileInputStream(STATE_FILE)) {
            Properties props = new Properties();
            props.load(fis);
            return props.getProperty(KEY_PROJECT);
        } catch (IOException ignored) {
            return null;
        }
    }
}
