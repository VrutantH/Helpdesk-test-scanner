$M = "Query Configuration"
$cases = @(
    @("QC_01", $M, "Verify that the user can login successfully with valid Super Admin credentials.", "1. Navigate to the login page.`n2. Enter valid Super Admin username and password.`n3. Click 'Login'.", "User is redirected to the Dashboard and a success message is displayed.", "", ""),
    @("QC_02", $M, "Verify that the 'Ticket Configuration' menu is visible in the sidebar.", "1. Look at the left sidebar navigation menu.`n2. Locate the 'Ticket Configuration' item.", "'Ticket Configuration' is visible under the management/admin section.", "", ""),
    @("QC_03", $M, "Verify that clicking 'Ticket Configuration' navigates to the project selection page.", "1. Click on 'Ticket Configuration' in the sidebar.", "The system navigates to /ticket-config and displays the project list.", "", ""),
    @("QC_04", $M, "Verify that the user can select the project 'Auto12' from the landing page.", "1. Locate the search bar on the landing page.`n2. Type 'Auto12'.`n3. Click on the 'Auto12' project card.", "The system navigates to the configuration settings page for project 'Auto12'.", "", ""),
    @("QC_05", $M, "Verify that the 'Ticket Numbering' tab is active by default.", "1. Observe the landing view of the settings page.", "The 'Ticket Numbering' tab is highlighted and its fields are visible.", "", ""),
    @("QC_06", $M, "Verify that updating the Ticket Prefix for 'Auto12' updates the preview.", "1. Enter 'TKT-A12' in the Prefix textbox.`n2. Observe the preview panel on the right.", "The preview reflects the new format (e.g., TKT-A12-2026-0001).", "", ""),
    @("QC_07", $M, "Verify that the 'Ticket Numbering' changes are saved and persisted.", "1. Modify the Prefix and Starting Number.`n2. Click 'Save All Changes'.`n3. Refresh the page.", "Success message appears and the values remain updated after refresh.", "", ""),
    @("QC_08", $M, "Verify that the 'Ticket Statuses' tab displays existing statuses for 'Auto12'.", "1. Click on the 'Ticket Statuses' tab.", "A list of current statuses (Open, In Progress, etc.) is displayed.", "", ""),
    @("QC_09", $M, "Verify that adding a new status 'In Review' auto-generates the correct code.", "1. Click '+ Add Status'.`n2. Enter 'In Review' in the Name field.", "The Code field automatically populates with 'IN_REVIEW'.", "", ""),
    @("QC_10", $M, "Verify that a new status can be saved and verified in the summary.", "1. Fill Name and select a Color.`n2. Click 'Save'.`n3. Check the right-side summary panel.", "The new status appears in both the main list and the summary panel.", "", ""),
    @("QC_11", $M, "Verify that deleting a status for 'Auto12' removes it from the configuration.", "1. Locate the status to be deleted.`n2. Click the 'Delete' icon and confirm.", "The status is immediately removed from the list and summary panel.", "", ""),
    @("QC_12", $M, "Verify that the 'Ticket Categories' tab allows adding a new category.", "1. Click on 'Ticket Categories' tab.`n2. Click '+ Add Category'.`n3. Enter 'Software Support' and select 'High' priority.", "Category is created and visible in the category list.", "", ""),
    @("QC_13", $M, "Verify that category changes are saved and persisted for project 'Auto12'.", "1. Update an existing category name.`n2. Click 'Save All Changes'.`n3. Navigate back to the project list and re-enter 'Auto12'.", "The updated category name is displayed correctly.", "", ""),
    @("QC_14", $M, "Verify that the 'Form Fields' tab displays the ticket submission form configuration.", "1. Click on the 'Form Fields' tab.", "The list of active and custom form fields is displayed.", "", ""),
    @("QC_15", $M, "Verify that adding a custom 'Dropdown' field works with defined options.", "1. Click '+ Add Field'.`n2. Select 'Dropdown' as the field type.`n3. Enter options 'Urgent', 'Standard'.`n4. Mark as 'Required'.", "The new field is added to the list with the correct configuration.", "", ""),
    @("QC_16", $M, "Verify that the 'Form Fields' changes are saved and persisted.", "1. Add/Modify a field.`n2. Click 'Save All Changes'.`n3. Refresh the page.", "The custom field remains in the list with all settings intact.", "", ""),
    @("QC_17", $M, "Verify that the 'Table Columns' tab allows selecting visible columns.", "1. Click on the 'Table Columns' tab.", "A list of all available system and custom fields is shown with checkboxes.", "", ""),
    @("QC_18", $M, "Verify that changing the column visibility reflects in the ticket list view.", "1. Check/Uncheck specific columns (e.g., 'Category', 'Created Date').`n2. Click 'Save All Changes'.", "Column configuration is saved successfully.", "", ""),
    @("QC_19", $M, "Verify that reordering table columns via drag-and-drop is persisted.", "1. Drag a column to a new position.`n2. Click 'Save All Changes'.`n3. Refresh the page.", "The new column order is maintained.", "", ""),
    @("QC_20", $M, "Verify that all module changes for 'Auto12' are correctly persisted globally.", "1. Perform changes in all 5 tabs.`n2. Click 'Save All Changes' at the bottom.`n3. Log out and log back in.`n4. Navigate back to 'Auto12' Ticket Configuration.", "All changes in all tabs (Numbering, Statuses, Categories, Fields, Columns) are correctly loaded.", "", "")
)

$csvPath = "C:\Users\nikhil.chaudhari\OneDrive - Eduspark International Pvt. Ltd\Helpdesk\helpdesk\automation\testresults\Query_Configuration_TestCases.csv"
$csvContent = "Test Case ID,Module,Test Case Description,Steps,Expected Result,Actual Result,Comments`n"

foreach ($case in $cases) {
    $line = ""
    for ($i=0; $i -lt 7; $i++) {
        $val = $case[$i] -replace '"', '""'
        if ($val -match "[,`n]") { $val = """$val""" }
        $line += $val
        if ($i -lt 6) { $line += "," }
    }
    $csvContent += "$line`n"
}

[System.IO.File]::WriteAllText($csvPath, $csvContent, [System.Text.Encoding]::UTF8)
Write-Host "CSV file created at: $csvPath"
