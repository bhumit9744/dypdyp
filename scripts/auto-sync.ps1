# auto-sync.ps1 - Automated periodic sync for dypdyp (Windows PowerShell)
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir = Split-Path -Parent $scriptDir
Set-Location $repoDir

# Explicit user approval gate to prevent unauthorized auto-push
$approvalFile = Join-Path $repoDir ".sync_approved"
if (-not (Test-Path $approvalFile)) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] Auto-sync paused: Explicit user approval required before commit/push (.sync_approved missing)."
    exit 0
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Check for modified, deleted, or untracked files
$status = git status --porcelain
if ($status) {
    Write-Host "[$timestamp] Changes detected. Staging and committing..."
    git add -A
    git commit -m "Auto-sync: $timestamp"
} else {
    Write-Host "[$timestamp] Working tree clean."
}

# Ensure we have current branch
$currentBranch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
if (-not $currentBranch) {
    $currentBranch = "main"
}

# Check if there are unpushed commits
$localCommit = (git rev-parse HEAD 2>$null)
$remoteCommit = (git rev-parse "@{u}" 2>$null)

if ($localCommit -and ($localCommit -ne $remoteCommit)) {
    Write-Host "[$timestamp] Pushing commits to origin $currentBranch..."
    try {
        git push origin $currentBranch
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$timestamp] Push complete."
        } else {
            Write-Warning "[$timestamp] git push exited with code $LASTEXITCODE. Remote push will retry on next cycle."
        }
    } catch {
        Write-Warning "[$timestamp] Network or authentication error during push: $_"
    }
} else {
    Write-Host "[$timestamp] Everything up-to-date with remote."
}
