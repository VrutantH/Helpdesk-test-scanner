# Add API_CONFIG imports to all files using it

$files = Get-ChildItem -Path "frontend\src" -Include *.tsx,*.ts -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if file uses API_CONFIG but doesn't have the import
    if ($content -match 'API_CONFIG' -and $content -notmatch "import.*API_CONFIG.*from.*config/constants") {
        Write-Host "Adding import to: $($file.Name)"
        
        # Find the last import statement
        $lines = Get-Content $file.FullName
        $lastImportLine = -1
        
        for ($i = 0; $i -lt $lines.Length; $i++) {
            if ($lines[$i] -match "^import ") {
                $lastImportLine = $i
            }
        }
        
        if ($lastImportLine -ge 0) {
            # Calculate relative path to config
            $relativePath = $file.DirectoryName -replace [regex]::Escape((Get-Item "frontend\src").FullName), ""
            $depth = ($relativePath -split '\\').Length - 1
            $pathPrefix = if ($depth -eq 0) { "./" } else { ("../" * $depth) }
            
            # Add import after last import
            $lines = @(
                $lines[0..$lastImportLine]
                "import { API_CONFIG } from '${pathPrefix}config/constants';"
                $lines[($lastImportLine + 1)..($lines.Length - 1)]
            )
            
            $lines | Set-Content $file.FullName
            Write-Host "  Added import with path: ${pathPrefix}config/constants"
        }
    }
}

Write-Host "`nImports added!"
