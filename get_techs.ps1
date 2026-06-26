$content = Get-Content -Path 'app.js' -Raw -Encoding UTF8
$matches = [regex]::Matches($content, '(?s)title:\s*"([^"]+)",.*?technique:\s*"([^"]+)"')
foreach ($m in $matches) {
    Write-Output "$($m.Groups[1].Value) = $($m.Groups[2].Value)"
}
