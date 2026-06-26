$app = Get-Content app.js -Encoding UTF8
$techs = Get-Content new_techs.js -Raw -Encoding UTF8

$startIndex = -1
$endIndex = -1

for ($i = 0; $i -lt $app.Length; $i++) {
    if ($app[$i] -match '^const techniques = \[') {
        $startIndex = $i
    }
    if ($startIndex -ne -1 -and $app[$i] -match '^\];') {
        $endIndex = $i
        break
    }
}

# In case app.js is already truncated, I will read the original from current_techs.js extraction if needed.
# But wait! app.js is already truncated! I need to recover the missing lines from the original app.js.
