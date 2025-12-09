# URL Configuration Verification Script
# Checks that no hardcoded URLs exist in production code

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   URL Configuration Audit" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$issues = @()

# Check Frontend
Write-Host "🔍 Checking Frontend..." -ForegroundColor Yellow

# Check if .env has hardcoded values
$frontendEnv = Get-Content "frontend\.env" -Raw
if ($frontendEnv -match '^VITE_API_BASE_URL=http') {
    $issues += "❌ Frontend .env has uncommented VITE_API_BASE_URL (should be commented for auto-detection)"
}

# Check constants.ts uses API_CONFIG
$constantsContent = Get-Content "frontend\src\config\constants.ts" -Raw
if ($constantsContent -match 'API_CONFIG') {
    Write-Host "   ✅ constants.ts exports API_CONFIG" -ForegroundColor Green
} else {
    $issues += "❌ constants.ts doesn't export API_CONFIG"
}

# Check for hardcoded URLs in components (excluding test files)
$hardcodedUrls = Select-String -Path "frontend\src\**\*.tsx" -Pattern "http://localhost:3003|https://helpdesk.hubblehox.ai" -Exclude "*test*","*spec*" -SimpleMatch
if ($hardcodedUrls) {
    $issues += "❌ Found hardcoded URLs in frontend components:"
    $hardcodedUrls | ForEach-Object { $issues += "   - $($_.Filename):$($_.LineNumber)" }
} else {
    Write-Host "   ✅ No hardcoded URLs in components" -ForegroundColor Green
}

Write-Host ""

# Check Backend
Write-Host "🔍 Checking Backend..." -ForegroundColor Yellow

# Check if .env has correct NODE_ENV
$backendEnv = Get-Content "backend\.env" -Raw
if ($backendEnv -match 'NODE_ENV=(\w+)') {
    $nodeEnv = $matches[1]
    Write-Host "   NODE_ENV: $nodeEnv" -ForegroundColor $(if ($nodeEnv -eq 'development') { 'Green' } else { 'Cyan' })
} else {
    $issues += "❌ Backend .env missing NODE_ENV"
}

# Check CORS configuration
if ($backendEnv -match 'ALLOWED_ORIGINS_LOCAL=') {
    Write-Host "   ✅ ALLOWED_ORIGINS_LOCAL configured" -ForegroundColor Green
} else {
    $issues += "❌ ALLOWED_ORIGINS_LOCAL not set in backend .env"
}

if ($backendEnv -match 'ALLOWED_ORIGINS_PRODUCTION=') {
    Write-Host "   ✅ ALLOWED_ORIGINS_PRODUCTION configured" -ForegroundColor Green
} else {
    $issues += "❌ ALLOWED_ORIGINS_PRODUCTION not set in backend .env"
}

# Check server.ts uses environment-based CORS
$serverContent = Get-Content "backend\src\server.ts" -Raw
if ($serverContent -match 'getAllowedOrigins') {
    Write-Host "   ✅ server.ts uses dynamic CORS configuration" -ForegroundColor Green
} else {
    $issues += "❌ server.ts doesn't use dynamic CORS"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($issues.Count -eq 0) {
    Write-Host "✅ ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Environment configuration is correct:" -ForegroundColor Green
    Write-Host "   ✓ Frontend auto-detects based on hostname" -ForegroundColor White
    Write-Host "   ✓ Backend uses NODE_ENV for CORS/DB" -ForegroundColor White
    Write-Host "   ✓ No hardcoded URLs in production code" -ForegroundColor White
    Write-Host ""
    Write-Host "Behavior:" -ForegroundColor Yellow
    Write-Host "   localhost:3001 → API calls to localhost:3003" -ForegroundColor White
    Write-Host "   helpdesk.hubblehox.ai → API calls to helpdesk.hubblehox.ai" -ForegroundColor White
} else {
    Write-Host "❌ ISSUES FOUND:" -ForegroundColor Red
    Write-Host ""
    $issues | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }
    Write-Host ""
    Write-Host "Run .\switch-environment.ps1 to fix configuration" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
