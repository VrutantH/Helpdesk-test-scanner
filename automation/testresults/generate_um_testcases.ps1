Add-Type -AssemblyName System.Drawing

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$workbook = $excel.Workbooks.Add()
$ws = $workbook.Worksheets.Item(1)
$ws.Name = "Test Cases"

function ToOle([System.Drawing.Color]$color) {
    return [System.Drawing.ColorTranslator]::ToOle($color)
}

$BLUE    = ToOle([System.Drawing.Color]::FromArgb(37,99,235))
$WHITE   = ToOle([System.Drawing.Color]::White)
$LRED    = ToOle([System.Drawing.Color]::FromArgb(254,226,226))
$DRED    = ToOle([System.Drawing.Color]::FromArgb(185,28,28))
$LGREEN  = ToOle([System.Drawing.Color]::FromArgb(220,252,231))
$DGREEN  = ToOle([System.Drawing.Color]::FromArgb(22,101,52))
$LYELLOW = ToOle([System.Drawing.Color]::FromArgb(254,249,195))
$DYELLOW = ToOle([System.Drawing.Color]::FromArgb(133,77,14))
$LBLUE   = ToOle([System.Drawing.Color]::FromArgb(219,234,254))
$DBLUE   = ToOle([System.Drawing.Color]::FromArgb(30,64,175))
$LGREY   = ToOle([System.Drawing.Color]::FromArgb(249,250,251))

# Headers
$headers = @("TC ID","Module","Test Case Name","Type","Priority","Pre-conditions","Test Steps","Test Data","Expected Result","Status")
for ($c=1; $c -le 10; $c++) { $ws.Cells.Item(1,$c).Value2 = $headers[$c-1] }
$hdr = $ws.Range("A1:J1")
$hdr.Font.Bold = $true
$hdr.Font.Color = $WHITE
$hdr.Interior.Color = $BLUE
$hdr.RowHeight = 30
$hdr.VerticalAlignment = -4108
$hdr.HorizontalAlignment = -4108

# Data - flat array [id, module, name, type, priority, pre, steps, data, expected, status]
$M = "User Management"
$PNAV  = "Super Admin logged in to UAT (https://helpdesk-uat.hubblehox.ai)"
$PPAGE = "Super Admin logged in; User Management page is open"
$PMOD  = "Super Admin logged in; User Management page open; Create User modal is open"
$PCREATED = "Super Admin logged in; User Management page open; New user created in TC_UM_52-54"

