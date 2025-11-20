# SAC Helpdesk - Server Watchdog (Auto-Restart)
# Monitors servers and auto-restarts if they crash

param(
    [int]$CheckInterval = 30  # Check every 30 seconds
)

Write-Host "👁️  SAC Helpdesk - Server Watchdog Started" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""
Write-Host "Monitoring servers every $CheckInterval seconds..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Gray
Write-Host ""

$script:restartCount = @{
    Backend = 0
    Frontend = 0
}

function Test-ServerRunning {
    param([int]$Port)
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        return $null -ne $connection
    } catch {
        return $false
    }
}

function Start-Backend {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 🔧 Starting Backend..." -ForegroundColor Yellow
    $backendPath = Join-Path $PSScriptRoot "backend"
    Start-Process powershell -ArgumentList `
        "-NoExit", `
        "-Command", "cd '$backendPath'; Write-Host '🔧 Backend Server (Auto-Started)' -ForegroundColor Green; npm run dev" `
        -WindowStyle Normal
    $script:restartCount.Backend++
    Start-Sleep -Seconds 5
}

function Start-Frontend {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 🎨 Starting Frontend..." -ForegroundColor Yellow
    $frontendPath = Join-Path $PSScriptRoot "frontend"
    Start-Process powershell -ArgumentList `
        "-NoExit", `
        "-Command", "cd '$frontendPath'; Write-Host '🎨 Frontend Server (Auto-Started)' -ForegroundColor Green; npm run dev" `
        -WindowStyle Normal
    $script:restartCount.Frontend++
    Start-Sleep -Seconds 5
}

# Initial check and start
if (-not (Test-ServerRunning -Port 3003)) {
    Write-Host "Backend not running - Starting..." -ForegroundColor Yellow
    Start-Backend
}

if (-not (Test-ServerRunning -Port 3001)) {
    Write-Host "Frontend not running - Starting..." -ForegroundColor Yellow
    Start-Frontend
}

Write-Host "✅ Initial setup complete" -ForegroundColor Green
Write-Host ""

# Continuous monitoring
try {
    while ($true) {
        $backendRunning = Test-ServerRunning -Port 3003
        $frontendRunning = Test-ServerRunning -Port 3001
        
        $status = "["
        $status += if ($backendRunning) { "Backend: ✅" } else { "Backend: ❌" }
        $status += " | "
        $status += if ($frontendRunning) { "Frontend: ✅" } else { "Frontend: ❌" }
        $status += "]"
        
        if (-not $backendRunning -or -not $frontendRunning) {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $status" -ForegroundColor Red
            
            if (-not $backendRunning) {
                Write-Host "⚠️  Backend crashed! Auto-restarting... (Restart #$($script:restartCount.Backend + 1))" -ForegroundColor Red
                Start-Backend
            }
            
            if (-not $frontendRunning) {
                Write-Host "⚠️  Frontend crashed! Auto-restarting... (Restart #$($script:restartCount.Frontend + 1))" -ForegroundColor Red
                Start-Frontend
            }
        } else {
            # Only show periodic status (every 5 checks)
            if ($script:checkCount % 5 -eq 0) {
                Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $status - Restarts: Backend=$($script:restartCount.Backend), Frontend=$($script:restartCount.Frontend)" -ForegroundColor Green
            }
        }
        
        $script:checkCount++
        Start-Sleep -Seconds $CheckInterval
    }
} catch {
    Write-Host ""
    Write-Host "Watchdog stopped" -ForegroundColor Yellow
    Write-Host "Total restarts: Backend=$($script:restartCount.Backend), Frontend=$($script:restartCount.Frontend)" -ForegroundColor Gray
}
