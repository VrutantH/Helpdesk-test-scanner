# SAC Helpdesk - Forever Running Dev Servers
# This keeps servers running even if terminal is closed (background mode)

Write-Host "🚀 SAC Helpdesk - Background Server Starter" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  This will start servers in BACKGROUND MODE" -ForegroundColor Yellow
Write-Host "   - Servers will keep running even if you close terminals" -ForegroundColor Yellow
Write-Host "   - Use check-servers.ps1 to see status" -ForegroundColor Yellow
Write-Host "   - Use stop-servers.ps1 to stop them" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Continue? (Y/N)"
if ($confirm -ne 'Y' -and $confirm -ne 'y') {
    Write-Host "Cancelled" -ForegroundColor Gray
    exit
}

Write-Host ""

# Function to kill process on a port
function Stop-ProcessOnPort {
    param([int]$Port, [string]$Name)
    
    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
               Select-Object -ExpandProperty OwningProcess -First 1
    
    if ($process) {
        Write-Host "⚠️  Stopping existing $Name on port $Port" -ForegroundColor Yellow
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

# Clean up ports
Stop-ProcessOnPort -Port 3003 -Name "Backend"
Stop-ProcessOnPort -Port 3001 -Name "Frontend"

Write-Host "📦 Starting Backend Server..." -ForegroundColor Yellow

# Start backend in background with window hidden
$backendPath = Join-Path $PSScriptRoot "backend"
$backendJob = Start-Process powershell -ArgumentList `
    "-WindowStyle", "Hidden", `
    "-Command", "cd '$backendPath'; npm run dev" `
    -PassThru

Write-Host "✅ Backend started (PID: $($backendJob.Id))" -ForegroundColor Green
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "📦 Starting Frontend Server..." -ForegroundColor Yellow

# Start frontend in background with window hidden
$frontendPath = Join-Path $PSScriptRoot "frontend"
$frontendJob = Start-Process powershell -ArgumentList `
    "-WindowStyle", "Hidden", `
    "-Command", "cd '$frontendPath'; npm run dev" `
    -PassThru

Write-Host "✅ Frontend started (PID: $($frontendJob.Id))" -ForegroundColor Green
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "✅ Servers running in background!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Access URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3001" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3003/api" -ForegroundColor White
Write-Host ""
Write-Host "💡 Management Commands:" -ForegroundColor Yellow
Write-Host "   Check status: .\check-servers.ps1" -ForegroundColor White
Write-Host "   Stop servers: .\stop-servers.ps1" -ForegroundColor White
Write-Host "   View logs:    Check Task Manager > Details > node.exe processes" -ForegroundColor White
Write-Host ""

# Save PIDs to file for stop script
@{
    BackendPID = $backendJob.Id
    FrontendPID = $frontendJob.Id
    StartTime = Get-Date
} | ConvertTo-Json | Out-File "$PSScriptRoot\.server-pids.json"

Write-Host "✅ Server PIDs saved for management" -ForegroundColor Green
Write-Host ""
