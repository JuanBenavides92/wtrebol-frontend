# Script PowerShell para reemplazar TODAS las URLs hardcodeadas

$files = Get-ChildItem -Path "src" -Recurse -Include *.tsx,*.ts,*.jsx,*.js

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Reemplazos específicos de endpoints
    $replacements = @(
        @{Pattern = "'http://localhost:5000/api/content/service\?active=true'"; Replacement = "API_CONFIG.url(API_CONFIG.ENDPOINTS.SERVICES + '?active=true')"}
        @{Pattern = "'http://localhost:5000/api/appointment-settings'"; Replacement = "API_CONFIG.url(API_CONFIG.ENDPOINTS.APPOINTMENT_SETTINGS)"}
        @{Pattern = "'http://localhost:5000/api/appointments'"; Replacement = "API_CONFIG.url(API_CONFIG.ENDPOINTS.APPOINTMENTS)"}
        @{Pattern = "'http://localhost:5000/api/time-blocks'"; Replacement = "API_CONFIG.url(API_CONFIG.ENDPOINTS.TIME_BLOCKS)"}
        @{Pattern = "'http://localhost:5000/api/technicians\?active=true'"; Replacement = "API_CONFIG.url(API_CONFIG.ENDPOINTS.TECHNICIANS + '?active=true')"}
        @{Pattern = "`"http://localhost:5000/api/appointments/\$\{appointmentId\}`""; Replacement = "API_CONFIG.url(`"`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/`${appointmentId}`"")"}
        @{Pattern = "`"http://localhost:5000/api/time-blocks/\$\{blockId\}`""; Replacement = "API_CONFIG.url(`"`${API_CONFIG.ENDPOINTS.TIME_BLOCKS}/`${blockId}`"")"}
        @{Pattern = "`"http://localhost:5000/api/time-blocks/\$\{block._id\}`""; Replacement = "API_CONFIG.url(`"`${API_CONFIG.ENDPOINTS.TIME_BLOCKS}/`${block._id}`"")"}
        @{Pattern = "`"http://localhost:5000/api/appointments/\$\{apt._id\}`""; Replacement = "API_CONFIG.url(`"`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/`${apt._id}`"")"}
        @{Pattern = "`"http://localhost:5000/api/appointments/\$\{id\}`""; Replacement = "API_CONFIG.url(`"`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/`${id}`"")"}
        @{Pattern = "`"http://localhost:5000/api/public/available-slots\?date=\$\{formData.scheduledDate\}&serviceType=\$\{formData.type\}`""; Replacement = "API_CONFIG.url(`"`${API_CONFIG.ENDPOINTS.AVAILABLE_SLOTS}?date=`${formData.scheduledDate}&serviceType=`${formData.type}`"")"}
    )
    
    foreach ($rep in $replacements) {
        if ($content -match [regex]::Escape($rep.Pattern)) {
            $content = $content -replace [regex]::Escape($rep.Pattern), $rep.Replacement
            $modified = $true
        }
    }
    
    if ($modified) {
        # Agregar import si no existe
        if ($content -notmatch "import API_CONFIG from '@/lib/config'") {
            $content = $content -replace "('use client';[\r\n]+)", "`$1`nimport API_CONFIG from '@/lib/config';`n"
        }
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "✅ Updated: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`n✨ Migration complete!" -ForegroundColor Cyan
