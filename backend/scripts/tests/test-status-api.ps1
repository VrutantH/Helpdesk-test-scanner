# Test Status API endpoints

$baseUrl = "http://localhost:3003"
$projectId = "6908806855106de325cb1354" # Student Assist Center

# Get token (replace with your actual token)
$token = Get-Content "token.txt" -ErrorAction SilentlyContinue
if (-not $token) {
    Write-Host "⚠️  Token not found in token.txt. Please login first." -ForegroundColor Yellow
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Testing Status API Endpoints" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Get all statuses for project
Write-Host "1️⃣  GET all statuses for project..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/statuses/project/$projectId" -Headers $headers -Method Get
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "Found $($response.data.Count) statuses:" -ForegroundColor Green
    $response.data | ForEach-Object {
        $defaultTag = if ($_.isDefault) { " [DEFAULT]" } else { "" }
        $closedTag = if ($_.isClosed) { " [CLOSED]" } else { "" }
        Write-Host "   - $($_.name) ($($_.code))$defaultTag$closedTag - Color: $($_.color)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Create a new status
Write-Host "`n2️⃣  POST new status 'Under Review'..." -ForegroundColor Yellow
$newStatus = @{
    name = "Under Review"
    code = "UNDER_REVIEW"
    color = "#9333ea"
    isDefault = $false
    isClosed = $false
    displayOrder = 10
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/statuses/project/$projectId" -Headers $headers -Method Post -Body $newStatus
    Write-Host "✅ Status created successfully!" -ForegroundColor Green
    $createdId = $response.data._id
    Write-Host "   ID: $createdId" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $createdId = $null
}

# 3. Update the status
if ($createdId) {
    Write-Host "`n3️⃣  PUT update status color..." -ForegroundColor Yellow
    $updateStatus = @{
        name = "Under Review"
        code = "UNDER_REVIEW"
        color = "#ec4899"  # Changed to pink
        isDefault = $false
        isClosed = $false
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/statuses/$createdId" -Headers $headers -Method Put -Body $updateStatus
        Write-Host "✅ Status updated successfully!" -ForegroundColor Green
        Write-Host "   New color: $($response.data.color)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }

    # 4. Get single status
    Write-Host "`n4️⃣  GET single status..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/statuses/$createdId" -Headers $headers -Method Get
        Write-Host "✅ Success!" -ForegroundColor Green
        Write-Host "   Name: $($response.data.name)" -ForegroundColor Cyan
        Write-Host "   Code: $($response.data.code)" -ForegroundColor Cyan
        Write-Host "   Color: $($response.data.color)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }

    # 5. Delete the status
    Write-Host "`n5️⃣  DELETE status..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/statuses/$createdId" -Headers $headers -Method Delete
        Write-Host "✅ Status deleted successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 6. Verify final state
Write-Host "`n6️⃣  GET final statuses list..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/statuses/project/$projectId" -Headers $headers -Method Get
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "Total statuses: $($response.data.Count)" -ForegroundColor Green
    $response.data | ForEach-Object {
        $defaultTag = if ($_.isDefault) { " [DEFAULT]" } else { "" }
        $closedTag = if ($_.isClosed) { " [CLOSED]" } else { "" }
        Write-Host "   - $($_.name) ($($_.code))$defaultTag$closedTag" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
