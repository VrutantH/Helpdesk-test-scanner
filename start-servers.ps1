# Start both backend and frontend servers in separate windows

Write-Host "Starting SAC Helpdesk servers..." -ForegroundColor Green

# Start Backend Server
$backendPath = "D:\Niraj\SAC\SAC Helpdesk\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Starting Backend Server...' -ForegroundColor Cyan; npm run dev"

# Wait a moment
Start-Sleep -Seconds 2

# Start Frontend Server
$frontendPath = "D:\Niraj\SAC\SAC Helpdesk\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Starting Frontend Server...' -ForegroundColor Cyan; npm run dev"

Write-Host "`n✅ Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host "Backend: http://localhost:3003" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3001" -ForegroundColor Yellow
Write-Host "`nDo NOT close the PowerShell windows!" -ForegroundColor Red
