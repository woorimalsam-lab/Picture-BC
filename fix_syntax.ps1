$techs = [System.IO.File]::ReadAllText('new_techs.js', [System.Text.Encoding]::UTF8)
$techs = $techs.Replace("},\n{", "},{")
[System.IO.File]::WriteAllText('new_techs.js', $techs, [System.Text.Encoding]::UTF8)

$booksFile = 'C:\Users\admin\.gemini\antigravity\brain\8f2fd8d5-bb03-46b2-a89f-1df6a6251344\scratch\new_books.js'
$books = [System.IO.File]::ReadAllText($booksFile, [System.Text.Encoding]::UTF8)
$books = $books.Replace("},\n{", "},{")
[System.IO.File]::WriteAllText($booksFile, $books, [System.Text.Encoding]::UTF8)
