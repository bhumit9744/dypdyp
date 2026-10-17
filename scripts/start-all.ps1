# start-all.ps1 - Starts both backend and frontend development servers
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir = Split-Path -Parent $scriptDir

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting Placement Hub (Backend & Frontend)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start Backend FastAPI Server
Write-Host "[1/2] Starting Backend API Server (http://127.0.0.1:8000)..." -ForegroundColor Green
$backendVenv = Join-Path $repoDir "backend\.venv\Scripts\uvicorn.exe"
$backendDir = Join-Path $repoDir "backend"

Start-Process -FilePath $backendVenv -ArgumentList "app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload" -WorkingDirectory $backendDir

# 2. Start Frontend Vite Server
Write-Host "[2/2] Starting Frontend Vite Server (http://localhost:5173)..." -ForegroundColor Green
$frontendDir = Join-Path $repoDir "frontend"
Start-Process -FilePath "npm.cmd" -ArgumentList "run", "dev" -WorkingDirectory $frontendDir

Write-Host "Both servers launched successfully!" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend API: http://127.0.0.1:8000/docs" -ForegroundColor White
