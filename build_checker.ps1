$js = Get-Content app.js -Raw -Encoding UTF8
$html = @"
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
    <h1 id="out">Checking...</h1>
    <script>
        const code = `$($js -replace '`\', '\\' -replace '`$', '\$' -replace '`\`', '\`')`;
        try {
            new Function(code);
            document.getElementById('out').innerText = "NO SYNTAX ERROR";
        } catch(e) {
            document.getElementById('out').innerText = e.name + ": " + e.message;
        }
    </script>
</body>
</html>
"@
[System.IO.File]::WriteAllText("check_syntax.html", $html, [System.Text.Encoding]::UTF8)
Write-Output "Created check_syntax.html"
