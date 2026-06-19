$csvPath = "C:\Users\nikhil.chaudhari\OneDrive - Eduspark International Pvt. Ltd\Helpdesk\helpdesk\automation\testresults\Query_Configuration_TestCases_Full.csv"
$xlsxPath = "C:\Users\nikhil.chaudhari\OneDrive - Eduspark International Pvt. Ltd\Helpdesk\helpdesk\automation\testresults\Query_Configuration_TestCases_Full.xlsx"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $workbook = $excel.Workbooks.Open($csvPath)
    $ws = $workbook.Worksheets.Item(1)
    
    $ws.Name = "Test Cases"
    $ws.Rows.Item(1).Font.Bold = $true
    
    # Header styling
    $headerRange = $ws.Range("A1:G1")
    $headerRange.Interior.Color = 12615680 # Dark blue
    $headerRange.Font.Color = 16777215 # White
    
    $ws.Columns.AutoFit()
    $ws.Columns.Item(4).ColumnWidth = 60 # Steps
    $ws.Columns.Item(5).ColumnWidth = 60 # Expected
    $ws.UsedRange.VerticalAlignment = -4108 # Center
    $ws.UsedRange.WrapText = $true
    
    if (Test-Path $xlsxPath) { Remove-Item $xlsxPath -Force }
    $workbook.SaveAs($xlsxPath, 51)
    Write-Host "Successfully generated full XLSX: $xlsxPath"
} finally {
    if ($workbook) { $workbook.Close($false) }
    $excel.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
}
