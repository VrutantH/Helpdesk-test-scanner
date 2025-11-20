# SAC Helpdesk - Server Status Checker and Auto-Restarter

Write-Host "🔍 SAC Helpdesk - Server Status Check" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        return $null -ne $connection
    } catch {
        return $false
    }
}

# Function to get process info for a port
function Get-PortProcess {
    param([int]$Port)
    try {
        $processId = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                     Select-Object -ExpandProperty OwningProcess -First 1
        
        if ($processId) {
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            return @{
                PID = $processId
                Name = $process.ProcessName
                StartTime = $process.StartTime
                Memory = [math]::Round($process.WorkingSet64 / 1MB, 2)
            }
        }
        return $null
    } catch {
        return $null
    }
}

# Check Backend (Port 3003)
Write-Host "🔧 Backend Server (Port 3003):" -ForegroundColor Yellow
$backendProcess = Get-PortProcess -Port 3003

if ($backendProcess) {
    Write-Host "   Status: ✅ RUNNING" -ForegroundColor Green
    Write-Host "   PID: $($backendProcess.PID)"
    Write-Host "   Process: $($backendProcess.Name)"
    Write-Host "   Started: $($backendProcess.StartTime)"
    Write-Host "   Memory: $($backendProcess.Memory) MB"
    $backendRunning = $true
} else {
    Write-Host "   Status: ❌ NOT RUNNING" -ForegroundColor Red
    $backendRunning = $false
}

Write-Host ""

# Check Frontend (Port 3001)
Write-Host "🎨 Frontend Server (Port 3001):" -ForegroundColor Yellow
$frontendProcess = Get-PortProcess -Port 3001

if ($frontendProcess) {
    Write-Host "   Status: ✅ RUNNING" -ForegroundColor Green
    Write-Host "   PID: $($frontendProcess.PID)"
    Write-Host "   Process: $($frontendProcess.Name)"
    Write-Host "   Started: $($frontendProcess.StartTime)"
    Write-Host "   Memory: $($frontendProcess.Memory) MB"
    $frontendRunning = $true
} else {
    Write-Host "   Status: ❌ NOT RUNNING" -ForegroundColor Red
    $frontendRunning = $false
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan

# Offer to restart if any server is down
if (-not $backendRunning -or -not $frontendRunning) {
    Write-Host ""
    Write-Host "⚠️  Some servers are not running!" -ForegroundColor Yellow
    Write-Host ""
    
    $restart = Read-Host "Would you like to start the servers now? (Y/N)"
    
    if ($restart -eq 'Y' -or $restart -eq 'y') {
        Write-Host ""
        Write-Host "🚀 Starting servers..." -ForegroundColor Green
        
        $startScript = Join-Path $PSScriptRoot "start-dev-servers.ps1"
        if (Test-Path $startScript) {
            & $startScript
        } else {
            Write-Host "❌ start-dev-servers.ps1 not found!" -ForegroundColor Red
            Write-Host ""
            Write-Host "Manual start commands:" -ForegroundColor Yellow
            Write-Host "   Backend:  cd backend; npm run dev" -ForegroundColor White
            Write-Host "   Frontend: cd frontend; npm run dev" -ForegroundColor White
        }
    }
} else {
    Write-Host ""
    Write-Host "✅ All servers are running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Access URLs:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:3001" -ForegroundColor White
    Write-Host "   Backend:  http://localhost:3003/api" -ForegroundColor White
}

Write-Host ""
