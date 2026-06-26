$content = Get-Content -Path 'app.js' -Raw -Encoding UTF8
$techMatches = [regex]::Matches($content, 'name: "([^"]+)"')
$bookTechMatches = [regex]::Matches($content, 'technique: \["([^"]+)"(?:, *"([^"]+)")?\]')

$techNames = @()
foreach ($m in $techMatches) {
    $techNames += $m.Groups[1].Value
}

$bookTechs = @()
foreach ($m in $bookTechMatches) {
    $bookTechs += $m.Groups[1].Value
    if ($m.Groups[2].Success) {
        $bookTechs += $m.Groups[2].Value
    }
}

Write-Output "Total Techs Found: $($techNames.Count)"
foreach ($t in $techNames) {
    if ($t -match '토론 형식 비교') { continue }
    $prefix = ($t -split ' ')[0]
    $found = $false
    foreach ($bt in $bookTechs) {
        if ($bt -match $prefix) {
            $found = $true
            break
        }
    }
    if (-not $found) {
        Write-Output "MISSING: $t (Prefix: $prefix)"
    }
}
