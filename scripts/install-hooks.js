#!/usr/bin/env node

// Script to install Git hooks
// Works with or without Husky

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const huskyPrePushPath = path.join(__dirname, '..', '.husky', 'pre-push');
const gitHooksDir = path.join(__dirname, '..', '.git', 'hooks');
const gitPrePushPath = path.join(gitHooksDir, 'pre-push');

try {
  // Try to use Husky if available
  try {
    require('husky').install();
    console.log('✅ Hooks installed via Husky');
    process.exit(0);
  } catch (e) {
    // Husky not installed, install manually
    if (!fs.existsSync(gitHooksDir)) {
      fs.mkdirSync(gitHooksDir, { recursive: true });
    }

    if (fs.existsSync(huskyPrePushPath)) {
      // Copy .husky/pre-push to .git/hooks/pre-push
      const content = fs.readFileSync(huskyPrePushPath, 'utf8');
      fs.writeFileSync(gitPrePushPath, content, { mode: 0o755 });
      console.log('✅ Pre-push hook installed manually');
    } else {
      console.log('⚠️  .husky/pre-push not found, skipping hook installation');
    }

    // Copy husky helper scripts if they exist
    const huskyHelperDir = path.join(__dirname, '..', '.husky', '_');
    const gitHooksHelperDir = path.join(gitHooksDir, '_');
    if (fs.existsSync(huskyHelperDir)) {
      if (!fs.existsSync(gitHooksHelperDir)) {
        fs.mkdirSync(gitHooksHelperDir, { recursive: true });
      }
      const files = fs.readdirSync(huskyHelperDir);
      files.forEach(file => {
        const src = path.join(huskyHelperDir, file);
        const dest = path.join(gitHooksHelperDir, file);
        fs.copyFileSync(src, dest);
      });
    }
  }
} catch (error) {
  console.error('❌ Error installing hooks:', error.message);
  process.exit(1);
}




