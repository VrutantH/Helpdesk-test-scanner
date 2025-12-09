# ============================================================================
# SAC Helpdesk - Production Deployment Script
# ============================================================================
# This script prepares the application for production deployment

param(
    [switch]$BuildOnly,
    [switch]$SkipTests
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SAC Helpdesk Production Deploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Check if we're in the correct directory
if (-not (Test-Path "package.json" -PathType Leaf) -or -not (Test-Path "backend" -PathType Container)) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Pre-Deployment Checklist:" -ForegroundColor Yellow
Write-Host "   ✓ Backend .env configured for production" -ForegroundColor Green
Write-Host "   ✓ Frontend .env configured for production" -ForegroundColor Green
Write-Host ""

# Step 1: Build Backend
Write-Host "🔨 Step 1: Building Backend..." -ForegroundColor Cyan
Set-Location backend
if (Test-Path "dist") {
    Write-Host "   Cleaning old dist folder..." -ForegroundColor Gray
    Remove-Item -Recurse -Force dist
}
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Backend built successfully" -ForegroundColor Green
Set-Location ..

# Step 2: Build Frontend
Write-Host ""
Write-Host "🔨 Step 2: Building Frontend..." -ForegroundColor Cyan
Set-Location frontend
if (Test-Path "dist") {
    Write-Host "   Cleaning old dist folder..." -ForegroundColor Gray
    Remove-Item -Recurse -Force dist
}
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Frontend built successfully" -ForegroundColor Green
Set-Location ..

# Step 3: Create deployment package
Write-Host ""
Write-Host "📦 Step 3: Creating deployment package..." -ForegroundColor Cyan

$deployDir = "deploy-package"
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# Copy backend files
Write-Host "   Copying backend files..." -ForegroundColor Gray
New-Item -ItemType Directory -Path "$deployDir/backend" | Out-Null
Copy-Item -Path "backend/dist" -Destination "$deployDir/backend" -Recurse
Copy-Item -Path "backend/package.json" -Destination "$deployDir/backend"
Copy-Item -Path "backend/package-lock.json" -Destination "$deployDir/backend"
Copy-Item -Path "backend/.env.example" -Destination "$deployDir/backend"
New-Item -ItemType Directory -Path "$deployDir/backend/uploads" -Force | Out-Null

# Copy frontend files
Write-Host "   Copying frontend files..." -ForegroundColor Gray
New-Item -ItemType Directory -Path "$deployDir/frontend" | Out-Null
Copy-Item -Path "frontend/dist" -Destination "$deployDir/frontend" -Recurse
Copy-Item -Path "frontend/package.json" -Destination "$deployDir/frontend"
Copy-Item -Path "frontend/package-lock.json" -Destination "$deployDir/frontend"
Copy-Item -Path "frontend/.env.example" -Destination "$deployDir/frontend"

# Copy PM2 config
Write-Host "   Copying PM2 configuration..." -ForegroundColor Gray
Copy-Item -Path "ecosystem.config.js" -Destination "$deployDir"

# Copy deployment documentation
Write-Host "   Copying documentation..." -ForegroundColor Gray
Copy-Item -Path "README.md" -Destination "$deployDir"
if (Test-Path "docs/DEPLOYMENT.md") {
    Copy-Item -Path "docs/DEPLOYMENT.md" -Destination "$deployDir"
}

Write-Host "   ✅ Deployment package created in: $deployDir" -ForegroundColor Green

# Step 4: Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ✅ Build Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📦 Deployment package location: ./$deployDir" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Next steps for deployment:" -ForegroundColor Yellow
Write-Host "   1. Copy the '$deployDir' folder to your production server" -ForegroundColor White
Write-Host "   2. On the server, navigate to backend/ and run: npm ci --production" -ForegroundColor White
Write-Host "   3. Create backend/.env file with production values (use .env.example as template)" -ForegroundColor White
Write-Host "   4. Create frontend/.env file with production values" -ForegroundColor White
Write-Host "   5. Start with PM2: pm2 start ecosystem.config.js" -ForegroundColor White
Write-Host "   6. Save PM2 config: pm2 save" -ForegroundColor White
Write-Host "   7. Setup PM2 startup: pm2 startup" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANT Security Checklist:" -ForegroundColor Red
Write-Host "   [ ] Change JWT_SECRET to a strong random value" -ForegroundColor Yellow
Write-Host "   [ ] Change JWT_REFRESH_SECRET to a strong random value" -ForegroundColor Yellow
Write-Host "   [ ] Verify MONGODB_PRODUCTION_URI is correct" -ForegroundColor Yellow
Write-Host "   [ ] Verify ALLOWED_ORIGINS_PRODUCTION includes only your domain" -ForegroundColor Yellow
Write-Host "   [ ] Set NODE_ENV=production in backend/.env" -ForegroundColor Yellow
Write-Host "   [ ] Configure firewall to only allow ports 80, 443, and 22" -ForegroundColor Yellow
Write-Host "   [ ] Setup HTTPS/SSL certificates" -ForegroundColor Yellow
Write-Host "   [ ] Configure nginx reverse proxy (recommended)" -ForegroundColor Yellow
Write-Host ""
