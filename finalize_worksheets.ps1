$init = Get-Content worksheet_init.js -Raw -Encoding UTF8
$raw = Get-Content "C:\Users\admin\.gemini\antigravity\brain\8f2fd8d5-bb03-46b2-a89f-1df6a6251344\scratch\new_worksheets.js" -Raw -Encoding UTF8

$init = $init -replace '(?s)\s*\}\);\s*\}\s*\}\s*$', ''

$tail = @"
            output.innerHTML = worksheetHTML;
            output.classList.remove("hidden");
        });
    }
}
"@

$combined = $init + "`n" + $raw + "`n" + $tail
[System.IO.File]::WriteAllText("worksheet_final.js", $combined, [System.Text.Encoding]::UTF8)
Write-Output "Successfully rebuilt worksheet_final.js"
