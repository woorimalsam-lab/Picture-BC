$app = Get-Content new_techs.js -Raw -Encoding UTF8
$techsStr = (Get-Content added_techs_tmp.js -Raw -Encoding UTF8)

$app = $app -replace '(?s)\s*\];\s*$', ''
$app = $app + ",\n" + ($techsStr -replace '(?s)^const added_techs = \[\s*', '')

[System.IO.File]::WriteAllText("new_techs.js", $app, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated new_techs.js"
