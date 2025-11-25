# Script to replace all hardcoded localhost URLs with API_CONFIG

$files = Get-ChildItem -Path "frontend\src" -Include *.tsx,*.ts -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Replace http://localhost:3003/api with ${API_CONFIG.API_URL}
    $content = $content -replace "http://localhost:3003/api", '${API_CONFIG.API_URL}'
    
    # Replace 'http://localhost:3003/api with `${API_CONFIG.API_URL}
    $content = $content -replace "'http://localhost:3003/api", '`${API_CONFIG.API_URL}'
    
    # Replace "http://localhost:3003/api with `${API_CONFIG.API_URL}
    $content = $content -replace '"http://localhost:3003/api', '`${API_CONFIG.API_URL}'
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.FullName)"
        
        # Check if file already has the import
        $fileContent = Get-Content $file.FullName -Raw
        if ($fileContent -match 'API_CONFIG' -and $fileContent -notmatch "import.*API_CONFIG.*from.*config/constants") {
            Write-Host "  WARNING: File uses API_CONFIG but missing import: $($file.Name)"
        }
    }
}

Write-Host "`nReplacement complete!"
Write-Host "Note: You may need to manually add imports where missing:"
Write-Host "import { API_CONFIG } from '../config/constants';"
