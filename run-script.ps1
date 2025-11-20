# SAC Helpdesk - Safe Script Runner
# Run database scripts without affecting running servers

param(
    [Parameter(Mandatory=$true)]
    [string]$ScriptName,
    
    [Parameter(Mandatory=$false)]
    [string[]]$Arguments
)

Write-Host "🔧 SAC Helpdesk - Script Runner" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
$backendPath = Join-Path $PSScriptRoot "backend"
Set-Location $backendPath

# Check if script exists
$scriptPath = Join-Path $backendPath $ScriptName

if (-not (Test-Path $scriptPath)) {
    Write-Host "❌ Script not found: $ScriptName" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Available scripts:" -ForegroundColor Yellow
    Get-ChildItem -Path $backendPath -Filter "*.js" | 
        Where-Object { $_.Name -notmatch "^(test-|dist)" } |
        ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor White }
    exit 1
}

Write-Host "📄 Running script: $ScriptName" -ForegroundColor Green
Write-Host ""

# Run the script with Node.js (not in the same process as servers)
if ($Arguments) {
    node $scriptPath @Arguments
} else {
    node $scriptPath
}

$exitCode = $LASTEXITCODE

Write-Host ""
if ($exitCode -eq 0) {
    Write-Host "✅ Script completed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Script failed with exit code: $exitCode" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