$cases = @(
@("TC_UM_01",$M,"Login as Super Admin","Positive","High",$PNAV,"1. Open https://helpdesk-uat.hubblehox.ai`n2. Enter email`n3. Enter password`n4. Click Login","Email: niraj.mishra@hubblehox.com | Password: admin@12345","Login successful; dashboard is displayed","Pending"),
@("TC_UM_02",$M,"Navigate to User Management via sidebar","Positive","High",$PNAV,"1. Click 'User Management' in left sidebar","N/A","Browser navigates to /users; User Management page loads","Pending"),
@("TC_UM_03",$M,"Verify page header text 'User Management'","Positive","High",$PPAGE,"1. Observe the page heading","N/A","Page heading shows 'User Management'","Pending"),
@("TC_UM_04",$M,"Verify subtitle 'Manage system users and their access'","Positive","Medium",$PPAGE,"1. Observe subtitle below heading","N/A","Subtitle reads 'Manage system users and their access'","Pending"),
@("TC_UM_05",$M,"Verify Stats cards visible (Total Users, Active, Inactive, Projects)","Positive","High",$PPAGE,"1. Observe stats row at top of page`n2. Verify 4 cards","N/A","All 4 stat cards visible with numeric values","Pending"),
@("TC_UM_06",$M,"Verify Search input field visible with placeholder","Positive","Medium",$PPAGE,"1. Locate search input in filter bar","Placeholder: 'Search users...'","Search input visible with placeholder 'Search users...'","Pending"),
@("TC_UM_07",$M,"Verify Role filter dropdown visible with default 'All Roles'","Positive","Medium",$PPAGE,"1. Locate Role dropdown in filter bar","N/A","Role filter dropdown visible; default: 'All Roles'","Pending"),
@("TC_UM_08",$M,"Verify Status filter dropdown visible with default 'All Status'","Positive","Medium",$PPAGE,"1. Locate Status dropdown in filter bar","N/A","Status filter dropdown visible; default: 'All Status'","Pending"),
@("TC_UM_09",$M,"Verify 'Add from HRMS' button visible","Positive","Low",$PPAGE,"1. Observe buttons in top-right area","N/A","'Add from HRMS' button visible (green)","Pending"),
@("TC_UM_10",$M,"Verify 'Create User' button visible","Positive","High",$PPAGE,"1. Observe buttons in top-right area","N/A","'Create User' button visible (blue)","Pending"),
@("TC_UM_11",$M,"Verify users table is visible on landing page","Positive","High",$PPAGE,"1. Scroll to table section`n2. Verify table rendered","N/A","Users table is visible (may show loading then data)","Pending"),
@("TC_UM_12",$M,"Verify table column headers: NAME EMAIL EMPLOYEE CODE ROLE PROJECTS STATUS ACTIONS","Positive","High",$PPAGE,"1. Observe table header row`n2. Verify each column name","Expected: NAME|EMAIL|EMPLOYEE CODE|ROLE|PROJECTS|STATUS|ACTIONS","All 7 column headers visible in correct order","Pending"),
@("TC_UM_13",$M,"Click 'Create User' button - modal opens","Positive","High",$PPAGE,"1. Click 'Create User' button`n2. Wait for modal overlay","N/A","Create User modal opens with dark overlay background","Pending"),
@("TC_UM_14",$M,"Verify modal title is 'Create User'","Positive","High",$PMOD,"1. Read the modal header title text","N/A","Modal title reads 'Create User'","Pending"),
@("TC_UM_15",$M,"Verify First Name field visible and required (*)","Positive","High",$PMOD,"1. Locate 'First Name' label`n2. Verify red asterisk beside label","N/A","First Name input visible; label shows 'First Name *' (red asterisk)","Pending"),
@("TC_UM_16",$M,"Verify Last Name field visible and required (*)","Positive","High",$PMOD,"1. Locate 'Last Name' label`n2. Verify red asterisk","N/A","Last Name input visible; label shows 'Last Name *'","Pending"),
@("TC_UM_17",$M,"Verify Email field visible and required (*)","Positive","High",$PMOD,"1. Locate 'Email' label`n2. Verify red asterisk","N/A","Email input visible; label shows 'Email *'","Pending"),
@("TC_UM_18",$M,"Verify Mobile field visible (optional) with hint text","Positive","Medium",$PMOD,"1. Locate 'Mobile' label (no asterisk)`n2. Check placeholder and hint","Placeholder: '10-digit number (starts with 6-9)' | Hint: 'Example: 9876543210'","Mobile tel input visible; no asterisk; placeholder and hint shown","Pending"),
@("TC_UM_19",$M,"Verify Employee Code field visible (optional)","Positive","Medium",$PMOD,"1. Locate 'Employee Code' label (no asterisk)","N/A","Employee Code input visible; no asterisk","Pending"),
@("TC_UM_20",$M,"Verify Joining Date field visible (optional date picker)","Positive","Medium",$PMOD,"1. Locate 'Joining Date' label`n2. Verify date picker control","N/A","Joining Date date input visible; no asterisk","Pending"),
@("TC_UM_21",$M,"Verify Password field visible and required (*) for new user","Positive","High",$PMOD,"1. Locate 'Password' label`n2. Verify asterisk`n3. Verify placeholder 'Minimum 8 characters'`n4. Verify hint 'Must be at least 8 characters long'","Placeholder: 'Minimum 8 characters'","Password field visible; shows *; hint visible; field type is password","Pending"),
@("TC_UM_22",$M,"Verify Role dropdown visible and required (*)","Positive","High",$PMOD,"1. Locate 'Role' label`n2. Verify asterisk`n3. Verify default 'Select Role'","N/A","Role select dropdown visible; 'Role *'; default 'Select Role'","Pending"),
@("TC_UM_23",$M,"Verify Department field visible (optional)","Positive","Low",$PMOD,"1. Locate 'Department' label (no asterisk)","N/A","Department input visible; no asterisk","Pending"),
@("TC_UM_24",$M,"Verify Designation field visible (optional)","Positive","Low",$PMOD,"1. Locate 'Designation' label (no asterisk)","N/A","Designation input visible; no asterisk","Pending"),
@("TC_UM_25",$M,"Verify Reporting Manager dropdown visible (optional)","Positive","Low",$PMOD,"1. Locate 'Reporting Manager' label`n2. Verify dropdown with 'Select Reporting Manager' default","N/A","Reporting Manager select visible; default 'Select Reporting Manager'","Pending"),
@("TC_UM_26",$M,"Verify Assigned Projects section visible with checkboxes","Positive","High",$PMOD,"1. Locate 'Assigned Projects' label`n2. Verify scrollable checkbox list","N/A","Assigned Projects section visible; scrollable list of project checkboxes shown","Pending"),
@("TC_UM_27",$M,"Verify PM-created project appears in Assigned Projects list","Positive","High",$PMOD,"1. Scroll through Assigned Projects list`n2. Locate project 'AutoTest[RUN_ID]'","Project: AutoTest[RUN_ID] (created by ProjectManagementTest)","Project 'AutoTest[RUN_ID]' listed with checkbox in Assigned Projects","Pending"),
@("TC_UM_28",$M,"Verify 'Create User' button disabled when required fields empty","Positive","High",$PMOD,"1. Open modal with all fields empty`n2. Observe button state (disabled/grey)","All required fields: empty","'Create User' button disabled (grey); cannot be submitted","Pending"),
@("TC_UM_29",$M,"Verify Cancel button closes modal without submission","Positive","Medium",$PMOD,"1. Click 'Cancel' button in modal footer`n2. Verify modal disappears","N/A","Modal closes; landing page visible; no data submitted","Pending"),
@("TC_UM_30",$M,"[NEG] Submit form with all fields empty - required field alert","Negative","High","Create User modal open; all fields empty","1. Leave all fields empty`n2. If submit enabled click 'Create User'`n3. Observe alert","All fields: empty","Browser alert: 'Please fill all required fields'","Pending"),
@("TC_UM_31",$M,"[NEG] Submit without First Name - validation alert","Negative","High","Modal open; Last Name/Email/Password/Role filled; First Name empty","1. Fill Last Name Email Password Role`n2. Leave First Name empty`n3. Click 'Create User'","First Name: empty; others: valid","Browser alert: 'Please fill all required fields'","Pending"),
@("TC_UM_32",$M,"[NEG] Submit without Last Name - validation alert","Negative","High","Modal open; First Name/Email/Password/Role filled; Last Name empty","1. Fill First Name Email Password Role`n2. Leave Last Name empty`n3. Click 'Create User'","Last Name: empty; others: valid","Browser alert: 'Please fill all required fields'","Pending"),
@("TC_UM_33",$M,"[NEG] Submit without Email - validation alert","Negative","High","Modal open; First/Last Name, Password, Role filled; Email empty","1. Fill First Name Last Name Password Role`n2. Leave Email empty`n3. Click 'Create User'","Email: empty; others: valid","Browser alert: 'Please fill all required fields'","Pending"),
@("TC_UM_34",$M,"[NEG] Submit without Password (new user) - validation alert","Negative","High","Modal open; First/Last Name, Email, Role filled; Password empty","1. Fill First Name Last Name Email Role`n2. Leave Password empty`n3. Click 'Create User'","Password: empty; others: valid","Browser alert: 'Password is required for new users'","Pending"),
@("TC_UM_35",$M,"[NEG] No Role selected - Create User button stays disabled","Negative","High","Modal open; First/Last Name, Email, Password filled; Role not selected","1. Fill First Name Last Name Email Password`n2. Leave Role as 'Select Role'`n3. Observe button state","Role: not selected","'Create User' button stays disabled (grey); form cannot be submitted","Pending"),
@("TC_UM_36",$M,"[NEG] Mobile with less than 10 digits - HTML5 pattern validation","Negative","Medium",$PMOD,"1. Click Mobile field`n2. Enter '98765' (5 digits)`n3. Tab to next field or attempt submit","Mobile: 98765 (5 digits)","HTML5 pattern validation triggers; browser tooltip shown; form not submitted","Pending"),
@("TC_UM_37",$M,"[NEG] Mobile not starting with 6-9 - HTML5 pattern validation","Negative","Medium",$PMOD,"1. Click Mobile field`n2. Enter '1234567890' (starts with 1)`n3. Attempt submit","Mobile: 1234567890 (starts with 1)","HTML5 pattern validation rejects; browser tooltip shown","Pending"),
@("TC_UM_38",$M,"[NEG] Password less than 8 characters - minLength validation","Negative","Medium",$PMOD,"1. Fill required fields`n2. Enter password 'abc' (3 chars)`n3. Click 'Create User'","Password: 'abc' (3 chars)","HTML5 minLength validation: 'Please lengthen this text to 8 characters or more'","Pending"),
@("TC_UM_39",$M,"Reopen Create User modal for positive creation flow","Positive","High",$PPAGE,"1. Click 'Create User' button`n2. Wait for modal","N/A","Create User modal opens","Pending"),
@("TC_UM_40",$M,"Enter unique First Name (Auto + RUN_ID)","Positive","High",$PMOD,"1. Click First Name field`n2. Clear any content`n3. Type first name","First Name: 'Auto' + RUN_ID (e.g. Auto12345)","First Name field contains 'Auto[RUN_ID]'","Pending"),
@("TC_UM_41",$M,"Enter unique Last Name (User + RUN_ID)","Positive","High",$PMOD,"1. Click Last Name field`n2. Clear any content`n3. Type last name","Last Name: 'User' + RUN_ID (e.g. User12345)","Last Name field contains 'User[RUN_ID]'","Pending"),
@("TC_UM_42",$M,"Enter unique Email address","Positive","High",$PMOD,"1. Click Email field`n2. Clear any content`n3. Type email","Email: autouser[RUN_ID]@test.com","Email field contains 'autouser[RUN_ID]@test.com'","Pending"),
@("TC_UM_43",$M,"Enter valid Mobile number (10-digit starting with 9)","Positive","Medium",$PMOD,"1. Click Mobile field`n2. Type mobile number","Mobile: 9876543210","Mobile field contains '9876543210'","Pending"),
@("TC_UM_44",$M,"Enter unique Employee Code (EMP + RUN_ID)","Positive","Medium",$PMOD,"1. Click Employee Code field`n2. Type employee code","Employee Code: 'EMP' + RUN_ID (e.g. EMP12345)","Employee Code field contains 'EMP[RUN_ID]'","Pending"),
@("TC_UM_45",$M,"Enter Joining Date","Positive","Medium",$PMOD,"1. Click Joining Date field`n2. Enter a date value","Joining Date: current date (yyyy-MM-dd)","Joining Date field shows entered date","Pending"),
@("TC_UM_46",$M,"Enter Password (minimum 8 characters)","Positive","High",$PMOD,"1. Click Password field`n2. Type password (min 8 chars)","Password: 'Test@1234' (9 chars)","Password field accepts input (masked); no validation error","Pending"),
@("TC_UM_47",$M,"Select Role from Role dropdown (first available)","Positive","High",$PMOD,"1. Click Role dropdown`n2. Select first available non-empty role","Role: first available role in dropdown","Role dropdown shows selected role; 'Create User' button becomes enabled","Pending"),
@("TC_UM_48",$M,"Enter Department","Positive","Low",$PMOD,"1. Click Department field`n2. Type department","Department: 'IT Automation'","Department field contains 'IT Automation'","Pending"),
@("TC_UM_49",$M,"Enter Designation","Positive","Low",$PMOD,"1. Click Designation field`n2. Type designation","Designation: 'QA Engineer'","Designation field contains 'QA Engineer'","Pending"),
@("TC_UM_50",$M,"Assign PM-created project via Assigned Projects checkbox","Positive","High",$PMOD,"1. Scroll to Assigned Projects section`n2. Locate checkbox for 'AutoTest[RUN_ID]'`n3. Check the checkbox","Project name: AutoTest[RUN_ID]","Checkbox for 'AutoTest[RUN_ID]' is checked (visible tick)","Pending"),
@("TC_UM_51",$M,"Verify 'Create User' button enabled after all required fields filled","Positive","High","All required fields filled in modal","1. Observe 'Create User' button state`n2. Verify button is enabled (purple/violet color)","Required fields: all filled","'Create User' button is enabled (purple); can be clicked","Pending"),
@("TC_UM_52",$M,"Click 'Create User' submit button","Positive","High","All required and optional fields filled","1. Click the 'Create User' button (purple)","N/A","Form submission starts; button may briefly show 'Saving...'","Pending"),
@("TC_UM_53",$M,"Verify success alert 'User created successfully'","Positive","High","Create User button clicked (TC_UM_52)","1. Wait for browser native alert dialog`n2. Read alert message text","N/A","Browser alert shows: 'User created successfully'","Pending"),
@("TC_UM_54",$M,"Accept success alert - modal closes","Positive","High","Success alert visible (TC_UM_53)","1. Click OK on browser alert`n2. Verify Create User modal closes","N/A","Alert dismissed; modal no longer visible; landing page table reloads","Pending"),
@("TC_UM_55",$M,"Verify users table visible after user creation","Positive","High",$PCREATED,"1. Observe users table after modal closes","N/A","Users table visible and loaded with data","Pending"),
@("TC_UM_56",$M,"Verify created user full name in table (Auto[RUN_ID] User[RUN_ID])","Positive","High",$PCREATED,"1. Search or scroll table`n2. Locate row with created user name","Expected: Auto[RUN_ID] User[RUN_ID]","NAME column shows 'Auto[RUN_ID] User[RUN_ID]'","Pending"),
@("TC_UM_57",$M,"Verify created user email in table","Positive","High",$PCREATED,"1. Locate created user row`n2. Check EMAIL column","Expected: autouser[RUN_ID]@test.com","EMAIL column shows 'autouser[RUN_ID]@test.com'","Pending"),
@("TC_UM_58",$M,"Verify created user employee code in table","Positive","Medium",$PCREATED,"1. Locate created user row`n2. Check EMPLOYEE CODE column","Expected: EMP[RUN_ID]","EMPLOYEE CODE column shows 'EMP[RUN_ID]'","Pending"),
@("TC_UM_59",$M,"Verify created user role shown in table","Positive","High",$PCREATED,"1. Locate created user row`n2. Check ROLE column","Expected: role selected during creation","ROLE column shows the correct role name","Pending"),
@("TC_UM_60",$M,"Verify PROJECTS column shows at least 1 project for created user","Positive","High",$PCREATED,"1. Locate created user row`n2. Check PROJECTS column","Expected: at least 1 (AutoTest[RUN_ID] assigned)","PROJECTS column shows count or project name for created user","Pending"),
@("TC_UM_61",$M,"Verify created user status is Active (green toggle)","Positive","High",$PCREATED,"1. Locate created user row`n2. Check STATUS column toggle state","N/A","STATUS toggle shows active (green) for created user","Pending"),
@("TC_UM_62",$M,"Verify Edit button visible for created user","Positive","High",$PCREATED,"1. Locate created user row ACTIONS column`n2. Verify pencil/edit icon button","N/A","Edit button (pencil icon) visible in ACTIONS for created user","Pending"),
@("TC_UM_63",$M,"Verify Delete button visible for created user","Positive","High",$PCREATED,"1. Locate created user row ACTIONS column`n2. Verify trash/delete icon button","N/A","Delete button (trash icon) visible in ACTIONS for created user","Pending"),
@("TC_UM_64",$M,"Search for created user by first name","Positive","High",$PCREATED,"1. Click Search input`n2. Type 'Auto[RUN_ID]' (created user's first name)","Search text: Auto[RUN_ID]","Search input accepts text; table filters dynamically","Pending"),
@("TC_UM_65",$M,"Verify search results contain created user","Positive","High","Search performed with 'Auto[RUN_ID]'","1. Observe filtered table after search`n2. Verify created user row present","N/A","Table shows at least 1 row with name containing 'Auto[RUN_ID]'","Pending"),
@("TC_UM_66",$M,"Clear search field - all users reload","Positive","Medium","Search active with 'Auto[RUN_ID]'","1. Clear Search input (delete text or click X)`n2. Observe table","N/A","Table shows all users (full list) after search cleared","Pending"),
@("TC_UM_67",$M,"Filter by Role - verify filtered table results","Positive","Medium",$PPAGE,"1. Click Role filter dropdown`n2. Select role used during creation`n3. Observe table","Role: same as assigned to created user","Table shows only users with selected role; created user in results","Pending"),
@("TC_UM_68",$M,"Filter by Status 'Active' - created user visible","Positive","Medium",$PPAGE,"1. Click Status dropdown`n2. Select 'Active'`n3. Observe table","Status: Active","Only active users shown; created user (active) appears in results","Pending"),
@("TC_UM_69",$M,"Filter by Status 'Inactive' - created user NOT visible","Positive","Medium",$PPAGE,"1. Click Status dropdown`n2. Select 'Inactive'`n3. Observe table","Status: Inactive","Only inactive users shown; newly created (active) user NOT in results","Pending"),
@("TC_UM_70",$M,"Clear status filter - all users visible again","Positive","Medium","Status filter set to 'Inactive'","1. Click Status dropdown`n2. Select 'All Status'`n3. Observe table","Status: All Status","All users (active + inactive) shown again","Pending")
)

