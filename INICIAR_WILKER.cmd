@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js nao foi encontrado no PATH.
  pause
  exit /b 1
)
node server.js
pause
