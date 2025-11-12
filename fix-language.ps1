# PowerShell script to fix all language ternaries in the codebase

$frontendPath = "D:\Niraj\SAC\SAC Helpdesk\frontend\src"

# Get all .tsx and .ts files (excluding node_modules)
$files = Get-ChildItem -Path $frontendPath -Recurse -Include *.tsx,*.ts -Exclude *.d.ts,language.ts | 
    Where-Object { $_.FullName -notlike "*node_modules*" }

Write-Host "Found $($files.Count) files to process"

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)"
    
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Replace all instances of: i18n.language === 'en' ? 'text' : 'मराठी/हिंदी'
    # This regex will match the pattern and we'll need to manually review critical ones
    
    # For now, let's just add the import statement if it uses i18n.language
    if ($content -match "i18n\.language === 'en'") {
        # Check if language utility import exists
        if ($content -notmatch "import.*getText.*from.*utils/language") {
            # Add import after other imports
            $importToAdd = "import { getText } from '../utils/language';"
            
            # Find the last import statement
            if ($content -match "(?ms)(import .+ from .+;)\s*\n\s*\n") {
                $content = $content -replace "(import .+ from .+;)(\s*\n\s*\n)", "`$1`n$importToAdd`$2"
            }
        }
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "  Updated: $($file.Name)" -ForegroundColor Green
        }
    }
}

Write-Host "`nDone! Processed $($files.Count) files" -ForegroundColor Cyan
