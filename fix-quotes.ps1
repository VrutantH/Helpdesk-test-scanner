$files = Get-ChildItem -Path "frontend/src" -Recurse -Include "*.tsx","*.ts"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Replace single quotes with backticks for API_CONFIG template literals
    $content = $content -replace "'\$\{API_CONFIG", '`${API_CONFIG'
    $content = $content -replace "([^`])API_CONFIG\.[^}]+\}'", '$1API_CONFIG.API_URL}`'
    $content = $content -replace "([^`])API_CONFIG\.[^}]+\}[^'`]*'", '$1API_CONFIG.BASE_URL}`'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.Name)"
    }
}

Write-Host "`nDone!"
