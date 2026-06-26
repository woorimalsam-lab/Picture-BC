$text = Get-Content app.js -Raw
$matches = [regex]::Matches($text, '`')
Write-Output "Backtick count: $($matches.Count)"
