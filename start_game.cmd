@echo off
title L^&B Spielserver
cd /d "%~dp0"
echo ============================================================
echo   L^&B SPIELFASSUNG AKTUELL - Stand 12.07.2026, 21:11 Uhr
echo ============================================================
echo.
start "" "http://localhost:8764/leitung.html"
"runtime\node.exe" game-server.js
pause
