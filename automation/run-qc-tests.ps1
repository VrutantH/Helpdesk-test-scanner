param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$TestCases
)

# ===================================================================
# CLEANUP FUNCTION - Kill only automation Chrome processes
# ===================================================================
function Cleanup-AutomationProcesses {
    Write-Host "Cleaning up locked automation processes..." -ForegroundColor Cyan
    
    $driverCount = 0
    $chromeCount = 0

    try {
        # 1. Kill chromedriver
        $drivers = Get-Process -Name "chromedriver" -ErrorAction SilentlyContinue
        if ($drivers) {
            $drivers | Stop-Process -Force
            $driverCount = $drivers.Count
            Write-Host "  [OK] Stopped $driverCount ChromeDriver process(es)" -ForegroundColor Green
        }

        # 2. Kill only Chrome processes started by automation
        # We use WMI to check the command line arguments for automation flags
        $chromes = Get-WmiObject Win32_Process -Filter "Name='chrome.exe'"
        foreach ($chrome in $chromes) {
            if ($chrome.CommandLine -match "--test-type" -or 
                $chrome.CommandLine -match "--enable-automation" -or 
                $chrome.CommandLine -match "scoped_dir") {
                
                try {
                    Stop-Process -Id $chrome.ProcessId -Force -ErrorAction SilentlyContinue
                    $chromeCount++
                } catch {}
            }
        }
        
        if ($chromeCount -gt 0) {
            Write-Host "  [OK] Stopped $chromeCount automation Chrome process(es)" -ForegroundColor Green
        }

        if ($driverCount -eq 0 -and $chromeCount -eq 0) {
            Write-Host "  [INFO] No automation Chrome processes found to clean up" -ForegroundColor Gray
        }

        # 3. Clean target directory to avoid locked file errors
        $ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
        $TargetDir = Join-Path $ProjectDir "target"
        
        if (Test-Path $TargetDir) {
            Remove-Item -Path $TargetDir -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "  [OK] Removed locked target directory" -ForegroundColor Green
        }

    } catch {
        Write-Host "  [WARNING] Cleanup encountered an error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Run cleanup before execution
Cleanup-AutomationProcesses

# ===================================================================
# TEST EXECUTION
# ===================================================================

$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$BaseXml = Join-Path $ProjectDir "testng-qc.xml"
$TempXml = Join-Path $ProjectDir "testng-qc-run.xml"

# If no specific test cases provided, run everything using the base XML
if ($null -eq $TestCases -or $TestCases.Count -eq 0) {
    Write-Host "No test cases specified - running ALL Query Configuration tests." -ForegroundColor Cyan
    Copy-Item $BaseXml $TempXml -Force
} 
else {
    Write-Host "Running $($TestCases.Count) test(s): $([string]::Join(', ', $TestCases))" -ForegroundColor Cyan
    
    $xmlContent = @"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="HubbleHox Test Suite - Custom Run" parallel="false">
    <test name="Custom Query Configuration Tests">
        <classes>
            <class name="com.hubblehox.automation.tests.TicketConfigTest">
                <methods>
"@

    foreach ($tc in $TestCases) {
        $xmlContent += "                    <include name=`"$tc`" />`n"
    }

    $xmlContent += @"
                </methods>
            </class>
        </classes>
    </test>
</suite>
"@

    Set-Content -Path $TempXml -Value $xmlContent -Encoding UTF8
}

Write-Host "Generated: $TempXml" -ForegroundColor Gray
Write-Host ""

Push-Location $ProjectDir
try {
    mvn test "-Dmodule=qc-run"
} finally {
    Pop-Location
    if (Test-Path $TempXml) { Remove-Item $TempXml -Force }
}
