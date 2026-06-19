param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$TestCases
)

# ===================================================================
# CLEANUP FUNCTION - Kill only automation Chrome processes
# ===================================================================
function Cleanup-LockedProcesses {
    Write-Host "Cleaning up locked automation processes..." -ForegroundColor Yellow
    
    # Kill ChromeDriver processes (these are only for automation)
    $chromedrivers = Get-Process -Name "chromedriver" -ErrorAction SilentlyContinue
    if ($chromedrivers) {
        $chromedrivers | Stop-Process -Force -ErrorAction SilentlyContinue
        Write-Host "  [OK] Stopped $($chromedrivers.Count) ChromeDriver process(es)" -ForegroundColor Green
    }
    
    # Kill only Chrome processes with automation profile (safer - won't close user's personal tabs)
    # Look for Chrome processes with "selenium-chrome-profile" in command line
    $allChromes = Get-Process -Name "chrome" -ErrorAction SilentlyContinue
    $automationChromes = @()
    
    if ($allChromes) {
        foreach ($chrome in $allChromes) {
            try {
                $cmdLine = (Get-CimInstance Win32_Process -Filter "ProcessId = $($chrome.Id)" -ErrorAction SilentlyContinue).CommandLine
                if ($cmdLine -and $cmdLine -match "selenium-chrome-profile") {
                    $automationChromes += $chrome
                }
            } catch {
                # Skip if can't read command line
            }
        }
        
        if ($automationChromes.Count -gt 0) {
            $automationChromes | Stop-Process -Force -ErrorAction SilentlyContinue
            Write-Host "  [OK] Stopped $($automationChromes.Count) automation Chrome process(es)" -ForegroundColor Green
        } else {
            Write-Host "  [INFO] No automation Chrome processes found to clean up" -ForegroundColor Cyan
        }
    }
    
    # Wait for processes to fully terminate
    Start-Sleep -Milliseconds 800
    
    # Force unlock target directory if it exists
    $targetDir = Join-Path $PSScriptRoot "target"
    if (Test-Path $targetDir) {
        try {
            Remove-Item -Path $targetDir -Recurse -Force -ErrorAction Stop
            Write-Host "  [OK] Removed locked target directory" -ForegroundColor Green
        } catch {
            # If full delete fails, try to delete just the problematic test-classes folder
            $testClasses = Join-Path $targetDir "test-classes"
            if (Test-Path $testClasses) {
                try {
                    Remove-Item -Path $testClasses -Recurse -Force -ErrorAction SilentlyContinue
                    Write-Host "  [OK] Removed test-classes directory" -ForegroundColor Green
                } catch {
                    Write-Host "  [WARN] Could not remove some locked files (will be overwritten)" -ForegroundColor DarkYellow
                }
            }
        }
    }
    
    Write-Host ""
}

# Run cleanup before starting tests
Cleanup-LockedProcesses

$ProjectDir = $PSScriptRoot
$TempXml    = Join-Path $ProjectDir "testng-um-run.xml"
$ClassName  = "com.hubblehox.automation.tests.UserManagementTest"

# Build XML content
$xmlContent = @"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="User Management Suite" verbose="1" thread-count="1" parallel="none">
    <test name="User Management Tests">
        <classes>
"@

if ($TestCases -and $TestCases.Count -gt 0) {
    $xmlContent += "`n            <class name=`"$ClassName`">`n"
    $xmlContent += "                <methods>`n"
    foreach ($tc in $TestCases) {
        $xmlContent += "                    <include name=`"$tc`"/>`n"
    }
    $xmlContent += "                </methods>`n"
    $xmlContent += "            </class>`n"
    Write-Host ""
    Write-Host "Running $($TestCases.Count) test(s): $($TestCases -join ', ')" -ForegroundColor Cyan
} else {
    $xmlContent += "            <class name=`"$ClassName`"/>`n"
    Write-Host ""
    Write-Host "No test cases specified - running ALL UserManagementTest cases." -ForegroundColor Yellow
}

$xmlContent += @"
        </classes>
    </test>
</suite>
"@

$xmlContent | Set-Content -Path $TempXml -Encoding UTF8
Write-Host "Generated: $TempXml" -ForegroundColor Gray
Write-Host ""

Push-Location $ProjectDir
try {
    mvn test "-Dmodule=um-run"
} finally {
    Pop-Location
    if (Test-Path $TempXml) { Remove-Item $TempXml -Force }
}
