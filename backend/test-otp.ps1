$body = @{
    mobile = "9769406488"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/auth/forgot-password/send-otp" -Method POST -ContentType "application/json" -Body $body
    Write-Host "Success:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body:" $responseBody
    }
}