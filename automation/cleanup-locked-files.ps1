# ===================================================================
# Cleanup Script - Kill locked processes and clean target directory
# ===================================================================
# Usage: .\cleanup-locked-files.ps1
# This script forcefully closes ChromeDriver and Chrome automation 
# processes, then cleans the target directory to prevent "file locked" 
# errors during Maven builds.
# ===================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Automation Cleanup Utility" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill ChromeDriver processes
Write-Host "Checking for ChromeDriver processes..." -ForegroundColor Yellow
$chromedrivers = Get-Process -Name "chromedriver" -ErrorAction SilentlyContinue
if ($chromedrivers) {
    $count = $chromedrivers.Count
    $chromedrivers | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "  [✓] Stopped $count ChromeDriver process(es)" -ForegroundColor Green
} else {
    Write-Host "  [✓] No ChromeDriver processes found" -ForegroundColor Gray
}

# Kill Chrome processes started by automation (only those with selenium profile)
Write-Host "Checking for Chrome automation processes..." -ForegroundColor Yellow
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
        Write-Host "  [✓] Stopped $($automationChromes.Count) Chrome automation process(es)" -ForegroundColor Green
    } else {
        Write-Host "  [✓] No Chrome automation processes found" -ForegroundColor Gray
    }
} else {
    Write-Host "  [✓] No Chrome processes running" -ForegroundColor Gray
}

# Wait for processes to fully terminate
Write-Host "Waiting for processes to terminate..." -ForegroundColor Yellow
Start-Sleep -Seconds 1

# Clean target directory
$ProjectDir = $PSScriptRoot
$targetDir = Join-Path $ProjectDir "target"

if (Test-Path $targetDir) {
    Write-Host "Cleaning target directory..." -ForegroundColor Yellow
    try {
        Remove-Item -Path $targetDir -Recurse -Force -ErrorAction Stop
        Write-Host "  [✓] Successfully removed target directory" -ForegroundColor Green
    } catch {
        # If full delete fails, try to delete specific problematic folders
        Write-Host "  [!] Cannot remove entire target directory, trying selective cleanup..." -ForegroundColor DarkYellow
        
        $foldersToClean = @(
            (Join-Path $targetDir "test-classes"),
            (Join-Path $targetDir "classes"),
            (Join-Path $targetDir "surefire-reports")
        )
        
        foreach ($folder in $foldersToClean) {
            if (Test-Path $folder) {
                try {
                    Remove-Item -Path $folder -Recurse -Force -ErrorAction SilentlyContinue
                    Write-Host "    [✓] Removed $(Split-Path $folder -Leaf)" -ForegroundColor Green
                } catch {
                    Write-Host "    [!] Could not remove $(Split-Path $folder -Leaf)" -ForegroundColor DarkYellow
                }
            }
        }
    }
} else {
    Write-Host "  [✓] Target directory does not exist (already clean)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Cleanup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now run Maven commands without file lock issues." -ForegroundColor Green
Write-Host ""
