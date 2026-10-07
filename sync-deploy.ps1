# Sync-Deploy.ps1
# Syncs changes from the Development repository to the Deployment repository

$ErrorActionPreference = "Stop"

# Configuration
$devRepoUrl = "https://github.com/Astraweb-co-in/GRHeartbeat-Dev.git"
$deployRepoUrl = "https://github.com/abhassj/GRHeartbeat-Dep.git"
$commitPrefix = "Sync changes from parent repo"

try {
    # --- Step 1: Pull from Development Repo ---
    Write-Host "Step 1: Pulling latest changes from DEVELOPMENT repo ($devRepoUrl)..." -ForegroundColor Cyan
    git remote set-url origin $devRepoUrl
    git pull origin main

    # --- Step 2: Pull from Deployment Repo (to merge history if needed) ---
    Write-Host "Step 2: Pulling latest changes from DEPLOYMENT repo ($deployRepoUrl)..." -ForegroundColor Cyan
    git remote set-url origin $deployRepoUrl
    
    # We allow this to fail if the histories are unrelated or repo is empty
    try {
        git pull origin main
    }
    catch {
        Write-Warning "Pull from deploy repo failed (likely empty or unrelated history). Continuing..."
    }

    # --- Step 3: Build & Check ---
    Write-Host "Step 3: Running build to verify integrity..." -ForegroundColor Cyan
    # Adjust path if script is run from root or scripts folder
    if (Test-Path "package.json") {
        npm run build
    }
    elseif (Test-Path "../package.json") {
        # Assuming script is in /scripts
        Set-Location ..
        try {
            npm run build
        }
        finally {
            Set-Location scripts
        }
    }
    else {
        Write-Warning "Could not find package.json. Skipping build check."
    }

    # --- Step 4: Determine Commit Message ---
    Write-Host "Step 4: Preparing commit message..." -ForegroundColor Cyan
    $lastCommitMsg = git log -1 --pretty=%B
    $commitNumber = 1

    if ($lastCommitMsg -match "$commitPrefix\s+(\d+)") {
        if ($matches.Count -gt 1 -and $matches[1] -match '^\d+$') {
            $commitNumber = [int]$matches[1] + 1
        }
    }
    $commitMessage = "$commitPrefix $commitNumber"
    Write-Host "Commit Message: $commitMessage" -ForegroundColor Gray

    # --- Step 5: Push to Deployment Repo ---
    Write-Host "Step 5: Pushing to DEPLOYMENT repo..." -ForegroundColor Cyan
    git add .
    git commit -m "$commitMessage"
    # Ignore "nothing to commit" errors
    
    git push origin main
    Write-Host "Successfully pushed to deployment repo." -ForegroundColor Green

}
catch {
    Write-Error "An error occurred: $_"
}
finally {
    # --- Step 6: Restore Dev Repo Remote ---
    Write-Host "Step 6: Restoring remote to DEVELOPMENT repo..." -ForegroundColor Cyan
    git remote set-url origin $devRepoUrl
    Write-Host "Remote restored to development repo." -ForegroundColor Green
}