$r = 2
foreach ($case in $cases) {
    for ($c=1; $c -le 10; $c++) {
        $ws.Cells.Item($r,$c).Value2 = $case[$c-1]
    }
    $r++
}

$lastRow = $r - 1

# Apply formatting
for ($row=2; $row -le $lastRow; $row++) {
    $type = $ws.Cells.Item($row,4).Value2
    if ($type -eq "Negative") {
        $ws.Cells.Item($row,4).Interior.Color = $LRED
        $ws.Cells.Item($row,4).Font.Color = $DRED
    }
    $pri = $ws.Cells.Item($row,5).Value2
    if ($pri -eq "High") {
        $ws.Cells.Item($row,5).Interior.Color = $LGREEN
        $ws.Cells.Item($row,5).Font.Color = $DGREEN
    } elseif ($pri -eq "Medium") {
        $ws.Cells.Item($row,5).Interior.Color = $LYELLOW
        $ws.Cells.Item($row,5).Font.Color = $DYELLOW
    }
    # Status column
    $ws.Cells.Item($row,10).Interior.Color = $LBLUE
    $ws.Cells.Item($row,10).Font.Color = $DBLUE
    # Alternate row background (only for un-colored area)
    if ($row % 2 -eq 0) {
        $ws.Cells.Item($row,1).Interior.Color = $LGREY
        $ws.Cells.Item($row,2).Interior.Color = $LGREY
        $ws.Cells.Item($row,3).Interior.Color = $LGREY
        $ws.Cells.Item($row,6).Interior.Color = $LGREY
        $ws.Cells.Item($row,7).Interior.Color = $LGREY
        $ws.Cells.Item($row,8).Interior.Color = $LGREY
        $ws.Cells.Item($row,9).Interior.Color = $LGREY
    }
}

