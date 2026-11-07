# HabitGarden PowerShell Launcher
# Architect: DEEPAK KONAKALLA | USN: 2102508559

Write-Host "=====================================================================" -ForegroundColor Green
Write-Host "  HABITGARDEN - Mindful Habit Progress & Reflection Platform" -ForegroundColor Green
Write-Host "  Architect: DEEPAK KONAKALLA | USN: 2102508559" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Green

$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
$rootDir = $PSScriptRoot

Write-Host "`n[1/2] Starting Backend API (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PATH='C:\Program Files\nodejs;' + `$env:PATH; cd '$rootDir\backend'; node server.js"

Write-Host "[2/2] Starting Frontend Vite App (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PATH='C:\Program Files\nodejs;' + `$env:PATH; cd '$rootDir\frontend'; npm run dev"

Start-Sleep -Seconds 3

Write-Host "`n✓ Opening HabitGarden in your browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host "`n=====================================================================" -ForegroundColor Green
Write-Host "  Frontend Web UI: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend REST API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "=====================================================================`n" -ForegroundColor Green
