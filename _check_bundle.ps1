$h = (Invoke-WebRequest 'https://ewolucja-azure.vercel.app/' -UseBasicParsing -Headers @{'Cache-Control'='no-cache'}).Content
$js = ($h | Select-String -Pattern '/assets/[^"]+\.js' -AllMatches).Matches.Value | Select-Object -Unique
foreach ($u in $js) {
  Write-Host ('--- bundle: ' + $u)
  $b = (Invoke-WebRequest ('https://ewolucja-azure.vercel.app' + $u) -UseBasicParsing -Headers @{'Cache-Control'='no-cache'}).Content
  $hasAdobe = $b -match 'ns_extend|ns_adobe|DOCTYPE svg'
  $hasCleanup = $b -match 'zwojClean|<!DOCTYPE'
  $hasSvgGroup = $b -match 'id=.srodek.'
  Write-Host ('  Adobe DOCTYPE/entities in code: ' + $hasAdobe)
  Write-Host ('  runtime cleanup present:        ' + $hasCleanup)
  Write-Host ('  zwoj svg embedded (id=srodek):  ' + $hasSvgGroup)
}
