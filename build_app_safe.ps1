$techs = [System.IO.File]::ReadAllText("new_techs.js", [System.Text.Encoding]::UTF8)
$theory = [System.IO.File]::ReadAllText("theory.js", [System.Text.Encoding]::UTF8)
$books = [System.IO.File]::ReadAllText("new_books.js", [System.Text.Encoding]::UTF8)
$archive = [System.IO.File]::ReadAllText("archive_data.js", [System.Text.Encoding]::UTF8)

$funcs = [System.IO.File]::ReadAllText("functions.js", [System.Text.Encoding]::UTF8)

$ws_final = [System.IO.File]::ReadAllText("worksheet_final.js", [System.Text.Encoding]::UTF8)

$final = $techs + "`n" + $theory + "`n" + $books + "`n" + $archive + "`n" + $funcs + "`n" + $ws_final + "`n"

[System.IO.File]::WriteAllText("app.js", $final, [System.Text.Encoding]::UTF8)
Write-Output "App.js completely rebuilt with correct encodings!"
