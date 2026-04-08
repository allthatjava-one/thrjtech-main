import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/r2-presign': 'http://127.0.0.1:8789',
      '/api/blogs': {
        target: 'https://preview.api-gateway.thrjtech.com',
        // target: 'http://localhost:8788',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/blogs/, '/api/v1/blogs'),
      },
    },
  },
  build: {
    outDir: 'dist',
  },
})
