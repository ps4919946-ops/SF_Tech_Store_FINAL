@echo off
setlocal
cd /d "%~dp0"
title SF Tech Store - port 8765
where py >nul 2>nul
if not errorlevel 1 (
  py -3 --version >nul 2>nul
  if not errorlevel 1 set "PY=py -3"
)
if not defined PY (
  where python >nul 2>nul
  if not errorlevel 1 (
    python --version >nul 2>nul
    if not errorlevel 1 set "PY=python"
  )
)
if not defined PY (
  echo ERROR: Python 3 is required. Install Python 3 and try again.
  pause
  exit /b 1
)
echo Starting SF Tech Store - port 8765... (Ctrl+C to stop)
%PY% -u run_local_server.py
if errorlevel 1 (
  echo.
  echo The server could not start. Read the error above.
  echo If the port is busy, close the other project server window first.
  pause
  exit /b 1
)
endlocal
