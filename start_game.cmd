@echo off
title L^&B Spielserver
cd /d "%~dp0"
echo ============================================================
echo   L^&B SPIELFASSUNG AKTUELL - Stand 12.07.2026, 21:11 Uhr
echo ============================================================
echo.
set "EXISTING_PID="
for /f %%P in ('powershell -NoProfile -Command "$c=Get-NetTCPConnection -LocalPort 8764 -State Listen -ErrorAction SilentlyContinue ^| Select-Object -First 1; if($c){$c.OwningProcess}"') do set "EXISTING_PID=%%P"
if defined EXISTING_PID (
  echo Eine alte Spielserver-Instanz auf Port 8764 wird beendet ...
  powershell -NoProfile -Command "$p=Get-CimInstance Win32_Process -Filter ('ProcessId=' + $env:EXISTING_PID); if($p -and $p.Name -eq 'node.exe' -and $p.CommandLine -match 'game-server.js'){Stop-Process -Id $p.ProcessId -Force; Start-Sleep -Milliseconds 500; exit 0}; exit 2"
  if errorlevel 1 goto port_blocked
)
start "" "http://localhost:8764/leitung.html"
"runtime\node.exe" game-server.js
pause
exit /b

:port_blocked
echo.
echo FEHLER: Port 8764 wird von einem anderen Programm verwendet.
echo Bitte dieses Programm schliessen und start_game.cmd erneut ausfuehren.
pause
