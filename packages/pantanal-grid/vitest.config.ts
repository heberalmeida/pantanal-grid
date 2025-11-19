import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    css: true,
    setupFiles: './tests/setup.ts',
    watch: true,
    watchExclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.git/**',
      '**/coverage/**'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      reportsDirectory: './coverage',
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/coverage/**',
        '**/tests/**',
        '**/*.spec.ts',
        '**/*.spec.js',
        '**/coverage-summary.cjs',
        '**/types.ts', // Types-only file, no executable code
        '**/vite.config.ts', // Configuration file
        '**/vitest.config.ts', // Configuration file
        '**/vite-env.d.ts', // Type definitions file
        '**/*.d.ts', // All TypeScript declaration files
      ]
    }
  }
})
