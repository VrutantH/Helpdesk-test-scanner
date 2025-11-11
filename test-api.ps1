$body = @{
    mobile = "9769406488"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "Testing Forgot Password API..."
Write-Host "Sending request to: http://localhost:3003/api/auth/forgot-password/send-otp"
Write-Host "Body: $body"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/auth/forgot-password/send-otp" -Method POST -Headers $headers -Body $body
    Write-Host "`n✅ Success!"
    Write-Host "`nResponse:"
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "`n❌ Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    }
}
