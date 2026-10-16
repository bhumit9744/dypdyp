# start-auto-sync-service.ps1 - Runs auto-sync every 30 minutes
param (
    [int]$IntervalMinutes = 30
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$syncScript = Join-Path $scriptDir "auto-sync.ps1"

Write-Host "=========================================================="
Write-Host " dypdyp Auto-Sync Service"
Write-Host " Interval: Every $IntervalMinutes minutes"
Write-Host " Approval Gate: .sync_approved"
Write-Host "=========================================================="

while ($true) {
    try {
        & powershell -ExecutionPolicy Bypass -File $syncScript
    } catch {
        Write-Warning "Error during auto-sync execution: $_"
    }
    
    $nextRun = (Get-Date).AddMinutes($IntervalMinutes).ToString("HH:mm:ss")
    Write-Host "Next sync scheduled at: $nextRun. Sleeping for $IntervalMinutes minutes..."
    Start-Sleep -Seconds ($IntervalMinutes * 60)
}
