# SAC Helpdesk - Restore Files from Backups
# This script restores empty or corrupted files from their backup versions

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  SAC Helpdesk Backup Restoration" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Change to the project root directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Counter for tracking
$restoredCount = 0
$skippedCount = 0
$errorCount = 0

# Function to restore a file from backup
function Restore-FromBackup {
    param(
        [string]$BackupFile,
        [string]$TargetFile
    )
    
    try {
        if (Test-Path $BackupFile) {
            $backupSize = (Get-Item $BackupFile).Length
            
            # Check if target file exists and is empty or very small
            $shouldRestore = $false
            if (Test-Path $TargetFile) {
                $targetSize = (Get-Item $TargetFile).Length
                if ($targetSize -lt 100) {
                    $shouldRestore = $true
                    Write-Host "  Target file is empty or very small ($targetSize bytes)" -ForegroundColor Yellow
                }
            } else {
                $shouldRestore = $true
                Write-Host "  Target file doesn't exist" -ForegroundColor Yellow
            }
            
            if ($shouldRestore -and $backupSize -gt 100) {
                Write-Host "  Restoring: $TargetFile" -ForegroundColor Green
                Write-Host "  From:      $BackupFile ($backupSize bytes)" -ForegroundColor Gray
                
                Copy-Item -Path $BackupFile -Destination $TargetFile -Force
                
                # Verify the copy
                if (Test-Path $TargetFile) {
                    $newSize = (Get-Item $TargetFile).Length
                    if ($newSize -eq $backupSize) {
                        Write-Host "  ✓ Successfully restored ($newSize bytes)" -ForegroundColor Green
                        $script:restoredCount++
                        return $true
                    } else {
                        Write-Host "  ✗ Size mismatch after copy!" -ForegroundColor Red
                        $script:errorCount++
                        return $false
                    }
                }
            } else {
                Write-Host "  Skipped: $TargetFile (already has content or backup is empty)" -ForegroundColor Gray
                $script:skippedCount++
            }
        } else {
            Write-Host "  ✗ Backup file not found: $BackupFile" -ForegroundColor Red
            $script:errorCount++
        }
    } catch {
        Write-Host "  ✗ Error restoring $TargetFile : $_" -ForegroundColor Red
        $script:errorCount++
        return $false
    }
    
    return $false
}

Write-Host "Searching for backup files..." -ForegroundColor Cyan
Write-Host ""

# Find all backup files
$backupFiles = @()
$backupFiles += Get-ChildItem -Path "frontend\src" -Recurse -Include "*_backup.tsx","*_backup.ts" -ErrorAction SilentlyContinue
$backupFiles += Get-ChildItem -Path "backend\src" -Recurse -Include "*_backup.tsx","*_backup.ts" -ErrorAction SilentlyContinue

Write-Host "Found $($backupFiles.Count) backup files" -ForegroundColor Cyan
Write-Host ""

# Process each backup file
foreach ($backup in $backupFiles) {
    Write-Host "Processing: $($backup.Name)" -ForegroundColor Cyan
    
    # Determine the target file name (remove _backup suffix)
    $targetName = $backup.Name -replace '_backup\.(tsx?|jsx?)$', '.$1'
    $targetPath = Join-Path -Path $backup.DirectoryName -ChildPath $targetName
    
    Restore-FromBackup -BackupFile $backup.FullName -TargetFile $targetPath
    Write-Host ""
}

# Also check for _clean versions (use them if no _backup exists)
Write-Host "Checking for _clean versions..." -ForegroundColor Cyan
$cleanFiles = @()
$cleanFiles += Get-ChildItem -Path "frontend\src" -Recurse -Include "*_clean.tsx","*_clean.ts" -ErrorAction SilentlyContinue
$cleanFiles += Get-ChildItem -Path "backend\src" -Recurse -Include "*_clean.tsx","*_clean.ts" -ErrorAction SilentlyContinue

foreach ($clean in $cleanFiles) {
    Write-Host "Processing: $($clean.Name)" -ForegroundColor Cyan
    
    # Determine the target file name (remove _clean suffix)
    $targetName = $clean.Name -replace '_clean\.(tsx?|jsx?)$', '.$1'
    $targetPath = Join-Path -Path $clean.DirectoryName -ChildPath $targetName
    
    # Only restore from _clean if target doesn't exist or is empty
    if ((-not (Test-Path $targetPath)) -or ((Get-Item $targetPath).Length -lt 100)) {
        Restore-FromBackup -BackupFile $clean.FullName -TargetFile $targetPath
    } else {
        Write-Host "  Skipped: $targetPath (already restored from _backup or has content)" -ForegroundColor Gray
        $script:skippedCount++
    }
    Write-Host ""
}

# Summary
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Restoration Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✓ Files restored:  $restoredCount" -ForegroundColor Green
Write-Host "- Files skipped:   $skippedCount" -ForegroundColor Yellow
Write-Host "✗ Errors:          $errorCount" -ForegroundColor Red
Write-Host ""

if ($restoredCount -gt 0) {
    Write-Host "✓ Restoration completed! Please review the changes." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Check the restored files in VS Code" -ForegroundColor White
    Write-Host "2. Test your application to ensure everything works" -ForegroundColor White
    Write-Host "3. Commit the restored files to git:" -ForegroundColor White
    Write-Host "   git add ." -ForegroundColor Gray
    Write-Host "   git commit -m ""Restore files from backups""" -ForegroundColor Gray
} else {
    Write-Host "No files needed restoration." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