# Borders
$ws.Range("A1:J$lastRow").Borders.LineStyle = 1
$ws.Range("A1:J$lastRow").Borders.Weight = 2

# Wrap text
$ws.Columns("F:I").WrapText = $true

# Column widths
$ws.Columns("A").ColumnWidth = 12
$ws.Columns("B").ColumnWidth = 20
$ws.Columns("C").ColumnWidth = 48
$ws.Columns("D").ColumnWidth = 12
$ws.Columns("E").ColumnWidth = 10
$ws.Columns("F").ColumnWidth = 40
$ws.Columns("G").ColumnWidth = 55
$ws.Columns("H").ColumnWidth = 42
$ws.Columns("I").ColumnWidth = 48
$ws.Columns("J").ColumnWidth = 12

# Row heights
for ($row=2; $row -le $lastRow; $row++) { $ws.Rows($row).RowHeight = 85 }

# Freeze panes
$ws.Application.ActiveWindow.SplitRow = 1
$ws.Application.ActiveWindow.FreezePanes = $true

# Bold TC ID and Name columns
$ws.Columns("A").Font.Bold = $true

# Save
$savePath = "C:\Users\nikhil.chaudhari\OneDrive - Eduspark International Pvt. Ltd\Helpdesk\helpdesk\automation\testresults\User_Management_TestCases.xlsx"
$workbook.SaveAs($savePath)
$workbook.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

Write-Host "SUCCESS: Saved $lastRow test cases to $savePath"
