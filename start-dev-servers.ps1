# SAC Helpdesk - Development Server Starter with Auto-Restart
# This script starts both backend and frontend servers and keeps them running

Write-Host "🚀 SAC Helpdesk - Starting Development Servers" -ForegroundColor Cyan
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

# Function to kill process on a port
function Stop-ProcessOnPort {
    param([int]$Port, [string]$Name)
    
    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
               Select-Object -ExpandProperty OwningProcess -First 1
    
    if ($process) {
        Write-Host "⚠️  Stopping existing $Name process on port $Port (PID: $process)" -ForegroundColor Yellow
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Write-Host "✅ Port $Port is now free" -ForegroundColor Green
    }
}

# Kill any existing processes on ports 3003 and 3001
Stop-ProcessOnPort -Port 3003 -Name "Backend"
Stop-ProcessOnPort -Port 3001 -Name "Frontend"

Write-Host ""
Write-Host "📦 Starting Backend Server (Port 3003)..." -ForegroundColor Yellow

# Start backend in a new PowerShell window
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '🔧 Backend Server' -ForegroundColor Green; npm run dev" -WindowStyle Normal

Write-Host "✅ Backend server starting..." -ForegroundColor Green
Start-Sleep -Seconds 3

# Check if backend started successfully
if (Test-Port -Port 3003) {
    Write-Host "✅ Backend is running on http://localhost:3003" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend may still be starting... Check the backend terminal window" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Starting Frontend Server (Port 3001)..." -ForegroundColor Yellow

# Start frontend in a new PowerShell window
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '🎨 Frontend Server' -ForegroundColor Green; npm run dev" -WindowStyle Normal

Write-Host "✅ Frontend server starting..." -ForegroundColor Green
Start-Sleep -Seconds 3

# Check if frontend started successfully
if (Test-Port -Port 3001) {
    Write-Host "✅ Frontend is running on http://localhost:3001" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend may still be starting... Check the frontend terminal window" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "✅ Development servers started!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Access URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3001" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3003/api" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Don't close the backend/frontend terminal windows!" -ForegroundColor Yellow
Write-Host "   They will show real-time logs and errors" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  To run database scripts without killing servers:" -ForegroundColor Yellow
Write-Host "   Use: .\run-script.ps1 <script-name>" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this launcher..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
