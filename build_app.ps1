$techs = Get-Content new_techs.js -Raw -Encoding UTF8
$theory = Get-Content theory.js -Raw -Encoding UTF8
$books = Get-Content "C:\Users\admin\.gemini\antigravity\brain\8f2fd8d5-bb03-46b2-a89f-1df6a6251344\scratch\new_books.js" -Raw -Encoding UTF8
$worksheets = Get-Content "C:\Users\admin\.gemini\antigravity\brain\8f2fd8d5-bb03-46b2-a89f-1df6a6251344\scratch\new_worksheets.js" -Raw -Encoding UTF8
$funcs = Get-Content functions.js -Raw -Encoding UTF8

$final = $techs + "`n" + $theory + "`n" + $books + "`n" + $worksheets + "`n" + $funcs + "`n"

[System.IO.File]::WriteAllText("app.js", $final, [System.Text.Encoding]::UTF8)

Write-Output "App.js rebuilt successfully."
