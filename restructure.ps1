$content = Get-Content index.html -Raw -Encoding UTF8
$content = $content -replace '(?s)<!-- Hero Section -->.*?<!-- Footer -->', "<main id=`"main-content`" class=`"main-container`">`n`$0`n    </main>`n    <!-- Footer -->"
$content = $content -replace '    </main>`n    <!-- Footer -->', "</main>`n`n    <!-- Footer -->"
[System.IO.File]::WriteAllText("index.html", $content, [System.Text.Encoding]::UTF8)
Write-Output "Restructured index.html"
