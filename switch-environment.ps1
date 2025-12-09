# Environment Configuration Switcher
# Switches between development (localhost) and production (helpdesk.hubblehox.ai)

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('development', 'production')]
    [string]$Environment
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Environment Switcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = $PSScriptRoot
$backendEnvPath = Join-Path $rootPath "backend\.env"
$frontendEnvPath = Join-Path $rootPath "frontend\.env"

if ($Environment -eq 'development') {
    Write-Host "🔧 Switching to DEVELOPMENT mode..." -ForegroundColor Yellow
    Write-Host ""
    
    # Update Backend .env
    Write-Host "📝 Updating backend/.env..." -ForegroundColor Gray
    $backendContent = Get-Content $backendEnvPath -Raw
    $backendContent = $backendContent -replace 'NODE_ENV=production', 'NODE_ENV=development'
    Set-Content -Path $backendEnvPath -Value $backendContent -NoNewline
    Write-Host "   ✅ Backend set to development mode" -ForegroundColor Green
    
    # Update Frontend .env (ensure variables are commented out for auto-detection)
    Write-Host "📝 Updating frontend/.env..." -ForegroundColor Gray
    $frontendContent = @"
# ============================================================================
# Environment Variables - Single .env file
# ============================================================================
# LEAVE THESE COMMENTED for automatic environment detection
# The app will auto-detect based on current hostname:
# - If on localhost -> uses http://localhost:3003
# - If on helpdesk.hubblehox.ai -> uses https://helpdesk.hubblehox.ai

# API Base URL (LEAVE COMMENTED for auto-detection)
# VITE_API_BASE_URL=https://helpdesk.hubblehox.ai
# VITE_API_BASE_URL=http://localhost:3003

# WebSocket URL (LEAVE COMMENTED for auto-detection)
# VITE_WS_URL=wss://helpdesk.hubblehox.ai
# VITE_WS_URL=ws://localhost:3003
"@
    Set-Content -Path $frontendEnvPath -Value $frontendContent -NoNewline
    Write-Host "   ✅ Frontend set to auto-detect mode" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "✅ DEVELOPMENT MODE ACTIVATED" -ForegroundColor Green
    Write-Host ""
    Write-Host "Configuration:" -ForegroundColor Yellow
    Write-Host "   Backend:  NODE_ENV=development" -ForegroundColor White
    Write-Host "   Database: MongoDB Local (localhost:27017)" -ForegroundColor White
    Write-Host "   CORS:     localhost:3001, localhost:3003" -ForegroundColor White
    Write-Host "   Frontend: Auto-detects based on hostname" -ForegroundColor White
    Write-Host ""
    Write-Host "Access URLs:" -ForegroundColor Yellow
    Write-Host "   Frontend: http://localhost:3001" -ForegroundColor Cyan
    Write-Host "   Backend:  http://localhost:3003" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⚠️  Restart both servers for changes to take effect:" -ForegroundColor Red
    Write-Host "   Backend:  cd backend && npm run dev" -ForegroundColor White
    Write-Host "   Frontend: cd frontend && npm run dev" -ForegroundColor White
    
} elseif ($Environment -eq 'production') {
    Write-Host "🚀 Switching to PRODUCTION mode..." -ForegroundColor Yellow
    Write-Host ""
    
    # Update Backend .env
    Write-Host "📝 Updating backend/.env..." -ForegroundColor Gray
    $backendContent = Get-Content $backendEnvPath -Raw
    $backendContent = $backendContent -replace 'NODE_ENV=development', 'NODE_ENV=production'
    Set-Content -Path $backendEnvPath -Value $backendContent -NoNewline
    Write-Host "   ✅ Backend set to production mode" -ForegroundColor Green
    
    # Frontend .env stays the same (auto-detection works for both)
    Write-Host "📝 Frontend .env unchanged (auto-detection enabled)" -ForegroundColor Gray
    Write-Host "   ✅ Frontend will auto-detect production domain" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "✅ PRODUCTION MODE ACTIVATED" -ForegroundColor Green
    Write-Host ""
    Write-Host "Configuration:" -ForegroundColor Yellow
    Write-Host "   Backend:  NODE_ENV=production" -ForegroundColor White
    Write-Host "   Database: MongoDB Production (34.14.157.13:27017)" -ForegroundColor White
    Write-Host "   CORS:     helpdesk.hubblehox.ai" -ForegroundColor White
    Write-Host "   Frontend: Auto-detects based on hostname" -ForegroundColor White
    Write-Host ""
    Write-Host "Access URLs:" -ForegroundColor Yellow
    Write-Host "   Frontend: https://helpdesk.hubblehox.ai" -ForegroundColor Cyan
    Write-Host "   Backend:  https://helpdesk.hubblehox.ai/api" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⚠️  IMPORTANT Security Checklist:" -ForegroundColor Red
    Write-Host "   [ ] JWT_SECRET is strong and unique" -ForegroundColor Yellow
    Write-Host "   [ ] JWT_REFRESH_SECRET is strong and unique" -ForegroundColor Yellow
    Write-Host "   [ ] MongoDB credentials are correct" -ForegroundColor Yellow
    Write-Host "   [ ] SSL/HTTPS is configured" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📦 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Build: .\deploy-production.ps1" -ForegroundColor White
    Write-Host "   2. Deploy to server" -ForegroundColor White
    Write-Host "   3. Restart PM2: pm2 restart ecosystem.config.js" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
