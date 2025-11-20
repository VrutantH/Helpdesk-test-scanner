# SAC Helpdesk - Ultra-Stable Development Server Starter
# Uses concurrently to run both servers in one terminal with auto-restart

Write-Host "🚀 SAC Helpdesk - Starting Ultra-Stable Dev Servers" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""

# Check if concurrently is installed globally
$hasC oncurrently = npm list -g concurrently 2>$null
if (-not $hasConcurrently) {
    Write-Host "📦 Installing concurrently globally for better dev experience..." -ForegroundColor Yellow
    npm install -g concurrently --silent
    Write-Host "✅ Concurrently installed" -ForegroundColor Green
    Write-Host ""
}

# Function to kill process on a port
function Stop-ProcessOnPort {
    param([int]$Port, [string]$Name)
    
    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
               Select-Object -ExpandProperty OwningProcess -First 1
    
    if ($process) {
        Write-Host "⚠️  Stopping existing $Name on port $Port (PID: $process)" -ForegroundColor Yellow
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

# Clean up ports
Stop-ProcessOnPort -Port 3003 -Name "Backend"
Stop-ProcessOnPort -Port 3001 -Name "Frontend"

Write-Host "🔧 Starting both servers..." -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tip: This terminal will show logs from both servers" -ForegroundColor Yellow
Write-Host "   - Backend logs will be prefixed with [BACKEND]" -ForegroundColor Cyan
Write-Host "   - Frontend logs will be prefixed with [FRONTEND]" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  DO NOT close this terminal - servers will stop!" -ForegroundColor Yellow
Write-Host "   Press Ctrl+C to stop both servers" -ForegroundColor Gray
Write-Host ""
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""

# Run both servers concurrently with colored output
npx concurrently `
    --names "BACKEND,FRONTEND" `
    --prefix-colors "cyan,magenta" `
    --kill-others `
    "cd backend && npm run dev" `
    "cd frontend && npm run dev"

Write-Host ""
Write-Host "🛑 Servers stopped" -ForegroundColor Red
