$M = "Query Configuration"
$cases = @(
    # PHASE 1: LOGIN & SELECTION
    @("QC_01", $M, "Verify that the user can login successfully with valid Super Admin credentials.", "1. Navigate to the login page.`n2. Enter valid Super Admin username and password.`n3. Click 'Login'.", "User is redirected to the Dashboard and a success message is displayed.", "", ""),
    @("QC_02", $M, "Verify that the 'Ticket Configuration' menu is visible in the sidebar.", "1. Look at the left sidebar navigation menu.`n2. Locate the 'Ticket Configuration' item.", "'Ticket Configuration' is visible under the management/admin section.", "", ""),
    @("QC_03", $M, "Verify that clicking 'Ticket Configuration' navigates to the project selection page.", "1. Click on 'Ticket Configuration' in the sidebar.", "The system navigates to /ticket-config and displays the project list.", "", ""),
    @("QC_04", $M, "Verify that the search bar correctly filters projects to show 'Auto12'.", "1. Locate the search bar.`n2. Type 'Auto12'.", "Only the 'Auto12' project card is displayed in the list.", "", ""),
    @("QC_05", $M, "Verify that clicking the 'Auto12' project card opens the configuration settings.", "1. Click on the 'Auto12' project card.", "The system navigates to the detailed settings page for project 'Auto12'.", "", ""),

    # PHASE 2: TICKET NUMBERING
    @("QC_06", $M, "Verify that the 'Ticket Numbering' tab is active by default.", "1. Observe the landing view of the settings page.", "The 'Ticket Numbering' tab is highlighted and its fields are visible.", "", ""),
    @("QC_07", $M, "Verify that entering a Prefix (e.g., 'A12') updates the preview format.", "1. Enter 'A12' in the Prefix textbox.`n2. Observe the preview panel.", "The preview reflects the new format: A12-2026-0001.", "", ""),
    @("QC_08", $M, "Verify that entering a Starting Number (e.g., '100') updates the preview sequence.", "1. Enter '100' in the Starting Number field.", "The preview updates to show the starting number (e.g., A12-2026-0100).", "", ""),
    @("QC_09", $M, "Verify that selecting a Separator (e.g., '/') updates the preview correctly.", "1. Select '/' from the Separator dropdown.", "The preview format changes to use the selected separator (e.g., A12/2026/0100).", "", ""),
    @("QC_10", $M, "Verify that toggling 'Include Year' adds the current year to the preview.", "1. Toggle 'Include Year' to ON.", "The current year (2026) is visible in the preview format.", "", ""),
    @("QC_11", $M, "Verify that toggling 'Include Month' adds the current month to the preview.", "1. Toggle 'Include Month' to ON.", "The current month is visible in the preview format.", "", ""),
    @("QC_12", $M, "Verify that selecting 'Reset Frequency' (Yearly/Monthly) is saved.", "1. Select 'Monthly' from the Reset Frequency dropdown.", "The selection is accepted and displayed in the dropdown.", "", ""),
    @("QC_13", $M, "Verify that clicking 'Save All Changes' persists the numbering settings.", "1. Click 'Save All Changes'.", "A success toast 'Saved!' is displayed.", "", ""),
    @("QC_14", $M, "Verify that after saving and refreshing, the numbering changes remain updated.", "1. Refresh the browser page.", "Prefix, Starting Number, and Format remain exactly as saved previously.", "", ""),

    # PHASE 3: TICKET STATUSES
    @("QC_15", $M, "Verify that clicking the 'Ticket Statuses' tab displays the list of statuses.", "1. Click on the 'Ticket Statuses' tab.", "A table of all current statuses for 'Auto12' is displayed.", "", ""),
    @("QC_16", $M, "Verify that clicking '+ Add Status' opens the status creation modal.", "1. Click the '+ Add Status' button.", "The 'Add Status' modal opens with empty fields.", "", ""),
    @("QC_17", $M, "Verify that entering a Status Name auto-generates the Status Code.", "1. Type 'Pending Verification' in the Name field.", "The Code field is automatically filled with 'PENDING_VERIFICATION'.", "", ""),
    @("QC_18", $M, "Verify that selecting a color from the palette updates the status icon preview.", "1. Select a custom color (e.g., Purple) from the color picker.", "The status icon in the list/preview updates to the selected color.", "", ""),
    @("QC_19", $M, "Verify that toggling 'Set as Default Status' marks it as the entry status.", "1. Toggle 'Set as Default Status' to ON.", "The status is marked as default (only one status can be default).", "", ""),
    @("QC_20", $M, "Verify that toggling 'This Status Closes Tickets' marks it as a terminal status.", "1. Toggle 'This Status Closes Tickets' to ON.", "The status is marked as a closing status.", "", ""),
    @("QC_21", $M, "Verify that saving a new status adds it to the table and summary.", "1. Click 'Save' in the modal.", "The status 'Pending Verification' appears in the table and the summary panel.", "", ""),
    @("QC_22", $M, "Verify that clicking 'Edit' allows modification of an existing status.", "1. Click 'Edit' on an existing status.`n2. Change the color.`n3. Click 'Save'.", "The status color is updated successfully in the list.", "", ""),
    @("QC_23", $M, "Verify that clicking 'Delete' removes the status from the project.", "1. Click 'Delete' on a status.`n2. Confirm deletion.", "The status is removed from the table and summary panel.", "", ""),
    @("QC_24", $M, "Verify that [NEG] saving a status without a name displays a validation error.", "1. Open Add Status modal.`n2. Leave Name empty.`n3. Click 'Save'.", "System displays 'Name is required' error message.", "", ""),
    @("QC_25", $M, "Verify that all status changes persist after a page refresh.", "1. Refresh the page.", "All added/edited statuses are correctly displayed.", "", ""),

    # PHASE 4: TICKET CATEGORIES
    @("QC_26", $M, "Verify that clicking the 'Ticket Categories' tab displays all categories.", "1. Click on the 'Ticket Categories' tab.", "List of categories for 'Auto12' is visible.", "", ""),
    @("QC_27", $M, "Verify that clicking '+ Add Category' opens the category modal.", "1. Click the '+ Add Category' button.", "The 'Add Category' modal appears.", "", ""),
    @("QC_28", $M, "Verify that selecting a 'Default Priority' for a category is saved.", "1. Select 'High' from the Default Priority dropdown.", "The priority selection is visible and saved.", "", ""),
    @("QC_29", $M, "Verify that adding a description and color to a category works correctly.", "1. Enter a description.`n2. Choose a color.", "Description and color are assigned to the category correctly.", "", ""),
    @("QC_30", $M, "Verify that toggling a category to 'Inactive' hides it from end-users.", "1. Toggle 'Active' switch to OFF.", "The category appears grayed out in the list and is marked as Inactive.", "", ""),
    @("QC_31", $M, "Verify that saving a new category adds it to the configuration summary.", "1. Click 'Save' in the modal.", "The new category appears in the 'Configured Categories' list in the right panel.", "", ""),
    @("QC_32", $M, "Verify that clicking 'Edit' allows updating category details.", "1. Click 'Edit' on a category.`n2. Change priority to 'Medium'.`n3. Save.", "The category priority is updated successfully.", "", ""),
    @("QC_33", $M, "Verify that clicking 'Delete' removes the category after confirmation.", "1. Click 'Delete' on a category.`n2. Confirm.", "The category is deleted from the list.", "", ""),
    @("QC_34", $M, "Verify that [NEG] adding a category with a duplicate name displays an error.", "1. Attempt to add a category with an existing name.", "System displays an error message regarding duplicate category.", "", ""),
    @("QC_35", $M, "Verify that category changes are persisted after re-entering the project.", "1. Navigate back to Project list.`n2. Re-enter 'Auto12' config.", "All category changes are visible as saved.", "", ""),

    # PHASE 5: FORM FIELDS
    @("QC_36", $M, "Verify that clicking the 'Form Fields' tab shows the submission form config.", "1. Click on the 'Form Fields' tab.", "Current custom fields for 'Auto12' are displayed.", "", ""),
    @("QC_37", $M, "Verify that clicking '+ Add Field' adds a new field row to the list.", "1. Click the '+ Add Field' button.", "A new empty field row is added to the configuration list.", "", ""),
    @("QC_38", $M, "Verify that selecting 'Text' field type allows entering name and placeholder.", "1. Choose 'Text' type.`n2. Enter Name 'Employee ID' and Placeholder 'Enter ID'.", "The field settings are accepted.", "", ""),
    @("QC_39", $M, "Verify that selecting 'Dropdown' field type enables the 'Options' input area.", "1. Select 'Dropdown' as field type.", "An 'Options' text area appears below the field type selector.", "", ""),
    @("QC_40", $M, "Verify that entering comma-separated options for a dropdown is saved correctly.", "1. Enter 'HR, Finance, Tech' in options area.", "The options are parsed and stored correctly.", "", ""),
    @("QC_41", $M, "Verify that selecting 'Date' field type is saved.", "1. Select 'Date' field type.", "Field is configured as a date picker.", "", ""),
    @("QC_42", $M, "Verify that selecting 'File Upload' type allows setting size limits.", "1. Select 'File Upload' type.`n2. Set limit to '10MB'.", "File upload field is configured with 10MB limit.", "", ""),
    @("QC_43", $M, "Verify that toggling 'Required' marks the field as mandatory in the UI.", "1. Toggle 'Required' checkbox to ON.", "The field is marked as mandatory (*).", "", ""),
    @("QC_44", $M, "Verify that reordering fields using the drag handle updates the display order.", "1. Click and drag a field handle to a new position.", "The field row moves and maintains its new position in the list.", "", ""),
    @("QC_45", $M, "Verify that clicking 'Delete' on a field row removes it from the form.", "1. Click the 'Delete' icon on a field row.", "The field is immediately removed from the list.", "", ""),
    @("QC_46", $M, "Verify that [NEG] saving a field without a name displays an error.", "1. Add a field.`n2. Leave Name empty.`n3. Click Save.", "System displays 'Field name is required' error.", "", ""),
    @("QC_47", $M, "Verify that clicking 'Save All Changes' persists the form fields to the project.", "1. Click 'Save All Changes'.", "Success message is displayed.", "", ""),
    @("QC_48", $M, "Verify that after saving, the form fields appear in the correct order after refresh.", "1. Refresh the page.", "Form fields are displayed in the exact order and configuration saved.", "", ""),

    # PHASE 6: TABLE COLUMNS
    @("QC_49", $M, "Verify that clicking the 'Table Columns' tab shows all available columns.", "1. Click on the 'Table Columns' tab.", "A list of system and custom columns is displayed with checkboxes.", "", ""),
    @("QC_50", $M, "Verify that checking a column (e.g., 'Priority') makes it visible in the list.", "1. Check the 'Priority' checkbox.", "The column is marked for visibility.", "", ""),
    @("QC_51", $M, "Verify that unchecking a column removes it from the default view.", "1. Uncheck the 'Tags' checkbox.", "The column is marked to be hidden.", "", ""),
    @("QC_52", $M, "Verify that selecting 'Default Sort' (e.g., 'Ticket ID') is saved.", "1. Select 'Ticket ID' from Default Sort dropdown.", "The sorting preference is accepted.", "", ""),
    @("QC_53", $M, "Verify that changing 'Sort Direction' (Asc/Desc) is saved.", "1. Select 'Descending' from the sort order.", "The sort direction is saved.", "", ""),
    @("QC_54", $M, "Verify that system-required columns are locked and cannot be hidden.", "1. Attempt to uncheck 'Ticket ID'.", "The checkbox for 'Ticket ID' is disabled/read-only.", "", ""),
    @("QC_55", $M, "Verify that clicking 'Save All Changes' persists the table column configuration.", "1. Click 'Save All Changes'.", "Success message is displayed.", "", ""),
    @("QC_56", $M, "Verify that column settings remain unchanged after page navigation.", "1. Navigate away and return.", "Column visibility and sorting settings remain as configured.", "", ""),

    # PHASE 7: EXTENDED VERIFICATION
    @("QC_57", $M, "Verify that 'Form Fields' allows configuring 'Radio Buttons' with multiple options.", "1. Add field of type 'Radio Buttons'.`n2. Enter 'Yes, No' in options.", "Options are displayed and selectable in the form preview.", "", ""),
    @("QC_58", $M, "Verify that 'Form Fields' allows configuring 'Multi-Select' dropdowns.", "1. Add field of type 'Multi-Select'.`n2. Enter options.", "Multi-select functionality is enabled for this field.", "", ""),
    @("QC_59", $M, "Verify that 'Form Fields' allows configuring 'Number' fields with validation.", "1. Add field of type 'Number'.", "Field accepts numeric input only.", "", ""),
    @("QC_60", $M, "Verify that 'Form Fields' allows configuring 'Link/URL' fields.", "1. Add field of type 'Link (URL)'.", "Field is configured to accept URL format.", "", ""),
    @("QC_61", $M, "Verify that 'Form Fields' allows configuring 'Textarea' (Long Text) fields.", "1. Add field of type 'Textarea'.", "Field is rendered as a multi-line text input.", "", ""),
    @("QC_62", $M, "Verify that [NEG] adding a Form Field with an extremely long name is handled.", "1. Enter a 500-char field name.", "System either truncates or displays a validation length error.", "", ""),
    @("QC_63", $M, "Verify that [NEG] adding a Form Field with special characters is supported.", "1. Enter name 'Field @#$%'.", "System handles special characters without breaking the JSON structure.", "", ""),
    @("QC_64", $M, "Verify that the 'Table Columns' tab displays any newly added 'Form Fields'.", "1. Add a custom field 'Region'.`n2. Switch to 'Table Columns' tab.", "The field 'Region' appears as a selectable column checkbox.", "", ""),
    @("QC_65", $M, "Verify that checking a newly added 'Form Field' in 'Table Columns' works.", "1. Check the newly added custom field checkbox.", "The field is saved as a visible column.", "", ""),
    @("QC_66", $M, "Verify that the 'Default Sort' dropdown includes newly added custom fields.", "1. Open 'Default Sort' dropdown in Table Columns tab.", "Custom fields are listed as sortable options.", "", ""),
    @("QC_67", $M, "Verify that 'Table Columns' allows setting 'Created Date' as default sort.", "1. Select 'Created Date' from Default Sort.", "Sorting preference is updated.", "", ""),
    @("QC_68", $M, "Verify that 'Table Columns' allows setting 'Ascending' sort direction.", "1. Select 'Ascending' direction.", "Direction is saved successfully.", "", ""),
    @("QC_69", $M, "Verify that [NEG] a non-admin user cannot access the configuration page.", "1. Login as standard Agent.`n2. Attempt to navigate to /ticket-config.", "Access is denied or user is redirected to dashboard.", "", ""),
    @("QC_70", $M, "Verify that 'Save All Changes' button shows 'Saving...' state.", "1. Click Save All Changes.", "Button text changes to 'Saving...' and is disabled during API call.", "", ""),
    @("QC_71", $M, "Verify that 'Save All Changes' is only enabled when modifications exist.", "1. Observe button on initial load.`n2. Edit any field.", "Button transitions from disabled to enabled state.", "", ""),
    @("QC_72", $M, "Verify that navigating away without saving prompts a warning.", "1. Make a change.`n2. Click 'Dashboard' in sidebar.", "Browser/System prompt asks to 'Discard unsaved changes?'.", "", ""),
    @("QC_73", $M, "Verify that 'Form Fields' reordering persists across tab switches.", "1. Reorder fields.`n2. Switch to 'Statuses' tab.`n3. Switch back to 'Form Fields'.", "The custom order is maintained.", "", ""),
    @("QC_74", $M, "Verify that 'Table Columns' checkboxes persist across tab switches.", "1. Check 3 columns.`n2. Switch to 'Numbering'.`n3. Switch back to 'Table Columns'.", "The 3 columns remain checked.", "", ""),
    @("QC_75", $M, "Verify that 'Ticket Numbering' preview is responsive on narrow screens.", "1. Resize browser to mobile width.", "Preview box remains visible and readable.", "", ""),
    @("QC_76", $M, "Verify that changes for 'Auto12' do NOT affect other project configurations.", "1. Save changes for 'Auto12'.`n2. Open 'Demo' project configuration.", "Demo project settings remain in their original state.", "", ""),
    @("QC_77", $M, "Verify that deleting a Category also removes it from the Summary Panel.", "1. Delete a category.`n2. Observe 'Configured Categories' on the right.", "The category is removed from the summary immediately.", "", ""),
    @("QC_78", $M, "Verify that marking a Status as 'Default' removes default from previous status.", "1. Set 'In Progress' as Default.`n2. Observe previous default status.", "The 'Default' checkmark moves to the new status.", "", ""),
    @("QC_79", $M, "Verify that adding a Status with name 'New Status' generates code 'NEW_STATUS'.", "1. Enter 'New Status' in modal.", "Code field shows 'NEW_STATUS' auto-formatted.", "", ""),
    @("QC_80", $M, "Verify that the 'Last Modified' timestamp (if any) updates after Save.", "1. Save changes.`n2. Observe project card or summary footer.", "Timestamp reflects the current save time.", "", "")
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
Write-Host "Consolidated 80-case CSV file created at: $csvPath"
