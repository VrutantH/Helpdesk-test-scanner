# Environment Status Checker
# Shows current environment configuration

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Environment Status Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = $PSScriptRoot
$backendEnvPath = Join-Path $rootPath "backend\.env"
$frontendEnvPath = Join-Path $rootPath "frontend\.env"

# Check Backend Environment
Write-Host "🔧 BACKEND Configuration:" -ForegroundColor Yellow
if (Test-Path $backendEnvPath) {
    $backendContent = Get-Content $backendEnvPath -Raw
    
    if ($backendContent -match 'NODE_ENV=(\w+)') {
        $nodeEnv = $matches[1]
        if ($nodeEnv -eq 'development') {
            Write-Host "   NODE_ENV: " -NoNewline -ForegroundColor Gray
            Write-Host "development" -ForegroundColor Green
            Write-Host "   Database: MongoDB Local (localhost:27017)" -ForegroundColor Gray
            Write-Host "   CORS:     localhost:3001, localhost:3003" -ForegroundColor Gray
        } else {
            Write-Host "   NODE_ENV: " -NoNewline -ForegroundColor Gray
            Write-Host "production" -ForegroundColor Cyan
            Write-Host "   Database: MongoDB Production (34.14.157.13:27017)" -ForegroundColor Gray
            Write-Host "   CORS:     helpdesk.hubblehox.ai" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "   ❌ backend/.env not found" -ForegroundColor Red
}

Write-Host ""

# Check Frontend Environment
Write-Host "🎨 FRONTEND Configuration:" -ForegroundColor Yellow
if (Test-Path $frontendEnvPath) {
    $frontendContent = Get-Content $frontendEnvPath -Raw
    
    # Check if VITE_API_BASE_URL is uncommented
    if ($frontendContent -match '^VITE_API_BASE_URL=(.+)$' -and $frontendContent -notmatch '^#\s*VITE_API_BASE_URL=(.+)$') {
        $apiUrl = $matches[1]
        Write-Host "   Mode: " -NoNewline -ForegroundColor Gray
        Write-Host "FIXED URL (Not Auto-Detecting)" -ForegroundColor Yellow
        Write-Host "   API URL: $apiUrl" -ForegroundColor Gray
        Write-Host ""
        Write-Host "   ⚠️  WARNING: Auto-detection is disabled!" -ForegroundColor Red
        Write-Host "   This URL will be used regardless of hostname" -ForegroundColor Yellow
    } else {
        Write-Host "   Mode: " -NoNewline -ForegroundColor Gray
        Write-Host "AUTO-DETECTION" -ForegroundColor Green
        Write-Host "   Will use:" -ForegroundColor Gray
        Write-Host "     - localhost       → http://localhost:3003" -ForegroundColor Gray
        Write-Host "     - production URL  → https://helpdesk.hubblehox.ai" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ frontend/.env not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Quick action suggestions
if ($backendContent -match 'NODE_ENV=development') {
    Write-Host "💡 Current Mode: DEVELOPMENT (Local)" -ForegroundColor Green
    Write-Host ""
    Write-Host "To switch to production:" -ForegroundColor Gray
    Write-Host "   .\switch-environment.ps1 production" -ForegroundColor White
} else {
    Write-Host "💡 Current Mode: PRODUCTION" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To switch to development:" -ForegroundColor Gray
    Write-Host "   .\switch-environment.ps1 development" -ForegroundColor White
}

Write-Host ""
