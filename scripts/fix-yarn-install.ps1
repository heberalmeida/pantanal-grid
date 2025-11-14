# Script to fix yarn install permission errors on Windows
# This script closes Node.js processes and cleans up locked files

Write-Host "🔧 Fixing yarn install permission issues..." -ForegroundColor Yellow
Write-Host ""

# Close Node.js processes
Write-Host "Closing Node.js processes..." -ForegroundColor Cyan
$nodeProcesses = Get-Process | Where-Object { $_.ProcessName -like "*node*" }
if ($nodeProcesses) {
  $nodeProcesses | ForEach-Object {
    Write-Host "  Closing process: $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor Gray
    try {
      Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    } catch {
      Write-Host "  ⚠️  Could not close process $($_.Id)" -ForegroundColor Yellow
    }
  }
  Start-Sleep -Seconds 2
  Write-Host "✅ Node.js processes closed" -ForegroundColor Green
} else {
  Write-Host "✅ No Node.js processes found" -ForegroundColor Green
}

Write-Host ""

# Try to remove locked files
Write-Host "Cleaning up locked files..." -ForegroundColor Cyan
$lockedFiles = @(
  "node_modules\@esbuild\win32-x64\esbuild.exe"
)

$cleaned = 0
foreach ($filePath in $lockedFiles) {
  if (Test-Path $filePath) {
    Write-Host "  Removing: $filePath" -ForegroundColor Gray
    try {
      Remove-Item $filePath -Force -ErrorAction Stop
      $cleaned++
      Write-Host "    ✅ Removed" -ForegroundColor Green
    } catch {
      Write-Host "    ⚠️  Could not remove (may be locked): $_" -ForegroundColor Yellow
    }
  }
}

if ($cleaned -gt 0) {
  Write-Host "✅ Cleaned $cleaned file(s)" -ForegroundColor Green
} else {
  Write-Host "✅ No locked files found" -ForegroundColor Green
}

Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: yarn install"
Write-Host "  2. If it still fails, try: Remove-Item node_modules -Recurse -Force; yarn install"
Write-Host ""




