$app = Get-Content app.js -Encoding UTF8
$techs = $app[3..541]
[System.IO.File]::WriteAllLines('current_techs.js', $techs, [System.Text.Encoding]::UTF8)
