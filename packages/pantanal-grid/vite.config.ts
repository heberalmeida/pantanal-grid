import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PantanalGrid',
      formats: ['es', 'umd'],
      fileName: (format) => format === 'es' ? 'index.es.js' : 'index.umd.cjs'
    },
    rollupOptions: {
      external: ['vue', 'jspdf', 'html2canvas', 'docx', 'file-saver'],
      output: { globals: { vue: 'Vue' } }
    }
  }
})
