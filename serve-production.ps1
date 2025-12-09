# Serve Production Build Locally for Testing
# This serves the built frontend from dist/ folder

Write-Host "🚀 Starting Production Frontend Server..." -ForegroundColor Cyan
Write-Host ""

# Check if dist folder exists
if (-not (Test-Path "frontend/dist")) {
    Write-Host "❌ Error: frontend/dist folder not found!" -ForegroundColor Red
    Write-Host "   Run this first: cd frontend && npm run build" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found production build in frontend/dist" -ForegroundColor Green
Write-Host "📦 Installing 'serve' if needed..." -ForegroundColor Gray

# Check if serve is installed globally
$serveInstalled = Get-Command "serve" -ErrorAction SilentlyContinue
if (-not $serveInstalled) {
    Write-Host "   Installing 'serve' globally..." -ForegroundColor Yellow
    npm install -g serve
}

Write-Host ""
Write-Host "🌐 Starting server on port 3001..." -ForegroundColor Cyan
Write-Host ""
Write-Host "   Frontend: http://localhost:3001" -ForegroundColor Green
Write-Host "   Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

Set-Location frontend
npx serve dist -l 3001 -s
