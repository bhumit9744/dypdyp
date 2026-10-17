# setup-openjarvis.ps1 - Setup and launch script for OpenJarvis
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$parentDir = Split-Path -Parent $scriptDir
$openJarvisDir = Join-Path $parentDir "OpenJarvis"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " OpenJarvis Local Agent Framework Setup" -ForegroundColor Cyan
Write-Host " Repository: https://github.com/open-jarvis/OpenJarvis.git" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not (Test-Path $openJarvisDir)) {
    Write-Host "Cloning OpenJarvis into $openJarvisDir..." -ForegroundColor Yellow
    git clone https://github.com/open-jarvis/OpenJarvis.git $openJarvisDir
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OpenJarvis repository successfully cloned!" -ForegroundColor Green
    } else {
        Write-Warning "Failed to clone OpenJarvis directly. You can clone manually using: git clone https://github.com/open-jarvis/OpenJarvis.git"
    }
} else {
    Write-Host "OpenJarvis directory already present at $openJarvisDir" -ForegroundColor Green
}

Write-Host ""
Write-Host "Placement Hub auto-detects OpenJarvis running at http://127.0.0.1:8008." -ForegroundColor Cyan
Write-Host "If OpenJarvis is offline, Placement Hub automatically fails over to Google Gemini." -ForegroundColor Cyan
