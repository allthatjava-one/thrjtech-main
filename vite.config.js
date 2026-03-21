import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/r2-presign': 'http://127.0.0.1:8789',
    },
  },
  build: {
    outDir: 'dist',
  },
})
