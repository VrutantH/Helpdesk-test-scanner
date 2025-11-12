# Test Student Portal Setup

Write-Host "Testing Student Portal Configuration..." -ForegroundColor Cyan

# Get project branding
Write-Host "`n1. Testing Project Branding API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/projects/branding/studentassistcenter" -Method Get
    Write-Host "✓ Branding API working:" -ForegroundColor Green
    Write-Host "  Project: $($response.data.name)"
    Write-Host "  Custom URL: $($response.data.customUrlPath)"
    Write-Host "  Project ID: $($response.data.projectId)"
    $projectId = $response.data.projectId
} catch {
    Write-Host "✗ Branding API failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Get ticket submission settings
Write-Host "`n2. Testing Ticket Settings API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/projects/$projectId/ticket-settings" -Method Get
    Write-Host "✓ Ticket Settings API working:" -ForegroundColor Green
    Write-Host "  Mode: $($response.mode)"
    Write-Host "  Online Form: $($response.enableOnlineForm)"
    Write-Host "  Offline Centers: $($response.enableOfflineCenter)"
    Write-Host "  Form Fields: $($response.onlineFormFields.Count)"
    Write-Host "  Centers: $($response.offlineCenters.Count)"
} catch {
    Write-Host "✗ Ticket Settings API failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n✓ All APIs are working correctly!" -ForegroundColor Green
Write-Host "`nYou can now access the student portal at:" -ForegroundColor Cyan
Write-Host "  http://localhost:3001/studentassistcenter/submit-ticket" -ForegroundColor White

Write-Host "`nNote: Default form fields are being used since none were configured yet." -ForegroundColor Yellow
Write-Host "To customize form fields and add offline centers:" -ForegroundColor Yellow
Write-Host "  1. Go to http://localhost:3001/projects" -ForegroundColor White
Write-Host "  2. Edit the 'Student Assist Center' project" -ForegroundColor White
Write-Host "  3. Add ticket submission settings" -ForegroundColor White
