# Script para encontrar todas las dependencias faltantes en componentes UI
# y mostrar el comando para instalarlas todas de una vez

Write-Host "🔍 Buscando todas las importaciones en componentes UI..." -ForegroundColor Cyan

# Buscar todas las importaciones externas en archivos de componentes UI
$imports = Get-ChildItem -Path "src\components\ui" -Filter "*.tsx" -Recurse | 
    ForEach-Object {
        Get-Content $_.FullName | Select-String -Pattern 'import.*from\s+[''"]([^@./].*?|@radix-ui/.*?|@dnd-kit/.*?)[''"]' | 
        ForEach-Object {
            if ($_ -match 'from\s+[''"]([^''"]+ )[''""]') {
                $matches[1]
            }
        }
    } | Select-Object -Unique | Sort-Object

Write-Host "`n📦 Paquetes importados en componentes UI:" -ForegroundColor Yellow
$imports | ForEach-Object { Write-Host "  - $_" }

# Leer package.json
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$installed = @($packageJson.dependencies.PSObject.Properties.Name)
$installedDev = @($packageJson.devDependencies.PSObject.Properties.Name)
$allInstalled = $installed + $installedDev

# Encontrar faltantes
$missing = $imports | Where-Object { $_ -notin $allInstalled }

if ($missing.Count -eq 0) {
    Write-Host "`n✅ Todas las dependencias están instaladas!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Dependencias faltantes:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    
    Write-Host "`n💡 Para instalar todas de una vez, ejecuta:" -ForegroundColor Cyan
    Write-Host "npm install $($missing -join ' ')" -ForegroundColor Green
}
