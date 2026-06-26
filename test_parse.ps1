$ie = New-Object -ComObject InternetExplorer.Application
$ie.Visible = $false
$ie.Navigate('about:blank')
Start-Sleep -Seconds 2
$js = Get-Content app.js -Raw -Encoding UTF8
$html = "<html><head><meta http-equiv='X-UA-Compatible' content='IE=edge'><script>$js</script></head><body>Parsed successfully</body></html>"
[System.IO.File]::WriteAllText("test.html", $html, [System.Text.Encoding]::UTF8)
$ie.Navigate('file:///' + (Get-Item 'test.html').FullName)
Start-Sleep -Seconds 2
$content = $ie.Document.body.innerHTML
Write-Output "Result: $content"
$ie.Quit()
