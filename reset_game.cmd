@echo off
cd /d "%~dp0"
if exist game-state.json del /q game-state.json
echo Spielstand wurde zurueckgesetzt.
pause
