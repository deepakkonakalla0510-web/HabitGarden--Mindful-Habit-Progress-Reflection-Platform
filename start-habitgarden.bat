@echo off
title HabitGarden Launcher - Deepak Konakalla (USN: 2102508559)
echo =====================================================================
echo   HABITGARDEN - Mindful Habit Progress & Reflection Platform
echo   Architect: DEEPAK KONAKALLA  ^|  USN: 2102508559
echo =====================================================================
echo.

set PATH=C:\Program Files\nodejs;%PATH%

echo [1/2] Starting HabitGarden Backend API on http://localhost:5000 ...
start "HabitGarden Backend (Port 5000)" cmd /k "set PATH=C:\Program Files\nodejs;%%PATH%% && cd /d "%~dp0backend" && node server.js"

echo [2/2] Starting HabitGarden Frontend Vite App on http://localhost:5173 ...
start "HabitGarden Frontend (Port 5173)" cmd /k "set PATH=C:\Program Files\nodejs;%%PATH%% && cd /d "%~dp0frontend" && npm run dev"

timeout /t 3 >nul

echo.
echo Opening HabitGarden in your default browser...
start http://localhost:5173

echo.
echo =====================================================================
echo   HabitGarden is live!
echo   Frontend UI: http://localhost:5173
echo   Backend API: http://localhost:5000
echo =====================================================================
pause
