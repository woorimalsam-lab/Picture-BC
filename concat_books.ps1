$booksFile = "C:\Users\admin\.gemini\antigravity\brain\8f2fd8d5-bb03-46b2-a89f-1df6a6251344\scratch\new_books.js"
$app = Get-Content $booksFile -Raw -Encoding UTF8
$booksStr = (Get-Content added_books_tmp.js -Raw -Encoding UTF8)

$app = $app -replace '(?s)\s*\];\s*$', ''
$app = $app + ",\n" + ($booksStr -replace '(?s)^const added_books = \[\s*', '')

[System.IO.File]::WriteAllText($booksFile, $app, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated new_books.js"
