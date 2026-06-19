package com.hubblehox.automation.utils;

public class AppConstants {

    private AppConstants() {
    }

    // -------------------- Module Names (match Google Sheet file tabs)
    // --------------------
    public static final String MODULE_LOGIN = "login";
    public static final String MODULE_DASHBOARD = "dashboard";
    public static final String MODULE_TICKETS = "tickets";
    public static final String MODULE_USERS = "users";
    public static final String MODULE_RBAC = "rbac";
    public static final String MODULE_MASTER_DATA = "masterdata";
    public static final String MODULE_SLA = "sla";
    public static final String MODULE_KB = "knowledgebase";
    public static final String MODULE_PROJECTS = "projects";
    public static final String MODULE_QUERY_CONFIG = "queryconfig";

    // -------------------- Module URLs --------------------
    public static final String PROJECTS_URL = "/projects";
    public static final String USERS_URL = "/users";
    public static final String RBAC_URL = "/rbac";

    // -------------------- Test Result Values --------------------
    public static final String RESULT_PASS = "PASS";
    public static final String RESULT_FAIL = "FAIL";

    // -------------------- Excel Column Indexes (0-based) --------------------
    public static final int COL_TC_ID = 0;
    public static final int COL_TC_DESCRIPTION = 1;
    public static final int COL_STEPS = 2;
    public static final int COL_EXPECTED = 3;
    public static final int COL_ACTUAL = 4;
    public static final int COL_COMMENTS = 5;
    // Column 6 onwards = date-time run columns (added dynamically per run)
    public static final int COL_RESULTS_START = 6;

    // -------------------- Google Sheets API Scope --------------------
    public static final String SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
    public static final String DRIVE_SCOPE = "https://www.googleapis.com/auth/drive";

    // -------------------- Wait Times (ms) --------------------
    public static final int DEFAULT_SLEEP = 1000;

    // -------------------- Login Page --------------------
    public static final String LOGIN_URL = "/login";
    public static final String DASHBOARD_URL = "/dashboard";
}
