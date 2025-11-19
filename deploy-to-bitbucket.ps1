# Quick Bitbucket Deployment Script for Windows
# Run this script after setting up your Bitbucket repository

Write-Host "🚀 SAC Helpdesk - Bitbucket Deployment Setup" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: SAC Helpdesk Application"
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}

# Ask for Bitbucket repository URL
$repoUrl = Read-Host "Enter your Bitbucket repository URL (e.g., https://bitbucket.org/username/sac-helpdesk.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ Repository URL is required" -ForegroundColor Red
    exit 1
}

# Check if remote exists
$remoteExists = git remote | Select-String -Pattern "^origin$"

if ($remoteExists) {
    Write-Host "📝 Updating origin remote..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
} else {
    Write-Host "📝 Adding origin remote..." -ForegroundColor Yellow
    git remote add origin $repoUrl
}

# Push to Bitbucket
Write-Host "📤 Pushing to Bitbucket..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

Write-Host ""
Write-Host "✅ Code pushed to Bitbucket successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to Bitbucket → Repository Settings → Pipelines"
Write-Host "2. Enable Pipelines"
Write-Host "3. Add the following Repository Variables:" -ForegroundColor Yellow
Write-Host "   - SSH_USER: Your server SSH username"
Write-Host "   - SSH_HOST: helpdesk.hubblehox.ai"
Write-Host "   - SSH_PRIVATE_KEY: Your SSH private key"
Write-Host "   - SSH_KNOWN_HOSTS: Output of 'ssh-keyscan helpdesk.hubblehox.ai'"
Write-Host ""
Write-Host "4. Review DEPLOYMENT.md for full deployment instructions"
Write-Host ""
Write-Host "🎉 Happy deploying!" -ForegroundColor Green
