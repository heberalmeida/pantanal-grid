import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@pantanal/grid': path.resolve(__dirname, '../packages/pantanal-grid/src')
    }
  },
  optimizeDeps: {
    // não tente pré-empacotar a lib local
    exclude: ['@pantanal/grid']
  },
  server: {
    port: 5173,
    open: true
  }
})
