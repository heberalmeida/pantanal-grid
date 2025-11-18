#!/bin/sh

# Script to fix yarn install permission errors on Unix systems
# This script closes Node.js processes and cleans up locked files

echo "🔧 Fixing yarn install permission issues..."
echo ""

# Close Node.js processes (optional - be careful!)
# Uncomment if needed:
# pkill -f node || true
# sleep 2

# Try to remove locked files
echo "Cleaning up locked files..."
if [ -f "node_modules/@esbuild/win32-x64/esbuild.exe" ]; then
  rm -f "node_modules/@esbuild/win32-x64/esbuild.exe" 2>/dev/null && echo "✅ Removed esbuild.exe" || echo "⚠️  Could not remove esbuild.exe"
fi

echo ""
echo "💡 Next steps:"
echo "  1. Run: yarn install"
echo "  2. If it still fails, try: rm -rf node_modules && yarn install"
echo ""





