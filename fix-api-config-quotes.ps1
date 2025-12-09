# Fix single quotes to backticks for API_CONFIG URLs only
$files = Get-ChildItem -Path "frontend/src" -Recurse -Include "*.tsx","*.ts"
$fixedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Replace '${API_CONFIG.API_URL}/... with `${API_CONFIG.API_URL}/...`
    $content = $content -replace "'(\`$\{API_CONFIG\.API_URL\}[^']*)'", '`$1`'
    $content = $content -replace "'(\`$\{API_CONFIG\.BASE_URL\}[^']*)'", '`$1`'
    $content = $content -replace "'(\`$\{API_CONFIG\.WS_URL\}[^']*)'", '`$1`'
    
    if ($content -ne $originalContent) {
        try {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "Fixed: $($file.Name)"
            $fixedCount++
        } catch {
            Write-Host "Error fixing $($file.Name): $_" -ForegroundColor Red
        }
    }
}

Write-Host "`nFixed $fixedCount files" -ForegroundColor Green
