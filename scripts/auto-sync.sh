#!/bin/bash
set -euo pipefail

REPO_DIR="/home/iamironman/dypdyp"
cd "$REPO_DIR"

# Ensure we're on main
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'main')"

# Check for modified, deleted, or untracked files
if [ -n "$(git status --porcelain)" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Changes detected. Staging and committing..."
    git add -A
    git commit -m "Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')"
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Working tree clean."
fi

# Check if there are any unpushed commits
LOCAL=$(git rev-parse @ 2>/dev/null || echo "")
REMOTE=$(git rev-parse "@{u}" 2>/dev/null || echo "")

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Pushing commits to origin $CURRENT_BRANCH..."
    git push origin "$CURRENT_BRANCH"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Push complete."
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Everything up-to-date with remote."
fi
