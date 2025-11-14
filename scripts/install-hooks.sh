#!/bin/sh

# Script to install Git hooks manually if Husky is not available
# This ensures hooks work even without Husky installed

echo "Installing Git hooks..."

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy pre-push hook
if [ -f ".husky/pre-push" ]; then
  cp .husky/pre-push .git/hooks/pre-push
  chmod +x .git/hooks/pre-push
  echo "✅ Pre-push hook installed"
else
  echo "⚠️  .husky/pre-push not found"
fi

echo "Git hooks installation complete!"




