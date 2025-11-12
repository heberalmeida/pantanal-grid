import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const base = '/pantanal-grid/'

export default defineConfig({
  base,
  plugins: [vue()],
  resolve: {
    alias: {
      '@pantanal/grid': path.resolve(__dirname, '../packages/pantanal-grid/src'),
    },
  },
  optimizeDeps: {
    exclude: ['@pantanal/grid'],
    include: ['jspdf', 'html2canvas'],
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
