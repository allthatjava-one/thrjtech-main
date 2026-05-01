import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import { cloudflareDevProxy } from '@react-router/dev/vite/cloudflare'
import { getLoadContext } from './app/load-context'

export default defineConfig({
  plugins: [
    cloudflareDevProxy({ getLoadContext }),
    reactRouter(),
  ],
  server: {
    port: 5173,
  },
})
