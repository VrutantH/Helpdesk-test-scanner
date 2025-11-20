# SAC Helpdesk - Stop All Servers

Write-Host "🛑 SAC Helpdesk - Stopping All Servers" -ForegroundColor Red
Write-Host "=" * 60 -ForegroundColor Red
Write-Host ""

# Function to stop process on port
function Stop-ProcessOnPort {
    param([int]$Port, [string]$Name)
    
    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
               Select-Object -ExpandProperty OwningProcess -First 1
    
    if ($process) {
        Write-Host "🛑 Stopping $Name on port $Port (PID: $process)" -ForegroundColor Yellow
        try {
            Stop-Process -Id $process -Force -ErrorAction Stop
            Write-Host "   ✅ Stopped" -ForegroundColor Green
            return $true
        } catch {
            Write-Host "   ❌ Failed to stop" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "   ℹ️  $Name not running on port $Port" -ForegroundColor Gray
        return $true
    }
}

# Stop backend
Stop-ProcessOnPort -Port 3003 -Name "Backend Server"

# Stop frontend
Stop-ProcessOnPort -Port 3001 -Name "Frontend Server"

# Clean up PID file if exists
$pidFile = Join-Path $PSScriptRoot ".server-pids.json"
if (Test-Path $pidFile) {
    Remove-Item $pidFile -Force
    Write-Host ""
    Write-Host "✅ Cleaned up PID tracking file" -ForegroundColor Green
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Red
Write-Host "✅ All servers stopped" -ForegroundColor Green
Write-Host ""
