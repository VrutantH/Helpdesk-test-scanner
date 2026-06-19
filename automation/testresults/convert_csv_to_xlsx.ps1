$csvPath = "C:\Users\nikhil.chaudhari\OneDrive - Eduspark International Pvt. Ltd\Helpdesk\helpdesk\automation\testresults\Query_Configuration_TestCases.csv"
$xlsxPath = "C:\Users\nikhil.chaudhari\OneDrive - Eduspark International Pvt. Ltd\Helpdesk\helpdesk\automation\testresults\Query_Configuration_TestCases.xlsx"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    # Open the CSV as a Workbook
    $workbook = $excel.Workbooks.Open($csvPath)
    $ws = $workbook.Worksheets.Item(1)
    
    # Basic Formatting
    $ws.Name = "Test Cases"
    $ws.Rows.Item(1).Font.Bold = $true
    $ws.Columns.AutoFit()
    $ws.Columns.Item(4).ColumnWidth = 50
    $ws.Columns.Item(5).ColumnWidth = 50
    $ws.UsedRange.VerticalAlignment = -4108
    $ws.UsedRange.WrapText = $true
    
    # Save as XLSX
    if (Test-Path $xlsxPath) { Remove-Item $xlsxPath -Force }
    $workbook.SaveAs($xlsxPath, 51) # 51 = xlOpenXMLWorkbook (.xlsx)
    Write-Host "Successfully converted CSV to XLSX: $xlsxPath"
} finally {
    if ($workbook) { $workbook.Close($false) }
    $excel.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
}
