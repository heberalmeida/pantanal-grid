# Script to install Git hooks manually if Husky is not available
# This ensures hooks work even without Husky installed

Write-Host "Installing Git hooks..." -ForegroundColor Yellow

# Create hooks directory if it doesn't exist
if (-not (Test-Path ".git\hooks")) {
  New-Item -ItemType Directory -Path ".git\hooks" -Force | Out-Null
}

# Copy pre-push hook
if (Test-Path ".husky\pre-push") {
  Copy-Item ".husky\pre-push" ".git\hooks\pre-push" -Force
  Write-Host "✅ Pre-push hook installed" -ForegroundColor Green
} else {
  Write-Host "⚠️  .husky/pre-push not found" -ForegroundColor Yellow
}

# Copy husky helper script if exists
if (Test-Path ".husky\_\husky.sh") {
  if (-not (Test-Path ".git\hooks\_")) {
    New-Item -ItemType Directory -Path ".git\hooks\_" -Force | Out-Null
  }
  Copy-Item ".husky\_\*" ".git\hooks\_\" -Recurse -Force
}

Write-Host "Git hooks installation complete!" -ForegroundColor Green


